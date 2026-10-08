import { runBrowserGate } from "../qa/harness.mjs";

export const id = "T12";
export const gate = 12;
export const description = "accessibility and contrast";

export async function run(ctx) {
  return runBrowserGate(ctx, id);
}
