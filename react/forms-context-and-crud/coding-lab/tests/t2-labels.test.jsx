import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubCrudFetch } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 2: every field has a programmatically associated label", () => {
  stubCrudFetch();
  render(
    <MemoryRouter initialEntries={["/services/new"]}>
      <App />
    </MemoryRouter>,
  );

  const name = screen.getByLabelText("Service name");
  expect(name).toHaveRole("textbox");
  expect(name).toBeRequired();

  const team = screen.getByLabelText("Owning team");
  expect(team).toHaveRole("combobox");
  expect(team).toBeRequired();

  expect(
    screen.getByLabelText("Notify the on-call engineer about incidents"),
  ).toHaveRole("checkbox");
});
