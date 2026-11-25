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

test("task 3: the detail page reads the id from the URL and offers a back control", async () => {
  stubRoutedFetch();
  render(
    <MemoryRouter initialEntries={["/services/email-relay"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  expect(
    await screen.findByRole("heading", { level: 2, name: "Email Relay" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Down")).toBeInTheDocument();
  expect(screen.getByText(/Messaging/)).toBeInTheDocument();
  expect(screen.getByText(/91\.44%/)).toBeInTheDocument();
  expect(
    screen.getByText(/Outbound transactional mail\./),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Back to overview" }));
  expect(
    await screen.findByRole("heading", { level: 2, name: "Service overview" }),
  ).toBeInTheDocument();

  cleanup();
  vi.unstubAllGlobals();

  // An unknown id surfaces the API's 404 as an error banner.
  stubRoutedFetch();
  render(
    <MemoryRouter initialEntries={["/services/no-such-service"]}>
      <App />
    </MemoryRouter>,
  );
  expect(
    await screen.findByText("Could not load this service (HTTP 404)"),
  ).toBeInTheDocument();
});
