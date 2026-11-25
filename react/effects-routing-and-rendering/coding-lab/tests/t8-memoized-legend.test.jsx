import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { renderCounts } from "../starter/src/render-count.js";
import { stubRoutedFetch } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 8: the status legend is memoized and skips re-renders it does not need", async () => {
  stubRoutedFetch();
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  await screen.findByRole("heading", { level: 3, name: "Catalog API" });
  const rendersAfterLoad = renderCounts.StatusLegend;
  expect(rendersAfterLoad).toBeGreaterThanOrEqual(1);

  await user.click(screen.getByRole("button", { name: "Refresh view" }));
  await user.click(screen.getByRole("button", { name: "Refresh view" }));

  // The page re-rendered (the counter text moved on)...
  expect(screen.getByText("View refreshed 3 times")).toBeInTheDocument();
  // ...but the static legend did not render again.
  expect(renderCounts.StatusLegend).toBe(rendersAfterLoad);
});
