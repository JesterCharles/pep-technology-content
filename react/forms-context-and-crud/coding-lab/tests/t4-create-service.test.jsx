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

test("task 4: a valid submission posts JSON, disables Save while pending, and the new service appears", async () => {
  const api = stubCrudFetch();
  render(
    <MemoryRouter initialEntries={["/services/new"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  await user.type(screen.getByLabelText("Service name"), "Image Resizer");
  await user.selectOptions(screen.getByLabelText("Owning team"), "Storefront");
  await user.click(
    screen.getByLabelText("Notify the on-call engineer about incidents"),
  );

  // Hold the POST open to observe the in-flight state.
  api.holdNextMutation = true;
  const saveButton = screen.getByRole("button", { name: /Save service|Saving/ });
  const clicking = user.click(saveButton);
  await waitFor(() => expect(saveButton).toBeDisabled());
  api.releaseHeld();
  await clicking;

  // The request was an explicit JSON POST.
  const calls = mutationCalls(api);
  expect(calls).toHaveLength(1);
  expect(calls[0].method).toBe("POST");
  expect(calls[0].url).toBe("/api/services");
  expect(calls[0].headers["content-type"]).toBe("application/json");
  expect(JSON.parse(calls[0].body)).toMatchObject({
    name: "Image Resizer",
    team: "Storefront",
    notify: true,
  });

  // After success the overview reflects the server's new state.
  expect(
    await screen.findByRole("heading", { level: 3, name: "Image Resizer" }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(7);
});
