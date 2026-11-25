import { format } from "node:util";
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardHeader from "../starter/src/components/DashboardHeader.jsx";

test("task 1: the masthead is valid JSX with a computed service count", () => {
  // React still renders an HTML attribute spelling such as class or tabindex,
  // but logs an "Invalid DOM property" warning; collect those warnings.
  const consoleError = vi.spyOn(console, "error");
  try {
    const { rerender } = render(<DashboardHeader serviceCount={6} />);
    const banner = screen.getByRole("banner");
    expect(banner).toHaveClass("masthead");
    const heading = screen.getByRole("heading", { level: 1, name: "Beacon" });
    expect(heading).toHaveAttribute("tabindex", "-1");
    expect(
      screen.getByRole("img", { name: "Beacon logo" }),
    ).toBeInTheDocument();
    expect(banner.textContent).toMatch(/6 services monitored/);
    expect(banner.textContent).toMatch(/All times UTC/);

    // The count must come from the prop, not from typed-in text.
    rerender(<DashboardHeader serviceCount={4} />);
    expect(banner.textContent).toMatch(/4 services monitored/);

    const htmlAttributeWarnings = consoleError.mock.calls
      .map((args) => format(...args))
      .filter((message) => message.includes("Invalid DOM property"));
    expect(
      htmlAttributeWarnings,
      "use the JSX attribute names React expects",
    ).toEqual([]);
  } finally {
    consoleError.mockRestore();
  }
});
