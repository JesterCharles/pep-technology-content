// Stamps the lesson-editor sources into a page and verifies inlined copies.
// Each fragment is wrapped in markers carrying the component version and the fragment's sha256;
// the root element carries data-lesson-editor-source, the sha256 of the manifest lines below. A root inside an
// answer-sensitive activity instead says data-lesson-editor-source="head" and the page head carries
// <meta name="lesson-editor-source" content="<adapter>@<version> sha256:<hex>">; its fragment markers may likewise say
// "head" and take their digest from <meta name="lesson-editor-fragment" content="<name> sha256:<hex>">, so no digest
// sits on the answer surface or in a script that names the answer targets.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
export const DIR = path.dirname(new URL(import.meta.url).pathname);
export const CONTRACT = JSON.parse(readFileSync(path.join(DIR, "contract.json"), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");
export function fragment(name) {
  const f = CONTRACT.fragments[name];
  const text = readFileSync(path.join(DIR, f.file), "utf8");
  return { name, file: f.file, kind: f.kind, text, sha256: sha(text) };
}
export function sourceSha256(names) {
  return sha(names.map((n) => { const f = fragment(n); return `${f.name} ${f.sha256}\n`; }).join(""));
}
const open = (name, h) => `/* lesson-editor@${CONTRACT.version} ${name} sha256:${h} */\n`;
const close = (name) => `/* /lesson-editor ${name} */\n`;
export function block(name, { headStamp = false } = {}) {
  const f = fragment(name);
  return (headStamp ? `/* lesson-editor@${CONTRACT.version} ${name} head */\n` : open(name, f.sha256)) + f.text + close(name);
}
// Head meta for a page whose answer-sensitive activity must carry no digest in its scripts or attributes.
export function headStamps(adapterName) {
  const st = stampFor(adapterName);
  return [`<meta name="lesson-editor-source" content="${st.adapter} sha256:${st.sourceSha256}">`]
    .concat(st.names.map((n) => `<meta name="lesson-editor-fragment" content="${n} sha256:${fragment(n).sha256}">`)).join("\n");
}
export function stampFor(adapterName) {
  const names = ["shell.css", "shell.js", adapterName];
  const a = CONTRACT.fragments[adapterName];
  return { version: CONTRACT.version, adapter: `${a.adapterId}@${a.adapterVersion}`, sourceSha256: sourceSha256(names), names };
}
// Finds every marked block in a page: [{name, version, sha256, text}].
export function blocksIn(html) {
  const heads = new Map([...html.matchAll(/<meta name="lesson-editor-fragment" content="(\S+) sha256:([0-9a-f]{64})">/g)].map((m) => [m[1], m[2]]));
  const re = /\/\* lesson-editor@(\S+) (\S+) (?:sha256:([0-9a-f]{64})|head) \*\/\n([\s\S]*?)\/\* \/lesson-editor \2 \*\/\n/g;
  return [...html.matchAll(re)].map((m) => ({ version: m[1], name: m[2], sha256: m[3] ?? heads.get(m[2]) ?? "missing head stamp", text: m[4] }));
}
export function verifyPage(html) {
  const errors = [];
  const sourceHeads = new Map([...html.matchAll(/<meta name="lesson-editor-source" content="(\S+) sha256:([0-9a-f]{64})">/g)].map((m) => [m[1], m[2]]));
  const roots = [...html.matchAll(/data-lesson-editor="([^"]+)" data-lesson-editor-adapter="([^"]+)" data-lesson-editor-source="(?:sha256:([0-9a-f]{64})|head)"/g)]
    .map((m) => [m[0], m[1], m[2], m[3] ?? sourceHeads.get(m[2]) ?? "missing head stamp"]);
  const blocks = blocksIn(html);
  const opens = (html.match(/\/\* lesson-editor@/g) || []).length;
  if (opens !== blocks.length) errors.push(`${opens - blocks.length} lesson-editor marker(s) without a matching close`);
  if (!roots.length && !blocks.length) return { present: false, errors };
  if (!roots.length) errors.push("lesson-editor fragments without a stamped root element");
  for (const b of blocks) {
    const def = CONTRACT.fragments[b.name];
    if (!def) { errors.push(`unknown fragment ${b.name}`); continue; }
    if (b.version !== CONTRACT.version) errors.push(`${b.name}: version ${b.version}, contract ${CONTRACT.version}`);
    const f = fragment(b.name);
    if (sha(b.text) !== b.sha256) errors.push(`${b.name}: inlined bytes do not match their stamp`);
    if (b.sha256 !== f.sha256) errors.push(`${b.name}: stamp ${b.sha256.slice(0, 12)} differs from source ${f.sha256.slice(0, 12)}`);
    if (def.sha256 !== f.sha256) errors.push(`${b.name}: contract.json records ${def.sha256.slice(0, 12)}, source is ${f.sha256.slice(0, 12)}`);
  }
  for (const [, version, adapter, source] of roots) {
    const an = Object.keys(CONTRACT.fragments).find((n) => { const d = CONTRACT.fragments[n]; return d.adapterId && `${d.adapterId}@${d.adapterVersion}` === adapter; });
    if (!an) { errors.push(`unknown adapter ${adapter}`); continue; }
    if (version !== CONTRACT.version) errors.push(`root version ${version}, contract ${CONTRACT.version}`);
    const st = stampFor(an);
    if (source !== st.sourceSha256) errors.push(`root source stamp differs from the current sources`);
    for (const n of st.names) if (blocks.filter((b) => b.name === n).length !== 1) errors.push(`expected exactly one ${n} block`);
  }
  return { present: true, errors, blocks: blocks.map((b) => ({ name: b.name, version: b.version, sha256: b.sha256 })), roots: roots.map((r) => ({ version: r[1], adapter: r[2], sourceSha256: r[3] })) };
}
