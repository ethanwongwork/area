---
name: checkpoint
description: Close out a working session cleanly so the next one can resume without compacting. Runs the verification suite, commits and pushes, rewrites .Codex/HANDOFF.md, and appends to .Codex/JOURNAL.md. Use this whenever the user says checkpoint, handoff, "wrap up", "I'm going to close this session", "save your progress", "context is getting full", or asks how to continue tomorrow — and offer it unprompted when the session is long enough that context pressure is likely.
---

# Checkpoint

A session ends one of two ways: compacted, or handed off. Compaction is lossy in the
worst possible way — it keeps the shape of what happened and drops the specifics, which
are the expensive part. A handoff document is the opposite: it costs one write now and
one read later, and what it carries is exactly what the next session would otherwise
spend thousands of tokens rediscovering.

So the job here is not "summarise the session". It is: **leave the repository and the
next session in a state where picking up requires reading one file.**

## Before writing anything, take stock

Run these together and read the output — the handoff has to describe what is actually
true, not what you remember doing:

```bash
git status --short
git log --oneline -15
git diff --stat HEAD
```

Three things matter and are easy to get wrong:

- **Uncommitted work.** Anything in `git status` either gets committed or gets described
  in the handoff as deliberately left dirty, with the reason. Silence here is how the
  next session inherits a mystery.
- **Work in flight.** A half-finished refactor is the single most valuable thing to write
  down and the easiest to forget, because you have not hit the failure yet.
- **What you learned the hard way.** Every wrong turn this session is a trap the next
  session will walk into for free unless you name it.

## Verify before committing

Never write a handoff that claims a green state without checking. The next session will
trust it and build on it.

```bash
npm test                                          # colour maths, gamut, scales, contrast gate
npm run build                                     # axis integrity, tokens, styles, parity
npm run lint:manifest -w @area/styles             # CSS <-> manifest drift
npm run build:docs                                # dogfood audit
node packages/tokens/src/contrast/report.ts       # gate failures grouped by assertion
npm run typecheck
```

Record the real numbers in the handoff — test count, assertion count, waiver count. A
handoff that says "all green" is worth much less than one that says "8,673 tests, 172
assertions + 4 waivers across 66 themes", because the next session can tell at a glance
whether it has broken something.

If something is red, do not hide it. A handoff whose first line is "the contrast gate has
four failures, here is what I was in the middle of" is a good handoff.

## Commit

Commit everything that should be committed, in coherent units rather than one lump —
the log is the other half of the handoff. Follow the repository's existing commit style:
a summary line, then prose explaining *why*, including what was measured and what was
rejected.

Push the branch. Offer to open a PR rather than opening one unasked — a PR is an
outward-facing action and the user may not want one yet.

## Write the handoff

Overwrite `.Codex/HANDOFF.md`. It describes **one** state: the current one. History
belongs in the journal and in the git log, and a handoff that accretes becomes a thing
nobody reads.

Use this shape:

```markdown
# Handoff — <date>

**Branch** `<branch>` · **Last commit** `<sha>` `<subject>`
**State** <one line: green, or exactly what is red>

## Where things stand
<2–4 sentences. What is the project, what phase is it in, what just changed.>

## What happened this session
<Bullets. What changed and why. Link decisions to their reasoning — the *why* is the
part that is expensive to reconstruct.>

## In flight
<Anything half-done, with enough detail to resume. If nothing, say "Nothing — the tree
is clean" so the next session does not go looking.>

## Next
<Concrete next steps, most useful first. Not a wishlist — the actual next actions.>

## Traps
<Things learned the hard way. Wrong turns, surprising constraints, checks that caught
something. This section is why the handoff beats compaction.>

## Verify
<The exact commands, with the numbers they should print.>
```

Write it for a reader with **no memory of this session** and no patience. Name files by
path. Quote the numbers. Do not write "as discussed".

## Append to the journal

Add one entry to the top of `.Codex/JOURNAL.md`, under the heading, newest first:

```markdown
## <date> — <short title>
<2–4 sentences: what changed, why it mattered, anything a future reader would want to
know that the git log alone would not tell them.>
```

The journal is a different instrument from the handoff. The handoff answers "what do I do
now"; the journal answers "why is it like this", months later, when the reasoning has
left everyone's head. Keep entries short — a long journal stops being read, and the cost
of reading it is the reason it is consulted rarely.

Do not restate the handoff here. If an entry and the handoff say the same thing, the
entry is not earning its place.

## Close

Tell the user plainly: what was committed, whether it is pushed, what the handoff says to
do next, and that it is safe to exit. Do not start new work after a checkpoint — that is
the one thing that makes the handoff wrong.

## Resuming

At the start of a session that continues previous work, read `.Codex/HANDOFF.md` first.
It is written to be the only file you need. Reach for `.Codex/JOURNAL.md` only when you
need to know *why* something is the way it is and the handoff does not say — it is a
reference, not a briefing, and reading it has a cost.
