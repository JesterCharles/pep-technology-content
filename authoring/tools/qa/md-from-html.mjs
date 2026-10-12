#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "./harness.mjs";

function clean(value) {
  return value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function escapeMarkdown(value) {
  return value.replace(/([\\`*_[\]<>])/g, "\\$1");
}

export async function deriveMarkdown(page) {
  const data = await page.evaluate(() => {
    const visibleText = (element) => (element.innerText ?? element.textContent ?? "").trim();
    const title = visibleText(document.querySelector("h1") ?? document.querySelector("title"));
    const objectiveRoot = document.querySelector("[data-pep-objectives], .objectives");
    const objectives = objectiveRoot
      ? [...objectiveRoot.querySelectorAll("li")].map(visibleText).filter(Boolean)
      : [];
    const categories = [
      ["Teaching", "[data-pep-teaching], [data-pep-teach], .teach"],
      ["Model", "[data-pep-model], #live-model"],
      ["Recap", "[data-pep-recap]"],
      ["Cheat sheet", "[data-pep-cheat-sheet], [data-section-skip]"],
      ["Sources", "[data-pep-sources], .sources"],
    ];
    const sections = categories.map(([name, selector]) => ({
      name,
      blocks: [...document.querySelectorAll(selector)].map(visibleText).filter(Boolean),
    }));
    const interactions = [...document.querySelectorAll("[data-interaction]")].map((element, index) => {
      const block = element.querySelector("[data-static-alt]");
      const ownAlternative = element.getAttribute("data-static-alt")?.trim();
      const blockAlternative = block
        ? block.getAttribute("data-static-alt")?.trim() || visibleText(block)
        : undefined;
      return {
        name: element.getAttribute("data-interaction") || `interaction-${index + 1}`,
        alternative: ownAlternative || blockAlternative,
      };
    });
    return { title, objectives, sections, interactions };
  });
  if (!data.title) throw new Error("HTML must contain one non-empty h1");
  if (!data.objectives.length) throw new Error("HTML must contain objectives in [data-pep-objectives] or .objectives");
  const missing = data.interactions.filter((item) => !item.alternative?.trim());
  if (missing.length) {
    throw new Error(
      `interactions missing author-written data-static-alt: ${missing.map((item) => item.name).join(", ")}`,
    );
  }
  const lines = [`# ${escapeMarkdown(clean(data.title))}`, "", "## Objectives", ""];
  for (const objective of data.objectives) lines.push(`- ${escapeMarkdown(clean(objective))}`);
  for (const section of data.sections) {
    if (!section.blocks.length) continue;
    lines.push("", `## ${section.name}`, "");
    section.blocks.forEach((block, index) => {
      if (index) lines.push("");
      lines.push(clean(block));
    });
  }
  if (data.interactions.length) {
    lines.push("", "## Static interaction alternatives", "");
    for (const item of data.interactions) {
      lines.push(`### ${escapeMarkdown(clean(item.name))}`, "", clean(item.alternative), "");
    }
    while (lines.at(-1) === "") lines.pop();
  }
  return `${lines.join("\n")}\n`;
}

export async function markdownFromHtml(htmlFile) {
  const browser = await launchChromium();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.resolve(htmlFile)).href, { waitUntil: "load" });
    return await deriveMarkdown(page);
  } finally {
    await browser.close();
  }
}

async function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error(
      "Usage: node authoring/tools/qa/md-from-html.mjs <artifact.html> <artifact.md>",
    );
    process.exitCode = 2;
    return;
  }
  const markdown = await markdownFromHtml(input);
  await writeFile(output, markdown);
  console.log(path.relative(process.cwd(), output));
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (invoked) await main();
