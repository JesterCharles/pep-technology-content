import { runBrowserGate } from "../qa/harness.mjs";

export const id = "T11";
export const gate = 11;
export const description = "behavior paths";

export async function run(ctx) {
  return runBrowserGate(ctx, id);
}
