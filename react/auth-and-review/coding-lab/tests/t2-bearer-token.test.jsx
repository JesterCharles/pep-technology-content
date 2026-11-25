import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubSecuredFetch, signInAs } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 2: signed-in requests carry the bearer token", async () => {
  const api = stubSecuredFetch();
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  await signInAs("avery", screen, user);
  await screen.findByRole("heading", { level: 3, name: "Catalog API" });

  const listCalls = api.calls.filter(
    (call) => call.url === "/api/services" && call.method === "GET",
  );
  expect(listCalls.length).toBeGreaterThanOrEqual(1);
  for (const call of listCalls) {
    expect(call.headers.authorization).toBe("Bearer tok-avery");
  }
});
