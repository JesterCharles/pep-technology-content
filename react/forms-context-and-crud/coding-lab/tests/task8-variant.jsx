// Task 8 check: controlled behaviour variants of the learner's own ServiceForm.
// Each variant renders the learner's form unchanged (same exports, no extra
// markup) and changes one observable behaviour by intercepting the submit event
// on the document, before React sees it, or by changing what reaches onSave.
// "control" changes nothing; the learner's test must pass with it.
import { appendFileSync } from "node:fs";
import { useLayoutEffect, useRef } from "react";
import { within } from "@testing-library/dom";
import RealServiceForm from "../starter/src/components/ServiceForm.jsx";

// Find a field the way Testing Library does (htmlFor/id, a wrapping label or
// aria-labelledby), inside the form that was submitted.
function fieldByLabel(form, text) {
  return within(form).queryAllByLabelText(text)[0] ?? null;
}

function readForm(form) {
  const name = fieldByLabel(form, "Service name");
  const team = fieldByLabel(form, "Owning team");
  if (!name || !team) return null;
  const notify = form.querySelector('input[type="checkbox"]');
  return { name: name.value, team: team.value, notify: Boolean(notify?.checked) };
}

function isThisForm(form, submitLabel) {
  return [...form.querySelectorAll("button")].some(
    (button) => button.textContent.trim() === String(submitLabel ?? "").trim(),
  );
}

export function makeVariant(fault, reportFile) {
  return function ServiceForm(props) {
    const latest = useRef(props);
    latest.current = props;

    useLayoutEffect(() => {
      if (fault === "control" || fault.startsWith("complete-never") || fault.startsWith("complete-wrong")) {
        return undefined;
      }
      function onSubmit(event) {
        const form = event.target;
        if (!(form instanceof HTMLFormElement) || !isThisForm(form, latest.current.submitLabel)) return;
        const values = readForm(form);
        if (!values) {
          // Fail closed: without the labelled fields the fault cannot be applied.
          appendFileSync(reportFile, "unreadable\n");
          return;
        }
        const blank = !values.name.trim();
        const complete = !blank && Boolean(values.team);
        if ((fault === "blank-ignored" && blank) || (fault === "complete-ignored" && complete)) {
          event.preventDefault();
          event.stopPropagation();
        } else if (fault === "blank-saves" && blank) {
          latest.current.onSave?.(values);
        }
      }
      document.addEventListener("submit", onSubmit, true);
      return () => document.removeEventListener("submit", onSubmit, true);
    }, []);

    let onSave = props.onSave;
    if (fault === "complete-never-saves") onSave = async () => {};
    if (fault === "complete-wrong-name") {
      onSave = (values) => props.onSave?.({ ...values, name: `${values.name} (draft)` });
    }
    if (fault === "complete-wrong-team") {
      onSave = (values) => props.onSave?.({ ...values, team: `${values.team} (draft)` });
    }
    return <RealServiceForm {...props} onSave={onSave} />;
  };
}
