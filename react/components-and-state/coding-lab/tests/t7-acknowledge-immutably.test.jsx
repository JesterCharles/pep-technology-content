import { test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../starter/src/App.jsx";
import { initialServices } from "../starter/src/data/services.js";

function card(name) {
  return screen.getByRole("heading", { level: 3, name }).closest("li");
}

test("task 7: acknowledging an incident updates the card and the log immutably", async () => {
  render(<App />);
  const user = userEvent.setup();

  const checkout = card("Checkout API");
  expect(within(checkout).queryByText("Acknowledged")).not.toBeInTheDocument();

  await user.click(
    within(checkout).getByRole("button", { name: "Acknowledge" }),
  );

  expect(within(card("Checkout API")).getByText("Acknowledged")).toBeVisible();
  expect(
    within(card("Checkout API")).queryByRole("button", { name: "Acknowledge" }),
  ).not.toBeInTheDocument();

  const log = screen
    .getByRole("heading", { level: 2, name: "Acknowledged this session" })
    .closest("section");
  expect(within(log).getByText("Checkout API")).toBeInTheDocument();

  // Other cards keep their own incident state.
  expect(
    within(card("Email Relay")).getByRole("button", { name: "Acknowledge" }),
  ).toBeInTheDocument();

  // State updates must not reach into the shared fixture data.
  const fixture = initialServices.find((s) => s.id === "checkout-api");
  expect(fixture.incident.acknowledged).toBe(false);
});
