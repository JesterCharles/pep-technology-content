#!/usr/bin/env node
// Module-local real-print regression. It renders every learner page with Chromium print media, writes a temporary PDF,
// extracts its text, and proves that all required teaching plus answer-free task/input inventories survive printing.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../tools/qa/harness.mjs";

const root = "collections-streams/collections-in-depth";
const expected = {
  "lists-sets-and-maps-in-depth": ["Classify seven lines", "Run add(\"pear\")"],
  "stacks-and-queues": ["Classify six calls", "Starting empty, try push"],
  "generics": ["Starter excerpt: Crate stores Object", "Classify all six parameters"],
  "wrapper-types-and-autoboxing": ["Classify five lines", "For values 100, 127, 128 and 1000"],
  "big-o-basics": ["Mystery A times", "Starter: hasRepeat"],
  "the-equals-and-hashcode-contract": ["Classify six descriptions", "Starter class Course"],
  "how-hashmap-works": ["Starting empty, run put", "Starter add(Visit v)"],
  "choosing-the-right-collection": ["Four questions pick the collection", "ArrayList beats LinkedList", "When the output order is part of the requirement", "Recap", "Choose an implementation for each need", "At n = 10,000 compare ArrayList and LinkedList"],
  "sorting-with-comparator": ["Starter: players.sort", "Classify seven calls"],
};
const failures = [];
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pep-collections-print-"));
const browser = await launchChromium();
try {
  for (const [topic, phrases] of Object.entries(expected)) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(root, topic, "artifact.html")).href);
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
    const dom = await page.evaluate(() => ({
      hiddenActivities: [...document.querySelectorAll("[data-pep-activity], [data-step], [data-pep-recap]")]
        .filter((node) => getComputedStyle(node).display === "none").map((node) => node.id || node.getAttribute("data-step") || node.tagName),
      inventories: [...document.querySelectorAll("[data-pep-print-items]")].map((node) => ({
        text: node.getAttribute("data-pep-print-items"),
        rendered: getComputedStyle(node, "::after").content,
      })),
    }));
    if (dom.hiddenActivities.length) failures.push(`${topic}: print hides required sections ${dom.hiddenActivities.join(", ")}`);
    if (!dom.inventories.length) failures.push(`${topic}: no print task/input inventory`);
    for (const item of dom.inventories) {
      if (!item.text?.trim() || item.rendered === "none" || item.rendered === "normal") failures.push(`${topic}: a print inventory is not rendered`);
      if (/\b(correct|wrong|answer key|solution)\b/i.test(item.text)) failures.push(`${topic}: print inventory contains keyed-answer wording`);
    }
    const pdf = path.join(dir, `${topic}.pdf`), txt = path.join(dir, `${topic}.txt`);
    await page.pdf({ path: pdf, format: "Letter", printBackground: true });
    execFileSync("pdftotext", [pdf, txt]);
    const printed = fs.readFileSync(txt, "utf8").replace(/\s+/g, " ");
    for (const phrase of phrases) if (!printed.includes(phrase)) failures.push(`${topic}: PDF text misses ${JSON.stringify(phrase)}`);
    await page.evaluate(() => dispatchEvent(new Event("afterprint")));
    await page.close();
  }
} finally {
  await browser.close();
  fs.rmSync(dir, { recursive: true, force: true });
}
console.log(`print regression: ${Object.keys(expected).length} real PDFs include every required section and task/input inventory`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
