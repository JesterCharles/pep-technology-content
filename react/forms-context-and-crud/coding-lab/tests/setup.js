import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount whatever a test rendered, so a file may hold more than one test.
afterEach(() => cleanup());
