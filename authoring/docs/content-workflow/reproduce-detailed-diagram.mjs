#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const args = process.argv.slice(2);
const rootFlag = args.indexOf("--archify-root");
const archifyRoot = rootFlag >= 0 ? path.resolve(args[rootFlag + 1] ?? "") : process.env.ARCHIFY_ROOT;
const write = args.includes("--write");
const sourcePath = path.join(here, "detailed-architecture.archify.json");
const svgPath = path.join(here, "detailed-architecture.svg");
const manifestPath = path.join(here, "detailed-diagram-provenance.json");
const buildDirectory = path.join(root, "build", "content-workflow-detailed-reproduction");
const rawPath = path.join(buildDirectory, "detailed-architecture.raw.html");

const provenance = {
  repository: "https://github.com/tt-a1i/archify",
  tag: "v3.0.1",
  annotatedTagObject: "679f195584e4216fd582c073d8964b3a9f59107e",
  commit: "2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c",
  license: "MIT",
  cliPath: "archify/bin/archify.mjs",
  cliSha256: "97788086acaac4122aafc56c48acfe5fde1979d6aaa67db73aa1f4ab70b34390",
  licenseSha256: "b799ab081703e7821ae5096d2c1abdf14bbdc75e8ea1c4045998c36ed6db9706",
  sourceArchiveSha256: "e14ccec6d5765e842aa77907431aa068410f2e44fe373e13eae786d7697b0888"
};

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function fail(message) {
  console.error(`content-workflow detailed diagram: ${message}`);
  process.exit(1);
}

function prefixSvgIds(svg, prefix) {
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const known = new Set(ids);
  for (const id of ids) {
    svg = svg
      .replaceAll(`id="${id}"`, `id="${prefix}${id}"`)
      .replaceAll(`url(#${id})`, `url(#${prefix}${id})`)
      .replaceAll(`href="#${id}"`, `href="#${prefix}${id}"`);
  }
  return svg.replace(/aria-labelledby="([^"]+)"/g, (_, value) =>
    `aria-labelledby="${value.split(/\s+/).map((id) => known.has(id) ? `${prefix}${id}` : id).join(" ")}"`);
}

function finalSvg(raw, inputSha) {
  const start = raw.indexOf("<svg ");
  const end = raw.indexOf("</svg>", start);
  if (start < 0 || end < 0) fail("Archify output does not contain one SVG");
  let svg = raw.slice(start, end + 6);
  if (raw.indexOf("<svg ", start + 1) >= 0 && raw.indexOf("<svg ", start + 1) < end) {
    fail("Archify diagram contains an unexpected nested SVG");
  }
  const generatedViewBox = 'viewBox="0 0 1258 652"';
  if (!svg.includes(generatedViewBox)) fail("Archify output viewBox changed; review the intentional crop before adapting it");
  svg = svg
    .replace("<svg ", `<svg xmlns="http://www.w3.org/2000/svg" data-archify-input-sha256="${inputSha}" `)
    .replace(generatedViewBox, 'viewBox="0 0 1258 564"')
    .replaceAll(/\s+tabindex="0"\s+role="button"/g, "")
    .replaceAll(/\s+aria-pressed="false"/g, "");
  const styles = `
        <metadata id="pep-detailed-archify-provenance">Archify v3.0.1, commit ${provenance.commit}; post-process pep-content-workflow-detailed-svg-v1</metadata>
        <style>
          svg{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color-scheme:light dark}
          .c-grid{fill:none;stroke:#d8e0dd}.c-lane{fill:#f8faf9;stroke:#83908b}.c-security-group{fill:#fff4f2;stroke:#a32218}
          .c-mask{fill:#f8faf9}.c-frontend{fill:#d6ebe5;stroke:#0d6657}.c-backend{fill:#e7ecea;stroke:#47524e}.c-database{fill:#e7ecea;stroke:#47524e}
          .c-security{fill:#f8e0dc;stroke:#a32218}.c-messagebus{fill:#d6ebe5;stroke:#0d6657}.c-external{fill:#f6e7d6;stroke:#87470a}
          .t-primary{fill:#1b2320}.t-muted,.t-dim{fill:#47524e}.t-security{fill:#8f1f17}
          .t-edge-default{fill:#47524e}.t-edge-emphasis{fill:#0d6657}.t-edge-security{fill:#8f1f17}.t-edge-dashed{fill:#6b4be8}
          .semantic-sigil{fill:none;stroke:#1b2320;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round}.sigil-fill{fill:#1b2320;stroke:none}
          .a-emphasis,.a-dashed,.a-security,.a-default{fill:none;stroke-linejoin:round;stroke-linecap:round}.a-emphasis{stroke:#0d6657}.a-dashed{stroke:#6b4be8;stroke-dasharray:6 5}.a-security{stroke:#a32218}.a-default{stroke:#47524e}
          .m-emphasis{fill:#0d6657}.m-dashed{fill:#6b4be8}.m-security{fill:#a32218}.m-default{fill:#47524e}
          text{paint-order:stroke;stroke:#f8faf9;stroke-width:1.5px;stroke-linejoin:round}
          @media(prefers-color-scheme:dark){
            .c-grid{stroke:#2f3b37}.c-lane{fill:#1a2220;stroke:#71827c}.c-security-group{fill:#281c1a;stroke:#ff8b7c}
            .c-mask{fill:#1a2220}.c-frontend{fill:#173430;stroke:#5fcab3}.c-backend,.c-database{fill:#202a27;stroke:#a8b6b0}
            .c-security{fill:#3d1d19;stroke:#ff8b7c}.c-messagebus{fill:#173430;stroke:#5fcab3}.c-external{fill:#36281a;stroke:#e6a65c}
            .t-primary{fill:#e3ebe7}.t-muted,.t-dim{fill:#a8b6b0}.t-security{fill:#ff8b7c}
            .t-edge-default{fill:#a8b6b0}.t-edge-emphasis{fill:#5fcab3}.t-edge-security{fill:#ff8b7c}.t-edge-dashed{fill:#ad99ff}
            .semantic-sigil{stroke:#e3ebe7}.sigil-fill{fill:#e3ebe7}.a-emphasis{stroke:#5fcab3}.a-dashed{stroke:#ad99ff}.a-security{stroke:#ff8b7c}.a-default{stroke:#a8b6b0}
            .m-emphasis{fill:#5fcab3}.m-dashed{fill:#ad99ff}.m-security{fill:#ff8b7c}.m-default{fill:#a8b6b0}
            text{stroke:#1a2220}
          }
          @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
        </style>`;
  svg = svg.replace(/(<desc[^>]*>.*?<\/desc>)/s, `$1${styles}`);
  svg = prefixSvgIds(svg, "detail-");
  return `${svg.trim()}\n`;
}

