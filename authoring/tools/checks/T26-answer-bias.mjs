import { error } from "../lib/common.mjs";
import { lengthSummary, loadBanks, positionProblems } from "../qa/answer-bias.mjs";

export const id = "T26";
export const gate = 26;
export const description = "correct-answer position balance and answer-length report";

// Position balance is reported, not enforced, until every page-build module
// has been planned with authoring/tools/html/answer-order.mjs; then this flips
// to true and each position problem becomes a gate failure. Answer length is
// always report-only: rebalancing option wording needs critic review.
export const ENFORCE_POSITION = false;

function percent(share) {
  return `${Math.round(share * 100)}%`;
}

export async function run(ctx) {
  const banks = await loadBanks(ctx.root);
  const problems = positionProblems(banks);
  if (ENFORCE_POSITION) return problems.map((problem) => error(id, problem.path, problem.message));
  const page = lengthSummary(banks, "page");
  const gift = lengthSummary(banks, "gift");
  if (problems.length) {
    console.log(`${id} report: ${problems.length} answer-position problem(s); see node authoring/tools/qa/answer-bias.mjs --report`);
  }
  if (page.questions || gift.questions) {
    console.log(
      `${id} report: correct option strictly longest in ${percent(page.share)} of ${page.questions} page and ${percent(gift.share)} of ${gift.questions} GIFT questions (chance about 25%)`,
    );
  }
  return [];
}
