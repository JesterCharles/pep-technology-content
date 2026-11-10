// Public tests for tasks 7 to 10: the sign-up corner's semantic structure,
// labels, built-in validation and accessible controls. They open the page in
// the lab's own pinned headless Chromium, like tasks 4 to 6.
import { test } from "node:test";
import assert from "node:assert/strict";
import { withPage } from "./browser.mjs";

test("task 7: the sign-up corner is a section whose heading fits the page outline", async () => {
  const result = await withPage((page) =>
    page.evaluate(() => {
      const signup = document.querySelector(".signup");
      const heading = signup?.querySelector("h1, h2, h3, h4, h5, h6");
      const levels = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((el) =>
        Number(el.tagName[1]),
      );
      return {
        tag: signup?.tagName ?? null,
        holdsForm: !!signup?.querySelector("form"),
        headingTag: heading?.tagName ?? null,
        levels,
      };
    }),
  );
  assert.ok(result.tag, "Keep the sign-up region with class \"signup\"; it could not be found.");
  assert.equal(
    result.tag,
    "SECTION",
    "The sign-up wrapper is still a generic element; pick the semantic element for a standalone region with its own heading (task 7's hints point at the topic page).",
  );
  assert.ok(result.holdsForm, "The sign-up section must still contain the sign-up form.");
  assert.equal(
    result.headingTag,
    "H2",
    "The sign-up heading still skips levels in the page outline; headings step down one level at a time.",
  );
  let previous = 0;
  for (const level of result.levels) {
    assert.ok(
      level <= previous + 1,
      `The heading outline skips from h${previous} to h${level}; headings may only go one level deeper at a time.`,
    );
    previous = level;
  }
});

test("task 8: every sign-up input has a label the browser connects to it", async () => {
  const fields = await withPage((page) =>
    page.evaluate(() =>
      [...document.querySelectorAll(
        ".signup-form input:not([type=\"submit\"]):not([type=\"button\"]):not([type=\"reset\"]):not([type=\"image\"])",
      )].map((input) => ({
        id: input.id,
        labelTexts: [...(input.labels ?? [])].map((label) => label.textContent.trim()),
        ariaLabel: (input.getAttribute("aria-label") ?? "").trim(),
      })),
    ),
  );
  assert.equal(fields.length, 3, "Keep the three sign-up inputs with their ids from the starter.");
  for (const field of fields) {
    assert.ok(
      field.labelTexts.some((text) => text.length > 0) || field.ariaLabel.length > 0,
      `The browser cannot connect any label to #${field.id}. Turn its loose text into a visible label element the browser associates with the input.`,
    );
    assert.ok(
      field.labelTexts.some((text) => text.length > 0),
      `#${field.id} needs a visible label element, not only an attribute: sighted visitors use it too.`,
    );
  }
});

test("task 9: the browser blocks an empty or invalid sign-up before it is sent", async () => {
  const result = await withPage((page) =>
    page.evaluate(() => {
      const form = document.querySelector(".signup-form");
      const name = document.querySelector("#hiker-name");
      const email = document.querySelector("#hiker-email");
      const size = document.querySelector("#group-size");
      if (!form || !name || !email || !size) return { missing: true };
      const attrs = {
        nameRequired: name.required,
        emailRequired: email.required,
        emailType: email.type,
        sizeRequired: size.required,
        sizeMin: size.min,
        sizeMax: size.max,
      };
      const emptyBlocked = !form.checkValidity();
      name.value = "Robin Shaw";
      email.value = "robin@example.com";
      size.value = "4";
      const validAccepted = form.checkValidity();
      email.value = "not-an-email";
      const badEmailBlocked = !form.checkValidity();
      email.value = "robin@example.com";
      size.value = "9";
      const bigGroupBlocked = !form.checkValidity();
      return { missing: false, attrs, emptyBlocked, validAccepted, badEmailBlocked, bigGroupBlocked };
    }),
  );
  assert.ok(!result.missing, "Keep the sign-up form and its three inputs with their starter ids.");
  const { attrs } = result;
  assert.ok(attrs.nameRequired, "An empty name must block submission: #hiker-name needs required.");
  assert.ok(attrs.emailRequired, "#hiker-email needs required.");
  assert.equal(attrs.emailType, "email", "#hiker-email must use the input type that checks the address shape.");
  assert.ok(attrs.sizeRequired, "#group-size needs required.");
  assert.equal(attrs.sizeMin, "1", "#group-size must set min to 1.");
  assert.equal(attrs.sizeMax, "6", "#group-size must set max to 6.");
  assert.ok(result.emptyBlocked, "With everything empty, the browser must report the form as invalid.");
  assert.ok(result.validAccepted, "A filled-in, valid sign-up must pass the browser's checks.");
  assert.ok(result.badEmailBlocked, "not-an-email must be blocked by the email input type.");
  assert.ok(result.bigGroupBlocked, "A group of 9 must be blocked by the max of 6.");
});

test("task 10: the badge has alt text and the submit control is a real button", async () => {
  const result = await withPage((page) =>
    page.evaluate(() => {
      const badge = document.querySelector(".signup-badge");
      const fakes = document.querySelectorAll(".signup .fake-button, .signup [role=\"button\"]").length;
      const submit = document.querySelector(".signup-form button, .signup-form input[type=\"submit\"]");
      let focusable = false;
      if (submit) {
        submit.focus();
        focusable = document.activeElement === submit && submit.tabIndex >= 0;
      }
      const unreachable = [...document.querySelectorAll(".signup-form input, .signup-form button")]
        .filter((control) => {
          control.focus();
          return document.activeElement !== control || control.tabIndex < 0;
        })
        .map((control) => control.id || control.tagName.toLowerCase());
      return {
        alt: badge?.getAttribute("alt"),
        fakes,
        submitTag: submit?.tagName ?? null,
        submitType: submit?.type ?? null,
        submitText: submit?.textContent?.trim() || submit?.value || "",
        focusable,
        unreachable,
      };
    }),
  );
  assert.ok(
    typeof result.alt === "string" && result.alt.trim().length > 0,
    "The badge image has no alt text, so a screen reader announces nothing useful for it.",
  );
  assert.equal(
    result.fakes,
    0,
    "A div acting as a button is not keyboard-reachable; remove the fake-button div and its role attribute in favour of a native control.",
  );
  assert.ok(result.submitTag, "The form needs a real submit control: a button element.");
  assert.equal(
    result.submitType,
    "submit",
    "Inside a form, make the button's job explicit: it submits the sign-up.",
  );
  assert.ok(result.submitText.length > 0, "The button must keep its visible text.");
  assert.ok(
    result.focusable,
    "The submit control must take keyboard focus (and sit in the tab order); native buttons do this with no extra attributes.",
  );
  assert.deepEqual(
    result.unreachable,
    [],
    "Every control in the sign-up form must be reachable and operable with the keyboard alone.",
  );
});
