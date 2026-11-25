import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Panel from "../starter/src/components/Panel.jsx";
import App from "../starter/src/App.jsx";

test("task 2: Panel renders its title and children, and a missing team falls back to Unassigned", () => {
  const panel = render(
    <Panel title="Example panel">
      <p>panel child text</p>
    </Panel>,
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Example panel" }),
  ).toBeInTheDocument();
  expect(screen.getByText("panel child text")).toBeInTheDocument();
  panel.unmount();

  render(<App />);
  const cdnCard = screen
    .getByRole("heading", { level: 3, name: "Image CDN" })
    .closest("li");
  expect(cdnCard.textContent).toMatch(/Team: Unassigned/);
  const catalogCard = screen
    .getByRole("heading", { level: 3, name: "Catalog API" })
    .closest("li");
  expect(catalogCard.textContent).toMatch(/Team: Storefront/);
});
