# Secrets in CI

## Objectives

- Reference a repository secret as ${{ secrets.NAME }} in a workflow instead of writing the credential into the file
- Explain that GitHub attempts to redact registered secrets in logs but that redaction is not a permission boundary, so a workflow never prints a secret and masks other sensitive values with add-mask, and that a run triggered from a fork receives no repository secrets (GITHUB\_TOKEN excepted)
- Restrict the GITHUB\_TOKEN with a permissions block to the least access the workflow needs

## Teaching

A repository secret is registered in GitHub. A step base64-encodes it and writes the encoded text to the run log.

Store a credential as a repository secret, then reference it with the `secrets` context. Passing it through `env` keeps it out of the command text:

```
env:
  DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

Each run also gets an automatic `GITHUB_TOKEN`. A `permissions` block sets what it can do, and any permission you do not list becomes `none`:

```
permissions:
  issues: read
```

Grant the least access the workflow needs.

GitHub attempts to redact registered secrets from logs, but redaction relies on matching values. It is best effort, not a permission boundary. Anyone with write access to a repository can read its secrets through a workflow.

So never print a secret. Register other sensitive values, including derived ones, before they could appear:

```
echo "::add-mask::$DERIVED_VALUE"
```

A run triggered from a fork receives no repository secrets, except `GITHUB_TOKEN`.

A job checks out code and pushes an image to the GitHub Container Registry, signing in with `GITHUB_TOKEN`. It does nothing else.

## Recap

You finished 0 of 4 activities and got 0 right. Any settled activity shows what to review; Restart activity lets you try it again.

- Reference a credential as `${{ secrets.NAME }}`; it never goes in the workflow file.
- Redaction is best effort: never print a secret, mask other sensitive values with `add-mask`, and expect fork runs to get no secrets except `GITHUB_TOKEN`.
- A `permissions` block limits `GITHUB_TOKEN`; what you do not list becomes `none`.

## Cheat sheet

Reading without JavaScript: decide first, then read on.

Where to act: Start on the `REGISTRY_PASSWORD` line.

Next step: Look at how the example reads a value through the secrets context.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Now look at the top level of the file, level with `jobs`.

Next step: Name the one permission this job needs, and the access level it needs.

Printed alternative: Replace the literal value with a reference to a repository secret named REGISTRY_PASSWORD, and add a top-level permissions block with read access to contents and nothing else. The starter is shown in the editor box above. Compare your edit with the requirements under What success looks like; this reading does not include a finished answer.

A proofreader blacks out one exact phrase in a document. If the writer rewords it or writes it backwards, the proofreader misses it, and the sensitive fact is still on the page.

A filter that matches exact text cannot be your security boundary.

Where to act: Keep the trigger on this repository first.

Next step: Compare the two behaviours that handle a derived value, and read which one the log hides.

Printed alternative: On a same-repository run: printing nothing is best; an exact secret is usually shown as stars; a base64-encoded value can leak unredacted; a derived value registered with add-mask is hidden. On a run from a fork, repository secrets are empty and only GITHUB_TOKEN is provided.

Reading without JavaScript: decide first, then read on.

- Do not store structured data such as JSON as one secret; redaction can fail on it.
- Do not pass secrets as Docker build arguments; use build secrets.
- A leaked secret gets rotated, not just deleted.

## Sources

Status: minimum release, checked by the page author on 2026-11-08. Sources were fetched live on 2026-11-04 and the author checked the page against them; no independent education or technology review was performed.

- Using secrets: secrets context, not passed to fork-triggered workflows except GITHUB_TOKEN
- Secrets reference: redaction, structured data
- Secure use reference: redaction not guaranteed, add-mask, write access reads secrets, least privilege
- GITHUB_TOKEN: permissions
- Workflow syntax: permissions; unspecified permissions are none
- Build secrets: do not use build arguments for secrets

## Static interaction alternatives

### predict

What does the log show? Each option is explained after the question in this reading.

### terminal

Replace the literal value with a reference to a repository secret named REGISTRY_PASSWORD, and add a top-level permissions block with read access to contents and nothing else. The starter is shown in the editor box above. Compare your edit with the requirements under What success looks like; this reading does not include a finished answer.

### explore

On a same-repository run: printing nothing is best; an exact secret is usually shown as stars; a base64-encoded value can leak unredacted; a derived value registered with add-mask is hidden. On a run from a fork, repository secrets are empty and only GITHUB_TOKEN is provided.

### mcq

Which permissions block fits this job? Each option is explained after the question in this reading.
