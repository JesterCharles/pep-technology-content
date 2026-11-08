// Maintainer regression evidence, not part of the learner bundle. Static and browser-free:
// run `node authoring/evidence/containers-cicd/containers-and-compose/page-regressions/check-pages.mjs` from the repository root.
// For every topic page in this module it checks three corrected defects:
//  1. One-story ownership: each optional anecdote owns exactly one non-empty data-pep-anecdote-story and at most one
//     data-pep-anecdote-map (25 words or fewer), the story holds no code markup, and no story or map hook exists
//     anywhere else on the page.
//  2. Phone link targets: every link outside a closed-by-default disclosure is a "Next topic" link, and the page CSS
//     gives those links a box that can take a 44 px minimum height while never exceeding the column width.
//  3. Print shows every activity: the print stylesheet un-hides every teaching, task and control step,
//     renders each data-static-alt text, and lets the terminal log grow instead of clipping it.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const moduleDir = path.join(import.meta.dirname, '../../../../../containers-cicd/containers-and-compose');
const STORY = /<([a-z]+)\b[^>]*\sdata-pep-anecdote-story\b[^>]*>([\s\S]*?)<\/\1>/g;
const MAP = /<([a-z]+)\b[^>]*\sdata-pep-anecdote-map\b[^>]*>([\s\S]*?)<\/\1>/g;
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const count = (s, re) => (s.match(re) || []).length;
let failed = 0;
const report = (ok, topic, what) => { if (!ok) failed++; console.log(`${ok ? 'ok' : 'not ok'} - ${topic}: ${what}`); };

for (const topic of readdirSync(moduleDir).sort()) {
  const file = path.join(moduleDir, topic, 'artifact.html');
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');

  const anecdotes = [...html.matchAll(/<details\b[^>]*\bpep-optional--anecdote\b[^>]*>([\s\S]*?)<\/details>/g)].map((m) => m[1]);
  let owned = 0;
  for (const body of anecdotes) {
    const stories = [...body.matchAll(STORY)], maps = [...body.matchAll(MAP)];
    owned += stories.length + maps.length;
    report(stories.length === 1 && text(stories[0][2]).length > 0, topic, `anecdote owns exactly one non-empty story (found ${stories.length})`);
    report(stories.every((s) => !/<(code|pre|kbd|samp)\b|`/.test(s[2])), topic, 'anecdote story contains no code markup');
    report(maps.length <= 1 && maps.every((m) => { const n = text(m[2]).split(' ').filter(Boolean).length; return n > 0 && n <= 25; }), topic, 'anecdote has at most one map of 1-25 words');
  }
  const pageHooks = count(html, /\sdata-pep-anecdote-(story|map)\b/g);
  report(pageHooks === owned, topic, `no story or map hook outside an anecdote (${pageHooks} on page, ${owned} owned)`);

  const visible = html.replace(/<details\b[\s\S]*?<\/details>/g, '').replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/g, '');
  const links = [...visible.matchAll(/<a\b[^>]*>/g)].length;
  const nextLinks = count(visible, /<p class="next-topic">[^<]*<a\b/g);
  report(links === nextLinks, topic, `every always-visible link is a Next topic link (${links} links, ${nextLinks} Next topic)`);
  if (nextLinks) {
    const rule = (html.match(/\.next-topic a \{([^}]*)\}/) || [])[1] || '';
    const minHeight = Number((rule.match(/min-height:\s*(\d+)px/) || [])[1] || 0);
    report(/display:\s*(inline-flex|inline-block|flex|block)\b/.test(rule) && minHeight >= 44 && /max-width:\s*100%/.test(rule), topic,
      `Next topic link CSS gives a sized box with min-height ${minHeight}px >= 44 and max-width 100%`);
  }

  const print = [...html.matchAll(/@media print \{([\s\S]*?)\n\}/g)].map((m) => m[1]).join('\n');
  const unhide = (print.match(/^\s*([^{\n]*)\{[^}]*display: block !important/m) || [])[1] || '';
  report(['teaching', 'task', 'control'].every((r) => unhide.includes(`#current-${r} > [data-step][hidden]`)), topic,
    'print un-hides every teaching, task and control step');
  report(/\[data-static-alt\]::after \{[^}]*content: attr\(data-static-alt\)/.test(print), topic, 'print renders each static alternative');
  report(/\.log \{[^}]*height: auto/.test(print), topic, 'print lets the terminal log grow');
}
console.log(failed ? `# ${failed} check(s) failed` : '# every page check passed');
process.exitCode = failed ? 1 : 0;
