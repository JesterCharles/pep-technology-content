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

test("task 5: server field errors and network failures surface without losing input", async () => {
  const api = stubCrudFetch();
  render(
    <MemoryRouter initialEntries={["/services/new"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  // The server rejects a duplicate name with a 400 and field errors; the
  // client could not have known, so the server's message shows at the field.
  const name = screen.getByLabelText("Service name");
  await user.type(name, "Catalog API");
  await user.selectOptions(screen.getByLabelText("Owning team"), "Payments");
  await user.click(screen.getByRole("button", { name: "Save service" }));

  const nameError = await screen.findByText(
    "A service with this name already exists.",
  );
  expect(nameError).toHaveAttribute("id", "name-error");
  expect(screen.getByLabelText("Service name")).toHaveValue("Catalog API");

  // A network failure keeps the input and shows a form-level alert.
  await user.clear(name);
  await user.type(name, "Fresh Name");
  api.failNetwork = true;
  await user.click(screen.getByRole("button", { name: "Save service" }));

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "Could not reach the server - your input was kept.",
  );
  expect(screen.getByLabelText("Service name")).toHaveValue("Fresh Name");
  expect(screen.getByLabelText("Owning team")).toHaveValue("Payments");
});
