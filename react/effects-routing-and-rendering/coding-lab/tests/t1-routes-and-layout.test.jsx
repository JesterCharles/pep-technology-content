import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubRoutedFetch } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderAt(path) {
  stubRoutedFetch();
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

test("task 1: the app routes overview, service detail and unknown paths through one layout", async () => {
  renderAt("/");
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(
    screen.getByRole("navigation", { name: "Main" }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { level: 2, name: "Service overview" }),
  ).toBeInTheDocument();
  cleanup();
  vi.unstubAllGlobals();

  renderAt("/services/checkout-api");
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { level: 2, name: "Checkout API" }),
  ).toBeInTheDocument();
  cleanup();
  vi.unstubAllGlobals();

  renderAt("/legend");
  expect(
    screen.getByRole("heading", { level: 2, name: "What the statuses mean" }),
  ).toBeInTheDocument();
  cleanup();
  vi.unstubAllGlobals();

  renderAt("/this/page/does/not/exist");
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 2, name: "Page not found" }),
  ).toBeInTheDocument();
});
