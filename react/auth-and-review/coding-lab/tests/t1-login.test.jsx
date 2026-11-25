import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubSecuredFetch } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 1: the login form signs in on success and reports wrong credentials", async () => {
  stubSecuredFetch();
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  // Wrong password: an alert appears and the typed username is kept.
  await user.type(screen.getByLabelText("Username"), "avery");
  await user.type(screen.getByLabelText("Password"), "wrong-pass");
  await user.click(screen.getByRole("button", { name: "Sign in" }));
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("Wrong username or password.");
  expect(screen.getByLabelText("Username")).toHaveValue("avery");

  // Correct credentials: the signed-in user lands on the dashboard.
  await user.clear(screen.getByLabelText("Password"));
  await user.type(screen.getByLabelText("Password"), "beacon1");
  await user.click(screen.getByRole("button", { name: "Sign in" }));

  expect(
    await screen.findByRole("heading", { level: 2, name: "Service overview" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Signed in as Avery Diaz \(admin\)/),
  ).toBeInTheDocument();
});