if (!archifyRoot) {
  fail("set ARCHIFY_ROOT or pass --archify-root with an extracted pinned Archify v3.0.1 source tree");
}

const cli = path.join(archifyRoot, provenance.cliPath);
const license = path.join(archifyRoot, "LICENSE");
const packageFile = path.join(archifyRoot, "archify", "package.json");
const [cliBytes, licenseBytes, packageBytes, sourceBytes, scriptBytes] = await Promise.all([
  readFile(cli).catch(() => fail(`missing ${cli}`)),
  readFile(license).catch(() => fail(`missing ${license}`)),
  readFile(packageFile).catch(() => fail(`missing ${packageFile}`)),
  readFile(sourcePath),
  readFile(fileURLToPath(import.meta.url))
]);
if (sha256(cliBytes) !== provenance.cliSha256) fail("Archify CLI hash differs from the pinned v3.0.1 bytes");
if (sha256(licenseBytes) !== provenance.licenseSha256) fail("Archify license hash differs from the pinned MIT license bytes");
const packageData = JSON.parse(packageBytes);
if (packageData.version !== "3.0.1" || packageData.bin?.archify !== "./bin/archify.mjs" || packageData.license !== "MIT") {
  fail("Archify package identity, CLI path, or license differs from v3.0.1");
}

await mkdir(buildDirectory, { recursive: true });
const render = spawnSync(process.execPath, [cli, "render", "workflow", sourcePath, rawPath, "--quality", "standard"], {
  cwd: root,
  encoding: "utf8"
});
if (render.status !== 0) fail(`render failed\n${render.stdout}${render.stderr}`);
const rawBytes = await readFile(rawPath);
const inputSha256 = sha256(sourceBytes);
const svg = finalSvg(rawBytes.toString("utf8"), inputSha256);
const manifest = {
  schemaVersion: 1,
  producer: provenance,
  input: {
    path: "authoring/docs/content-workflow/detailed-architecture.archify.json",
    sha256: inputSha256
  },
  generation: {
    command: "node <archify-root>/archify/bin/archify.mjs render workflow authoring/docs/content-workflow/detailed-architecture.archify.json build/content-workflow-detailed-reproduction/detailed-architecture.raw.html --quality standard",
    networkBehavior: "render only; no network-capable Archify command",
    rawHtmlSha256: sha256(rawBytes)
  },
  postprocess: {
    recipe: "pep-content-workflow-detailed-svg-v1: extract the only outer SVG; add xmlns and input hash; crop the generated empty footer from viewBox 1258x652 to 1258x564 after asserting exact geometry; remove Archify node button state; embed system-font light/dark styles, reduced-motion rule, and producer metadata; normalize one trailing newline",
    script: "authoring/docs/content-workflow/reproduce-detailed-diagram.mjs",
    scriptSha256: sha256(scriptBytes),
    finalSvgSha256: sha256(svg)
  }
};

if (write) {
  await writeFile(svgPath, svg);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`wrote ${path.relative(root, svgPath)} and ${path.relative(root, manifestPath)}`);
} else {
  const [trackedSvg, trackedManifest] = await Promise.all([
    readFile(svgPath, "utf8"),
    readFile(manifestPath, "utf8").then(JSON.parse)
  ]);
  if (trackedSvg !== svg) fail("generated SVG differs; rerun with --write after reviewing the pinned output");
  if (JSON.stringify(trackedManifest) !== JSON.stringify(manifest)) fail("provenance or raw output drifted; rerun with --write after review");
  console.log(`content-workflow detailed diagram: pinned Archify reproduction passed (${manifest.postprocess.finalSvgSha256})`);
}
