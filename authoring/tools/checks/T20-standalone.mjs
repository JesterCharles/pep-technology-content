import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";
import { error, exists, posix, readJson, sha256, walk } from "../lib/common.mjs";

export const id = "T20";
export const gate = 20;
export const description = "learner artifacts are standalone";

const ARTIFACT_NAMES = new Set([
  "artifact.html",
  "artifact.md",
  "artifact.pdf",
  "artifact.gift",
  "video-artifact.md",
]);
const SCRIPT_RESOURCE_EXT = /\.(?:css|m?js|json|xml|csv|tsv|txt|vtt|srt|wasm|woff2?|ttf|otf|eot|avif|bmp|gif|jpe?g|png|svg|webp|ico|mp3|m4a|ogg|wav|mp4|m4v|mov|webm|pdf)$/i;
const MEDIA_EXT = /\.(?:avif|bmp|gif|jpe?g|png|svg|webp|ico|mp3|m4a|ogg|wav|mp4|m4v|mov|webm)(?:\b|$)/i;
const md = new MarkdownIt({ html: true, linkify: false, typographer: false });

function lineAt(text, index) {
  return text.slice(0, index).split("\n").length;
}

function add(out, ctx, file, line, message) {
  out.push(error(id, `${ctx.display(file)}:${line}`, message));
}

