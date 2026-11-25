// Code-block line breaks for [html] GIFT banks.
//
// Code inside a <pre>...</pre> region, plain or with the existing <pre><code> nesting,
// uses actual LF line breaks, not numeric &#10; references. Text outside <pre> is not touched.
// Importers may trim every physical line, and GIFT reads a blank physical line as the
// end of a question and drops a line that starts with optional whitespace then //.
// So every code line after the first is written so that it neither starts nor ends
// with whitespace, is never empty and never starts with //:
//   - a visually blank line is &nbsp;
//   - the first leading space of an indented line is &nbsp; (same visible width)
//   - a line starting with // starts with &#47;/ instead (same visible text)
// The first code line shares the <pre> (or <pre><code>) physical line and is never changed.
//
// Forms: "entity" (one physical line joined by &#10;), "nbsp" (literal LF, &nbsp; for
// blank lines and before //), "j47" (literal LF, &nbsp; for blank lines, &#47;/ for //)
// and "safe" (the form above). In file text # is GIFT-escaped as \#; pass
// { escaped: false } for text that has already been GIFT-unescaped.

export const NUMERIC_NEWLINE = /&\\?#(?:10|[xX]0*[aA]);/g;
const PRE = /<pre>([\s\S]*?)<\/pre>/g;
const NBSP = "&nbsp;";
const FORMS = new Set(["entity", "nbsp", "j47", "safe"]);

const marks = (escaped) => ({ lf: escaped ? "&\\#10;" : "&#10;", slash: escaped ? "&\\#47;" : "&#47;" });

export function decodeCodeLines(inner, form, { escaped = true } = {}) {
  if (!FORMS.has(form)) throw new Error(`unknown code-block form ${form}`);
  const { lf, slash } = marks(escaped);
  if (form === "entity" ? inner.includes("\n") : inner.includes(lf)) {
    throw new Error(`code block is not in ${form} form`);
  }
  const lines = form === "entity" ? inner.split(lf) : inner.split("\n");
  return lines.map((line, index) => {
    if (index === 0 || form === "entity") return line;
    if (line === NBSP) return "";
    if (form === "nbsp") return line.replace(/^( *)&nbsp;\/\//, "$1//");
    if (form === "j47") return line.replace(escaped ? /^( *)&\\#47;\// : /^( *)&#47;\//, "$1//");
    if (line.startsWith(NBSP)) return ` ${line.slice(NBSP.length)}`;
    if (line.startsWith(slash)) return `/${line.slice(slash.length)}`;
    return line;
  });
}

export function encodeCodeLines(lines, form, { escaped = true } = {}) {
  if (!FORMS.has(form)) throw new Error(`unknown code-block form ${form}`);
  const { lf, slash } = marks(escaped);
  const out = lines.map((raw, index) => {
    if (index === 0) return raw;
    if (raw.startsWith(NBSP) || raw.startsWith(slash) || raw.includes("\t") || raw !== raw.trimEnd()) {
      throw new Error("code line starts with an entity, holds a tab or ends with whitespace");
    }
    if (form === "entity") return raw;
    if (raw === "") return NBSP;
    if (form === "nbsp") return raw.replace(/^( *)\/\//, "$1&nbsp;//");
    if (form === "j47") return raw.replace(/^( *)\/\//, `$1${slash}/`);
    if (raw.startsWith(" ")) return NBSP + raw.slice(1);
    if (raw.startsWith("//")) return slash + raw.slice(1);
    return raw;
  });
  return out.join(form === "entity" ? lf : "\n");
}

export function convertCodeBlocks(text, from, to, options = {}) {
  return text.replace(PRE, (_, inner) => `<pre>${encodeCodeLines(decodeCodeLines(inner, from, options), to, options)}</pre>`);
}

// Numeric newline references inside <pre> regions (both accepted forms); text outside <pre> may keep them.
export function numericCodeNewlines(text) {
  return [...text.matchAll(PRE)].flatMap((match) => match[1].match(NUMERIC_NEWLINE) ?? []);
}

// Code lines after the first that a per-line-trimming importer or GIFT itself would change.
export function unsafeCodeLines(text) {
  return [...text.matchAll(PRE)]
    .flatMap((match) => match[1].split("\n").slice(1))
    .filter((line) => line === "" || line !== line.trim() || line.startsWith("//"));
}

// Entity form (the retired one) to the indentation-safe literal form, and back.
export const literalCodeNewlines = (text) => convertCodeBlocks(text, "entity", "safe");
export const entityCodeNewlines = (text, options) => convertCodeBlocks(text, "safe", "entity", options);
