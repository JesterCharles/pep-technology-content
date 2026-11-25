import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import {
  stubRoutedFetch,
  stubPendingFetch,
  stubFailingFetch,
  stubEmptyListFetch,
} from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderOverview() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
}

test("task 5: the overview distinguishes loading, error, empty and loaded screens", async () => {
  // Loading: request still pending.
  stubPendingFetch();
  renderOverview();
  expect(screen.getByText(/Loading services/)).toBeInTheDocument();
  cleanup();
  vi.unstubAllGlobals();

  // Error: the server answered 500 and fetch does not reject on its own.
  stubFailingFetch(500);
  renderOverview();
  expect(
    await screen.findByText("Could not load services (HTTP 500)"),
  ).toBeInTheDocument();
  cleanup();
  vi.unstubAllGlobals();

  // Empty: a successful response with no services is not an error.
  stubEmptyListFetch();
  renderOverview();
  expect(
    await screen.findByText(/No services reporting yet/),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/Could not load services/),
  ).not.toBeInTheDocument();
  cleanup();
  vi.unstubAllGlobals();

  // Loaded: all six cards render.
  stubRoutedFetch();
  renderOverview();
  expect(
    await screen.findByRole("heading", { level: 3, name: "Catalog API" }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
});
