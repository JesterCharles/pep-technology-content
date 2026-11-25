import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubCrudFetch } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 1: the form fields are controlled by state", async () => {
  stubCrudFetch();
  render(
    <MemoryRouter initialEntries={["/services/new"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  // Typing must reach state and come back out of the input.
  const name = screen.getByRole("textbox");
  await user.type(name, "Image Resizer");
  expect(name).toHaveValue("Image Resizer");

  const team = screen.getByRole("combobox");
  await user.selectOptions(team, "Discovery");
  expect(team).toHaveValue("Discovery");

  cleanup();
  vi.unstubAllGlobals();

  // On the edit page the initial state must appear in every control: the
  // select cannot be uncontrolled and the checkbox is controlled via checked.
  stubCrudFetch();
  render(
    <MemoryRouter initialEntries={["/services/checkout-api/edit"]}>
      <App />
    </MemoryRouter>,
  );
  expect(await screen.findByRole("textbox")).toHaveValue("Checkout API");
  expect(screen.getByRole("combobox")).toHaveValue("Payments");
  expect(screen.getByRole("checkbox")).toBeChecked();
});
