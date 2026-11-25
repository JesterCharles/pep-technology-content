import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../starter/src/App.jsx";
import { stubCrudFetch } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 7: toasts flow through context from deep components to the layout", async () => {
  stubCrudFetch();
  render(
    <MemoryRouter initialEntries={["/services/new"]}>
      <App />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  // Registering a service announces itself in the layout's live region, even
  // though the page is far below the layout in the tree - that is context,
  // and the provided value changing is what re-renders the toast area.
  await user.type(screen.getByLabelText("Service name"), "Image Resizer");
  await user.selectOptions(screen.getByLabelText("Owning team"), "Storefront");
  await user.click(screen.getByRole("button", { name: "Save service" }));

  const toastArea = await screen.findByRole("status");
  expect(
    await within(toastArea).findByText("Service registered"),
  ).toBeInTheDocument();

  // Deleting announces through the same context.
  const relayCard = (
    await screen.findByRole("heading", { level: 3, name: "Email Relay" })
  ).closest("li");
  await user.click(within(relayCard).getByRole("button", { name: "Delete" }));
  expect(
    await within(toastArea).findByText("Service deleted"),
  ).toBeInTheDocument();
});
