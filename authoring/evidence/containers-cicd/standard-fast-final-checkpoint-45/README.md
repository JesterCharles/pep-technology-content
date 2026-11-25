# Final checkpoint: 30 → 45 questions (2026-11-19)

User decision (2026-11-19): the Standard/Fast Final Assessment MCQ is a 45-question cumulative bank across every shared course; course finals stay at 30.

- Base: the 30-question bank in `../standard-fast-final-checkpoint.md` (sha256 d7b32ef2…) kept byte-for-byte except header line 1.
- Added: `sfcp-q31`–`sfcp-q45` (15 items) weighted to Spring Boot, Python/FastAPI, HTML/CSS/JS, React and Containers objectives not sampled by the base 30 (`coverage-45.json`).
- Independent critics on the 15 new items: `sme-findings-new15.json` (all ok), `education-findings-new15.json` (medium on q35, q44). Fixes applied to q35, q42, q44 and the header; keys re-verified by execution (`key-verification-fixes.txt`: q35 MockMvc on JDK 25 / Boot 4.1.2; q44 fastapi-cli `dev` vs `run` binding and Compose container port).
- Key spread A11 B11 C11 D12, longest run 2. Dedup scan vs repo banks: `dedup-new15.json`.
- Duration 90 minutes (2 min/question per test contract). Weights `{}` (beta default). Open decision: Final day now 150 minutes with the coding challenges.
- Not verified: platform import, learner timing.
