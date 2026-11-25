/*
TASK 8. This is YOUR test. The suite runs it together with the public tests
(its name appears there as "task 8: learner test: ..."). Finish it using what
this module taught about Testing Library:

  1. render the form with Testing Library's render (the component and a
     perfectly good onSave are already set up below);
  2. use user-event to click the submit button - find it with getByRole and
     its accessible name;
  3. assert that the name field's error message "Enter a service name."
     appears (findBy is the safe choice for an element that may appear
     asynchronously; pick from getBy / queryBy / findBy);
  4. assert that onSave was never called (expect(onSave).not.toHaveBeenCalled());
  5. then type a name with user.type, choose a team with user.selectOptions,
     submit again, and assert that the error is gone and that onSave received
     the values: expect(onSave).toHaveBeenCalledWith(...) with the name, the
     team and notify (the form sends all three; expect.objectContaining lets
     you check only some). queryBy ... not.toBeInTheDocument() proves an
     element is absent (findBy rejects when it is missing); wrap in waitFor
     if needed.

Replace the failing placeholder assertion at the bottom when you are done.
*/
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServiceForm from "./components/ServiceForm.jsx";

test("task 8: learner test: the form rejects a blank name", async () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  render(
    <ServiceForm
      initialValues={{ name: "", team: "", notify: false }}
      onSave={onSave}
      submitLabel="Save service"
    />,
  );
  const user = userEvent.setup();
  expect.hasAssertions(); // the test fails if it never asserts anything

  // TODO: follow steps 2 to 5 from the comment above.

  expect(true).toBe(false); // replace me with your real assertions
});
