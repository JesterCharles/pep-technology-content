import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubRoutedFetch } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 2: the nav uses router links that switch pages without a reload and mark the active page", async () => {
  stubRoutedFetch();
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  const legendLink = screen.getByRole("link", { name: "Legend" });
  await user.click(legendLink);

  // A router link renders the legend page client-side; a plain anchor cannot.
  expect(
    screen.getByRole("heading", { level: 2, name: "What the statuses mean" }),
  ).toBeInTheDocument();
  expect(legendLink).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute(
    "aria-current",
  );

  await user.click(screen.getByRole("link", { name: "Overview" }));
  expect(
    await screen.findByRole("heading", { level: 2, name: "Service overview" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});
