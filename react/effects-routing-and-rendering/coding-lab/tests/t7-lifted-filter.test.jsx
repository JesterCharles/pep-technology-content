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

test("task 7: the filter state lives in the overview and narrows the list, with a derived count", async () => {
  stubRoutedFetch();
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  await screen.findByRole("heading", { level: 3, name: "Catalog API" });
  expect(screen.getByText("Showing 6 of 6 services")).toBeInTheDocument();
  const listRendersBefore = renderCounts.ServiceList;

  await user.click(screen.getByRole("button", { name: "Degraded" }));
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  expect(
    screen.getByRole("heading", { level: 3, name: "Checkout API" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 3, name: "Search Index" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Showing 2 of 6 services")).toBeInTheDocument();
  // One click, one list render: a list derived during render needs no extra
  // state update (and no second render) to catch up with the filter.
  expect(renderCounts.ServiceList).toBe(listRendersBefore + 1);

  await user.click(screen.getByRole("button", { name: "All" }));
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
  expect(screen.getByText("Showing 6 of 6 services")).toBeInTheDocument();
});
