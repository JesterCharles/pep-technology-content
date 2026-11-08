# Preventing cross-site scripting

## Objectives

- Explain how untrusted text inserted with innerHTML can run script
- Render untrusted data with textContent or other safe DOM APIs instead of HTML strings
- Identify the risky sink in a code sample and rewrite it safely

## Teaching

A comment box on your site saves any text. A visitor submits this comment, and your page displays it with the code below for every other visitor.

```
// comment is: <img src=x onerror="stealData()">
card.innerHTML = "<p>" + comment + "</p>";
```

Cross-site scripting happens when untrusted data reaches a page as code. A sink is an API that can turn a string into something active. `innerHTML` parses its string as HTML; `textContent` always treats it as plain text.

This model never runs the input. It parses in an inert document and reports what the page would have created.

The fix is to build elements and insert data as text, never as HTML.

```
const label = document.createElement("span");
label.textContent = untrusted;   // always plain text
container.replaceChildren(label);
```

String-escaping by hand is easy to get wrong. Use `textContent`, `createTextNode` and `setAttribute` on safe attributes, so the browser keeps data as data.

Some sinks parse HTML: `innerHTML`, `outerHTML`, `insertAdjacentHTML` and `document.write`. URL attributes such as `href` are risky too, because `javascript:` URLs run code when followed, so check the scheme of untrusted URLs.

Text APIs and ordinary attributes keep data inert. Rendering through a framework helps, but its own escape hatches bring the risk back.

A teammate says: "Our API validates comments before saving them, so `innerHTML` on the client is fine. We also added a Content Security Policy." The comments only need to be plain text.

## Recap

XSS happens when untrusted data reaches a sink that treats it as code. Build elements and insert data with `textContent`, `createTextNode` or safe attributes. Treat `innerHTML`, `insertAdjacentHTML` and `javascript:` URLs as risky. Sanitizer libraries, validation and CSP are extra layers, not replacements.

## Cheat sheet

What happens when another visitor views the comment?

- The browser builds an `img`, the load fails, and `stealData()` runs in that visitor's session: correct. `innerHTML` parses the string as HTML, so data becomes markup. The `onerror` handler then runs with the full power of your page.
- The text shows literally, with its angle brackets: not correct. That is what `textContent` does. `innerHTML` parses the string.
- Nothing runs, because `innerHTML` never runs scripts: not correct. A `script` tag inserted this way does not run, but event handler attributes do.
- The browser blocks it, because the text came from a form: not correct. The browser cannot tell where your string came from.

Where to act: The readout under the Untrusted input and Sink choices.

Next step: Look for the lines naming elements and event handlers, because those are what turn data into code.

With innerHTML, the image input creates an img element with an onerror handler, which would run. With textContent, the same input is only text. A script tag inserted through innerHTML is created but not run, which does not make innerHTML safe.

Where to act: The first line of the function body.

Next step: Create the paragraph element, then set its class through `classList`, or `className`.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: After the paragraph has its text.

Next step: Attach it to `card` with a method that does not parse strings as HTML, such as `append`.

function renderComment(card, comment) { card.innerHTML = "<p class='note'>" + comment + "</p>"; }

Create the paragraph with createElement, set its class, assign the comment with textContent, then append it to the card. An attack string then stays as visible text.

Where to act: The row that sets a link address.

Next step: Ask what could happen if a visitor supplies the whole URL, including its scheme.

- `el.textContent = name`: Keeps data inert. It always creates text and never parses markup.
- `el.insertAdjacentHTML("beforeend", name)`: Risky sink. It parses its string as HTML, exactly like `innerHTML`.
- `link.href = name`: Risky sink. A `javascript:` URL would run code when followed, so validate the scheme first.
- `el.setAttribute("title", name)`: Keeps data inert. `title` is a plain text attribute. Event handler attributes would be a different story.
- `el.append(document.createTextNode(name))`: Keeps data inert. A text node is only ever text.

What is the best response?

- Use `textContent` anyway. Validation and CSP are extra layers and do not make an HTML sink safe: correct. Encoding for the output context is the primary defense. Validation can miss things, other data paths exist, and CSP reduces the impact of a mistake without removing it.
- Keep it: server validation means the data is trusted from then on: not correct. Stored data can arrive by other routes, and validation rules can miss payloads.
- Keep it: a CSP stops all cross-site scripting: not correct. CSP is a valuable second layer, but policies can be weak, and it is not the primary fix.
- Replace `<` with an empty string before using `innerHTML`: not correct. Hand-written filters are fragile, and they also corrupt legitimate text.

```
// Safe
el.textContent = data;
el.append(document.createTextNode(data));
// Risky with untrusted data
el.innerHTML = data;
el.insertAdjacentHTML("beforeend", data);
link.href = data; // check the scheme first
```

## Sources

- OWASP: Cross Site Scripting Prevention Cheat Sheet, retrieved 2026-11-04
- OWASP: DOM based XSS Prevention Cheat Sheet, retrieved 2026-11-04
- MDN: Element.innerHTML, retrieved 2026-11-04
- MDN: Content Security Policy, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What happens when another visitor views the comment?

- The browser builds an `img`, the load fails, and `stealData()` runs in that visitor's session: correct. `innerHTML` parses the string as HTML, so data becomes markup. The `onerror` handler then runs with the full power of your page.
- The text shows literally, with its angle brackets: not correct. That is what `textContent` does. `innerHTML` parses the string.
- Nothing runs, because `innerHTML` never runs scripts: not correct. A `script` tag inserted this way does not run, but event handler attributes do.
- The browser blocks it, because the text came from a form: not correct. The browser cannot tell where your string came from.

### explore

### Static alternative

With innerHTML, the image input creates an img element with an onerror handler, which would run. With textContent, the same input is only text. A script tag inserted through innerHTML is created but not run, which does not make innerHTML safe.

### terminal

### Static alternative

Create the paragraph with createElement, set its class, assign the comment with textContent, then append it to the card. An attack string then stays as visible text.

### explore

### Static alternative

- `el.textContent = name`: Keeps data inert. It always creates text and never parses markup.
- `el.insertAdjacentHTML("beforeend", name)`: Risky sink. It parses its string as HTML, exactly like `innerHTML`.
- `link.href = name`: Risky sink. A `javascript:` URL would run code when followed, so validate the scheme first.
- `el.setAttribute("title", name)`: Keeps data inert. `title` is a plain text attribute. Event handler attributes would be a different story.
- `el.append(document.createTextNode(name))`: Keeps data inert. A text node is only ever text.

### mcq

### Static alternative

What is the best response?

- Use `textContent` anyway. Validation and CSP are extra layers and do not make an HTML sink safe: correct. Encoding for the output context is the primary defense. Validation can miss things, other data paths exist, and CSP reduces the impact of a mistake without removing it.
- Keep it: server validation means the data is trusted from then on: not correct. Stored data can arrive by other routes, and validation rules can miss payloads.
- Keep it: a CSP stops all cross-site scripting: not correct. CSP is a valuable second layer, but policies can be weak, and it is not the primary fix.
- Replace `<` with an empty string before using `innerHTML`: not correct. Hand-written filters are fragile, and they also corrupt legitimate text.
