---
name: checkpoint
description: Saves an Area session when the user asks for a checkpoint or handoff. Verifies affected work, records the current state in the handoff, and commits or pushes only within the user's requested scope. Use only when the user asks for a checkpoint, a handoff or to save progress.
---

# Checkpoint

Use only for a requested checkpoint or handoff, not ordinary task completion.

1. Read `git status --short` and `git diff --stat`; preserve unrelated edits.
2. Run checks appropriate to the changes in `docs/DEVELOPMENT.md`. Record failures and
   browser/platform limits honestly; do not repeat an already completed unchanged suite.
3. Rewrite the "Current state" section at the top of `.Codex/HANDOFF.md`. In under 40 lines,
   cover what is in review, what is in progress on which branch, open owner questions and the
   next concrete step. Put this session's entry under it, newest first. Remove anything the
   new state supersedes rather than adding beside it. Add a brief historical decision to
   `.Codex/JOURNAL.md` when useful.
4. If the user requested a commit, commit the relevant changes. Push only if requested.
   A handoff alone is not permission to commit or publish.
5. Report what is saved, what remains uncommitted, and any remaining work.

Do not mark a component complete because a report or test passes. Owner-confirmed
completion is recorded in `apps/desktop/src/content/component-status.mjs`.
