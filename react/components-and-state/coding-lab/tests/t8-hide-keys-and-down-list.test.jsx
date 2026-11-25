import { test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../starter/src/App.jsx";

function card(name) {
  return screen.getByRole("heading", { level: 3, name }).closest("li");
}

test("task 8: hiding a card keeps details state with the right service and lists down services", async () => {
  render(<App />);
  const user = userEvent.setup();

  // Expand details on the second card, then hide the first card.
  await user.click(
    within(card("Checkout API")).getByRole("button", { name: "Details" }),
  );
  expect(
    screen.getByText("Runbook: runbook/checkout-api"),
  ).toBeInTheDocument();

  await user.click(
    within(card("Catalog API")).getByRole("button", { name: "Hide" }),
  );

  expect(
    screen.queryByRole("heading", { level: 3, name: "Catalog API" }),
  ).not.toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);

  // With stable keys, the expanded state stays on Checkout API and does not
  // jump to the card that moved into the old position.
  expect(
    screen.getByText("Runbook: runbook/checkout-api"),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Runbook: runbook/email-relay"),
  ).not.toBeInTheDocument();

  // The Down now panel is derived from the services state.
  const downPanel = screen
    .getByRole("heading", { level: 2, name: "Down now" })
    .closest("section");
  const items = within(downPanel).getAllByRole("listitem");
  expect(items.map((item) => item.textContent)).toEqual(["Email Relay"]);

  // Hiding the only down service empties the list, because it follows state.
  await user.click(
    within(card("Email Relay")).getByRole("button", { name: "Hide" }),
  );
  expect(within(downPanel).queryAllByRole("listitem")).toHaveLength(0);
});
