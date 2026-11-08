// Deterministic post-processing of the Archify v3.0.1 SVG for the multi-stage-builds learner page.
// Written for this repository; it contains no Archify code. Pure text transforms, no dependencies,
// no network: the same input bytes always give the same output bytes.
//
// Usage: node diagram-postprocess.mjs <raw.svg> <out.svg>
//   raw.svg  the single <svg> element extracted from `archify render` output (diagram-multi-stage.raw.svg)
//   out.svg  the bytes inlined in artifact.html as <svg class="msd">
import { readFileSync, writeFileSync } from 'node:fs';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: node diagram-postprocess.mjs <raw.svg> <out.svg>');
  process.exit(2);
}

let s = readFileSync(input, 'utf8');
const step = (re, to) => { s = s.replace(re, to); };

// 1. Drop comments, the decorative grid pattern and its background rectangle.
step(/<!--[\s\S]*?-->/g, '');
step(/<pattern id="grid"[\s\S]*?<\/pattern>/, '');
step(/<rect width="100%" height="100%" fill="url\(#grid\)" \/>/, '');

// 2. Root: a static image cropped to the drawing (legend hidden), labelled by page-specific title and desc.
step(/<svg [^>]*>/, '<svg class="msd" viewBox="70 20 300 644" role="img" aria-labelledby="msd-title msd-desc">');
step(/<title id="archify-diagram-title">[^<]*<\/title>/, '<title id="msd-title">Multi-stage back-end build: what ships</title>');
step(/<desc id="archify-diagram-description">[^<]*<\/desc>/,
  '<desc id="msd-desc">One column, top to bottom: the project folder is copied into the build stage, which packages a jar; only that jar is copied with COPY --from=build into the final stage, the image. The caption below describes every part.</desc>');

// 3. Node groups become plain groups: no focus stops, button roles or per-node tooltips.
step(/<g id="node-(\w+)"[^>]*>/g, (_, id) => `<g class="msd-n msd-${id}">`);
step(/<title>[^<]*<\/title>/g, '');

// 4. Strip renderer data and pointer attributes and inline custom-property styles.
step(/\s(?:data-[\w-]+|pointer-events)="[^"]*"/g, '');
step(/\sstyle="--step:\d+"/g, '');
step(/stroke="var\(--mask\)"/g, 'class="msd-halo"');

// 5. Prefix marker ids so they cannot collide with anything else on the page.
for (const k of ['arrowhead-emphasis', 'arrowhead-security', 'arrowhead-dashed', 'arrowhead']) {
  s = s.split(`id="${k}"`).join(`id="msd-${k}"`).split(`url(#${k})`).join(`url(#msd-${k})`);
}

// 6. Larger type for a narrow column, and edge labels moved to the right of the vertical line.
step(/class="t-primary" font-size="11"/g, 'class="t-primary" font-size="15"');
step(/class="t-muted" font-size="9"/g, 'class="t-muted" font-size="13"');
step(/class="t-cloud" font-size="9"/g, 'class="t-cloud" font-size="14"');
step(/<text x="[\d.]+" y="(\d+)" class="(t-edge-(?:default|emphasis))" font-size="8" text-anchor="middle">/g,
  (_, y, cls) => `<text x="228" y="${y}" class="${cls}" font-size="13" text-anchor="start">`);

// 7. One element per line, no indentation, trailing newline.
s = s.split('\n').map((l) => l.trim()).filter(Boolean).join('\n') + '\n';
writeFileSync(output, s);