const REGEX_PREFIX = /(?:^|[(,=:[!&|?{};+\-*%<>~^]|\b(?:return|typeof|case|do|else|in|of|void|yield|await))\s*$/;
const ESCAPES = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", 0: "\0" };

function lexJavaScript(source) {
  const code = source.split("");
  const strings = [];
  const braces = [];
  const blank = (start, end) => {
    for (let index = start; index < end; index += 1) if (code[index] !== "\n") code[index] = " ";
  };
  const readTemplate = (start) => {
    let index = start;
    let value = "";
    while (index < source.length) {
      const character = source[index];
      if (character === "\\") {
        value += ESCAPES[source[index + 1]] ?? source[index + 1] ?? "";
        index += 2;
      } else if (character === "`") {
        strings.push({ start: start - 1, end: index + 1, value });
        blank(start - 1, index + 1);
        return index + 1;
      } else if (character === "$" && source[index + 1] === "{") {
        strings.push({ start: start - 1, end: index + 2, value });
        blank(start - 1, index + 2);
        braces.push("${");
        return index + 2;
      } else {
        value += character;
        index += 1;
      }
    }
    strings.push({ start: start - 1, end: index, value });
    blank(start - 1, index);
    return index;
  };
  let index = 0;
  while (index < source.length) {
    const character = source[index];
    const next = source[index + 1];
    if (character === "/" && next === "/") {
      const end = source.indexOf("\n", index);
      const stop = end < 0 ? source.length : end;
      blank(index, stop);
      index = stop;
    } else if (character === "/" && next === "*") {
      const end = source.indexOf("*/", index + 2);
      const stop = end < 0 ? source.length : end + 2;
      blank(index, stop);
      index = stop;
    } else if (character === "'" || character === '"') {
      let cursor = index + 1;
      let value = "";
      while (cursor < source.length && source[cursor] !== character && source[cursor] !== "\n") {
        if (source[cursor] === "\\") {
          value += ESCAPES[source[cursor + 1]] ?? source[cursor + 1] ?? "";
          cursor += 2;
        } else {
          value += source[cursor];
          cursor += 1;
        }
      }
      const stop = source[cursor] === character ? cursor + 1 : cursor;
      strings.push({ start: index, end: stop, value });
      blank(index, stop);
      index = stop;
    } else if (character === "`") {
      index = readTemplate(index + 1);
    } else if (character === "{") {
      braces.push("{");
      index += 1;
    } else if (character === "}") {
      index = braces.pop() === "${" ? readTemplate(index + 1) : index + 1;
    } else if (character === "/" && REGEX_PREFIX.test(code.slice(Math.max(0, index - 16), index).join(""))) {
      let cursor = index + 1;
      let inClass = false;
      while (cursor < source.length && source[cursor] !== "\n") {
        if (source[cursor] === "\\") cursor += 1;
        else if (source[cursor] === "[") inClass = true;
        else if (source[cursor] === "]") inClass = false;
        else if (source[cursor] === "/" && !inClass) break;
        cursor += 1;
      }
      blank(index, cursor + 1);
      index = cursor + 1;
    } else {
      index += 1;
    }
  }
  return { code: code.join(""), strings };
}

function attributes(source) {
  const out = new Map();
  const nameEnd = source.search(/\s|\/?>/);
  const body = nameEnd < 0 ? "" : source.slice(nameEnd);
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of body.matchAll(re))
    out.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
  return out;
}

function isEmbedded(value, { fragment = false, data = [] } = {}) {
  const trimmed = value.trim();
  const type = trimmed.match(/^data:([a-z]+)\//i)?.[1].toLowerCase();
  return (fragment && trimmed.startsWith("#")) || (type !== undefined && data.includes(type));
}

function scanCss(out, ctx, file, css, offset, whole, baseLine = 1) {
  const displayLine = (index) => baseLine + lineAt(whole, index) - 1;
  for (const match of css.matchAll(/@import\b[^;]*(?:;|$)/gi))
    add(out, ctx, file, displayLine(offset + match.index), "CSS @import creates an external dependency");
  for (const match of css.matchAll(/@font-face\b/gi))
    add(out, ctx, file, displayLine(offset + match.index), "web fonts are not standalone");
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
    if (!isEmbedded(match[2], { fragment: true, data: ["image"] }))
      add(out, ctx, file, displayLine(offset + match.index), `CSS url() must be embedded, not ${JSON.stringify(match[2])}`);
  }
}

function scriptResourceAllowed(value, property) {
  const trimmed = value.trim();
  if (trimmed === "" || /\s/.test(trimmed) || /^(?:data:|blob:|#|about:blank$)/i.test(trimmed)) return true;
  if (SCRIPT_RESOURCE_EXT.test(trimmed.split(/[?#]/)[0])) return false;
  return property === "href" || !/^(?:[a-z][a-z+.-]*:|\/\/)|\//i.test(trimmed);
}

function scanJavaScript(out, ctx, file, source, offset, whole, baseLine = 1) {
  const displayLine = (index) => baseLine + lineAt(whole, index) - 1;
  const { code, strings } = lexJavaScript(source);
  const stringsByStart = new Map(strings.map((token) => [token.start, token]));
  const stringAt = (position) => {
    const start = position + (source.slice(position).match(/^\s*/)?.[0].length ?? 0);
    return stringsByStart.get(start);
  };
  const report = (index, message) => add(out, ctx, file, displayLine(offset + index), message);
  const fetchIsLocal = /\bfunction\s+fetch\s*\(|\b(?:const|let|var|class)\s+fetch\b/.test(code);
  const rules = [
    [/\b(?:globalThis|window|self)\s*\.\s*fetch\s*\(/g, "global fetch() is forbidden"],
    [/\bnew\s+(?:globalThis\s*\.\s*)?XMLHttpRequest\s*\(/g, "XMLHttpRequest is forbidden"],
    [/\bimport\s*\(/g, "dynamic import() is forbidden"],
    [/\bnew\s+(?:Worker|SharedWorker)\s*\(/g, "workers are forbidden"],
    [/\bnew\s+EventSource\s*\(/g, "EventSource is forbidden"],
    [/\bnew\s+WebSocket\s*\(/g, "WebSocket is forbidden"],
    [/\b(?:navigator\s*\.\s*)?sendBeacon\s*\(/g, "sendBeacon is forbidden"],
  ];
  if (!fetchIsLocal) rules.push([/(^|[^.\w$])fetch\s*\(/g, "global fetch() is forbidden"]);
  for (const [pattern, message] of rules)
    for (const match of code.matchAll(pattern)) report(match.index, message);
  for (const match of code.matchAll(/\bimport\b(?!\s*[(.])(?:[^;\n]*?\bfrom\b)?/g))
    if (stringAt(match.index + match[0].length)) report(match.index, "external module imports are forbidden");
  const checkResource = (index, property, token) => {
    if (!token) return;
    const values = property === "srcset" ? token.value.split(",").map((item) => item.trim().split(/\s+/)[0]) : [token.value];
    if (values.some((value) => !scriptResourceAllowed(value, property)))
      report(index, `script sets ${property} to a non-embedded resource ${JSON.stringify(token.value)}`);
  };
  for (const match of code.matchAll(/\.\s*(src|href|data|poster|srcset)\s*=(?!=)/g))
    checkResource(match.index, match[1], stringAt(match.index + match[0].length));
  for (const match of code.matchAll(/\.\s*setAttribute(?:NS)?\s*\(/g)) {
    let position = match.index + match[0].length;
    let name = stringAt(position);
    if (name && !/^(?:src|href|data|poster|srcset|xlink:href)$/i.test(name.value)) {
      const namespace = name;
      position = namespace.end + (code.slice(namespace.end).match(/^\s*,/)?.[0].length ?? 0);
      name = stringAt(position);
    }
    if (!name || !/^(?:src|href|data|poster|srcset|xlink:href)$/i.test(name.value)) continue;
    const comma = code.slice(name.end).match(/^\s*,/);
    if (comma) checkResource(match.index, name.value.toLowerCase().replace(/^xlink:/, ""), stringAt(name.end + comma[0].length));
  }
  for (const match of code.matchAll(/\bnew\s+Audio\s*\(/g))
    checkResource(match.index, "src", stringAt(match.index + match[0].length));
  for (const match of code.matchAll(/\.\s*(?:innerHTML|outerHTML)\s*=(?!=)|\.\s*insertAdjacentHTML\s*\(|\bdocument\s*\.\s*write(?:ln)?\s*\(/g)) {
    const start = match.index + match[0].length;
    let depth = 0;
    let end = start;
    for (; end < code.length; end += 1) {
      const character = code[end];
      if ("([{".includes(character)) depth += 1;
      else if (")]}".includes(character) && --depth < 0) break;
      else if (character === ";" && depth === 0) break;
      else if (character === "\n" && depth === 0) {
        const codeEnd = start + code.slice(start, end).trimEnd().length;
        const stringEnd = Math.max(start, ...strings.filter((token) => token.start >= start && token.end <= end).map((token) => token.end));
        const continued = codeEnd > stringEnd && /[+\-*/%=&|^<>?:,.!~]$/.test(code.slice(start, codeEnd));
        if (Math.max(codeEnd, stringEnd) > start && !continued && !/^\s*[+\-*/%&|^<>?:.,]/.test(code.slice(end))) break;
      }
    }
    const markup = strings.filter((token) => token.start >= start && token.start < end).map((token) => token.value).join("");
    if (markup) scanHtmlText(out, ctx, file, markup, { baseLine: displayLine(offset + match.index) });
  }
}

function scanHtmlText(out, ctx, file, html, options = {}) {
  const baseLine = options.baseLine ?? 1;
  const displayLine = (index) => baseLine + lineAt(html, index) - 1;
  const resourceAllowed = (value, embeddedOptions) => {
    if (isEmbedded(value, embeddedOptions)) return true;
    if (!options.bundleRoot || /^(?:[a-z][a-z+.-]*:|\/\/|\/)/i.test(value)) return false;
    const resolved = path.resolve(options.baseDirectory ?? options.bundleRoot, value.split(/[?#]/)[0]);
    return inside(options.bundleRoot, resolved) && existsSync(resolved);
  };
  const source = html.replace(/<!--[\s\S]*?-->/g, (match) => match.replace(/[^\n]/g, " "));
  const tagSource = source.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, (match) => {
    const openEnd = match.indexOf(">");
    const closeStart = match.toLowerCase().lastIndexOf("</");
    return match.slice(0, openEnd + 1) + match.slice(openEnd + 1, closeStart).replace(/[^\n]/g, " ") + match.slice(closeStart);
  });
  const tagPattern = /<\s*([a-zA-Z][\w:-]*)\b[^>]*>/g;
  for (const match of tagSource.matchAll(tagPattern)) {
    const tag = match[1].toLowerCase();
    const attrs = attributes(match[0]);
    const line = displayLine(match.index);
    const reject = (name, embeddedOptions = {}) => {
      if (!attrs.has(name) || resourceAllowed(attrs.get(name), embeddedOptions)) return;
      add(out, ctx, file, line, `<${tag}> ${name} must be embedded, not ${JSON.stringify(attrs.get(name))}`);
    };
    if (tag === "link" && /(?:^|\s)(?:stylesheet|preload|modulepreload)(?:\s|$)/i.test(attrs.get("rel") ?? ""))
      reject("href");
    if (tag === "script") reject("src");
    if (["img", "input"].includes(tag)) reject("src", { data: ["image"] });
    if (tag === "source") reject("src", { data: ["image", "audio", "video"] });
    if (["video", "audio"].includes(tag)) reject("src", { data: ["audio", "video"] });
    if (tag === "track") reject("src", { data: ["text"] });
    if (["iframe", "embed"].includes(tag)) reject("src");
    if (tag === "object") reject("data");
    if (tag === "video") reject("poster", { data: ["image"] });
    if (attrs.has("srcset")) {
      const candidates = attrs.get("srcset").split(",").map((item) => item.trim().split(/\s+/)[0]);
      if (candidates.some((item) => !resourceAllowed(item, { data: ["image"] })))
        add(out, ctx, file, line, `<${tag}> srcset contains a non-embedded resource`);
    }
    if (["image", "use"].includes(tag)) {
      for (const name of ["href", "xlink:href"])
        reject(name, { fragment: true, data: tag === "image" ? ["image"] : [] });
    }
    if (attrs.has("style")) scanCss(out, ctx, file, attrs.get("style"), match.index, html, baseLine);
  }
  for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) {
    const inner = match[0].indexOf(match[1]);
    scanCss(out, ctx, file, match[1], match.index + inner, html, baseLine);
  }
  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const attrs = attributes(`<script ${match[1]}>`);
    if (attrs.has("src") || /^(?:application|text)\/(?:json|ld\+json)$/i.test(attrs.get("type") ?? "")) continue;
    const inner = match[0].indexOf(match[2]);
    scanJavaScript(out, ctx, file, match[2], match.index + inner, html, baseLine);
  }
}

async function scanHtml(out, ctx, file) {
  scanHtmlText(out, ctx, file, await readFile(file, "utf8"));
}

function markdownDestinationAllowed(destination, image) {
  if (/^data:image\//i.test(destination)) return true;
  if (image) return false;
  return /^(?:https?:|mailto:|#)/i.test(destination);
}

async function scanMarkdown(out, ctx, file, bundleRoot) {
  const source = await readFile(file, "utf8");
  const tokens = md.parse(source, {});
  const localAllowed = (destination) => {
    if (!bundleRoot || /^(?:[a-z][a-z+.-]*:|\/\/|\/)/i.test(destination)) return false;
    const resolved = path.resolve(path.dirname(file), destination.split(/[?#]/)[0]);
    return inside(bundleRoot, resolved) && existsSync(resolved);
  };
  const visit = (items, inheritedLine = 1) => {
    for (const token of items) {
      const line = (token.map?.[0] ?? inheritedLine - 1) + 1;
      if (token.type === "image") {
        const destination = token.attrGet("src") ?? "";
        if (!markdownDestinationAllowed(destination, true) && !localAllowed(destination))
          add(out, ctx, file, line, `Markdown image must be embedded, not ${JSON.stringify(destination)}`);
      }
      if (token.type === "link_open") {
        const destination = token.attrGet("href") ?? "";
        const optional = /optional navigation/i.test(token.attrGet("title") ?? "");
        if (!optional && !markdownDestinationAllowed(destination, false) && !localAllowed(destination))
          add(out, ctx, file, line, `relative link must be marked with title "optional navigation": ${JSON.stringify(destination)}`);
      }
      if (["html_block", "html_inline"].includes(token.type))
        scanHtmlText(out, ctx, file, token.content, { baseLine: line, bundleRoot, baseDirectory: path.dirname(file) });
      if (token.children) visit(token.children, line);
    }
  };
  visit(tokens);
}

async function scanGift(out, ctx, file) {
  const source = await readFile(file, "utf8");
  const rules = [
    [/\[html\]/gi, "GIFT HTML format can hide external dependencies"],
    [/<\s*(?:img|source|video|audio|object|iframe|embed)\b/gi, "GIFT embedded media is forbidden"],
    [/@@PLUGINFILE@@/gi, "GIFT @@PLUGINFILE@@ dependency is forbidden"],
    [/!\[[^\]]*\]\([^)]*\)|!\[[^\]]*\]\s*\[[^\]]*\]/g, "GIFT Markdown image is forbidden"],
    [/\bfile:/gi, "GIFT file: dependency is forbidden"],
    [MEDIA_EXT, "GIFT image or media filename is forbidden"],
  ];
  for (const [pattern, message] of rules)
    for (const match of source.matchAll(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`)))
      add(out, ctx, file, lineAt(source, match.index), message);
}

async function scanPdf(out, ctx, file) {
  const bytes = await readFile(file);
  const source = bytes.toString("latin1");
  const staticRules = [
    [/\/JavaScript\b|\/JS\b/, "PDF JavaScript action is forbidden"],
    [/\/Launch\b/, "PDF launch action is forbidden"],
    [/\/GoToR\b/, "PDF remote-goto action is forbidden"],
    [/\/Type\s*\/Filespec\b|\/EF\s*<</, "PDF external-file specification is forbidden"],
  ];
  for (const [pattern, message] of staticRules)
    if (pattern.test(source)) add(out, ctx, file, 1, message);
  const info = spawnSync("pdfinfo", [file], { encoding: "utf8" });
  if (info.error || info.status !== 0) {
    add(out, ctx, file, 1, `cannot inspect PDF: ${info.error?.message ?? info.stderr.trim()}`);
    return;
  }
  if (/^JavaScript:\s+yes$/im.test(info.stdout) && !/\/JavaScript\b|\/JS\b/.test(source))
    add(out, ctx, file, 1, "PDF JavaScript action is forbidden");
  const fonts = spawnSync("pdffonts", [file], { encoding: "utf8" });
  if (fonts.error || fonts.status !== 0) {
    add(out, ctx, file, 1, `cannot inspect PDF fonts: ${fonts.error?.message ?? fonts.stderr.trim()}`);
    return;
  }
  const rows = fonts.stdout.split("\n").slice(2).filter((line) => line.trim());
  if (rows.some((line) => line.trim().split(/\s+/).at(-5) !== "yes"))
    add(out, ctx, file, 1, "PDF contains an unembedded font");
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function manifestReferences(manifest) {
  return [
    ["setup.cwd", manifest.setup?.cwd, "directory", true],
    ["test.cwd", manifest.test?.cwd, "directory", true],
    ...((manifest.fixtures?.files ?? []).map((value, index) => [`fixtures.files[${index}]`, value, "file", true])),
    ["expectedOutput", manifest.expectedOutput, "file", true],
    ...((manifest.cleanup?.paths ?? []).map((value, index) => [`cleanup.paths[${index}]`, value, "path", false])),
  ].filter(([, value]) => typeof value === "string");
}

function commandReferences(command) {
  if (typeof command !== "string") return [];
  return [...command.matchAll(/(?:^|\s)([^\s"']*(?:\/|\.(?:py|js|mjs|cjs|sh|jar))[^\s"']*)/g)]
    .map((match) => match[1].replace(/[;&|]+$/, ""))
    .filter((value) => value && !value.startsWith("-"));
}

async function scanLab(out, ctx, root) {
  const tree = await walk(root);
  for (const link of tree.symlinks) add(out, ctx, link, 1, "coding-lab bundles must not contain symlinks");
  const readme = path.join(root, "README.md");
  const manifestFile = path.join(root, "lab.json");
  if (!(await exists(readme))) add(out, ctx, readme, 1, "coding-lab/README.md is the required learner entrypoint");
  if (!(await exists(manifestFile))) {
    add(out, ctx, manifestFile, 1, "coding-lab/lab.json is required");
    return;
  }
  let manifest;
  try {
    manifest = await readJson(manifestFile);
  } catch (issue) {
    add(out, ctx, manifestFile, 1, `invalid lab manifest: ${issue.message}`);
    return;
  }
  if (await exists(readme)) {
    const text = await readFile(readme, "utf8");
    for (const [label, block] of [["setup command", manifest.setup], ["test command", manifest.test]])
      if (typeof block?.command === "string" && !text.includes(block.command))
        add(out, ctx, readme, 1, `README.md must name the ${label} ${JSON.stringify(block.command)}`);
  }
  for (const [label, value, kind, mustExist] of manifestReferences(manifest)) {
    const resolved = path.resolve(root, value);
    if (path.isAbsolute(value) || !inside(root, resolved)) {
      add(out, ctx, manifestFile, 1, `${label} escapes the coding-lab bundle: ${JSON.stringify(value)}`);
      continue;
    }
    if (mustExist && !(await exists(resolved)))
      add(out, ctx, manifestFile, 1, `${label} names a missing ${kind}: ${JSON.stringify(value)}`);
  }
  for (const [label, block] of [["setup.command", manifest.setup], ["test.command", manifest.test]]) {
    for (const value of commandReferences(block?.command)) {
      const cwd = path.resolve(root, block?.cwd ?? ".");
      const resolved = path.resolve(cwd, value);
      if (path.isAbsolute(value) || !inside(root, resolved))
        add(out, ctx, manifestFile, 1, `${label} references outside the bundle: ${JSON.stringify(value)}`);
      else if (!(await exists(resolved)))
        add(out, ctx, manifestFile, 1, `${label} names a missing path: ${JSON.stringify(value)}`);
    }
  }
  for (const file of tree.files) {
    const relative = posix(path.relative(root, file));
    if (relative.endsWith(".md")) await scanMarkdown(out, ctx, file, root);
    if (/\.(?:mjs|cjs|js)$/.test(relative)) {
      const source = await readFile(file, "utf8");
      for (const match of source.matchAll(/(?:import\s+(?:[\s\S]*?\s+from\s+)?|require\s*\()\s*["'](\.{1,2}\/[^"']+)["']/g)) {
        const resolved = path.resolve(path.dirname(file), match[1]);
        if (!inside(root, resolved)) add(out, ctx, file, lineAt(source, match.index), `import escapes the coding-lab bundle: ${JSON.stringify(match[1])}`);
      }
    }
    if (relative.endsWith(".py")) {
      const source = await readFile(file, "utf8");
      for (const match of source.matchAll(/^\s*from\s+(\.{2,})[\w.]*\s+import\b/gm))
        add(out, ctx, file, lineAt(source, match.index), `relative import escapes the coding-lab bundle: ${JSON.stringify(match[1])}`);
    }
  }
  const digest = path.join(root, "LAB_BUNDLE.sha256");
  if (await exists(digest)) {
    const records = new Map();
    const text = await readFile(digest, "utf8");
    for (const [index, line] of text.trimEnd().split("\n").entries()) {
      const match = line.match(/^([a-f0-9]{64})  (.+)$/);
      if (!match) {
        add(out, ctx, digest, index + 1, "invalid LAB_BUNDLE.sha256 record");
        continue;
      }
      records.set(match[2], match[1]);
    }
    const shipped = tree.files.filter((file) => file !== digest).map((file) => posix(path.relative(root, file))).sort();
    for (const relative of shipped) {
      const expected = records.get(relative);
      if (!expected) add(out, ctx, digest, 1, `digest does not inventory ${relative}`);
      else if (expected !== sha256(await readFile(path.join(root, relative))))
        add(out, ctx, digest, 1, `digest checksum disagrees for ${relative}`);
    }
    for (const relative of records.keys())
      if (!shipped.includes(relative)) add(out, ctx, digest, 1, `digest inventories a file that is not shipped: ${relative}`);
  }
}

function learnerFile(relative) {
  const parts = relative.split("/");
  if (["authoring", "components", "curriculum", "tracks", ".github", "build", "node_modules"].includes(parts[0])) return false;
  return ARTIFACT_NAMES.has(parts.at(-1)) || parts.includes("coding-lab");
}

async function inventory(ctx) {
  if (ctx.explicit) {
    const files = [];
    const labs = new Set();
    for (const target of ctx.targets) {
      const tree = await walk(target);
      for (const file of tree.files) {
        const labIndex = file.split(path.sep).lastIndexOf("coding-lab");
        if (labIndex >= 0) labs.add(file.split(path.sep).slice(0, labIndex + 1).join(path.sep));
        if (ARTIFACT_NAMES.has(path.basename(file))) files.push(file);
      }
      for (const link of tree.symlinks) {
        const parts = link.split(path.sep);
        const labIndex = parts.lastIndexOf("coding-lab");
        if (labIndex >= 0) labs.add(parts.slice(0, labIndex + 1).join(path.sep));
      }
      if (path.basename(target) === "coding-lab") labs.add(target);
    }
    return { files: [...new Set(files)].sort(), labs: [...labs].sort() };
  }
  let tracked;
  try {
    tracked = execFileSync("git", ["ls-files", "-z", "--"], { cwd: ctx.root })
      .toString("utf8").split("\0").filter(Boolean).filter(learnerFile);
  } catch (issue) {
    throw new Error(`cannot inventory tracked learner artifacts: ${issue.message}`);
  }
  const files = tracked.filter((relative) => ARTIFACT_NAMES.has(path.posix.basename(relative))).map((relative) => path.join(ctx.root, relative));
  const labs = new Set();
  for (const relative of tracked) {
    const parts = relative.split("/");
    const index = parts.lastIndexOf("coding-lab");
    if (index >= 0) labs.add(path.join(ctx.root, ...parts.slice(0, index + 1)));
  }
  return { files: files.sort(), labs: [...labs].sort() };
}

export async function run(ctx) {
  const out = [];
  const { files, labs } = await inventory(ctx);
  for (const file of files) {
    const name = path.basename(file);
    if (name === "artifact.html") await scanHtml(out, ctx, file);
    else if (name === "artifact.md" || name === "video-artifact.md") await scanMarkdown(out, ctx, file);
    else if (name === "artifact.gift") await scanGift(out, ctx, file);
    else if (name === "artifact.pdf") await scanPdf(out, ctx, file);
  }
  for (const lab of labs) await scanLab(out, ctx, lab);
  return out;
}
