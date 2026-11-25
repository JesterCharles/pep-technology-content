import { test, expect } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../starter/src/App.jsx";

test("task 6: one click of Run checks performs all three regional checks", async () => {
  render(<App />);
  const user = userEvent.setup();
  const runChecks = screen.getByRole("button", { name: "Run checks" });
  const counter = screen.getByText(/checks run/);

  expect(counter).toHaveTextContent("0 checks run");
  await user.click(runChecks);
  expect(counter).toHaveTextContent("3 checks run");

  // act() lets the test queue both clicks before React re-renders, the same
  // way several setter calls in one handler are queued, so the second click
  // still sees the old checksRun value. Only updater functions add up
  // correctly when updates are queued, so this must read 9.
  act(() => {
    runChecks.click();
    runChecks.click();
  });
  expect(counter).toHaveTextContent("9 checks run");
});
