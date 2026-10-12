import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

export const freshnessDays = 30;

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function freshnessIssue(value, now = new Date()) {
  const checked = new Date(value);
  if (Number.isNaN(checked.valueOf())) {
    return "receipt date is invalid";
  }
  const age = now.valueOf() - checked.valueOf();
  if (age < -24 * 60 * 60 * 1000) {
    return "receipt date is in the future";
  }
  if (age > freshnessDays * 24 * 60 * 60 * 1000) {
    return `receipt is older than ${freshnessDays} days`;
  }
  return null;
}

export async function artifactSha256(file) {
  return sha256(await readFile(file));
}

export async function fetchBytes(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "pep-content-validator/1.0" },
    signal: AbortSignal.timeout(30_000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  return { response, bytes };
}
