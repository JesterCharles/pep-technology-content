#!/usr/bin/env node
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { evidencePath, walk } from "../lib/common.mjs";
import { artifactSha256, fetchBytes } from "./receipts.mjs";

export function parseVideoFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) {
    throw new Error("missing video front matter");
  }
  const end = markdown.indexOf("\n---\n", 4);
  if (end < 0) {
    throw new Error("unterminated video front matter");
  }
  const data = {};
  for (const line of markdown.slice(4, end).split("\n")) {
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!match) {
      continue;
    }
    let value = match[2];
    if (/^\d+(?:\.\d+)?$/.test(value)) {
      value = Number(value);
    } else if (value === "true" || value === "false") {
      value = value === "true";
    }
    data[match[1]] = value;
  }
  return data;
}

function provider(url) {
  const parsed = new URL(url);
  if (/(^|\.)youtube\.com$/.test(parsed.hostname) || parsed.hostname === "youtu.be") {
    return {
      name: "youtube",
      oEmbed: `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    };
  }
  if (/(^|\.)vimeo\.com$/.test(parsed.hostname)) {
    return {
      name: "vimeo",
      oEmbed: `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
    };
  }
  return { name: "other" };
}

async function inspectVideo(url) {
  const selected = provider(url);
  let oEmbedUrl = selected.oEmbed;
  let pageBytes;
  if (!oEmbedUrl || selected.name === "youtube") {
    const page = await fetchBytes(url);
    if (page.response.status !== 200) {
      throw new Error(`video page returned HTTP ${page.response.status}`);
    }
    pageBytes = page.bytes;
    if (!oEmbedUrl) {
      const match = pageBytes
        .toString("utf8")
        .match(/<link[^>]+type=["']application\/json\+oembed["'][^>]+href=["']([^"']+)/i);
      if (!match) {
        throw new Error("video page does not advertise a JSON oEmbed endpoint");
      }
      oEmbedUrl = match[1].replaceAll("&amp;", "&");
    }
  }
  const fetched = await fetchBytes(oEmbedUrl);
  if (fetched.response.status !== 200) {
    throw new Error(`oEmbed returned HTTP ${fetched.response.status}`);
  }
  const oEmbed = JSON.parse(fetched.bytes.toString("utf8"));
  let runtimeSeconds = Number(oEmbed.duration);
  if ((!runtimeSeconds || !Number.isFinite(runtimeSeconds)) && selected.name === "youtube") {
    const page = pageBytes ?? (await fetchBytes(url)).bytes;
    const match = page.toString("utf8").match(/["']lengthSeconds["']\s*:\s*["'](\d+)["']/);
    runtimeSeconds = match ? Number(match[1]) : NaN;
  }
  if (!runtimeSeconds || !Number.isFinite(runtimeSeconds)) {
    throw new Error("provider did not expose a video runtime");
  }
  return {
    oEmbedUrl,
    oEmbedStatus: fetched.response.status,
    title: oEmbed.title,
    channel: oEmbed.author_name,
    runtimeSeconds,
  };
}

async function videoFiles(root, inputs) {
  const found = new Set();
  for (const input of inputs.length ? inputs : [root]) {
    const resolved = path.resolve(root, input);
    const info = await stat(resolved);
    if (info.isFile() && path.basename(resolved) === "video-artifact.md") {
      found.add(resolved);
      continue;
    }
    const directory = info.isDirectory() ? resolved : path.dirname(resolved);
    for (const file of (await walk(directory)).files) {
      if (path.basename(file) === "video-artifact.md") {
        found.add(file);
      }
    }
  }
  return [...found].sort();
}

async function main() {
  const inputs = process.argv.slice(2);
  if (inputs.includes("--help")) {
    console.log(
      "Usage: node workflow/tools/net/check-video.mjs [video-or-course-path ...]",
    );
    return;
  }
  const root = process.cwd();
  let failed = false;
  for (const file of await videoFiles(root, inputs)) {
    const parts = path.relative(root, file).split(path.sep);
    if (parts.length < 4) {
      throw new Error(`${path.relative(root, file)} is not under <course>/<module>/<topic>`);
    }
    const [course, module, topic] = parts;
    const frontmatter = parseVideoFrontmatter(await readFile(file, "utf8"));
    const checkedAt = new Date().toISOString();
    let status;
    try {
      status = await inspectVideo(frontmatter.url);
    } catch (issue) {
      status = {
        oEmbedUrl: null,
        oEmbedStatus: 0,
        title: frontmatter.title,
        channel: frontmatter.channel,
        runtimeSeconds: 0,
        error: issue.message,
      };
      failed = true;
    }
    const receipt = {
      schemaVersion: 1,
      artifactSha256: await artifactSha256(file),
      checkedAt,
      url: frontmatter.url,
      public: status.oEmbedStatus === 200,
      embeddable: status.oEmbedStatus === 200,
      ...status,
    };
    const receiptFile = evidencePath(root, course, module, topic, "video.json");
    await mkdir(path.dirname(receiptFile), { recursive: true });
    await writeFile(receiptFile, `${JSON.stringify(receipt, null, 2)}\n`);
    console.log(path.relative(root, receiptFile));
  }
  if (failed) {
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(`check-video: ${error.message}`);
    process.exitCode = 1;
  });
}
