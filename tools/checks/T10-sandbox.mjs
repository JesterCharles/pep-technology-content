import { runBrowserGate } from "../qa/harness.mjs";

export const id = "T10";
export const gate = 10;
export const description = "sandbox behavior";

export async function run(ctx) {
  return runBrowserGate(ctx, id);
}
