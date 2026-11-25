import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
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

test("task 5: a 401 clears the session and returns to login with an explanation", async () => {
  const api = stubSecuredFetch();
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" });
  await signInAs("avery", screen, user);
  await screen.findByRole("heading", { level: 3, name: "Catalog API" });

  // The server stops accepting the token; the next load comes back 401.
  api.expireTokens = true;
  await user.click(screen.getByRole("button", { name: "Refresh list" }));

  expect(
    await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Your session expired - sign in again."),
  ).toBeInTheDocument();
  // The stale session is gone from the screen.
  expect(screen.queryByText(/Signed in as/)).not.toBeInTheDocument();

  // Signing in again returns to the page the user was on.
  api.expireTokens = false;
  await signInAs("avery", screen, user);
  expect(
    await screen.findByRole("heading", { level: 2, name: "Service overview" }),
  ).toBeInTheDocument();
});
