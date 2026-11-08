// lesson-editor shell markup, version 1. Language-neutral; the adapter supplies behaviour at run time.
// id: unique prefix; file: shown file name; label: legend; language: shown language name; alt: data-static-alt text;
// fallback: optional HTML for an editor that is visible on the initial route when JavaScript is off (pages whose editor
// sits on a later, hidden step put the static exercise in a top-level noscript instead); limits: array of HTML items for the on-page limitations list;
// stamp: { version, adapter, sourceSha256 } from stamp.mjs.
export function editorHtml({ id, file, label, language, alt, fallback, limits, describedBy, stamp }) {
  const a = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<fieldset class="le" id="${id}" data-interaction="explore" data-pep-explore${describedBy ? ` aria-describedby="${describedBy}"` : ""} data-lesson-editor="${stamp.version}" data-lesson-editor-adapter="${stamp.adapter}" data-lesson-editor-source="sha256:${stamp.sourceSha256}" data-le-state="loading" data-static-alt="${a(alt)}">
    <legend>${label}</legend>
    <div class="le-bar"><span class="le-file">${file}</span><span class="le-badge">Lesson simulator: checks and runs only this exercise, not real ${language}</span></div>
    <div class="le-main">
      <pre class="le-gutter" aria-hidden="true">1</pre>
      <label class="vh" for="${id}-code">Code editor for ${file}</label>
      <textarea id="${id}-code" class="le-code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-describedby="${id}-keys"></textarea>
    </div>
    <div class="le-actions">
      <button type="button" class="primary le-run" id="${id}-run">Run</button>
      <button type="button" class="ghost le-reset" id="${id}-reset">Reset code</button>
      <p class="le-keys" id="${id}-keys">In the editor: Tab indents, Shift+Tab outdents, Ctrl+Enter (Cmd+Enter on a Mac) runs. To leave it, press Escape, then Tab.</p>
    </div>
    <div class="le-tabs" role="tablist" aria-label="Editor panels">
      <button type="button" role="tab" id="${id}-tab-p" aria-controls="${id}-p" aria-selected="true">Problems</button>
      <button type="button" role="tab" id="${id}-tab-o" aria-controls="${id}-o" aria-selected="false" tabindex="-1">Output</button>
    </div>
    <div class="le-problems" role="tabpanel" id="${id}-p" aria-labelledby="${id}-tab-p" tabindex="0"><ul><li class="p-none">Loading the editor...</li></ul></div>
    <div class="le-output" role="tabpanel" id="${id}-o" aria-labelledby="${id}-tab-o" tabindex="0" hidden><pre>Loading the editor...</pre></div>
    <div class="le-status"><span class="le-pos">Ln 1, Col 1</span><span class="le-count"></span><span>Spaces: 4</span><span>${language} lesson simulator</span><span class="le-escnote">Tab now leaves the editor</span><span class="le-live" aria-live="polite"></span></div>
    <details class="le-limits"><summary>What this simulator can and cannot do</summary><ul>${limits.map((l) => `<li>${l}</li>`).join("")}</ul></details>
${fallback ? `    <noscript><div class="le-fallback">${fallback}</div></noscript>\n` : ""}  </fieldset>`;
}
