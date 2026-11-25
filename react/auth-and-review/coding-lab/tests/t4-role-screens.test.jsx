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

test("task 4: admin screens and controls follow the signed-in role", async () => {
  // The operator neither sees the Admin link nor the admin tools.
  stubSecuredFetch();
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <App />
    </MemoryRouter>,
  );
  let user = userEvent.setup();
  await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" });
  await signInAs("omar", screen, user);

  expect(
    await screen.findByRole("heading", { level: 2, name: "Not allowed" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { level: 2, name: "Admin tools" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Admin" }),
  ).not.toBeInTheDocument();

  cleanup();
  vi.unstubAllGlobals();

  // The admin sees both.
  stubSecuredFetch();
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <App />
    </MemoryRouter>,
  );
  user = userEvent.setup();
  await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" });
  await signInAs("avery", screen, user);

  expect(
    await screen.findByRole("heading", { level: 2, name: "Admin tools" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Admin" })).toBeInTheDocument();
});
