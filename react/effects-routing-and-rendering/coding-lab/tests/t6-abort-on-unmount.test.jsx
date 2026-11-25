import { StrictMode } from "react";
import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubPendingFetch, stubRoutedFetch } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 6: an unmounted request is aborted through the effect cleanup", async () => {
  const pending = stubPendingFetch();
  const view = render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );

  // The request was started with an AbortSignal...
  expect(pending.signal).not.toBeNull();
  expect(pending.signal.aborted).toBe(false);

  // ...and leaving the page aborts it instead of letting it hang around.
  view.unmount();
  expect(pending.signal.aborted).toBe(true);
  vi.unstubAllGlobals();

  // Strict Mode runs every Effect twice in development, aborting the first
  // request. That deliberate abort must not surface as an error, not even
  // while the second request is still loading.
  stubPendingFetch();
  const strictView = render(
    <StrictMode>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </StrictMode>,
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  expect(screen.queryByText(/Could not load/)).not.toBeInTheDocument();
  expect(screen.getByText(/Loading services/)).toBeInTheDocument();
  strictView.unmount();
  vi.unstubAllGlobals();

  // ...and once the second request answers, the cards load with no error.
  stubRoutedFetch();
  render(
    <StrictMode>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </StrictMode>,
  );
  expect(await screen.findAllByRole("heading", { level: 3 })).toHaveLength(6);
  expect(screen.queryByText(/Could not load/)).not.toBeInTheDocument();
});
