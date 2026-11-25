import { useState } from "react";

export const TEAMS = [
  "Storefront",
  "Payments",
  "Messaging",
  "Discovery",
  "Platform",
];

/*
The register and edit pages both render this form. It receives:
  - initialValues: { name, team, notify } to start from;
  - onSave(values): an async function provided by the page; it resolves when
    the server accepted the values and throws when it did not (a thrown error
    may carry .status and .details - see sendJson in ../api.js);
  - submitLabel: the text of the submit button.

TASK 1. The fields below are broken in three different ways:
  - the name input sets value from state but has no onChange, so typing does
    nothing (React also warns about it in the console);
  - the team select is uncontrolled (defaultValue), so state never learns the
    choice;
  - the checkbox never reflects state because a checkbox is controlled through
    checked, not value.
  Make all three controlled: value/checked from state, updated in onChange.

TASK 2. Only the checkbox has a usable label (it wraps its input). Associate
the other two: give each control an id and point its label at it with
htmlFor. The team caption is a <span>; make it a <label> first. Mark the name
and team fields required (required attribute).

TASK 3. Implement handleSubmit:
  - call event.preventDefault() so the browser does not reload the page;
  - validate from state: a trimmed-empty name means "Enter a service name.",
    an empty team means "Choose the owning team."; put them in fieldErrors
    state and stop without calling onSave when anything failed;
  - render each message in a <p className="field-error"> with id "name-error"
    or "team-error", point the field at it with aria-describedby, and set
    aria-invalid on the field exactly while it has an error. The server stays
    the authority: its 400 errors land in the same fieldErrors state (task 5).

TASK 4 (part 3). While onSave is pending, disable the submit button so a
double click cannot create the service twice.

TASK 5. When onSave throws:
  - status 400: show error.details.errors next to the fields (fieldErrors);
  - anything else (network failure, 500): keep what the user typed and show
    <p className="error-banner" role="alert">
      Could not reach the server - your input was kept.
    </p>
  Never clear the fields on a failure.
*/
export default function ServiceForm({ initialValues, onSave, submitLabel }) {
  const [values, setValues] = useState(initialValues);

  function handleSubmit() {
    // TODO: implement as described in TASK 3 / 4 / 5
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label>Service name</label>
        <input type="text" value={values.name} />
      </div>
      <div className="field">
        <span>Owning team</span>
        <select defaultValue="">
          <option value="">Choose a team</option>
          {TEAMS.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>
          <input
            type="checkbox"
            value={values.notify}
            onChange={(event) =>
              setValues({ ...values, notify: event.target.checked })
            }
          />{" "}
          Notify the on-call engineer about incidents
        </label>
      </div>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
