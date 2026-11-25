import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubCrudFetch, mutationCalls } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 3: submitting invalid input shows accessible field errors without calling the API", async () => {
  const api = stubCrudFetch();
  render(
    <MemoryRouter initialEntries={["/services/new"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  // Record whether the submit handler cancels the browser's own submit.
  const preventDefault = vi.spyOn(Event.prototype, "preventDefault");
  await user.click(screen.getByRole("button", { name: "Save service" }));
  const cancelledSubmits = preventDefault.mock.contexts.filter(
    (event) => event.type === "submit",
  );
  preventDefault.mockRestore();
  expect(
    cancelledSubmits.length,
    "handleSubmit must call event.preventDefault()",
  ).toBeGreaterThan(0);

  const nameError = await screen.findByText("Enter a service name.");
  expect(nameError).toHaveAttribute("id", "name-error");
  const teamError = screen.getByText("Choose the owning team.");
  expect(teamError).toHaveAttribute("id", "team-error");

  const name = screen.getByLabelText("Service name");
  expect(name).toHaveAttribute("aria-describedby", "name-error");
  expect(name).toHaveAttribute("aria-invalid", "true");
  const team = screen.getByLabelText("Owning team");
  expect(team).toHaveAttribute("aria-describedby", "team-error");
  expect(team).toHaveAttribute("aria-invalid", "true");

  // The client check happens before any request is sent.
  expect(mutationCalls(api)).toHaveLength(0);

  // Fixing the fields clears the errors on the next submit.
  await user.type(name, "Image Resizer");
  await user.selectOptions(team, "Storefront");
  // Hold the request so the form stays mounted while we look.
  api.holdNextMutation = true;
  await user.click(screen.getByRole("button", { name: "Save service" }));
  expect(screen.queryByText("Enter a service name.")).not.toBeInTheDocument();
  expect(screen.queryByText("Choose the owning team.")).not.toBeInTheDocument();
  expect(name).not.toHaveAttribute("aria-invalid", "true");
  expect(team).not.toHaveAttribute("aria-invalid", "true");

  // Once task 4 sends the request, let it finish so nothing is left in flight.
  // Only the pending state is awaited, so this test does not depend on task 4.
  if (api.releaseHeld) {
    api.releaseHeld();
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Saving/ })).not.toBeInTheDocument(),
    );
  }
});
