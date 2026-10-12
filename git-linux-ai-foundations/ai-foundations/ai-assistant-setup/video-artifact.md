---
title: The CLAUDE.md file
channel: Claude
url: https://www.youtube.com/watch?v=O0FGCxkHM-U
runtimeMinutes: 3
embeddable: true
checkedAt: 2026-10-12
covers: []
  - Standing instructions: a project rules file (CLAUDE.md) that the tool reads automatically at the start of every session and appends to your prompt (objective o1)
  - What happens without standing instructions: the assistant re-explores the codebase and sometimes has to make assumptions, which makes it harder to steer (objective o2)
  - Shared context alongside the prompt: pointing the assistant at project docs with an @ file reference (objective o1)
  - Keeping the instructions file in version control so the whole team shares it, matching the page's rules file kept in the project
gaps: []
  - Objective o3 is not covered: nothing on opening the workspace at the project folder, or on a scope that is too wide or too narrow
  - No tool-neutral framing of the three inputs; it shows one tool's file name, where the page says names and support vary by tool
  - Nothing on using an approved tool and account, or on treating every answer as a proposal until checked
cautions: []
  - Tool-specific and vendor-made: an Anthropic product video for Claude Code; the page cites CLAUDE.md as one example beside GitHub Copilot's .github/copilot-instructions.md
  - Beyond the page: a user-level instructions file, the /init command and saving corrections to memory
  - Mild tension with the page: the video suggests starting a project without a CLAUDE.md and adding to it as corrections recur, while the page's setup keeps a standing instructions file in the project; both keep the file small and project-specific
alternates: []
rejected: []
---

# Video: The CLAUDE.md file

- Channel: Claude (Anthropic's official YouTube channel, @claude; the channel description reads "Built by Anthropic")
- URL: https://www.youtube.com/watch?v=O0FGCxkHM-U
- Runtime: 3:01 (181 s in the watch page's player data), within the 9-minute topic budget
- Published: 2026-05-10
- Embeddable: yes (oEmbed HTTP 200; player data `playabilityStatus` OK, `playableInEmbed` true, not private, not unlisted)
- Checked: 2026-10-12

## How fit was judged

Fit was judged from the full English auto-generated transcript, the video description and the live player metadata, all fetched on 2026-10-12.
The video was not watched with picture, so on-screen content that the narration does not mention is not claimed.

## What it covers

The narration states that the file "gives Claude Code persistent memory about your project", is read automatically every session, and that its contents "are appended to your own prompt": the page's standing instructions sitting beside the prompt (o1).
It says that without the file the assistant "has to re-explore your code base" and "sometimes it has to make assumptions", which is the page's point that a missing input gets filled with something plausible (o2).
It shows `@` file references for pointing the assistant at project docs, a form of shared context (o1).

## Gaps

- Objective o3 (workspace scope) is not covered at all; the page's scope model has to carry it.
- The page's tool-neutral three-input model is not named as such; the video is about one tool's file.
- Nothing on approved tools and accounts, or on checking every answer as a proposal.

## Cautions

- Vendor product video for Claude Code. The page names CLAUDE.md as one example and GitHub Copilot's `.github/copilot-instructions.md` as another; learners should follow the page where file names differ by tool.
- Goes beyond the page with a user-level file, `/init` and saving corrections to memory.
- It advises starting without a CLAUDE.md and growing it from repeated corrections, while the page's setup keeps a standing instructions file in the project; the two agree that the file should stay small and project-specific.

## Alternates

- Microsoft Visual Studio, "Customizing GitHub Copilot in Visual Studio with Custom Instructions", https://www.youtube.com/watch?v=BdZWFlFiHHY (228 s; live, public and embeddable on 2026-10-12).
  The legacy pick: by transcript it shows `.github/copilot-instructions.md` used as a reference for every chat request and stored in the repo for the team, and the legacy frame record noted the chat box's "Include active document" option.
  Kept as an alternate because it does not connect a missing input to a guess (o2), and it is a Visual Studio and .NET walkthrough.
- Visual Studio Code, "Smaller prompts, better answers with GitHub Copilot Custom Instructions", https://www.youtube.com/watch?v=zwIlqbTHjac (429 s).
  By transcript it says the instructions file "is prepended to the request" and evaluated with the prompt you wrote; the second half moves to commit-message and settings customisation beyond the page.
- Claude, "Context Management in Claude Code", https://www.youtube.com/watch?v=eW3oTyfeWZ0 (210 s).
  By transcript it explains the context window, `/compact`, `/clear` and keeping MCP servers relevant; closer to context hygiene than to the three inputs or workspace scope.

## Rejected

- GitHub, "How to teach GitHub Copilot about your codebase | Tutorial for Beginners", https://www.youtube.com/watch?v=QGakvawJc2M (365 s).
  First-party and on instruction files, but by chapters and transcript most of its runtime goes to agent skills, custom agents and MCP servers, well beyond this page.
- Microsoft Visual Studio, "More Context == Better GitHub Copilot Responses in Visual Studio", https://www.youtube.com/watch?v=N62d9PgiqoY (251 s, published 2024-12-16).
  By transcript it is a feature tour (mention detection, guided chat, model picker) rather than a lesson on inputs or scope.

## Search record

YouTube searches on 2026-10-12: "copilot custom instructions", "VS Code copilot custom instructions", "github copilot repository custom instructions", "claude code CLAUDE.md memory", "copilot context chat vs code".
Official vendor channels (Claude, GitHub, Visual Studio Code, Microsoft Visual Studio) were preferred over third-party tutorials.
