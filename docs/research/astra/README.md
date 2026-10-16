# Astra research

Research, audits and reports written by Astra (Codex, GPT-6) from 2026-09-28 to 2026-10-12.
Astra is no longer available (2026-10-15). The `astra/research` branch was merged into `main`
on that date, so this folder is now an archive. New research goes in `docs/research/` like any
other Claude work, and the materials series continues from
[materials/README.md](materials/README.md).

Nothing here is a decision unless a review records the owner's choice (see
[materials/REVIEW.md](materials/REVIEW.md)). Most reports pin an older `main`; check a finding
against current code before acting on it. In particular, the axes were renamed to numbers and
Elevation was added on 2026-10-14.

[INDEX.md](INDEX.md) lists every task, newest first.

## Rules for Astra (historical)

Kept for reference; they describe how the folder was built. Read the repository's `AGENTS.md` first; it still applies. These rules add to it.

### Where to write

- Write only inside `docs/research/astra/`. Read anything in the repository.
- One folder per topic: `docs/research/astra/<topic>/`, lowercase and hyphenated
  (`date-picker-survey`, `dark-verification`). Its entry file is `README.md`.
- A repeated task (checks, drift) adds a dated file to its existing folder:
  `checks/2026-10-02.md`. Don't make a second folder for the same topic.
- When a task extends an earlier topic, update that folder and say what changed at the top of
  its README.
- Scripts that generate a report live in the topic folder and find the repository root
  relative to their own file. Each report says how to re-run them.

### What not to touch

- Component CSS, tokens, `packages/*`, `apps/*`, the icon set, specs, `docs/*.md` outside this
  folder, `.Codex/HANDOFF.md`, `AGENTS.md` and `apps/docs/src/component-status.mjs`.
  Changes there are written as proposals in the report.
- Never mark anything complete or approved. Never merge into `main`.
- Target products (ChatGPT, Notion, Figma, Cursor) are read-only. Don't sign in, change
  settings or create content in them. Public sites and public docs only, unless the task
  says otherwise.

### Evidence

- Every number or claim cites its source: a file and line pinned to a commit SHA, a public
  URL with the date it was checked, or a capture made with `apps/docs/public/area-capture.js`.
  Never estimate values from screenshots or from memory.
- Pin Area citations to the `origin/main` commit you read, and state it at the top.
- Separate what was measured from what you infer. Mark gaps as "not found" with where you
  looked.
- Write proposals as options for the owner, with a recommendation and its reason. Refer to
  existing Area tokens and families (`docs/research/BASELINE.md`, `docs/specs/`) by name.

### Size

- Prefer Markdown a person can read. Keep generated data under 1 MB per file; if a dataset must
  be larger, say why in the README. Don't commit source clones, caches, raw logs, build output,
  `node_modules` or captures containing personal content.

### Report shape

Each README starts with:

1. **Question:** the task, in one or two sentences.
2. **Answer:** the result in under ten lines, written for the owner.
3. **Snapshot:** Area commit, date checked, sources.

Then the evidence, then "Proposals" (if any) and "Open questions".

### Git

1. Start: `git fetch origin`, then work from `origin/astra/research`: switch to `astra/research`
   and fast-forward, or, if another worktree holds that branch, create a local branch from
   `origin/astra/research`.
2. Merge `origin/main` in when you need current code (this folder never conflicts with it).
3. Finish: add one line at the top of INDEX.md's table, commit, then
   `git fetch origin && git rebase origin/astra/research && git push origin HEAD:astra/research`.
   If INDEX.md conflicts, keep every line.
4. Don't open a new pull request. The standing draft pull request for `astra/research`
   picks up each push.
5. End your reply with the topic folder, the commit, and the Answer section.
