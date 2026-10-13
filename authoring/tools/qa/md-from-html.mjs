#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "./harness.mjs";

function clean(value) {
  const output = [];
  let fence;
  let blank = 0;
  for (const sourceLine of value.replace(/\r/g, "").split("\n")) {
    const line = fence ? sourceLine : sourceLine.replace(/[ \t]+$/g, "");
    const marker = line.match(/^[ \t]*(`{3,}|~{3,})/u)?.[1];
    if (marker && (!fence || marker[0] === fence[0] && marker.length >= fence.length)) {
      fence = fence ? undefined : marker;
    }
    if (!fence && !line) {
      blank += 1;
      if (blank > 1) continue;
    } else {
      blank = 0;
    }
    output.push(line);
  }
  return output.join("\n").trim();
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
    const blockDisplays = new Set(["block", "flow-root", "flex", "grid", "list-item", "table"]);

    function shouldSkip(element, owner, root) {
      if (element === root) return false;
      const claimedBy = categoryOwners.get(element);
      if (claimedBy && claimedBy !== owner) return true;
      if (element.parentElement !== root) return false;
      if (owner === "Recap" && /^H[1-6]$/.test(element.tagName)) return true;
      return (owner === "Cheat sheet" || owner === "Sources") &&
        (element.tagName === "SUMMARY" || /^H[1-6]$/.test(element.tagName));
    }

    function separateAdjacentElements(parent, previous, child) {
      if (!previous || child.nodeType !== Node.ELEMENT_NODE) return false;
      const parentDisplay = getComputedStyle(parent).display;
      const parentLaysOutItems = ["flex", "inline-flex", "grid", "inline-grid"].includes(parentDisplay);
      const childIsBlock = blockDisplays.has(getComputedStyle(child).display);
      if (previous.nodeType !== Node.ELEMENT_NODE) return childIsBlock;
      return parentLaysOutItems || blockDisplays.has(getComputedStyle(previous).display) || childIsBlock;
    }

    function inlineCode(value) {
      const text = normalizeInline(value);
      const longestRun = Math.max(0, ...[...text.matchAll(/`+/gu)].map((match) => match[0].length));
      const fence = "`".repeat(longestRun + 1);
      const padding = text.startsWith("`") || text.endsWith("`") ? " " : "";
      return `${fence}${padding}${text}${padding}${fence}`;
    }

    function inlineText(node, owner, root, markdown = true) {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      if (ignoredTags.has(node.tagName) || shouldSkip(node, owner, root)) return "";
      if (node.tagName === "BR") return "\n";
      if (markdown && node.tagName === "CODE") return inlineCode(node.textContent ?? "");
      const children = [...node.childNodes];
      return children.map((child, index) =>
        `${separateAdjacentElements(node, children[index - 1], child) ? " " : ""}${inlineText(child, owner, root, markdown)}`
      ).join("");
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

    function labeledRow(label, value) {
      const safeLabel = normalizeInline(label).replace(/([\\*_[\]])/gu, "\\$1");
      const lines = cleanBlock(value).split("\n");
      if (!lines[0]) return safeLabel ? `- **${safeLabel}**` : "";
      if (/^(`{3,}|~{3,}|\||[-+*] |\d+\. |#{1,6} )/u.test(lines[0])) {
        return `- **${safeLabel}**:\n\n${lines.map((line) => `  ${line}`).join("\n")}`;
      }
      return `- **${safeLabel}**: ${lines[0]}${lines.slice(1).map((line) => `\n  ${line}`).join("")}`;
    }

    function renderDefinitionList(list, owner, root) {
      const rows = [];
      let pendingTerms = [];
      let activeTerms = [];
      for (const child of list.children) {
        if (child.tagName === "DT") {
          pendingTerms.push(normalizeInline(inlineText(child, owner, root)));
        } else if (child.tagName === "DD") {
          if (pendingTerms.length) {
            activeTerms = pendingTerms;
            pendingTerms = [];
          }
          if (activeTerms.length) {
            rows.push(labeledRow(activeTerms.join(", "), renderChildren(child, owner, root)));
          }
        }
      }
      for (const term of pendingTerms) rows.push(labeledRow(term, ""));
      return rows.filter(Boolean).join("\n");
    }

    const keyClass = /(?:^|[-_])(key|label|term|name|k)$/u;
    const valueClass = /(?:^|[-_])(value|val|description|v)$/u;
    const rowClass = /^(key-value|kv|labelled|labeled)(?:[-_]row)?$/u;
    const hasMatchingClass = (element, expression) =>
      [...element.classList].some((className) => expression.test(className));

    function keyValueParts(element, owner, root) {
      const children = [...element.children].filter(
        (child) => !ignoredTags.has(child.tagName) && !shouldSkip(child, owner, root),
      );
      if (children.length !== 2) return undefined;
      const explicitRow = element.hasAttribute("data-key-value") || hasMatchingClass(element, rowClass);
      const semanticPair =
        (children[0].hasAttribute("data-key") || hasMatchingClass(children[0], keyClass)) &&
        (children[1].hasAttribute("data-value") || hasMatchingClass(children[1], valueClass));
      return explicitRow || semanticPair ? children : undefined;
    }

    function renderKeyValueRow(element, owner, root) {
      const [key, value] = keyValueParts(element, owner, root) ?? [];
      if (!key) return "";
      return labeledRow(
        inlineText(key, owner, root),
        renderElement(value, owner, root, 0),
      );
    }

    function renderKeyValueGroup(element, owner, root) {
      const children = [...element.children].filter(
        (child) => !ignoredTags.has(child.tagName) && !shouldSkip(child, owner, root),
      );
      if (!children.length || !children.every((child) => keyValueParts(child, owner, root))) return "";
      return children.map((child) => renderKeyValueRow(child, owner, root)).filter(Boolean).join("\n");
    }

    function codeBlockKind(element) {
      if (element.tagName === "PRE") return "code";
      if (element.tagName === "CODE" && (
        element.textContent?.includes("\n") || blockDisplays.has(getComputedStyle(element).display)
      )) return "code";
      const tokens = [element.id, ...element.classList].filter(Boolean);
      if (element.hasAttribute("data-diff") || tokens.some((token) => token === "diff" || token === "diff-block")) {
        return "diff";
      }
      if (element.hasAttribute("data-code-block") || tokens.some((token) =>
        ["code-block", "codeblock", "source-code"].includes(token)
      )) return "code";
      return undefined;
    }

    function fencedCode(text, language = "") {
      const content = text.replace(/\r/g, "").replace(/^\n|\n$/gu, "");
      if (!content) return "";
      const longestRun = Math.max(0, ...[...content.matchAll(/`+/gu)].map((match) => match[0].length));
      const fence = "`".repeat(Math.max(3, longestRun + 1));
      return `${fence}${language}\n${content}\n${fence}`;
    }

    function renderCodeBlock(element, kind, owner, root) {
      if (element.tagName === "PRE" || element.tagName === "CODE") {
        const language = element.querySelector?.("code[class*='language-']")?.className
          .match(/(?:^|\s)language-([^\s]+)/u)?.[1] ?? "";
        return fencedCode(element.textContent ?? "", language);
      }
      const children = [...element.childNodes].filter((child) =>
        child.nodeType === Node.ELEMENT_NODE
          ? !ignoredTags.has(child.tagName) && !shouldSkip(child, owner, root)
          : child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim(),
      );
      const lines = children.flatMap((child) => {
        const text = (child.textContent ?? "").replace(/\r/g, "").replace(/^\n|\n$/gu, "");
        return text.split("\n");
      });
      return fencedCode(lines.join("\n"), kind === "diff" ? "diff" : "");
    }

    function renderElement(element, owner, root, depth) {
      if (ignoredTags.has(element.tagName) || shouldSkip(element, owner, root)) return "";
      const codeKind = codeBlockKind(element);
      if (codeKind) return renderCodeBlock(element, codeKind, owner, root);
      if (element.tagName === "UL" || element.tagName === "OL") {
        return renderList(element, owner, root, depth);
      }
      if (element.tagName === "DL") return renderDefinitionList(element, owner, root);
      if (element.tagName === "TABLE") return renderTable(element, owner, root);
      const keyValueGroup = renderKeyValueGroup(element, owner, root);
      if (keyValueGroup) return keyValueGroup;
      const keyValueRow = renderKeyValueRow(element, owner, root);
      if (keyValueRow) return keyValueRow;
      if (/^H[1-6]$/.test(element.tagName)) {
        const text = normalizeInline(inlineText(element, owner, root));
        return text ? `### ${text}` : "";
      }
      if (element.tagName === "HR") return "---";
      if (blockTags.has(element.tagName)) return renderChildren(element, owner, root, depth);
      return normalizeInline(inlineText(element, owner, root));
    }

    function cleanBlock(value) {
      const output = [];
      let fence;
      let blank = 0;
      for (const sourceLine of value.replace(/\r/g, "").split("\n")) {
        const line = fence ? sourceLine : sourceLine.replace(/[ \t]+$/g, "");
        const marker = line.match(/^[ \t]*(`{3,}|~{3,})/u)?.[1];
        if (marker && (!fence || marker[0] === fence[0] && marker.length >= fence.length)) {
          fence = fence ? undefined : marker;
        }
        if (!fence && !line) {
          blank += 1;
          if (blank > 1) continue;
        } else {
          blank = 0;
        }
        output.push(line);
      }
      return output.join("\n").trim();
    }

    function renderChildren(parent, owner, root, depth = 0) {
      const parts = [];
      let inline = "";
      const flushInline = () => {
        const text = normalizeInline(inline);
        if (text) parts.push(text);
        inline = "";
      };
      const children = [...parent.childNodes];
      for (const [index, child] of children.entries()) {
        if (child.nodeType === Node.TEXT_NODE) {
          inline += child.nodeValue ?? "";
          continue;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) continue;
        if (ignoredTags.has(child.tagName) || shouldSkip(child, owner, root)) continue;
        if (blockTags.has(child.tagName) || codeBlockKind(child)) {
          flushInline();
          const rendered = renderElement(child, owner, root, depth);
          if (rendered) parts.push(rendered);
        } else {
          if (separateAdjacentElements(parent, children[index - 1], child)) inline += " ";
          inline += inlineText(child, owner, root);
        }
      }
      flushInline();
      return cleanBlock(parts.join("\n\n"));
    }

    const renderRoot = (element, owner) => cleanBlock(renderElement(element, owner, element, 0));
    const plainText = (element) => normalizeInline(inlineText(element, undefined, element, false));
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
