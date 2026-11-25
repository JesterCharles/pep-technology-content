import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge, {
  STATUS_LABELS,
} from "../starter/src/components/StatusBadge.jsx";
import ServiceCard from "../starter/src/components/ServiceCard.jsx";

// Wrap the module's default export in a spy that still renders the real
// component, so the test can see whether ServiceCard uses this module.
vi.mock("../starter/src/components/StatusBadge.jsx", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    STATUS_LABELS: actual.STATUS_LABELS,
    default:
      typeof actual.default === "function"
        ? vi.fn(actual.default)
        : actual.default,
  };
});

test("task 3: StatusBadge lives in its own module with named status labels", () => {
  expect(STATUS_LABELS).toEqual({
    operational: "Operational",
    degraded: "Degraded",
    down: "Down",
  });
  expect(typeof StatusBadge).toBe("function");
  const badgeOnly = render(<StatusBadge status="down" />);
  const badge = screen.getByText("Down");
  expect(badge).toHaveClass("badge");
  expect(badge).toHaveClass("badge-down");
  badgeOnly.unmount();

  // ServiceCard must render the StatusBadge imported from StatusBadge.jsx,
  // not a copy of its own.
  StatusBadge.mockClear();
  render(
    <ul>
      <ServiceCard
        service={{
          id: "queue-worker",
          name: "Queue Worker",
          team: "Platform",
          status: "degraded",
          incident: null,
          maintenance: null,
        }}
        onAcknowledge={() => {}}
        onHide={() => {}}
      />
    </ul>,
  );
  expect(
    StatusBadge,
    "ServiceCard should import and render StatusBadge from StatusBadge.jsx",
  ).toHaveBeenCalled();
  expect(screen.getByText("Degraded")).toHaveClass("badge-degraded");
});
