---
title: What NOT to Share with AI: 5 Things to Keep Private When Using LLMs
channel: Security Journey
url: https://www.youtube.com/watch?v=Z71DBzHrd-Q
runtimeMinutes: 2.2
embeddable: true
checkedAt: 2026-10-12
covers:
  - Material that should not go into a cloud-hosted assistant at all, in five categories: credit card statements, medical records, proprietary code, business plans and roadmaps, and legal documents (objective o1, the never-share lane)
  - The reason given is that anything uploaded can stay with the provider and may be used to train models, matching the page's rule to treat anything you paste as having left your control
gaps:
  - No three-lane sort: there is no share lane and no redact-first lane, only things to keep out
  - Objective o2 is not covered: no redaction, placeholders or keeping the useful part of an error message
  - Tokens, passwords and private keys, the page's main examples, are not named
  - Nothing on owning AI-proposed code you submit or on using only approved tools
cautions:
  - Tension with the page: the video puts proprietary (company) code in the do-not-share list, while the page's share lane allows only material the program or employer permits for that approved tool and account, with no secrets, personal data or confidential business details; learners should follow the page and their program's approved-tool policy
  - Made by a secure-coding training vendor, and the closing line promotes self-hosting models; the content itself is general guidance, not a product demo
  - Its claim that uploaded data could be used to train other models varies by provider and plan, which the page also notes was not checked per provider
alternates:
  - title: "ChatGPT: How to use AI tools securely | Hacker Headlines (Infosec Institute)"
    url: https://www.youtube.com/watch?v=PqjDPBBuqVE
    reason: "Closer to the page's rules but overstates provider data use and is dated 2023."
  - title: "Checklist on Guidelines for the Use of Generative AI by Employees Promotional Video (PCPD Hong Kong)"
    url: https://www.youtube.com/watch?v=SAu0iobgwdA
    reason: "Official regulator, but written for organisations drafting policy."
rejected:
  - title: "Protect data used in prompts with Copilot, ChatGPT, Gemini, and more | Microsoft Purview (Microsoft Mechanics)"
    url: https://www.youtube.com/watch?v=dYzTyEcjHc0
    reason: "Product demo of an enterprise data-loss-prevention tool, not learner guidance."
  - title: "OWASP LLM02 explainer (VeriGenAI)"
    url: https://www.youtube.com/watch?v=kS5ydwv26c4
    reason: "About applications leaking data, not what a user pastes into a prompt."
---

# Video: What NOT to Share with AI: 5 Things to Keep Private When Using LLMs

- Channel: Security Journey
- URL: https://www.youtube.com/watch?v=Z71DBzHrd-Q
- Runtime: 2:14 (134 s in the watch page's player data), within the 8-minute topic budget
- Published: 2024-12-03
- Embeddable: yes (oEmbed HTTP 200; player data `playabilityStatus` OK, `playableInEmbed` true, not private, not unlisted)
- Checked: 2026-10-12

## How fit was judged

Fit was judged from the full manual English (en-US) caption track, the video description and the live player metadata, all fetched on 2026-10-12.
The legacy curation (checked 2026-10-07) matched it from storyboard frames; this check re-read it from the transcript.
No official or standards-body video (OWASP Foundation, a regulator or a tool vendor) was found that teaches what to put in a prompt at this length; see the search record.

## What it covers

A security engineer lists five kinds of material not to upload to cloud-hosted assistants, each with a reason: credit card statements, medical records, proprietary code, business plans and roadmaps, and legal documents.
It opens with the point that cloud-hosted models "don't forget what you upload", which supports the page's rule to treat anything pasted as out of your control.
That serves objective o1 for the never-share lane only.

## Gaps

- No share or redact-first lanes, so it does not teach a sort, only a list of things to keep out.
- No redaction (o2): no placeholders such as `<TOKEN>`, and nothing on keeping error codes and line numbers while removing secrets.
- No tokens, passwords or private keys named; no ownership of submitted AI-proposed code; no approved-tool rule.

## Cautions

- Direct tension with the page on code: the video says not to upload proprietary code, while the page shares project code with no secrets or personal data in an approved tool.
  The page and the program's approved-tool policy decide; the video's advice fits unapproved public tools.
- Vendor-made (secure-coding training company); it closes by trailing self-hosted models.
- Training on uploaded data differs by provider and plan, as the page's own unverified note says.

## Alternates

- Infosec Institute, "ChatGPT: How to use AI tools securely | Hacker Headlines", https://www.youtube.com/watch?v=PqjDPBBuqVE (233 s, published 2023-05-05).
  By transcript it matches more of the page's rules (use only approved and verified AI tools, never input protected data or personal information, verify AI-written code before use) and has no tension on sharing code.
  Not chosen because it states as fact that uploaded data "will" be used to answer other people's queries, which overstates how providers handle data, and it refers to a ChatGPT breach "this week" in 2023, which dates it.
- 私隱公署 PCPD (Office of the Privacy Commissioner for Personal Data, Hong Kong), "Checklist on Guidelines for the Use of Generative AI by Employees" Promotional Video, https://www.youtube.com/watch?v=SAu0iobgwdA (294 s).
  An official regulator: by transcript it covers permitted tools, permissible types of input (including whether personal data may be input) and reviewing AI output.
  Not chosen because it addresses organisations writing policy under Hong Kong's PDPO, not an individual sorting a prompt.

## Rejected

- Microsoft Mechanics, "Protect data used in prompts with Copilot, ChatGPT, Gemini, and more | Microsoft Purview", https://www.youtube.com/watch?v=dYzTyEcjHc0 (search label 7:56): a product demo of an enterprise data-loss-prevention tool, not learner guidance (judged from the title and search listing only).
- OWASP LLM02 explainers from third-party channels (for example VeriGenAI, https://www.youtube.com/watch?v=kS5ydwv26c4, search label 6:56): about applications leaking data, not about what a user pastes (judged from titles and search listings only).
  The OWASP Foundation's own video found, "OWASP Top 10 for LLMs" (https://www.youtube.com/watch?v=de9UPN7yD5U, search label 28:33), exceeds the 8-minute budget.

## Search record

YouTube searches on 2026-10-12: "what not to share with AI chatbot", "sensitive information disclosure LLM OWASP", "OWASP Foundation LLM top 10 sensitive information", "don't paste secrets into AI prompt", "AI data privacy what to share with chatbots", "redact sensitive data before sending to ChatGPT", "secure use of generative AI at work employees", "GitHub copilot secrets protection prompt", "protect sensitive data when using AI tools at work", "API keys pasted into ChatGPT leak developers", "cybersecurity awareness generative AI safe use short", "National Cybersecurity Alliance use AI safely".
