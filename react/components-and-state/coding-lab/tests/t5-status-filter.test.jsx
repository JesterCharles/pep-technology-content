import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../starter/src/App.jsx";

test("task 5: the status filter buttons narrow the visible cards", async () => {
  render(<App />);
  const user = userEvent.setup();

  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);

  await user.click(screen.getByRole("button", { name: "Degraded" }));
  expect(
    screen.getByRole("heading", { level: 3, name: "Checkout API" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 3, name: "Search Index" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { level: 3, name: "Catalog API" }),
  ).not.toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);

  await user.click(screen.getByRole("button", { name: "Down" }));
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
  expect(
    screen.getByRole("heading", { level: 3, name: "Email Relay" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "All" }));
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
});
