import { runBrowserGate } from "../qa/harness.mjs";

export const id = "T09";
export const gate = 9;
export const description = "offline file loading";

export async function run(ctx) {
  return runBrowserGate(ctx, id);
}
