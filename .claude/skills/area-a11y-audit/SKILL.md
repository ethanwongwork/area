---
name: area-a11y-audit
description: Audits an Area component family or a composed screen for accessibility - names and roles in the accessibility tree, keyboard reach and order, focus visibility and return, target size, contrast, forced colours, increased contrast, reduced motion, zoom and RTL - in the real desktop app over the DevTools protocol, and routes every fix to the component. Use when a family is built or changed, before a family is proposed as Complete, when the owner asks whether something is accessible, keyboard-friendly or screen-reader friendly, or after a change to focus, state paint, overlays, menus or forms.
---

# Accessibility audit

`area-interaction-pass` tests how the app moves; this skill tests whether everyone can use it. It runs on one family
(every gallery tile and its Stage) or one screen, in the real Electron window, and reports each finding with the rule it
breaks, where, and the fix in the component (never an app-only patch; AGENTS.md). A defect found in one family is
checked in every family that shares the pattern (fix the rule, not the instance).

The rules themselves live elsewhere: names, roles and keys in the family's spec and Documentation entry
(`area-component-docs`); colour, focus and state paint in `docs/CONTRAST.md`; motion in `docs/MOTION.md` ("Reduced
motion"); words in `docs/WRITING.md`. This skill checks them.

## 1. Set up

1. Run the window as `area-interaction-pass` § 1 says (its own worktree build, one Electron, a debugging port), and drive
   it with that skill's `scripts/cdp.mjs`. The owner's data is real: open and cancel, never create, rename or delete.
2. Open the family's page (`#system/area/components/<slug>`) or the screen. Note type, density and light / dark: the
   audit runs at the app's defaults first, then at the extremes below.

## 2. Names and roles

Read the accessibility tree, not the DOM: `cdp.mjs eval` can call the protocol's `Accessibility.getFullAXTree` through
the page's target, or use `getComputedAccessibleNode`-style checks in the page (`el.computedRole`, `el.computedName`
where Chromium exposes them).

- Every interactive element has a role and a non-empty name; an icon-only control's name is its `aria-label` or
  `*Label` prop and matches its tooltip (WRITING.md, "Buttons and commands").
- A composite widget exposes its pattern: menu / menuitem, listbox / option, tablist / tab / tabpanel, tree / treeitem,
  dialog with `aria-labelledby` and `aria-describedby`, combobox with `aria-expanded` and `aria-controls`.
- State is in ARIA or native attributes, never only in paint: `aria-selected`, `aria-checked`, `aria-current`,
  `aria-expanded`, `aria-invalid`, `aria-disabled` / `disabled`, `aria-busy` while loading.
- A status that changes (upload progress, a toast, a step finishing, a copy, a reorder) is announced through the
  shared announcer: `announce(message, { politeness })` or `useAnnouncement(message)` from `@area/react`
  (DESIGN_SYSTEM.md, "Announcements"). Polite unless it is a failure to act on now. A family that writes its own
  `aria-live` or `role="status"` is a defect unless its visible text is the message (Alert, named Spinner, Toast
  without a Toaster, Turn notice, compact Pagination; the cohesion test lists them). Check the words: the subject is
  named ("Report.pdf: Complete"), and a repeated action is said again. In a modal, the regions sit inside the dialog
  (`[data-area-announcer]` under `dialog:modal`).
- Images and glyphs: decorative ones are `aria-hidden`; one that carries meaning has a name.

## 3. Keyboard

Walk with Tab and Shift+Tab from the page's first control, recording `document.activeElement` at each stop.

- Every action is reachable; the order follows the reading order; nothing traps focus except an open modal.
- A composite has one Tab stop and moves inside with arrows (roving tabindex or `aria-activedescendant`); Home / End
  where the spec lists them; type-ahead in menus and lists.
- Escape closes the top overlay and only it; focus returns to the trigger. A modal traps Tab inside and restores focus
  on close (Dialog, Drawer, Command palette, Confirm dialog).
- Enter and Space do what the role promises (a button activates, a checkbox toggles, a link navigates on Enter only).
- Disabled controls that must stay discoverable (`aria-disabled`, a loading Button) keep focus; truly disabled ones
  leave the order.

## 4. Focus visibility

At every stop: the ring is visible on its ground in light and dark (`docs/CONTRAST.md`, 3:1 against what it touches),
not clipped by an ancestor's `overflow`, and drawn by the focus tokens (`--area-focus-*`), never a browser default.
Under `:focus-visible` only: a pointer click shows no ring on controls that don't take text.

## 5. Target size

Measure every interactive element's box (`getBoundingClientRect`): at least 24 × 24 CSS px, or 24 px of spacing around a
smaller one (WCAG 2.2, 2.5.8). Report anything under, with its family; a dense UI meets it with spacing, not by growing
the mark. Touch (`lg`, the touch tier) aims for 44.

## 6. Contrast, forced colours, increased contrast

1. Text and non-text contrast come from the contrast gate (`node packages/tokens/src/contrast/report.ts`), which
   covers the tokens; here check what the gate can't: text over images and tints, a component's own `light-dark()`
   spec values, disabled text (exempt, but say so), placeholder text (4.5:1).
2. Forced colours: `Emulation.setEmulatedMedia` with `{ name: "forced-colors", value: "active" }`, then screenshot every
   tile. Every boundary, check, selected row, focus ring and icon is still visible (system colours from
   `packages/styles/src/forced-colors.css`). Report what disappears.
3. Increased contrast: `prefers-contrast: more`. Area's Contrast setting is the equivalent; report whether the family
   responds to the preference (an open item until Area maps it).

## 7. Reduced motion, zoom and RTL

- `prefers-reduced-motion: reduce`: open and close every overlay; nothing moves, fades stay short (100 / 160ms), loops
  stop, every state is still reachable (MOTION.md, the contract). Read `document.getAnimations()`.
- Zoom: 200% (`Emulation.setPageScaleFactor` or the window's own zoom) and a 320 CSS px wide viewport: no lost
  content, no horizontal scroll except in data tables and code, no overlapping text.
- RTL: set `dir="rtl"` on the specimen's scope; chevrons, sliders, progress, drawers and tree indent mirror; logical
  properties hold; nothing reads in the wrong order.

## 8. Screen reader (when the owner asks, or before Complete)

VoiceOver (⌘F5) on the app: navigate the family by Tab and by the rotor; each control reads its role, name and state;
announcements arrive once. Record what was spoken. This needs the owner's machine and attention: ask first.

## 9. Report

One table per run: rule · where (family, tile, state) · what happens · fix (the file and the change). Then the families
that share the pattern. Say plainly what wasn't checked (screen reader, Windows forced colours, a real touch device).
Fixes go through the family's spec and Documentation entry (`area-component-docs`), and a rule a test can hold gets a
test (Q1's DOM tests, `cohesion.test.mjs`).
