import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { findHtmlTopics, launchChromium, updateReceipt } from "../qa/harness.mjs";
import { deriveMarkdown } from "../qa/md-from-html.mjs";

export const id = "T18";
export const gate = 18;
export const description = "Markdown parity and PDF rendering";

function display(ctx, file) {
  return ctx.display(file);
}

function pdfHasExtractableText(pdfFile, bytes) {
  const command = spawnSync("pdftotext", [pdfFile, "-"], { encoding: "utf8" });
  if (!command.error && command.status === 0) return command.stdout.trim().length > 0;
  const source = bytes.toString("latin1");
  return /\/ToUnicode\b/.test(source) && /\/Font\b/.test(source) && bytes.length > 1000;
}

export async function run(ctx) {
  const topics = await findHtmlTopics(ctx);
  if (!topics.length) {
    console.log(`${id}: no topics with artifact.html; skipped`);
    return [];
  }
  const errors = [];
  const browser = await launchChromium();
  try {
    for (const topic of topics) {
      topic.browserVersion = browser.version();
      let passed = true;
      const details = [];
      const markdownFile = path.join(topic.root, "artifact.md");
      let failureFile = markdownFile;
      try {
        if (topic.manifest.artifacts?.md?.status !== "present") {
          throw new Error(`${display(ctx, markdownFile)} must be declared present for an HTML topic`);
        }
        const page = await browser.newPage();
        await page.goto(pathToFileURL(topic.html).href, { waitUntil: "load" });
        const expected = await deriveMarkdown(page);
        await page.close();
        const actual = await readFile(markdownFile, "utf8");
        if (actual !== expected) {
          throw new Error(
            `${display(ctx, markdownFile)} differs from deterministic HTML derivation ` +
              `(heading, objective, section, or static-alternative parity)`,
          );
        }
        details.push("Markdown parity passed");
        if (topic.manifest.artifacts?.pdf?.status === "present") {
          const pdfFile = path.join(topic.root, "artifact.pdf");
          failureFile = pdfFile;
          const bytes = await readFile(pdfFile);
          if (!bytes.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
            throw new Error(`${display(ctx, pdfFile)} is not a PDF`);
          }
          if (!pdfHasExtractableText(pdfFile, bytes)) {
            throw new Error(`${display(ctx, pdfFile)} has no extractable text`);
          }
          const pdfPage = await browser.newPage();
          const response = await pdfPage.goto(pathToFileURL(pdfFile).href, { waitUntil: "load" });
          if (response && !response.ok()) throw new Error(`${display(ctx, pdfFile)} did not render`);
          await pdfPage.close();
          details.push("PDF rendered with extractable text");
        }
      } catch (error) {
        passed = false;
        details.push(error.message);
        errors.push({ rule: id, file: display(ctx, failureFile), message: error.message });
      }
      await updateReceipt(ctx, topic, id, passed, details.join("; "));
    }
  } finally {
    await browser.close();
  }
  return errors;
}
