import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../starter/src/App.jsx";
import { MaintenanceNotice } from "../starter/src/components/ServiceCard.jsx";

function card(name) {
  return screen.getByRole("heading", { level: 3, name }).closest("li");
}

test("task 4: incident counts and maintenance notes appear only when they exist", () => {
  const { container } = render(<App />);

  expect(card("Checkout API").textContent).toMatch(/2 open incidents/);
  expect(card("Search Index").textContent).toMatch(/1 open incident(?!s)/);

  // A healthy card must not leak a stray zero from a numeric && condition.
  expect(card("Catalog API").textContent).not.toMatch(/0/);
  expect(card("Auth Service").textContent).not.toMatch(/0/);

  // Exactly one card has maintenance planned; nobody else renders the note,
  // not even as an empty paragraph.
  const notes = container.querySelectorAll(".maintenance");
  expect(notes).toHaveLength(1);
  expect(card("Image CDN").contains(notes[0])).toBe(true);
  expect(notes[0].textContent).toMatch(/Cache purge at two UTC/);

  // MaintenanceNotice itself returns null when there is nothing to say, so
  // it renders nothing wherever it is used.
  const notice = render(<MaintenanceNotice maintenance={null} />);
  expect(notice.container).toBeEmptyDOMElement();
});
