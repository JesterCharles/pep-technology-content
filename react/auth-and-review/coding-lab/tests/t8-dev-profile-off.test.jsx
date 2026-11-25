import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { apiUrl, authFetch } from "../starter/src/api.js";
import { stubSecuredFetch, signInAs } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

test("task 8: the dev auto-sign-in is off and the API address comes from the environment", async () => {
  // Nobody is signed in automatically any more: the app starts at the login
  // page, exactly like production without the dev profile.
  stubSecuredFetch();
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  expect(
    await screen.findByRole("heading", { level: 2, name: "Sign in to Beacon" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/Dev Admin/)).not.toBeInTheDocument();

  // And the secured API refuses a request that carries no token.
  await expect(
    authFetch("/services", { token: null }),
  ).rejects.toMatchObject({ status: 401 });

  // The API base address is an environment concern, not a code edit.
  expect(apiUrl("/services")).toBe("/api/services");
  vi.stubEnv("VITE_API_URL", "https://status.example.com/api");
  expect(apiUrl("/services")).toBe(
    "https://status.example.com/api/services",
  );
  vi.stubEnv("VITE_API_URL", "https://staging.example.net/api");
  expect(apiUrl("/login")).toBe("https://staging.example.net/api/login");

  // Every request the app sends goes to that address.
  cleanup();
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
  expect(api.calls.length).toBeGreaterThanOrEqual(2);
  for (const call of api.calls) {
    expect(call.url).toMatch(/^https:\/\/staging\.example\.net\/api\//);
  }
});
