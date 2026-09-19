---
name: checkpoint
description: Save an Area session when the user asks for a checkpoint or handoff. Verify affected work, record current state, and commit or push only within the user's requested scope.
---

# Checkpoint

Use only for a requested checkpoint or handoff, not ordinary task completion.

1. Read `git status --short` and `git diff --stat`; preserve unrelated edits.
2. Run checks appropriate to the changes in `docs/DEVELOPMENT.md`. Record failures and
   browser/platform limits honestly; do not repeat an already completed unchanged suite.
3. Replace `.Codex/HANDOFF.md` with current work, verification, and the next concrete step.
   Keep it short. Add a brief historical decision to `.Codex/JOURNAL.md` when useful.
4. If the user requested a commit, commit the relevant changes. Push only if requested.
   A handoff alone is not permission to commit or publish.
5. Report what is saved, what remains uncommitted, and any remaining work.

Do not mark a component complete because a report or test passes. Owner-confirmed
completion is recorded in `apps/docs/src/component-status.mjs`.
