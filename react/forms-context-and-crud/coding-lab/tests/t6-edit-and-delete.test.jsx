import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubCrudFetch, mutationCalls } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 6: editing uses PUT and deleting uses DELETE, and the list stays in sync", async () => {
  let api = stubCrudFetch();
  render(
    <MemoryRouter initialEntries={["/services/checkout-api/edit"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  // Edit: prefilled form, saved with PUT to the service's URL.
  const name = await screen.findByLabelText("Service name");
  expect(name).toHaveValue("Checkout API");
  await user.clear(name);
  await user.type(name, "Checkout API v2");
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  const putCalls = mutationCalls(api).filter((call) => call.method === "PUT");
  expect(putCalls).toHaveLength(1);
  expect(putCalls[0].url).toBe("/api/services/checkout-api");
  expect(putCalls[0].headers["content-type"]).toBe("application/json");
  expect(JSON.parse(putCalls[0].body)).toMatchObject({
    name: "Checkout API v2",
    team: "Payments",
  });

  // Back on the overview, the screen matches the server.
  expect(
    await screen.findByRole("heading", { level: 3, name: "Checkout API v2" }),
  ).toBeInTheDocument();

  // Delete: DELETE to the service's URL, then the card is gone.
  const relayCard = screen
    .getByRole("heading", { level: 3, name: "Email Relay" })
    .closest("li");
  await user.click(within(relayCard).getByRole("button", { name: "Delete" }));

  const deleteCalls = mutationCalls(api).filter(
    (call) => call.method === "DELETE",
  );
  expect(deleteCalls).toHaveLength(1);
  expect(deleteCalls[0].url).toBe("/api/services/email-relay");

  await waitFor(() =>
    expect(
      screen.queryByRole("heading", { level: 3, name: "Email Relay" }),
    ).not.toBeInTheDocument(),
  );
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
});
