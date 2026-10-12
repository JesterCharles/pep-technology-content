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
    const normalizeInline = (value) => value.replace(/\s+/g, " ").trim();
    const categoryDefinitions = [
      { name: "Teaching", selector: "[data-pep-teaching], [data-pep-teach], .teach" },
      { name: "Model", selector: "[data-pep-model], #live-model" },
      { name: "Recap", selector: "[data-pep-recap]" },
      { name: "Cheat sheet", selector: "[data-pep-cheat-sheet], [data-section-skip]" },
      { name: "Sources", selector: "[data-pep-sources], .sources" },
    ];
    const categoryByName = new Map(categoryDefinitions.map((category) => [category.name, category]));
    const categoryOwners = new Map();

    // More specific companion sections own a node that also matches a broader marker.
    // Ownership and ancestry, rather than matching text, prevent nested sections from
    // being emitted once with their parent and again under their own heading.
    for (const name of ["Sources", "Cheat sheet", "Recap", "Model", "Teaching"]) {
      const { selector } = categoryByName.get(name);
      for (const element of document.querySelectorAll(selector)) {
        if (!categoryOwners.has(element)) categoryOwners.set(element, name);
      }
    }

    const blockTags = new Set([
      "ADDRESS",
      "ARTICLE",
      "ASIDE",
      "BLOCKQUOTE",
      "DETAILS",
      "DIV",
      "DL",
      "FIELDSET",
      "FIGCAPTION",
      "FIGURE",
      "FOOTER",
      "FORM",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "HEADER",
      "HR",
      "MAIN",
      "NAV",
      "OL",
      "P",
      "PRE",
      "SECTION",
      "SUMMARY",
      "TABLE",
      "UL",
    ]);
    const ignoredTags = new Set(["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT"]);

    function shouldSkip(element, owner, root) {
      if (element === root) return false;
      const claimedBy = categoryOwners.get(element);
      if (claimedBy && claimedBy !== owner) return true;
      if (element.parentElement !== root) return false;
      if (owner === "Recap" && /^H[1-6]$/.test(element.tagName)) return true;
      return (owner === "Cheat sheet" || owner === "Sources") &&
        (element.tagName === "SUMMARY" || /^H[1-6]$/.test(element.tagName));
    }

    function inlineText(node, owner, root) {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      if (ignoredTags.has(node.tagName) || shouldSkip(node, owner, root)) return "";
      if (node.tagName === "BR") return "\n";
      return [...node.childNodes].map((child) => inlineText(child, owner, root)).join("");
    }

    function renderList(list, owner, root, depth = 0) {
      const ordered = list.tagName === "OL";
      const items = [...list.children].filter((child) => child.tagName === "LI");
      return items
        .map((item, index) => {
          const rendered = renderChildren(item, owner, root, depth + 1);
          const lines = rendered.split("\n").filter((line) => line.trim());
          const marker = ordered ? `${index + 1}.` : "-";
          const indent = "  ".repeat(depth);
          if (!lines.length) return "";
          return `${indent}${marker} ${lines[0]}${lines
            .slice(1)
            .map((line) => `\n${indent}  ${line}`)
            .join("")}`;
        })
        .filter(Boolean)
        .join("\n");
    }

    function renderTable(table, owner, root) {
      const rows = [...table.rows].map((row) =>
        [...row.cells].map((cell) =>
          cleanBlock(renderChildren(cell, owner, root)).replace(/\n+/g, "; ").replace(/\|/g, "\\|"),
        ),
      );
      if (!rows.length) return "";
      const width = Math.max(...rows.map((row) => row.length));
      const fill = (row) => [...row, ...Array(width - row.length).fill("")];
      const line = (row) => `| ${fill(row).join(" | ")} |`;
      const firstRow = table.rows[0];
      const hasAuthoredHeader = [...firstRow.cells].some((cell) => cell.tagName === "TH");
      const output = [];
      if (hasAuthoredHeader) {
        output.push(line(rows.shift()));
      } else {
        output.push(line(Array(width).fill("")));
      }
      output.push(line(Array(width).fill("---")), ...rows.map(line));
      return output.join("\n");
    }

    function renderElement(element, owner, root, depth) {
      if (ignoredTags.has(element.tagName) || shouldSkip(element, owner, root)) return "";
      if (element.tagName === "UL" || element.tagName === "OL") {
        return renderList(element, owner, root, depth);
      }
      if (element.tagName === "TABLE") return renderTable(element, owner, root);
      if (/^H[1-6]$/.test(element.tagName)) {
        const text = normalizeInline(inlineText(element, owner, root));
        return text ? `### ${text}` : "";
      }
      if (element.tagName === "HR") return "---";
      if (element.tagName === "PRE") {
        const text = (element.textContent ?? "").replace(/^\n|\n$/g, "");
        return text ? `\`\`\`\n${text}\n\`\`\`` : "";
      }
      if (blockTags.has(element.tagName)) return renderChildren(element, owner, root, depth);
      return normalizeInline(inlineText(element, owner, root));
    }

    function cleanBlock(value) {
      return value
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }

    function renderChildren(parent, owner, root, depth = 0) {
      const parts = [];
      let inline = "";
      const flushInline = () => {
        const text = normalizeInline(inline);
        if (text) parts.push(text);
        inline = "";
      };
      for (const child of parent.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          inline += child.nodeValue ?? "";
          continue;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) continue;
        if (ignoredTags.has(child.tagName) || shouldSkip(child, owner, root)) continue;
        if (blockTags.has(child.tagName)) {
          flushInline();
          const rendered = renderElement(child, owner, root, depth);
          if (rendered) parts.push(rendered);
        } else {
          inline += inlineText(child, owner, root);
        }
      }
      flushInline();
      return cleanBlock(parts.join("\n\n"));
    }

    const renderRoot = (element, owner) => cleanBlock(renderElement(element, owner, element, 0));
    const plainText = (element) => normalizeInline(inlineText(element, undefined, element));
    const title = plainText(document.querySelector("h1") ?? document.querySelector("title"));
    const objectiveRoot = document.querySelector("[data-pep-objectives], .objectives");
    const objectives = objectiveRoot
      ? [...objectiveRoot.querySelectorAll("li")].map(plainText).filter(Boolean)
      : [];
    const sections = categoryDefinitions.map(({ name, selector }) => {
      const candidates = [...document.querySelectorAll(selector)].filter(
        (element) => categoryOwners.get(element) === name,
      );
      const roots = candidates.filter(
        (element) => !candidates.some((candidate) => candidate !== element && candidate.contains(element)),
      );
      return { name, blocks: roots.map((element) => renderRoot(element, name)).filter(Boolean) };
    });
    const interactions = [...document.querySelectorAll("[data-interaction]")].map((element, index) => {
      const block = element.querySelector("[data-static-alt]");
      const ownAlternative = element.getAttribute("data-static-alt")?.trim();
      const blockAlternative = block
        ? block.getAttribute("data-static-alt")?.trim() || renderRoot(block)
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
