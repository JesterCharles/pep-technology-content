import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Link } from "react-router";
import App from "../starter/src/App.jsx";
import { stubSecuredFetch, signInAs } from "./helpers.js";

// Start signed out whatever dev-auth.js says: only test 8 checks that switch.
vi.mock("../starter/src/dev-auth.js", () => ({
  devAutoSignIn: { enabled: false, session: null },
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 7: signing out forgets the session and guards the pages again", async () => {
  const api = stubSecuredFetch();
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
      {/* Test-only link: a way back to a guarded page after signing out. */}
      <Link to="/">test: open overview</Link>
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" });
  await signInAs("avery", screen, user);
  await screen.findByRole("heading", { level: 3, name: "Catalog API" });

  await user.click(screen.getByRole("button", { name: "Sign out" }));

  expect(
    await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/Signed in as/)).not.toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { level: 2, name: "Service overview" }),
  ).not.toBeInTheDocument();

  // Going back to a guarded page meets the guard again, not the old session,
  // and no request after sign-out still carries the token.
  const callsBefore = api.calls.length;
  await user.click(screen.getByRole("link", { name: "test: open overview" }));
  expect(
    await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/Signed in as/)).not.toBeInTheDocument();
  const authorizedAfter = api.calls
    .slice(callsBefore)
    .filter((call) => call.headers.authorization);
  expect(authorizedAfter).toEqual([]);
});
