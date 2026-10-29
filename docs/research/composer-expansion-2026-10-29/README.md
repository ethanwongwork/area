# Composer expansion (2026-10-29)

Owner, 2026-10-29, with screenshots of Cursor's Agents window, the Claude desktop app's reply composer and Codex in
ChatGPT: "can you also expand the design and capabilities of the composer, looking at more slots, a mic button,
attachments, additional settings, etc". Measured values from the installed bundles: [evidence.md](evidence.md).

## Intake

**Need:** a person writing to an agent sets where and how the message runs (mode, model and effort, permissions,
project and files), dictates instead of typing, and drops or pastes files in, all around the one field.

**Answer:** slots and parts on Composer (rung 4), one prop group on Model picker (rung 6), and compositions for the
rest (rung 3).

| Need, as seen | Cursor | Claude | Codex | Answer |
|---|---|---|---|---|
| A row of selectors above the shell | "Code ▾ This Mac ▾" | — | — | `header` slot (a row outside, above the shell) |
| A strip tucked under the shell | — | — | "area · Files · Plugins ··· laptop" | built as a `tray` slot, removed on review (owner: it does not go with Area); the footer row holds the same content |
| A row of tools and a note under the shell | — | "+ mic voice ▾ · Claude is AI… · Opus 5.5 Medium · Manual" | — | `footer` slot, and `ComposerNote` for the muted line |
| Dictation | mic before send | mic in the footer | mic before send | `ComposerMic`: a toggle Button (mic, waveform while on) |
| Attach by picking | + | + | + | `ComposerAttach`: the + Button opening the file picker |
| Attach by dropping or pasting | yes | yes | yes | `onFiles` on Composer: drop and paste, with a drag-over state (File upload's) |
| Model with its effort | "Grok 4.6 Medium" | "Opus 5.5 Medium" | "6 Astra Light ▾" | Model picker `efforts` / `effort` / `onEffortChange`: the effort muted after the name, an Effort group in the menu |
| A mode chip | "Multitask ×" (tinted, removable) | — | — | composition: Tag (`tone`, `icon`, `onRemove`) in the leading actions (Chip has no tone) |
| A permission control | — | "Manual" (a select) | "Approve for me" (a dropdown, shield) | composition: a Menu trigger with an icon (Model picker) |
| A suggestion with its shortcut | "Plan New Idea ⇧Tab" | — | — | slot: Prompt suggestions `shortcut` (keys), a Kbd after the label |

**Why not smaller:** nothing in Composer holds content outside its shell (rung 1 fails); none of this applies to every
component (rung 2); a header, tray or footer laid out by the app would not share the shell's width, corner or inset, and
the tray's tuck depends on the shell's corner (rung 3 fails for those three); a model's effort is a second value with
its own menu group, not a slot (rung 4 fails for Model picker).

**Shape:** Composer adds `header`, `tray`, `footer` (ReactNode) and `onFiles(files, event)`; when any of the three
slots is used, the root becomes a group (`area-composer-group`) holding them around the shell, and takes the width hook.
New parts: `ComposerMic` (ghost icon-only toggle Button, `selected` / `onSelectedChange`, `label`), `ComposerAttach`
(ghost icon-only Button with a hidden file input: `onFiles`, `accept`, `multiple`, `label`), `ComposerNote` (muted xs
text). Model picker adds `efforts` (`{ value, label, description? }[]`), `effort` / `defaultEffort` /
`onEffortChange`.

**Peers:** Button (every action), Tag (mode), Model picker, Prompt suggestions (chips), File upload (the drag-over
paint), Kbd.

**Cost:** five new gallery tiles (header, tray, footer, mic, drop) plus three full references composed; Model picker
gains one tile (effort). Keyboard: no new contract (each part is a Button or Menu); drop and paste need no focus.

**Open:** none blocking; the evidence decides sizes and paints.

## Review, 2026-10-29

Owner: "which composition is being built? i prefer cursors but want it to still be rounded not pill/circular, but pretty
round. also want to see how you can take parts of each version and combine them, i dont like the codex tray
stylistically, i dont think it goes with area". No composition is built into Composer: the slots let a product compose
any of them. Applied: the shell's corner is the surface corner one step up its ladder (20 at the default, Cursor's
prompt input corner; evidence from the glass bundle, `--prompt-input-border-radius:20px`), its actions concentric
inside (12–13, rounded, not round); the tray removed; a combined composition takes Cursor's selectors and mode Tag,
Codex's and the Claude app's permission menu, the model and effort and mic from all three, and the Claude app's note.

Round 2 approved (owner, 2026-10-29): the corner (20, the one-line composer included), the combined composition, Approval's matching corner.
