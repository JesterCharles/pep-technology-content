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

test("task 3: protected pages redirect to login and return after sign-in", async () => {
  stubSecuredFetch();
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  // Signed out, the guard sends the user to the login page instead of the
  // admin screen.
  expect(
    await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { level: 2, name: "Admin tools" }),
  ).not.toBeInTheDocument();

  // After signing in, the user lands on the page they originally wanted.
  await signInAs("avery", screen, user);
  expect(
    await screen.findByRole("heading", { level: 2, name: "Admin tools" }),
  ).toBeInTheDocument();
});
