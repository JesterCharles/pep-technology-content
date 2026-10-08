import { runBrowserGate } from "../qa/harness.mjs";

export const id = "T13";
export const gate = 13;
export const description = "responsive and zoom matrix";

export async function run(ctx) {
  return runBrowserGate(ctx, id);
}
