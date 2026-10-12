#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";
import { launchChromium } from "./harness.mjs";

export const PRINT_TEMPLATE_VERSION = "1";

export async function pdfFromMarkdown(markdownFile, pdfFile) {
  const [markdown, template] = await Promise.all([
    readFile(markdownFile, "utf8"),
    readFile(new URL("./print-template.html", import.meta.url), "utf8"),
  ]);
  const renderer = new MarkdownIt({ html: false, linkify: true, typographer: false });
  const document = template.replace("{{CONTENT}}", renderer.render(markdown));
  const browser = await launchChromium();
  try {
    const page = await browser.newPage();
    await page.setContent(document, { waitUntil: "load" });
    await page.pdf({
      path: pdfFile,
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error(
      "Usage: node authoring/tools/qa/pdf-from-md.mjs <artifact.md> <artifact.pdf>",
    );
    process.exitCode = 2;
    return;
  }
  await pdfFromMarkdown(input, output);
  console.log(path.relative(process.cwd(), output));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split(path.sep).join("/"))) await main();
