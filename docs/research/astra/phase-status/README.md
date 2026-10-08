# Phase status

**Question:** Where does every family in `APPROVAL_BATCHES` stand in the four-step approval process, and what does its spec still label `Unverified:`?

**Answer:**

- 65 families in 23 batches: 57 have all four phases recorded; 8 remain in review. See [batch evidence](#batch-evidence).
- Disclosure and Alignment picker are closest by recorded phases: only owner approval is absent. Both have later edits than their validation dates; Alignment picker was explicitly reopened. See [closest to owner approval](#closest-to-owner-approval).
- Six newer families lack an audited-pass attestation and a `pass-status.mjs` entry. [Tag](#tag) has a documented side-by-side; [Custom select](#custom-select) has a Visual pass but explicitly lacks a side-by-side screenshot. [Tag picker](#tag-picker), [Date picker](#date-picker), [Drawer](#drawer) and [Confirm dialog](#confirm-dialog) lack a Visual pass section.
- Target-product capture files exist for every batch family except [Drawer](#drawer) (shadcn captures only) and [Confirm dialog](#confirm-dialog) (live measurements, product export not saved).
- The family specs retain 65 `Unverified:` markers, including historical notes. [Most unverified](#most-unverified) distinguishes missing phase evidence from marker count; neither approval nor a passing build clears these notes.

**Snapshot:** `origin/main` at `4c1854202a8e109479d5b83ef24a8325231da056`; checked 2026-10-07 (America/Los_Angeles). Sources: [apps/docs/src/component-status.mjs:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L1), [apps/docs/src/pass-status.mjs:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1), [docs/research/cohesion-audit.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L1), each family’s pinned spec and tracked capture files below. No live product inspection or new validation was performed.

## Method and interpretation

The four gates are audited spec, Visual pass section, target-product captures plus a recorded side-by-side, and owner membership in `COMPLETE_COMPONENTS`. Captures alone are half of phase 3; an older approval remains valid while earlier phases catch up. [apps/docs/src/component-status.mjs:58](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L58-L67)

“Audited: recorded” uses an existing spec plus a `VALIDATED_PASSES` entry: the registry explicitly attests that all three evidence steps were done. This is a historical attestation, not a fresh audit of current code. The cohesion audit documents its original scope and later additions; an isolated mention of an inherited audit rule or passing audit tests is not evidence that a new family was audited. [apps/docs/src/pass-status.mjs:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1-L12) [docs/research/cohesion-audit.md:6](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L6-L12) [docs/research/cohesion-audit.md:271](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L271-L277) [docs/research/cohesion-audit.md:319](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L319-L339)

“Visual pass” means the named section exists, not that every theme/state is verified. “Product captures” means tracked JSON files in that family’s capture directory whose names identify ChatGPT, Notion, Figma or Cursor. Links below identify every counted file; Area captures and design-system captures are not counted as product captures. No capture contents containing personal data are copied into this report.

“Side-by-side: recorded” means a validation entry exists. Spec-only comparisons are reported separately and do not silently fill the registry. Missing evidence means “not found” in the named spec, the complete pass registry and cohesion audit; it does not mean work could never have happened.

Every `Unverified:` marker is retained case-insensitively with its source line and the wrapped paragraph continuation. Historical and potentially superseded notes are preserved, not asserted to be current failures. A spec with no such marker can still contain “not compared”, “not yet”, open questions or other limits. The count ranks written markers, not severity or individual checks.

## Batch evidence

## Batch 1 — Toolbar controls

Batch membership: [apps/docs/src/component-status.mjs:70](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L70).

### toolbar

- Spec: [docs/specs/toolbar.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toolbar.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:19](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L19-L22)).
- Visual pass: **present** ([docs/specs/toolbar.md:187](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toolbar.md#L187-L210)).
- Product captures: **yes**, 13 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-27** — Figma toolbelt, re-checked after the Segmented and split-tool change (tools, chevrons, divider, mode switch). [apps/docs/src/pass-status.mjs:19](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L19-L22).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:11](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L11)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/toolbar.md:220](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toolbar.md#L220-L222)):

  > parity, token references and the React tests pass. Unverified: Figma's dark theme (switching it
  > needs the owner), keyboard focus ring in the new track, a screen reader on toggle and track
  > semantics (toggles are `aria-pressed`; a track is not a radio group).


<details>
<summary>13 pinned product capture files</summary>

- [figma--bottom-toolbar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--bottom-toolbar--rest--light.json#L1)
- [figma--mode-switch--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--mode-switch--hover--light.json#L1)
- [figma--mode-switch--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--mode-switch--rest--light.json#L1)
- [figma--split-tool--hover-action--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--split-tool--hover-action--light.json#L1)
- [figma--split-tool--hover-chevron--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--split-tool--hover-chevron--light.json#L1)
- [figma--split-tool--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--split-tool--rest--light.json#L1)
- [figma--split-tool-selected--hover-chevron--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--split-tool-selected--hover-chevron--light.json#L1)
- [figma--split-tool-selected--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--split-tool-selected--rest--light.json#L1)
- [figma--tool--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--tool--rest--light.json#L1)
- [figma--tool-group--chevron-hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--tool-group--chevron-hover--light.json#L1)
- [figma--tool-group--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--tool-group--hover--light.json#L1)
- [figma--tool-group--selected--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--tool-group--selected--light.json#L1)
- [figma--toolbelt-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toolbar/figma--toolbelt-row--rest--light.json#L1)

</details>

### split-button

- Spec: [docs/specs/split-button.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/split-button.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:23](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L23-L26)).
- Visual pass: **present** ([docs/specs/split-button.md:196](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/split-button.md#L196-L210)).
- Product captures: **yes**, 11 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [shadcn--group-dropdown-outline--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/shadcn--group-dropdown-outline--rest--light.json#L1); [shadcn--group-md-outline--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/shadcn--group-md-outline--rest--light.json#L1); [shadcn--split-dropdown--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/shadcn--split-dropdown--rest--light.json#L1); [shadcn--split-separator--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/shadcn--split-separator--rest--light.json#L1).
- Side-by-side: **recorded 2026-09-27** — Figma's toolbelt tool groups (tool and chevron plates, hover, selected). [apps/docs/src/pass-status.mjs:23](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L23-L26).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:11](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L11)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/split-button.md:217](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/split-button.md#L217)):

  > - Unverified: dark theme, screen reader announcement, forced colors, RTL divider position.


<details>
<summary>11 pinned product capture files</summary>

- [figma--split-tool--hover-action--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/figma--split-tool--hover-action--light.json#L1)
- [figma--split-tool--hover-chevron--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/figma--split-tool--hover-chevron--light.json#L1)
- [figma--split-tool--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/figma--split-tool--rest--light.json#L1)
- [figma--split-tool-selected--hover-chevron--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/figma--split-tool-selected--hover-chevron--light.json#L1)
- [figma--split-tool-selected--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/figma--split-tool-selected--rest--light.json#L1)
- [notion--split-main--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/notion--split-main--rest--light.json#L1)
- [notion--split-menu--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/notion--split-menu--rest--light.json#L1)
- [notion--split-menu-surface--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/notion--split-menu-surface--open--light.json#L1)
- [notion--split-solid-accent--hover-main--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/notion--split-solid-accent--hover-main--light.json#L1)
- [notion--split-solid-accent--hover-menu--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/notion--split-solid-accent--hover-menu--light.json#L1)
- [notion--split-solid-accent--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/split-button/notion--split-solid-accent--rest--light.json#L1)

</details>

### segmented

- Spec: [docs/specs/segmented.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/segmented.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:83](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L83-L86)).
- Visual pass: **present** ([docs/specs/segmented.md:142](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/segmented.md#L142-L156)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-27** — ChatGPT's Chat / Work switch and Figma's mode switch. [apps/docs/src/pass-status.mjs:83](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L83-L86).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:11](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L11)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/segmented.md:163](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/segmented.md#L163-L164)):

  > [the audit](../research/cohesion-audit.md#verification). Unverified: hover and focus
  > captures, dark theme.


<details>
<summary>3 pinned product capture files</summary>

- [figma--flow-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/segmented/figma--flow-row--rest--light.json#L1)
- [figma--panel-tabs--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/segmented/figma--panel-tabs--rest--light.json#L1)
- [figma--view-toggle--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/segmented/figma--view-toggle--rest--light.json#L1)

</details>

## Batch 2 — Navigation lists

Batch membership: [apps/docs/src/component-status.mjs:71](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L71).

### nav

- Spec: [docs/specs/nav.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/nav.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:27](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L27-L30)).
- Visual pass: **present** ([docs/specs/nav.md:181](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/nav.md#L181-L195)).
- Product captures: **yes**, 6 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-27** — ChatGPT's and Notion's sidebars (sections, labels, rows, current plate). [apps/docs/src/pass-status.mjs:27](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L27-L30).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:11](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L11)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/nav.md:194](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/nav.md#L194)):

  > - Unverified: dark products, an accent Selection theme beside a product.


<details>
<summary>6 pinned product capture files</summary>

- [chatgpt--sidebar-projects-section--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/nav/chatgpt--sidebar-projects-section--rest--light.json#L1)
- [chatgpt--sidebar-recents-section--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/nav/chatgpt--sidebar-recents-section--rest--light.json#L1)
- [chatgpt--sidebar-section-label--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/nav/chatgpt--sidebar-section-label--rest--light.json#L1)
- [chatgpt--sidebar-top-group--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/nav/chatgpt--sidebar-top-group--rest--light.json#L1)
- [notion--sidebar-private-section--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/nav/notion--sidebar-private-section--rest--light.json#L1)
- [notion--sidebar-sections--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/nav/notion--sidebar-sections--rest--light.json#L1)

</details>

### menu

- Spec: [docs/specs/menu.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/menu.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:31](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L31-L34)).
- Visual pass: **present** ([docs/specs/menu.md:135](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/menu.md#L135-L144)).
- Product captures: **yes**, 31 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-27** — Notion's page menu (icons, shortcuts, rules, danger row, lift). [apps/docs/src/pass-status.mjs:31](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L31-L34).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:11](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L11)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/menu.md:153](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/menu.md#L153)):

  > - Unverified: dark theme, screen-reader announcement of menu items and submenus.


<details>
<summary>31 pinned product capture files</summary>

- [chatgpt--account-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--account-menu--open--light.json#L1)
- [chatgpt--chat-actions-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--chat-actions-menu--open--light.json#L1)
- [chatgpt--composer-plus-menu--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--composer-plus-menu--open--dark.json#L1)
- [chatgpt--menu-item-danger--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--menu-item-danger--hover--light.json#L1)
- [chatgpt--menu-item-danger--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--menu-item-danger--rest--light.json#L1)
- [chatgpt--menu-item-icon--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--menu-item-icon--hover--light.json#L1)
- [chatgpt--menu-item-icon--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--menu-item-icon--rest--light.json#L1)
- [chatgpt--menu-item-keyboard--highlighted--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--menu-item-keyboard--highlighted--light.json#L1)
- [chatgpt--menu-item-selected--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--menu-item-selected--rest--light.json#L1)
- [chatgpt--menu-item-submenu--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--menu-item-submenu--rest--light.json#L1)
- [chatgpt--model-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--model-menu--open--light.json#L1)
- [chatgpt--profile-menu--hover--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--profile-menu--hover--dark.json#L1)
- [chatgpt--profile-menu--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/chatgpt--profile-menu--open--dark.json#L1)
- [figma--account-menu--hover--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/figma--account-menu--hover--dark.json#L1)
- [figma--account-menu--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/figma--account-menu--open--dark.json#L1)
- [figma--item--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/figma--item--hover--light.json#L1)
- [figma--item--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/figma--item--rest--light.json#L1)
- [figma--main-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/figma--main-menu--open--light.json#L1)
- [figma--more-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/figma--more-menu--open--light.json#L1)
- [notion--home-menu--hover--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--home-menu--hover--dark.json#L1)
- [notion--home-menu--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--home-menu--open--dark.json#L1)
- [notion--item--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--item--hover--light.json#L1)
- [notion--item-shortcut--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--item-shortcut--rest--light.json#L1)
- [notion--menu-item-icon--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--menu-item-icon--hover--light.json#L1)
- [notion--menu-item-icon--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--menu-item-icon--rest--light.json#L1)
- [notion--menu-item-keyboard--highlighted--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--menu-item-keyboard--highlighted--light.json#L1)
- [notion--menu-item-shortcut--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--menu-item-shortcut--rest--light.json#L1)
- [notion--menu-item-toggle--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--menu-item-toggle--rest--light.json#L1)
- [notion--menu-item-trash--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--menu-item-trash--rest--light.json#L1)
- [notion--page-actions-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--page-actions-menu--open--light.json#L1)
- [notion--page-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/menu/notion--page-menu--open--light.json#L1)

</details>

### tree-view

- Spec: [docs/specs/tree-view.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tree-view.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:35](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L35-L38)).
- Visual pass: **present** ([docs/specs/tree-view.md:118](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tree-view.md#L118-L129)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-27** — Notion's sidebar tree (rows, hover, row actions). [apps/docs/src/pass-status.mjs:35](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L35-L38).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:43](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L43)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/tree-view.md:143](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tree-view.md#L143-L146)):

  > - Unverified: dark theme, Notion indent and hover, Figma layers geometry (row height, 11px
  >   type, icon and control sizes: needs a capture in the editor), screen-reader behaviour of
  >   row actions. Layer-type glyphs (frame, rectangle, component, lock) are stand-ins until
  >   drawn under the icon construction rules.


<details>
<summary>3 pinned product capture files</summary>

- [figma--layer-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tree-view/figma--layer-row--rest--light.json#L1)
- [figma--layer-row--selected--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tree-view/figma--layer-row--selected--light.json#L1)
- [notion--sidebar-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tree-view/notion--sidebar-row--rest--light.json#L1)

</details>

## Batch 3 — Status messages

Batch membership: [apps/docs/src/component-status.mjs:72](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L72).

### toast

- Spec: [docs/specs/toast.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:79](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L79-L82)).
- Visual pass: **present** ([docs/specs/toast.md:107](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L107-L116)).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [shadcn--toast-error--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toast/shadcn--toast-error--open--light.json#L1); [shadcn--toast-success--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toast/shadcn--toast-success--open--light.json#L1); [shadcn--toast-title-description-action--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toast/shadcn--toast-title-description-action--open--light.json#L1).
- Side-by-side: **recorded 2026-09-27** — Notion's Link copied toast (shape, icon, action; Notion's is inverse). [apps/docs/src/pass-status.mjs:79](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L79-L82).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:11](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L11)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/toast.md:114](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L114-L115)):

  > owner's lighter-fill direction; an inverse toast remains an open option. Unverified: dark theme,
  > the action and dismiss hover on screen.

- Verbatim marker and continuation ([docs/specs/toast.md:123](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/toast.md#L123)):

  > - Unverified: dark theme, screen reader announcement timing.


<details>
<summary>1 pinned product capture files</summary>

- [notion--toast-link-copied--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/toast/notion--toast-link-copied--open--light.json#L1)

</details>

## Batch 4 — Counts and banners

Batch membership: [apps/docs/src/component-status.mjs:73](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L73).

### count

- Spec: [docs/specs/count.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/count.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:75](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L75-L78)).
- Visual pass: **present** ([docs/specs/count.md:122](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/count.md#L122-L139)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [primer--counter-label-secondary--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/count/primer--counter-label-secondary--rest--light.json#L1); [primer--underline-nav-counter--current--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/count/primer--underline-nav-counter--current--light.json#L1); [primer--underline-nav-counter--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/count/primer--underline-nav-counter--rest--light.json#L1).
- Side-by-side: **recorded 2026-09-28** — Notion's board group counts (neutral and tinted groups: size, gutter, ink, place after the label). [apps/docs/src/pass-status.mjs:75](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L75-L78).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:13](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L13)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/count.md:144](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/count.md#L144)):

  > - Unverified: dark theme, forced colours, screen-reader reading of `label`.


<details>
<summary>2 pinned product capture files</summary>

- [notion--board-group-count-neutral--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/count/notion--board-group-count-neutral--rest--light.json#L1)
- [notion--board-group-header-neutral--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/count/notion--board-group-header-neutral--rest--light.json#L1)

</details>

### alert

- Spec: [docs/specs/alert.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alert.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:39](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L39-L42)).
- Visual pass: **present** ([docs/specs/alert.md:168](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alert.md#L168-L182)).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [openai--business-banner--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/alert/openai--business-banner--rest--light.json#L1); [openai--daybreak-banner--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/alert/openai--daybreak-banner--rest--light.json#L1); [primer--banner-hidden-title-actions-dismiss--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/alert/primer--banner-hidden-title-actions-dismiss--rest--light.json#L1).
- Side-by-side: **recorded 2026-09-28** — Notion's callout block (fill, edge, icon on the first line); banner layout against OpenAI's Daybreak banner (height, corner, 16 inset, end link). [apps/docs/src/pass-status.mjs:39](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L39-L42).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:13](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L13)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/alert.md:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alert.md#L179)):

  > - Unverified: dismiss hover and focus on screen, dark theme.


<details>
<summary>1 pinned product capture files</summary>

- [notion--callout--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/alert/notion--callout--rest--light.json#L1)

</details>

## Batch 5 — Identity and status marks

Batch membership: [apps/docs/src/component-status.mjs:74](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L74).

### avatar

- Spec: [docs/specs/avatar.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/avatar.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:43](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L43-L46)).
- Visual pass: **present** ([docs/specs/avatar.md:142](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/avatar.md#L142-L186)).
- Product captures: **yes**, 9 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's file-browser avatars and Notion's person and workspace avatars (size, shape, fill, initial). [apps/docs/src/pass-status.mjs:43](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L43-L46).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:15](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L15)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/avatar.md:184](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/avatar.md#L184-L185)):

  > did not inspect screenshots. Unverified: dark theme, an active ring next to a focused
  > avatar-bearing control, a side-by-side with Figma's initials avatar.


<details>
<summary>9 pinned product capture files</summary>

- [figma--account-avatar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/figma--account-avatar--rest--light.json#L1)
- [figma--avatar-initial--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/figma--avatar-initial--rest--light.json#L1)
- [figma--file-card-avatar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/figma--file-card-avatar--rest--light.json#L1)
- [figma--team-avatar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/figma--team-avatar--rest--light.json#L1)
- [notion--avatar-person-initial--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/notion--avatar-person-initial--rest--light.json#L1)
- [notion--avatar-workspace-square--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/notion--avatar-workspace-square--rest--light.json#L1)
- [notion--share-person-avatar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/notion--share-person-avatar--rest--light.json#L1)
- [notion--share-workspace-avatar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/notion--share-workspace-avatar--rest--light.json#L1)
- [notion--workspace-avatar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/avatar/notion--workspace-avatar--rest--light.json#L1)

</details>

### indicator

- Spec: [docs/specs/indicator.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/indicator.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:47](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L47-L50)).
- Visual pass: **present** ([docs/specs/indicator.md:256](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/indicator.md#L256-L343)).
- Product captures: **yes**, 5 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [fluent--counter-medium--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/fluent--counter-medium--rest--light.json#L1); [fluent--counter-small--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/fluent--counter-small--rest--light.json#L1); [fluent--presence-available-extra-large--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/fluent--presence-available-extra-large--rest--light.json#L1); [fluent--presence-available-extra-small--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/fluent--presence-available-extra-small--rest--light.json#L1); [fluent--presence-available-large--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/fluent--presence-available-large--rest--light.json#L1); [fluent--presence-available-medium--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/fluent--presence-available-medium--rest--light.json#L1); [fluent--presence-available-small--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/fluent--presence-available-small--rest--light.json#L1); [fluent--presence-available-tiny--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/fluent--presence-available-tiny--rest--light.json#L1); [uui--avatar-offline-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/uui--avatar-offline-md--rest--light.json#L1); [uui--avatar-online-2xl--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/uui--avatar-online-2xl--rest--light.json#L1); [uui--avatar-online-lg--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/uui--avatar-online-lg--rest--light.json#L1); [uui--avatar-online-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/uui--avatar-online-md--rest--light.json#L1); [uui--avatar-online-sm--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/uui--avatar-online-sm--rest--light.json#L1); [uui--avatar-online-xl--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/uui--avatar-online-xl--rest--light.json#L1); [uui--avatar-online-xs--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/uui--avatar-online-xs--rest--light.json#L1).
- Side-by-side: **recorded 2026-09-28** — Figma's notification bell dot and Notion's help-button activity dot (size, cutout, placement). [apps/docs/src/pass-status.mjs:47](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L47-L50).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:15](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L15)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/indicator.md:351](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/indicator.md#L351-L353)):

  > - Unverified: product dark themes; Notion's inbox count and presence (not present);
  >   Figma multiplayer avatars; counts on rectangular owners in any product; cross-engine,
  >   screen-reader and forced-colors execution.


<details>
<summary>5 pinned product capture files</summary>

- [chatgpt--badge-new--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/chatgpt--badge-new--rest--light.json#L1)
- [figma--bell-unread-dot--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/figma--bell-unread-dot--rest--light.json#L1)
- [notion--board-group-count--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/notion--board-group-count--rest--light.json#L1)
- [notion--board-group-tag--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/notion--board-group-tag--rest--light.json#L1)
- [notion--help-dot--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/indicator/notion--help-dot--rest--light.json#L1)

</details>

### badge

- Spec: [docs/specs/badge.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:51](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L51-L54)).
- Visual pass: **present** ([docs/specs/badge.md:521](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge.md#L521-L543)).
- Product captures: **yes**, 14 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [uui--avatar-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--avatar-md--rest--light.json#L1); [uui--close-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--close-md--rest--light.json#L1); [uui--color-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--color-md--rest--light.json#L1); [uui--dot-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--dot-md--rest--light.json#L1); [uui--icon-leading-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--icon-leading-md--rest--light.json#L1); [uui--icon-only-sm--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--icon-only-sm--rest--light.json#L1); [uui--icon-trailing-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--icon-trailing-md--rest--light.json#L1); [uui--modern-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--modern-md--rest--light.json#L1); [uui--pill-lg--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--pill-lg--rest--light.json#L1); [uui--pill-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--pill-md--rest--light.json#L1); [uui--pill-sm--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/uui--pill-sm--rest--light.json#L1); [vscode--badge-new--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/vscode--badge-new--rest--dark.json#L1).
- Side-by-side: **recorded 2026-09-28** — Figma's AI label and Notion's select tags. [apps/docs/src/pass-status.mjs:51](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L51-L54).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:38](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L38)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/badge.md:555](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge.md#L555-L558)):

  > - Unverified: dark theme in every product (needs the owner's go-ahead to switch), Figma
  >   editor badges, hover/focus captures (no product badge is interactive), sm with icons
  >   (no composition uses it), browsers without `text-box` (they keep the previous centring
  >   and its baseline behaviour).


<details>
<summary>14 pinned product capture files</summary>

- [chatgpt--status-paid--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/chatgpt--status-paid--rest--light.json#L1)
- [figma--ai-badge--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/figma--ai-badge--rest--light.json#L1)
- [figma--label-ai--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/figma--label-ai--rest--light.json#L1)
- [figma--plan-badge--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/figma--plan-badge--rest--light.json#L1)
- [figma--plan-free-menu--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/figma--plan-free-menu--rest--dark.json#L1)
- [notion--select-brown--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--select-brown--rest--light.json#L1)
- [notion--select-red--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--select-red--rest--light.json#L1)
- [notion--status-dot--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--status-dot--rest--light.json#L1)
- [notion--status-dot-green--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--status-dot-green--rest--light.json#L1)
- [notion--status-dot-yellow--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--status-dot-yellow--rest--light.json#L1)
- [notion--tag-blue--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--tag-blue--rest--light.json#L1)
- [notion--tag-green--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--tag-green--rest--light.json#L1)
- [notion--tag-purple--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--tag-purple--rest--light.json#L1)
- [notion--tag-yellow--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge/notion--tag-yellow--rest--light.json#L1)

</details>

## Batch 6 — Loading

Batch membership: [apps/docs/src/component-status.mjs:75](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L75).

### spinner

- Spec: [docs/specs/spinner.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/spinner.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:59](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L59-L62)).
- Visual pass: **present** ([docs/specs/spinner.md:103](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/spinner.md#L103-L117)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's conversation spinner (ring, track, sizes, speed). [apps/docs/src/pass-status.mjs:59](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L59-L62).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:17](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L17)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/spinner.md:116](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/spinner.md#L116)):

  > Nothing in Notion or Figma to compare. Unverified: dark theme, forced colours.


<details>
<summary>3 pinned product capture files</summary>

- [chatgpt--spinner-18x18--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/spinner/chatgpt--spinner-18x18--loading--light.json#L1)
- [chatgpt--spinner-24x24--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/spinner/chatgpt--spinner-24x24--loading--light.json#L1)
- [chatgpt--spinner-28x28--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/spinner/chatgpt--spinner-28x28--loading--light.json#L1)

</details>

### skeleton

- Spec: [docs/specs/skeleton.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/skeleton.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:55](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L55-L58)).
- Visual pass: **present** ([docs/specs/skeleton.md:125](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/skeleton.md#L125-L149)).
- Product captures: **yes**, 6 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's results shimmer, Figma's tab shimmer and Notion's startup placeholders (fill, band, speed, shape). [apps/docs/src/pass-status.mjs:55](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L55-L58).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:17](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L17)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/skeleton.md:148](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/skeleton.md#L148)):

  > Unverified: dark theme, the card tile's media corners at the new Card radius on screen.


<details>
<summary>6 pinned product capture files</summary>

- [chatgpt--skeleton-168x16--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/skeleton/chatgpt--skeleton-168x16--loading--light.json#L1)
- [chatgpt--skeleton-205x16--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/skeleton/chatgpt--skeleton-205x16--loading--light.json#L1)
- [figma--skeleton-tab--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/skeleton/figma--skeleton-tab--loading--light.json#L1)
- [notion--skeleton-group--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/skeleton/notion--skeleton-group--loading--light.json#L1)
- [notion--skeleton-icon--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/skeleton/notion--skeleton-icon--loading--light.json#L1)
- [notion--skeleton-text--loading--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/skeleton/notion--skeleton-text--loading--light.json#L1)

</details>

### progress

- Spec: [docs/specs/progress.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/progress.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:63](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L63-L66)).
- Visual pass: **present** ([docs/specs/progress.md:112](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/progress.md#L112-L134)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's AI-credits usage meter (height, shape, track, neutral fill). [apps/docs/src/pass-status.mjs:63](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L63-L66).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:42](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L42)).
- Phase position: **all four recorded; officially complete by these gates**.
- `Unverified:`: not found (case-insensitive search of the entire linked spec).

<details>
<summary>3 pinned product capture files</summary>

- [figma--usage-bar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/progress/figma--usage-bar--rest--light.json#L1)
- [figma--usage-meter-ai-credits--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/progress/figma--usage-meter-ai-credits--rest--light.json#L1)
- [figma--usage-meter-card--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/progress/figma--usage-meter-card--rest--light.json#L1)

</details>

## Batch 7 — Date and floating surface

Batch membership: [apps/docs/src/component-status.mjs:76](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L76).

### calendar

- Spec: [docs/specs/calendar.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:67](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L67-L70)).
- Visual pass: **present** ([docs/specs/calendar.md:180](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L180-L209)).
- Product captures: **yes**, 7 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Notion's search Date filter calendar (surface, month label, cells, weeks, today, outside days). [apps/docs/src/pass-status.mjs:67](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L67-L70).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:19](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L19)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/calendar.md:216](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/calendar.md#L216-L217)):

  > - Unverified: screen readers, dark theme, RTL, Firefox/Safari, touch; hover preview was
  >   exercised only with synthetic events.


<details>
<summary>7 pinned product capture files</summary>

- [notion--day--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/calendar/notion--day--hover--light.json#L1)
- [notion--day-today--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/calendar/notion--day-today--rest--light.json#L1)
- [notion--nav-button--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/calendar/notion--nav-button--hover--light.json#L1)
- [notion--range--selected--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/calendar/notion--range--selected--light.json#L1)
- [notion--range-start--selected--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/calendar/notion--range-start--selected--light.json#L1)
- [notion--search-date-filter--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/calendar/notion--search-date-filter--rest--light.json#L1)
- [notion--search-date-filter-popover--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/calendar/notion--search-date-filter-popover--rest--light.json#L1)

</details>

### popover

- Spec: [docs/specs/popover.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/popover.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:71](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L71-L74)).
- Visual pass: **present** ([docs/specs/popover.md:127](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/popover.md#L127-L134)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [primer--dialog-header--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/popover/primer--dialog-header--open--light.json#L1); [shadcn--dialog-header--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/popover/shadcn--dialog-header--open--light.json#L1); [shadcn--popover--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/popover/shadcn--popover--open--light.json#L1).
- Side-by-side: **recorded 2026-09-28** — Notion's Share popover (surface, ring, lift, corner). [apps/docs/src/pass-status.mjs:71](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L71-L74).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:42](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L42)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/popover.md:139](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/popover.md#L139-L140)):

  > - Unverified: dark theme, screen reader announcement of the dialog, arrow alignment when the
  >   anchored popover shifts to stay in view.


<details>
<summary>2 pinned product capture files</summary>

- [chatgpt--model-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/popover/chatgpt--model-menu--open--light.json#L1)
- [notion--share-popover--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/popover/notion--share-popover--open--light.json#L1)

</details>

## Batch 8 — Inspector fields

Batch membership: [apps/docs/src/component-status.mjs:77](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L77).

### panel

- Spec: [docs/specs/panel.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/panel.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:87](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L87-L90)).
- Visual pass: **present** ([docs/specs/panel.md:168](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/panel.md#L168-L194)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's Design panel (section header, label and field rows, rules, row action column). [apps/docs/src/pass-status.mjs:87](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L87-L90).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:21](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L21)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/panel.md:193](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/panel.md#L193)):

  > Unverified: dark theme and a side-by-side with Figma's inspector at the same zoom.


<details>
<summary>3 pinned product capture files</summary>

- [figma--section-auto-layout--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/panel/figma--section-auto-layout--rest--light.json#L1)
- [figma--section-header--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/panel/figma--section-header--rest--light.json#L1)
- [figma--section-title--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/panel/figma--section-title--rest--light.json#L1)

</details>

### number-field

- Spec: [docs/specs/number-field.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/number-field.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:91](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L91-L94)).
- Visual pass: **present** ([docs/specs/number-field.md:130](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/number-field.md#L130-L145)).
- Product captures: **yes**, 11 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's Design panel fields (X / Y letters, W / H with a menu, Rotation, Gap). [apps/docs/src/pass-status.mjs:91](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L91-L94).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:42](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L42)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/number-field.md:152](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/number-field.md#L152)):

  > - Unverified: dark theme; Safari and Firefox without `field-sizing`.


<details>
<summary>11 pinned product capture files</summary>

- [figma--appearance-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--appearance-row--rest--light.json#L1)
- [figma--gap-field--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--gap-field--rest--light.json#L1)
- [figma--number-field--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--number-field--rest--light.json#L1)
- [figma--number-field-icon--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--number-field-icon--rest--light.json#L1)
- [figma--number-field-letter--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--number-field-letter--rest--light.json#L1)
- [figma--number-field-menu--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--number-field-menu--rest--light.json#L1)
- [figma--opacity--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--opacity--rest--light.json#L1)
- [figma--rotation--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--rotation--rest--light.json#L1)
- [figma--width--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--width--hover--light.json#L1)
- [figma--width--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--width--rest--light.json#L1)
- [figma--x-position--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/number-field/figma--x-position--rest--light.json#L1)

</details>

### box-field

- Spec: [docs/specs/box-field.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/box-field.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:95](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L95-L98)).
- Visual pass: **present** ([docs/specs/box-field.md:100](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/box-field.md#L100-L114)).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's Padding and Corner radius rows (paired fields, per-side toggle on the action column). [apps/docs/src/pass-status.mjs:95](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L95-L98).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:38](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L38)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/box-field.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/box-field.md#L124-L125)):

  > - Unverified: dark theme; screen reader output; RTL (left/right are physical here, as padding
  >   values are); Figma's split layouts (needs opening the panels in the owner's file).


<details>
<summary>1 pinned product capture files</summary>

- [figma--corner-radius-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/box-field/figma--corner-radius-row--rest--light.json#L1)

</details>

## Batch 9 — Fills

Batch membership: [apps/docs/src/component-status.mjs:78](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L78).

### property-list

- Spec: [docs/specs/property-list.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/property-list.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:99](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L99-L102)).
- Visual pass: **present** ([docs/specs/property-list.md:42](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/property-list.md#L42-L52)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's Fill and Effects rows (hex and opacity, effect type, row actions); owner screenshots. [apps/docs/src/pass-status.mjs:99](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L99-L102).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:42](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L42)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/property-list.md:60](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/property-list.md#L60)):

  > Unverified: touch drag on a device; screen reader output of the live region; dark theme.


<details>
<summary>2 pinned product capture files</summary>

- [figma--fill-row-image--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/property-list/figma--fill-row-image--rest--light.json#L1)
- [figma--fill-section--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/property-list/figma--fill-section--rest--light.json#L1)

</details>

### color-field

- Spec: [docs/specs/color-field.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-field.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:103](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L103-L106)).
- Visual pass: **present** ([docs/specs/color-field.md:123](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-field.md#L123-L135)).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's Page colour row (hex, opacity anchored with % at the end). [apps/docs/src/pass-status.mjs:103](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L103-L106).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:40](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L40)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/color-field.md:134](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-field.md#L134)):

  > Unverified: Figma side by side at the same zoom, dark theme.


<details>
<summary>1 pinned product capture files</summary>

- [chatgpt--color-field-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-field/chatgpt--color-field-row--rest--light.json#L1)

</details>

### color-swatch

- Spec: [docs/specs/color-swatch.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:107](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L107-L110)).
- Visual pass: **present** ([docs/specs/color-swatch.md:96](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch.md#L96-L106)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — The swatch in Figma's Page colour row (leading slot, hairline edge). [apps/docs/src/pass-status.mjs:107](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L107-L110).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:40](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L40)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/color-swatch.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch.md#L104-L105)):

  > The gallery shows ColorSwatch's tiles in named groups. Unverified: Figma side by side, dark
  > theme, forced colours.


<details>
<summary>2 pinned product capture files</summary>

- [figma--fill-swatch-image--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-swatch/figma--fill-swatch-image--rest--light.json#L1)
- [figma--library-swatch--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-swatch/figma--library-swatch--rest--light.json#L1)

</details>

## Batch 10 — Pickers

Batch membership: [apps/docs/src/component-status.mjs:79](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L79).

### color-swatch-picker

- Spec: [docs/specs/color-swatch-picker.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch-picker.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:115](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L115-L118)).
- Visual pass: **present** ([docs/specs/color-swatch-picker.md:130](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch-picker.md#L130-L143)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's On this page swatch grid (chit size, cell, corner, light-chit edge). [apps/docs/src/pass-status.mjs:115](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L115-L118).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:40](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L40)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/color-swatch-picker.md:141](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-swatch-picker.md#L141-L142)):

  > the sizes each have a tile. Unverified: Figma side by side, dark theme, a selected
  > Figma chit.


<details>
<summary>2 pinned product capture files</summary>

- [figma--library-swatch-grid--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-swatch-picker/figma--library-swatch-grid--rest--light.json#L1)
- [figma--library-swatch-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-swatch-picker/figma--library-swatch-row--rest--light.json#L1)

</details>

### color-picker

- Spec: [docs/specs/color-picker.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-picker.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:111](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L111-L114)).
- Visual pass: **present** ([docs/specs/color-picker.md:194](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-picker.md#L194-L224)).
- Product captures: **yes**, 11 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's colour picker from the Page colour row (area, tracks, value row, swatches). [apps/docs/src/pass-status.mjs:111](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L111-L114).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:40](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L40)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/color-picker.md:230](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/color-picker.md#L230)):

  > - Unverified: dark theme, screen readers, Firefox and Safari (no EyeDropper there), touch.


<details>
<summary>11 pinned product capture files</summary>

- [figma--area--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--area--rest--light.json#L1)
- [figma--eyedropper--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--eyedropper--hover--light.json#L1)
- [figma--eyedropper-and-sliders--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--eyedropper-and-sliders--rest--light.json#L1)
- [figma--fill-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--fill-row--rest--light.json#L1)
- [figma--format-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--format-menu--open--light.json#L1)
- [figma--format-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--format-row--rest--light.json#L1)
- [figma--hue-slider--focus-visible--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--hue-slider--focus-visible--light.json#L1)
- [figma--paint-type-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--paint-type-row--rest--light.json#L1)
- [figma--solid-layer-fill--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--solid-layer-fill--rest--light.json#L1)
- [figma--solid-page-background--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--solid-page-background--rest--light.json#L1)
- [figma--swatches--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/color-picker/figma--swatches--rest--light.json#L1)

</details>

### alignment-picker

- Spec: [docs/specs/alignment-picker.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:119](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L119-L122)).
- Visual pass: **present** ([docs/specs/alignment-picker.md:142](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L142-L157)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's auto-layout Alignment grid (ground, dots, selected bars). [apps/docs/src/pass-status.mjs:119](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L119-L122).
- Owner approval: **no — in review** ([apps/docs/src/component-status.mjs:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L48)).
- Phase position: **phases 1–3 recorded; awaiting owner approval**.
- Freshness: reopened 2026-10-04 after responsive grid / hover-preview changes; validation remains 2026-09-28. The spec’s later implementation notes must be included in the owner review. [apps/docs/src/component-status.mjs:46](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L46-L48) [docs/specs/alignment-picker.md:172](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L172-L207)
- Verbatim marker and continuation ([docs/specs/alignment-picker.md:170](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L170)):

  > Unverified: Figma's focus state (rest and hover captured 2026-10-04).

- Verbatim marker and continuation ([docs/specs/alignment-picker.md:194](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/alignment-picker.md#L194-L195)):

  >   for review (`component-status.mjs`). Unverified: Figma's grid size, padding, hover ink and plate,
  >   pending a live capture in Claude in Chrome.


<details>
<summary>3 pinned product capture files</summary>

- [figma--alignment-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/alignment-picker/figma--alignment-row--rest--light.json#L1)
- [figma--auto-layout-alignment--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/alignment-picker/figma--auto-layout-alignment--hover--light.json#L1)
- [figma--auto-layout-alignment--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/alignment-picker/figma--auto-layout-alignment--rest--light.json#L1)

</details>

## Batch 11 — Buttons

Batch membership: [apps/docs/src/component-status.mjs:80](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L80).

### button

- Spec: [docs/specs/button.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:123](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L123-L126)).
- Visual pass: **present** ([docs/specs/button.md:269](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button.md#L269-L279)).
- Product captures: **yes**, 49 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [chatgpt-loggedout--icon-ghost-round--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--icon-ghost-round--hover--light.json#L1); [chatgpt-loggedout--icon-ghost-round--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--icon-ghost-round--rest--light.json#L1); [chatgpt-loggedout--icon-ghost-square--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--icon-ghost-square--hover--light.json#L1); [chatgpt-loggedout--icon-ghost-square--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--icon-ghost-square--rest--light.json#L1); [chatgpt-loggedout--icon-solid-round--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--icon-solid-round--rest--light.json#L1); [chatgpt-loggedout--outline--focus-visible--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--outline--focus-visible--light.json#L1); [chatgpt-loggedout--outline--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--outline--hover--light.json#L1); [chatgpt-loggedout--outline--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--outline--rest--light.json#L1); [chatgpt-loggedout--solid--focus-visible--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--solid--focus-visible--light.json#L1); [chatgpt-loggedout--solid--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--solid--hover--light.json#L1); [chatgpt-loggedout--solid--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--solid--rest--light.json#L1); [chatgpt-loggedout--suggestion-outline--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--suggestion-outline--hover--light.json#L1); [chatgpt-loggedout--suggestion-outline--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt-loggedout--suggestion-outline--rest--light.json#L1); [uui--primary-icon-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--primary-icon-md--rest--light.json#L1); [uui--primary-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--primary-md--rest--light.json#L1); [uui--primary-sm--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--primary-sm--rest--light.json#L1); [uui--secondary-icon-sm--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--secondary-icon-sm--rest--light.json#L1); [uui--secondary-md--focus-visible--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--secondary-md--focus-visible--light.json#L1); [uui--secondary-md--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--secondary-md--hover--light.json#L1); [uui--secondary-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--secondary-md--rest--light.json#L1); [uui--secondary-sm--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--secondary-sm--rest--light.json#L1); [uui--tertiary-md--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/uui--tertiary-md--rest--light.json#L1); [vscode--button--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/vscode--button--rest--dark.json#L1).
- Side-by-side: **recorded 2026-09-28** — Figma's Share (32, corner 5, 12 inset), Notion's Share popover buttons and ChatGPT's solid and outline pills (height, inset, weight, no shadow). [apps/docs/src/pass-status.mjs:123](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L123-L126).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:39](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L39)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/button.md:292](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button.md#L292-L293)):

  > - Unverified: dark theme (products not switched), Figma hover, disabled/loading/selected against references, compact density
  >   (the gap follows density since audit S14; compact sm is 4).


<details>
<summary>49 pinned product capture files</summary>

- [chatgpt--icon-ghost-32--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-ghost-32--hover--light.json#L1)
- [chatgpt--icon-ghost-32--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-ghost-32--rest--light.json#L1)
- [chatgpt--icon-ghost-round--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-ghost-round--hover--light.json#L1)
- [chatgpt--icon-ghost-round--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-ghost-round--rest--light.json#L1)
- [chatgpt--icon-ghost-round-dictate--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-ghost-round-dictate--rest--light.json#L1)
- [chatgpt--icon-ghost-square--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-ghost-square--hover--light.json#L1)
- [chatgpt--icon-ghost-square--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-ghost-square--rest--light.json#L1)
- [chatgpt--icon-ghost-square-header--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-ghost-square-header--rest--light.json#L1)
- [chatgpt--icon-label-ghost--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-label-ghost--hover--light.json#L1)
- [chatgpt--icon-label-ghost--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-label-ghost--rest--light.json#L1)
- [chatgpt--icon-solid-round--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-solid-round--hover--light.json#L1)
- [chatgpt--icon-solid-round--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--icon-solid-round--rest--light.json#L1)
- [chatgpt--picker-ghost--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--picker-ghost--hover--light.json#L1)
- [chatgpt--picker-ghost--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--picker-ghost--rest--light.json#L1)
- [chatgpt--soft-danger--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--soft-danger--hover--light.json#L1)
- [chatgpt--soft-danger--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--soft-danger--rest--light.json#L1)
- [chatgpt--soft-secondary--focus-visible--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--soft-secondary--focus-visible--light.json#L1)
- [chatgpt--soft-secondary--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--soft-secondary--hover--light.json#L1)
- [chatgpt--soft-secondary--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/chatgpt--soft-secondary--rest--light.json#L1)
- [figma--icon-button--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--icon-button--hover--light.json#L1)
- [figma--icon-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--icon-button--rest--light.json#L1)
- [figma--icon-ghost-24--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--icon-ghost-24--rest--light.json#L1)
- [figma--icon-ghost-32--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--icon-ghost-32--rest--light.json#L1)
- [figma--pill-soft--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--pill-soft--rest--light.json#L1)
- [figma--primary-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--primary-button--rest--light.json#L1)
- [figma--product-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--product-button--rest--light.json#L1)
- [figma--secondary-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--secondary-button--rest--light.json#L1)
- [figma--share-solid--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--share-solid--rest--light.json#L1)
- [figma--tab--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--tab--rest--light.json#L1)
- [figma--tab-selected--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/figma--tab-selected--rest--light.json#L1)
- [notion--icon-button--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--icon-button--hover--light.json#L1)
- [notion--icon-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--icon-button--rest--light.json#L1)
- [notion--icon-ghost--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--icon-ghost--hover--light.json#L1)
- [notion--icon-ghost--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--icon-ghost--rest--light.json#L1)
- [notion--icon-ghost-sidebar--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--icon-ghost-sidebar--hover--light.json#L1)
- [notion--icon-ghost-sidebar--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--icon-ghost-sidebar--rest--light.json#L1)
- [notion--icon-label-ghost--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--icon-label-ghost--hover--light.json#L1)
- [notion--icon-label-ghost--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--icon-label-ghost--rest--light.json#L1)
- [notion--outline--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--outline--hover--light.json#L1)
- [notion--outline--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--outline--rest--light.json#L1)
- [notion--outline-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--outline-button--rest--light.json#L1)
- [notion--primary-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--primary-button--rest--light.json#L1)
- [notion--solid-accent--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--solid-accent--hover--light.json#L1)
- [notion--solid-accent--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--solid-accent--rest--light.json#L1)
- [notion--text-button--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--text-button--hover--light.json#L1)
- [notion--text-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--text-button--rest--light.json#L1)
- [notion--text-ghost--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--text-ghost--hover--light.json#L1)
- [notion--text-ghost--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--text-ghost--rest--light.json#L1)
- [notion--toolbar-icon--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button/notion--toolbar-icon--rest--light.json#L1)

</details>

### button-group

- Spec: [docs/specs/button-group.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button-group.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:127](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L127-L130)).
- Visual pass: **present** ([docs/specs/button-group.md:56](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button-group.md#L56-L64)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [shadcn--group-dropdown-outline--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button-group/shadcn--group-dropdown-outline--rest--light.json#L1); [shadcn--group-md-outline--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button-group/shadcn--group-md-outline--rest--light.json#L1).
- Side-by-side: **recorded 2026-09-28** — Figma's Present / Prototype view pair (outer corners only, square inner edges) and Notion's split divider. [apps/docs/src/pass-status.mjs:127](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L127-L130).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:39](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L39)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/button-group.md:69](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/button-group.md#L69)):

  > - Unverified: dark theme, focus ring over the divider in every size.


<details>
<summary>3 pinned product capture files</summary>

- [figma--align-group--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button-group/figma--align-group--rest--light.json#L1)
- [figma--present-split-group--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button-group/figma--present-split-group--rest--light.json#L1)
- [notion--split-button--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/button-group/notion--split-button--rest--light.json#L1)

</details>

### kbd

- Spec: [docs/specs/kbd.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/kbd.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L131-L134)).
- Visual pass: **present** ([docs/specs/kbd.md:141](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/kbd.md#L141-L149)).
- Product captures: **yes**, 4 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [vscode--keybinding--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/kbd/vscode--keybinding--rest--dark.json#L1).
- Side-by-side: **recorded 2026-09-28** — Notion's search ⌘K hint, ChatGPT's tooltip chip and Figma's keyboard-shortcuts panel keys (fill, edge, corner, nesting). [apps/docs/src/pass-status.mjs:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L131-L134).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:23](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L23)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/kbd.md:162](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/kbd.md#L162)):

  > [the audit](../research/cohesion-audit.md#verification). Unverified: dark theme, screen readers.


<details>
<summary>4 pinned product capture files</summary>

- [chatgpt--shortcut-chip--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/kbd/chatgpt--shortcut-chip--rest--light.json#L1)
- [figma--shortcut-panel-binding--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/kbd/figma--shortcut-panel-binding--rest--dark.json#L1)
- [figma--shortcut-panel-key--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/kbd/figma--shortcut-panel-key--rest--dark.json#L1)
- [notion--shortcut-hint--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/kbd/notion--shortcut-hint--rest--light.json#L1)

</details>

## Batch 12 — Text entry

Batch membership: [apps/docs/src/component-status.mjs:81](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L81).

### input

- Spec: [docs/specs/input.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:135](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L135-L138)).
- Visual pass: **present** ([docs/specs/input.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input.md#L145-L158)).
- Product captures: **yes**, 5 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [vscode--settings-input--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input/vscode--settings-input--rest--dark.json#L1).
- Side-by-side: **recorded 2026-09-28** — Notion's sidebar search field (with its ⌘K hint) and Share invite field, Figma's file-browser search (height, corner, edge, fill, text inset). [apps/docs/src/pass-status.mjs:135](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L135-L138).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:25](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L25)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/input.md:156](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input.md#L156-L157)):

  > resting shadow. Unverified: hover and focus in the products (Chrome was a background window),
  > dark theme.


<details>
<summary>5 pinned product capture files</summary>

- [figma--search-field--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input/figma--search-field--rest--light.json#L1)
- [notion--field--focus--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input/notion--field--focus--light.json#L1)
- [notion--invite-field--focus--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input/notion--invite-field--focus--light.json#L1)
- [notion--menu-search--focus--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input/notion--menu-search--focus--light.json#L1)
- [notion--search-field-kbd--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input/notion--search-field-kbd--rest--light.json#L1)

</details>

### input-group

- Spec: [docs/specs/input-group.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input-group.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:139](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L139-L142)).
- Visual pass: **present** ([docs/specs/input-group.md:135](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input-group.md#L135-L153)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Notion's Share invite row (field and button) and Figma's design-panel icon and colour fields. [apps/docs/src/pass-status.mjs:139](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L139-L142).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:41](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L41)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/input-group.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/input-group.md#L145-L146)):

  > second pass. Unverified: Figma side by side at one zoom, dark theme, a
  > disabled group, a group with one of two children disabled (the whole group paints disabled).


<details>
<summary>3 pinned product capture files</summary>

- [figma--color-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input-group/figma--color-row--rest--light.json#L1)
- [figma--icon-field--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input-group/figma--icon-field--rest--light.json#L1)
- [notion--invite-row--focus--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/input-group/notion--invite-row--focus--light.json#L1)

</details>

### textarea

- Spec: [docs/specs/textarea.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/textarea.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:143](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L143-L146)).
- Visual pass: **present** ([docs/specs/textarea.md:120](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/textarea.md#L120-L132)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's settings multiline fields (insets, corner, edge, no shadow). [apps/docs/src/pass-status.mjs:143](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L143-L146).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:25](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L25)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/textarea.md:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/textarea.md#L131)):

  > 82 at three rows). Unverified: dark theme.


<details>
<summary>2 pinned product capture files</summary>

- [chatgpt--textarea--focus--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/textarea/chatgpt--textarea--focus--light.json#L1)
- [chatgpt--textarea-short--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/textarea/chatgpt--textarea-short--rest--light.json#L1)

</details>

## Batch 13 — Choosing from a list

Batch membership: [apps/docs/src/component-status.mjs:82](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L82).

### select

- Spec: [docs/specs/select.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/select.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:147](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L147-L150)).
- Visual pass: **present** ([docs/specs/select.md:148](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/select.md#L148-L168)).
- Product captures: **yes**, 6 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's settings dropdown (read live), Figma's zoom, size and filter selects, Notion's inline select (height, fill, edge, chevron place). [apps/docs/src/pass-status.mjs:147](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L147-L150).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:42](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L42)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/select.md:159](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/select.md#L159-L160)):

  > and checked fill appear only with the picker open in a supporting browser. Unverified: the
  > open picker on screen, a Notion or Figma picker side by side, dark theme.


<details>
<summary>6 pinned product capture files</summary>

- [chatgpt--settings-select--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/select/chatgpt--settings-select--hover--light.json#L1)
- [chatgpt--settings-select--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/select/chatgpt--settings-select--rest--light.json#L1)
- [figma--filter-select--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/select/figma--filter-select--rest--light.json#L1)
- [figma--size-select--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/select/figma--size-select--rest--light.json#L1)
- [figma--zoom-select--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/select/figma--zoom-select--rest--light.json#L1)
- [notion--inline-select--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/select/notion--inline-select--rest--light.json#L1)

</details>

### combobox

- Spec: [docs/specs/combobox.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:151](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L151-L154)).
- Visual pass: **present** ([docs/specs/combobox.md:68](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L68-L80)).
- Product captures: **yes**, 4 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's font-family trigger, font-size combobox and open font picker (row, text, chevron place). [apps/docs/src/pass-status.mjs:151](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L151-L154).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:29](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L29)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/combobox.md:79](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L79)):

  > field), matched to Notion's menu when Menu was approved. No change. Unverified: dark theme.

- Verbatim marker and continuation ([docs/specs/combobox.md:89](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/combobox.md#L89)):

  > - Unverified: dark theme, screen reader announcements, IME composition, RTL.


<details>
<summary>4 pinned product capture files</summary>

- [chatgpt--settings-select-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/combobox/chatgpt--settings-select-menu--open--light.json#L1)
- [figma--font-family-trigger--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/combobox/figma--font-family-trigger--rest--light.json#L1)
- [figma--font-picker--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/combobox/figma--font-picker--open--light.json#L1)
- [figma--font-size-combobox--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/combobox/figma--font-size-combobox--rest--light.json#L1)

</details>

### custom-select

- Spec: [docs/specs/custom-select.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/custom-select.md#L1).
- Audited spec: **not found**. Spec exists, but no family audit attestation in the [pass registry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1) or [cohesion audit](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L1); inherited rules/test results in the spec do not establish this gate.
- Visual pass: **present** ([docs/specs/custom-select.md:188](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/custom-select.md#L188-L196)).
- Product captures: **yes**, 6 tracked files (pinned inventory below).
- Side-by-side: no [validation entry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1). Spec compares against captures and explicitly says “not yet a side-by-side screenshot”; **not completed in the written record**. [docs/specs/custom-select.md:188](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/custom-select.md#L188-L196).
- Owner approval: **no — in review** ([apps/docs/src/component-status.mjs:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L48)).
- Phase position: **evidence phases incomplete; awaiting owner approval**.
- Verbatim marker and continuation ([docs/specs/custom-select.md:209](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/custom-select.md#L209-L210)):

  > moves, Escape closes and keeps focus), groups, ghost open in dark. Unverified: screen reader
  > announcement, RTL, forced colours, Figma side by side.


<details>
<summary>6 pinned product capture files</summary>

- [notion--general-access-trigger--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/custom-select/notion--general-access-trigger--rest--light.json#L1)
- [notion--member-access-menu--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/custom-select/notion--member-access-menu--hover--light.json#L1)
- [notion--member-access-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/custom-select/notion--member-access-menu--open--light.json#L1)
- [notion--member-access-trigger--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/custom-select/notion--member-access-trigger--rest--light.json#L1)
- [notion--share-general-access--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/custom-select/notion--share-general-access--hover--light.json#L1)
- [notion--share-general-access--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/custom-select/notion--share-general-access--open--light.json#L1)

</details>

### tag

- Spec: [docs/specs/tag.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag.md#L1).
- Audited spec: **not found**. Spec exists, but no family audit attestation in the [pass registry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1) or [cohesion audit](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L1); inherited rules/test results in the spec do not establish this gate.
- Visual pass: **present** ([docs/specs/tag.md:68](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag.md#L68-L75)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: no [validation entry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1). Spec describes a live Notion/Area side-by-side on 2026-10-06; **documented in spec, not registered**. [docs/specs/tag.md:68](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag.md#L68-L75).
- Owner approval: **no — in review** ([apps/docs/src/component-status.mjs:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L48)).
- Phase position: **evidence phases incomplete; awaiting owner approval**.
- Verbatim marker and continuation ([docs/specs/tag.md:78](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag.md#L78)):

  > Build, parity, typecheck pass; captures pass the checksum. Unverified: dark against Notion, screen reader.


<details>
<summary>2 pinned product capture files</summary>

- [notion--tag-removable--dismiss-hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tag/notion--tag-removable--dismiss-hover--light.json#L1)
- [notion--tag-removable--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tag/notion--tag-removable--rest--light.json#L1)

</details>

### tag-picker

- Spec: [docs/specs/tag-picker.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag-picker.md#L1).
- Audited spec: **not found**. Spec exists, but no family audit attestation in the [pass registry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1) or [cohesion audit](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L1); inherited rules/test results in the spec do not establish this gate.
- Visual pass: **not found** (entire [spec](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag-picker.md#L1) searched for the named heading).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: no [validation entry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1). Spec has product measurements and Area anatomy; an explicit live side-by-side claim is **not found**. [docs/specs/tag-picker.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag-picker.md#L1-L130).
- Owner approval: **no — in review** ([apps/docs/src/component-status.mjs:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L48)).
- Phase position: **evidence phases incomplete; awaiting owner approval**.
- Verbatim marker and continuation ([docs/specs/tag-picker.md:117](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tag-picker.md#L117)):

  > removed"; chosen rows show the check. Dark and compact checked on the Review page 2026-10-06 (compact field 28). Unverified: screen reader, RTL.


<details>
<summary>2 pinned product capture files</summary>

- [notion--select-property-editor--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tag-picker/notion--select-property-editor--hover--light.json#L1)
- [notion--select-property-editor--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tag-picker/notion--select-property-editor--open--light.json#L1)

</details>

### date-picker

- Spec: [docs/specs/date-picker.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/date-picker.md#L1).
- Audited spec: **not found**. Spec exists, but no family audit attestation in the [pass registry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1) or [cohesion audit](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L1); inherited rules/test results in the spec do not establish this gate.
- Visual pass: **not found** (entire [spec](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/date-picker.md#L1) searched for the named heading).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Side-by-side: no [validation entry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1). Spec has product measurements and Area anatomy; an explicit live side-by-side claim is **not found**. [docs/specs/date-picker.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/date-picker.md#L1-L119).
- Owner approval: **no — in review** ([apps/docs/src/component-status.mjs:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L48)).
- Phase position: **evidence phases incomplete; awaiting owner approval**.
- Verbatim marker and continuation ([docs/specs/date-picker.md:107](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/date-picker.md#L107)):

  > invalid edge. Dark (panel and calendar) and compact (field 28) checked 2026-10-06. Unverified: screen reader, RTL, Figma comparison.


<details>
<summary>1 pinned product capture files</summary>

- [notion--date-property-editor--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/date-picker/notion--date-property-editor--open--light.json#L1)

</details>

### field

- Spec: [docs/specs/field.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/field.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:155](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L155-L158)).
- Visual pass: **present** ([docs/specs/field.md:132](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/field.md#L132-L141)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's settings row (read live) and stacked field (label, description, gaps). [apps/docs/src/pass-status.mjs:155](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L155-L158).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:41](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L41)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/field.md:135](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/field.md#L135)):

  > Unverified: dark theme.


<details>
<summary>3 pinned product capture files</summary>

- [chatgpt--field-stacked--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/field/chatgpt--field-stacked--rest--light.json#L1)
- [chatgpt--settings-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/field/chatgpt--settings-row--rest--light.json#L1)
- [figma--dimensions-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/field/figma--dimensions-row--rest--light.json#L1)

</details>

## Batch 14 — Choice controls

Batch membership: [apps/docs/src/component-status.mjs:83](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L83).

### checkbox

- Spec: [docs/specs/checkbox.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/checkbox.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:159](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L159-L162)).
- Visual pass: **present** ([docs/specs/checkbox.md:144](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/checkbox.md#L144-L154)).
- Product captures: **yes**, 4 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [shadcn--choice-card-radio-0--checked--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/checkbox/shadcn--choice-card-radio-0--checked--light.json#L1); [shadcn--choice-card-radio-1--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/checkbox/shadcn--choice-card-radio-1--rest--light.json#L1); [vscode--settings-checkbox--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/checkbox/vscode--settings-checkbox--rest--dark.json#L1).
- Side-by-side: **recorded 2026-09-28** — Notion's and Figma's 16px checkboxes (size, corner, edge, checked face, label alignment). [apps/docs/src/pass-status.mjs:159](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L159-L162).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:27](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L27)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/checkbox.md:153](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/checkbox.md#L153)):

  > Unverified: dark theme, hover and focus in a product.


<details>
<summary>4 pinned product capture files</summary>

- [figma--checkbox-checked--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/checkbox/figma--checkbox-checked--rest--light.json#L1)
- [figma--clip-content--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/checkbox/figma--clip-content--rest--light.json#L1)
- [notion--checkbox--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/checkbox/notion--checkbox--rest--light.json#L1)
- [notion--checkbox-checked--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/checkbox/notion--checkbox-checked--rest--light.json#L1)

</details>

### radio

- Spec: [docs/specs/radio.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/radio.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:163](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L163-L166)).
- Visual pass: **present** ([docs/specs/radio.md:118](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/radio.md#L118-L127)).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — No product radio exists; ChatGPT's mode radio cards and Checkbox's product evidence (control, label alignment). [apps/docs/src/pass-status.mjs:163](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L163-L166).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:27](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L27)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/radio.md:126](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/radio.md#L126)):

  > Unverified: dark theme, hover and focus in a product.


<details>
<summary>1 pinned product capture files</summary>

- [chatgpt--mode-radio-cards--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/radio/chatgpt--mode-radio-cards--rest--light.json#L1)

</details>

### switch

- Spec: [docs/specs/switch.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/switch.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:167](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L167-L170)).
- Visual pass: **present** ([docs/specs/switch.md:150](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/switch.md#L150-L164)).
- Product captures: **yes**, 6 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's settings switches off and on, rest and hover, and Notion's page-menu toggle (track, thumb, off fill). [apps/docs/src/pass-status.mjs:167](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L167-L170).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:27](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L27)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/switch.md:163](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/switch.md#L163)):

  > #c5), edge equal to the fill so none shows. Unverified: dark theme.


<details>
<summary>6 pinned product capture files</summary>

- [chatgpt--switch-off--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/switch/chatgpt--switch-off--hover--light.json#L1)
- [chatgpt--switch-off--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/switch/chatgpt--switch-off--rest--light.json#L1)
- [chatgpt--switch-on--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/switch/chatgpt--switch-on--hover--light.json#L1)
- [chatgpt--switch-on--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/switch/chatgpt--switch-on--rest--light.json#L1)
- [notion--menu-switch-off--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/switch/notion--menu-switch-off--rest--light.json#L1)
- [notion--switch-off--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/switch/notion--switch-off--rest--light.json#L1)

</details>

## Batch 15 — Values and tags

Batch membership: [apps/docs/src/component-status.mjs:84](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L84).

### slider

- Spec: [docs/specs/slider.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/slider.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:171](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L171-L174)).
- Visual pass: **present** ([docs/specs/slider.md:157](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/slider.md#L157-L170)).
- Product captures: **yes**, 4 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Figma's colour-picker sliders (reopened) and adjustment slider (rail, thumb, hit row). [apps/docs/src/pass-status.mjs:171](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L171-L174).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:42](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L42)).
- Phase position: **all four recorded; officially complete by these gates**.
- `Unverified:`: not found (case-insensitive search of the entire linked spec).

<details>
<summary>4 pinned product capture files</summary>

- [figma--adjustment-slider--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/slider/figma--adjustment-slider--rest--light.json#L1)
- [figma--adjustment-slider-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/slider/figma--adjustment-slider-row--rest--light.json#L1)
- [figma--hue-slider--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/slider/figma--hue-slider--rest--light.json#L1)
- [figma--opacity-slider--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/slider/figma--opacity-slider--rest--light.json#L1)

</details>

### chip

- Spec: [docs/specs/chip.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/chip.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:175](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L175-L178)).
- Visual pass: **present** ([docs/specs/chip.md:161](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/chip.md#L161-L172)).
- Product captures: **yes**, 4 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's composer tool pill (rest, hover) and Notion's select tags (shape, height, paint). [apps/docs/src/pass-status.mjs:175](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L175-L178).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:31](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L31)).
- Phase position: **all four recorded; officially complete by these gates**.
- `Unverified:`: not found (case-insensitive search of the entire linked spec).

<details>
<summary>4 pinned product capture files</summary>

- [chatgpt--composer-tool-pill--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/chip/chatgpt--composer-tool-pill--hover--light.json#L1)
- [chatgpt--composer-tool-pill--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/chip/chatgpt--composer-tool-pill--rest--light.json#L1)
- [notion--board-tag--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/chip/notion--board-tag--rest--light.json#L1)
- [notion--select-tag--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/chip/notion--select-tag--rest--light.json#L1)

</details>

### badge-group

- Spec: [docs/specs/badge-group.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge-group.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:187](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L187-L190)).
- Visual pass: **present** ([docs/specs/badge-group.md:123](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge-group.md#L123-L141)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [primer--group-truncated-5--expanded--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge-group/primer--group-truncated-5--expanded--light.json#L1).
- Side-by-side: **recorded 2026-09-28** — Notion's multi-select table cells on a public page (tag geometry, gap between tags and between wrapped lines). [apps/docs/src/pass-status.mjs:187](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L187-L190).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:31](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L31)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/badge-group.md:134](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge-group.md#L134-L135)):

  > owner's workspace (Notion's tasks board has single tags per group header). Unverified: a Notion multi-select cell's tag gap
  > (no multi-select was reachable in the owner's workspace), dark theme.

- Verbatim marker and continuation ([docs/specs/badge-group.md:147](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/badge-group.md#L147-L148)):

  > - Unverified: keyboard focus ring on the trigger (not reached with the real Tab key in
  >   this pass), dark theme, Primer source at a pinned commit.


<details>
<summary>2 pinned product capture files</summary>

- [notion--multi-select-many--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge-group/notion--multi-select-many--rest--light.json#L1)
- [notion--multi-select-wrap--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/badge-group/notion--multi-select-wrap--rest--light.json#L1)

</details>

## Batch 16 — Content surfaces

Batch membership: [apps/docs/src/component-status.mjs:85](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L85).

### card

- Spec: [docs/specs/card.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/card.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L179-L182)).
- Visual pass: **present** ([docs/specs/card.md:194](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/card.md#L194-L204)).
- Product captures: **yes**, 16 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [apple--web-glass-nav--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/apple--web-glass-nav--rest--light.json#L1).
- Side-by-side: **recorded 2026-09-27** — Notion board cards, ChatGPT library cards and Figma file and community cards, light and dark (consistency pass). [apps/docs/src/pass-status.mjs:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L179-L182).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:35](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L35)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/card.md:202](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/card.md#L202-L203)):

  > background). Unverified: Firefox and Safari (`text-box`, `cap`, container queries, `:has()`),
  > forced colours, screen readers.


<details>
<summary>16 pinned product capture files</summary>

- [chatgpt--library-file-card--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/chatgpt--library-file-card--hover--light.json#L1)
- [chatgpt--library-file-card--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/chatgpt--library-file-card--rest--light.json#L1)
- [chatgpt--library-image-card--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/chatgpt--library-image-card--rest--light.json#L1)
- [figma--community-feature-card--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/figma--community-feature-card--rest--light.json#L1)
- [figma--community-tile--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/figma--community-tile--rest--light.json#L1)
- [figma--file-card--hover--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/figma--file-card--hover--dark.json#L1)
- [figma--file-card--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/figma--file-card--rest--dark.json#L1)
- [figma--file-card--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/figma--file-card--rest--light.json#L1)
- [notion--board-card--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/notion--board-card--hover--light.json#L1)
- [notion--board-card--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/notion--board-card--rest--light.json#L1)
- [notion--board-card-linked--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/notion--board-card-linked--rest--light.json#L1)
- [notion--board-column--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/notion--board-column--rest--light.json#L1)
- [notion--home-panel--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/notion--home-panel--rest--dark.json#L1)
- [notion--recent-card--hover--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/notion--recent-card--hover--dark.json#L1)
- [notion--recent-card--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/notion--recent-card--rest--dark.json#L1)
- [notion--sidebar-promo-card--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/card/notion--sidebar-promo-card--rest--light.json#L1)

</details>

### table

- Spec: [docs/specs/table.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/table.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:183](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L183-L186)).
- Visual pass: **present** ([docs/specs/table.md:159](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/table.md#L159-L169)).
- Product captures: **yes**, 4 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Notion's table view (row height, rules, header ink, cells). [apps/docs/src/pass-status.mjs:183](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L183-L186).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:43](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L43)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/table.md:168](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/table.md#L168)):

  > paint, not with a real pointer (the preview pane was hidden). Unverified: dark theme.


<details>
<summary>4 pinned product capture files</summary>

- [notion--body-row--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/table/notion--body-row--hover--light.json#L1)
- [notion--body-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/table/notion--body-row--rest--light.json#L1)
- [notion--header-cell--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/table/notion--header-cell--rest--light.json#L1)
- [notion--header-row--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/table/notion--header-row--rest--light.json#L1)

</details>

## Batch 17 — Overlays

Batch membership: [apps/docs/src/component-status.mjs:86](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L86).

### dialog

- Spec: [docs/specs/dialog.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/dialog.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:243](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L243-L246)).
- Visual pass: **present** ([docs/specs/dialog.md:152](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/dialog.md#L152-L170)).
- Product captures: **yes**, 7 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [primer--dialog-header--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/primer--dialog-header--open--light.json#L1); [shadcn--dialog-header--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/shadcn--dialog-header--open--light.json#L1).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's keyboard-shortcuts dialog, live (width, corner, lift, title, close rest and hover, footer button inset). [apps/docs/src/pass-status.mjs:243](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L243-L246).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:41](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L41)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/dialog.md:179](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/dialog.md#L179-L180)):

  > - Unverified: dark theme and the dark scrim, screen reader announcement, the modal on a
  >   phone-width viewport.


<details>
<summary>7 pinned product capture files</summary>

- [chatgpt--close-button--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/chatgpt--close-button--hover--light.json#L1)
- [chatgpt--dialog-overlay--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/chatgpt--dialog-overlay--open--dark.json#L1)
- [chatgpt--dialog-overlay--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/chatgpt--dialog-overlay--open--light.json#L1)
- [chatgpt--search-dialog--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/chatgpt--search-dialog--open--dark.json#L1)
- [chatgpt--shortcuts-dialog--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/chatgpt--shortcuts-dialog--open--light.json#L1)
- [notion--dialog-overlay--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/notion--dialog-overlay--open--dark.json#L1)
- [notion--settings-dialog--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/dialog/notion--settings-dialog--open--dark.json#L1)

</details>

### confirm-dialog

- Spec: [docs/specs/confirm-dialog.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/confirm-dialog.md#L1).
- Audited spec: **not found**. Spec exists, but no family audit attestation in the [pass registry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1) or [cohesion audit](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L1); inherited rules/test results in the spec do not establish this gate.
- Visual pass: **not found** (entire [spec](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/confirm-dialog.md#L1) searched for the named heading).
- Product captures: **not found** in `docs/research/captures/confirm-dialog/`; [spec capture record](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/confirm-dialog.md#L4-L7).
- Side-by-side: no [validation entry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1). Spec has a ChatGPT/Area measurement table, but no saved product capture or explicit live side-by-side claim; **not found**. [docs/specs/confirm-dialog.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/confirm-dialog.md#L1-L74).
- Owner approval: **no — in review** ([apps/docs/src/component-status.mjs:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L48)).
- Phase position: **evidence phases incomplete; awaiting owner approval**.
- Verbatim marker and continuation ([docs/specs/confirm-dialog.md:59](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/confirm-dialog.md#L59)):

  > surface is 420 wide. Unverified: dark, compact, screen reader.


### drawer

- Spec: [docs/specs/drawer.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L1).
- Audited spec: **not found**. Spec exists, but no family audit attestation in the [pass registry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1) or [cohesion audit](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/cohesion-audit.md#L1); inherited rules/test results in the spec do not establish this gate.
- Visual pass: **not found** (entire [spec](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L1) searched for the named heading).
- Product captures: **not found** in `docs/research/captures/drawer/`; [spec capture record](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L4-L7).
- Other reference files (excluded from product count): [shadcn--sheet-overlay--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/drawer/shadcn--sheet-overlay--open--light.json#L1); [shadcn--sheet-right--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/drawer/shadcn--sheet-right--open--light.json#L1).
- Side-by-side: no [validation entry](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L1). Spec records a shadcn/Area measurement comparison; **design-system comparison only**, with no target-product comparison recorded. [docs/specs/drawer.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L1-L95).
- Owner approval: **no — in review** ([apps/docs/src/component-status.mjs:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L48)).
- Phase position: **evidence phases incomplete; awaiting owner approval**.
- Verbatim marker and continuation ([docs/specs/drawer.md:77](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L77-L78)):

  > Unverified: dark, compact, RTL, screen reader, the exit slide on browsers without
  > `transition-behavior`.


### tooltip

- Spec: [docs/specs/tooltip.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tooltip.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:247](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L247-L250)).
- Visual pass: **present** ([docs/specs/tooltip.md:127](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tooltip.md#L127-L139)).
- Product captures: **yes**, 6 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's sidebar-toggle tooltip with its shortcut, live (height, corner, type, fill, inline keycap); unchanged since 2026-09-25. [apps/docs/src/pass-status.mjs:247](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L247-L250).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:43](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L43)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/tooltip.md:145](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tooltip.md#L145)):

  > - Unverified: Figma capture file, dark theme. Hover/focus behaviour is implemented (2026-09-27, [overlay.md](overlay.md)); its timing has not been owner-reviewed (the batch 17 pass compared static paint).


<details>
<summary>6 pinned product capture files</summary>

- [chatgpt--plain--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tooltip/chatgpt--plain--rest--light.json#L1)
- [chatgpt--shortcut--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tooltip/chatgpt--shortcut--rest--light.json#L1)
- [chatgpt--tooltip-shortcut--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tooltip/chatgpt--tooltip-shortcut--open--dark.json#L1)
- [figma--tooltip--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tooltip/figma--tooltip--open--dark.json#L1)
- [notion--shortcut-stacked--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tooltip/notion--shortcut-stacked--rest--light.json#L1)
- [notion--tooltip-shortcut--open--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tooltip/notion--tooltip-shortcut--open--dark.json#L1)

</details>

### hover-card

- Spec: [docs/specs/hover-card.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/hover-card.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:191](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L191-L194)).
- Visual pass: **present** ([docs/specs/hover-card.md:55](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/hover-card.md#L55-L69)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Notion's sub-page link preview, live (surface, corner, ring, lift, type), and the web link preview on file. [apps/docs/src/pass-status.mjs:191](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L191-L194).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:33](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L33)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/hover-card.md:76](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/hover-card.md#L76)):

  > - Unverified: dark theme, screen readers (by design the card is not announced).


<details>
<summary>2 pinned product capture files</summary>

- [notion--link-preview--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/hover-card/notion--link-preview--open--light.json#L1)
- [notion--page-preview--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/hover-card/notion--page-preview--open--light.json#L1)

</details>

## Batch 18 — Command surfaces

Batch membership: [apps/docs/src/component-status.mjs:87](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L87).

### context-menu

- Spec: [docs/specs/context-menu.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/context-menu.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:195](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L195-L198)).
- Visual pass: **present** ([docs/specs/context-menu.md:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/context-menu.md#L48-L57)).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Notion's sidebar page menu, right-click, live (position, lift, rows, icons, type, shortcuts). [apps/docs/src/pass-status.mjs:195](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L195-L198).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:33](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L33)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/context-menu.md:66](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/context-menu.md#L66)):

  > - Unverified: touch long-press (not handled), screen reader output, dark theme.


<details>
<summary>1 pinned product capture files</summary>

- [notion--context-menu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/context-menu/notion--context-menu--open--light.json#L1)

</details>

### command-palette

- Spec: [docs/specs/command-palette.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:199](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L199-L202)).
- Visual pass: **present** ([docs/specs/command-palette.md:69](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L69-L86)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [vscode--quick-input--rest--dark.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/command-palette/vscode--quick-input--rest--dark.json#L1).
- Side-by-side: **recorded 2026-09-28** — Notion's search and ChatGPT's search-chats palettes, live via cmd+K (surface, field, headings, rows, highlight). [apps/docs/src/pass-status.mjs:199](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L199-L202).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:33](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L33)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/command-palette.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L104)):

  > - Unverified: dark theme, screen reader output, IME.

- Verbatim marker and continuation ([docs/specs/command-palette.md:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/command-palette.md#L131)):

  > "Move" ink to the Open keycap 16. Unverified: hover paint by eye, dark theme.


<details>
<summary>2 pinned product capture files</summary>

- [chatgpt--search-palette--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/command-palette/chatgpt--search-palette--open--light.json#L1)
- [notion--search-palette--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/command-palette/notion--search-palette--open--light.json#L1)

</details>

## Batch 19 — Conversation

Batch membership: [apps/docs/src/component-status.mjs:88](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L88).

### message

- Spec: [docs/specs/message.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/message.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:203](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L203-L206)).
- Visual pass: **present** ([docs/specs/message.md:61](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/message.md#L61-L72)).
- Product captures: **yes**, 4 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's conversation, live (user bubble rest and hover actions, prose, assistant actions). [apps/docs/src/pass-status.mjs:203](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L203-L206).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:33](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L33)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/message.md:85](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/message.md#L85)):

  > - Unverified: dark theme, screen readers, RTL (the bubble moves to the start).


<details>
<summary>4 pinned product capture files</summary>

- [chatgpt--assistant-actions--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/message/chatgpt--assistant-actions--rest--light.json#L1)
- [chatgpt--assistant-prose--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/message/chatgpt--assistant-prose--rest--light.json#L1)
- [chatgpt--user-message--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/message/chatgpt--user-message--hover--light.json#L1)
- [chatgpt--user-message--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/message/chatgpt--user-message--rest--light.json#L1)

</details>

### composer

- Spec: [docs/specs/composer.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/composer.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:207](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L207-L210)).
- Visual pass: **present** ([docs/specs/composer.md:84](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/composer.md#L84-L94)).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's home composer, live (size, corner, ring and lift, text). [apps/docs/src/pass-status.mjs:207](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L207-L210).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:40](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L40)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/composer.md:98](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/composer.md#L98-L99)):

  > `npm test` (tokens and contrast), capture checksums: all pass. Unverified: dark theme, focus ring on screen, ChatGPT's
  > multi-line radius (would require typing), hover states.


<details>
<summary>1 pinned product capture files</summary>

- [chatgpt--inline-empty--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/composer/chatgpt--inline-empty--rest--light.json#L1)

</details>

### prompt-suggestions

- Spec: [docs/specs/prompt-suggestions.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/prompt-suggestions.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:211](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L211-L214)).
- Visual pass: **present** ([docs/specs/prompt-suggestions.md:51](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/prompt-suggestions.md#L51-L59)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's home suggestions, live (rows, offset, hover wash, ink, dismiss). [apps/docs/src/pass-status.mjs:211](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L211-L214).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:33](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L33)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/prompt-suggestions.md:72](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/prompt-suggestions.md#L72)):

  > - Unverified: dark theme. ChatGPT's hover state was captured 2026-09-28.


<details>
<summary>2 pinned product capture files</summary>

- [chatgpt--prompt-suggestions--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/prompt-suggestions/chatgpt--prompt-suggestions--rest--light.json#L1)
- [chatgpt--suggestion-row--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/prompt-suggestions/chatgpt--suggestion-row--hover--light.json#L1)

</details>

## Batch 20 — Conversation controls

Batch membership: [apps/docs/src/component-status.mjs:89](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L89).

### model-picker

- Spec: [docs/specs/model-picker.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/model-picker.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:215](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L215-L218)).
- Visual pass: **present** ([docs/specs/model-picker.md:47](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/model-picker.md#L47-L57)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's composer model picker, live (trigger, menu surface, rows with notes, check). [apps/docs/src/pass-status.mjs:215](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L215-L218).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:35](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L35)).
- Phase position: **all four recorded; officially complete by these gates**.
- `Unverified:`: not found (case-insensitive search of the entire linked spec).

<details>
<summary>2 pinned product capture files</summary>

- [chatgpt--model-submenu--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/model-picker/chatgpt--model-submenu--open--light.json#L1)
- [chatgpt--model-trigger--open--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/model-picker/chatgpt--model-trigger--open--light.json#L1)

</details>

### scroll-to-latest

- Spec: [docs/specs/scroll-to-latest.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/scroll-to-latest.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:219](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L219-L222)).
- Visual pass: **present** ([docs/specs/scroll-to-latest.md:38](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/scroll-to-latest.md#L38-L47)).
- Product captures: **yes**, 3 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's scroll-to-bottom button, live (size, ring, fill, glyph, position, hover). [apps/docs/src/pass-status.mjs:219](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L219-L222).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:35](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L35)).
- Phase position: **all four recorded; officially complete by these gates**.
- `Unverified:`: not found (case-insensitive search of the entire linked spec).

<details>
<summary>3 pinned product capture files</summary>

- [chatgpt--scroll-to-bottom--hidden--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/scroll-to-latest/chatgpt--scroll-to-bottom--hidden--light.json#L1)
- [chatgpt--scroll-to-bottom--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/scroll-to-latest/chatgpt--scroll-to-bottom--hover--light.json#L1)
- [chatgpt--scroll-to-bottom--visible--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/scroll-to-latest/chatgpt--scroll-to-bottom--visible--light.json#L1)

</details>

## Batch 21 — Page navigation

Batch membership: [apps/docs/src/component-status.mjs:90](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L90).

### tabs

- Spec: [docs/specs/tabs.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tabs.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:223](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L223-L226)).
- Visual pass: **present** ([docs/specs/tabs.md:158](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tabs.md#L158-L168)).
- Product captures: **yes**, 10 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Notion's database view tabs, live (size, corner, type, selected and hover wash, ink). [apps/docs/src/pass-status.mjs:223](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L223-L226).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:43](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L43)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/tabs.md:166](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/tabs.md#L166-L167)):

  > Type size matches (14); weight stays 400 by the type ramp (Notion 500). No change. Unverified:
  > dark theme.


<details>
<summary>10 pinned product capture files</summary>

- [figma--panel-tab--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/figma--panel-tab--hover--light.json#L1)
- [figma--panel-tab--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/figma--panel-tab--rest--light.json#L1)
- [figma--tab--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/figma--tab--hover--light.json#L1)
- [figma--tab--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/figma--tab--rest--light.json#L1)
- [figma--tab-selected--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/figma--tab-selected--rest--light.json#L1)
- [notion--tabs-underline--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/notion--tabs-underline--rest--light.json#L1)
- [notion--view-tab--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/notion--view-tab--hover--light.json#L1)
- [notion--view-tab--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/notion--view-tab--rest--light.json#L1)
- [notion--view-tab-selected--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/notion--view-tab-selected--rest--light.json#L1)
- [notion--view-tab-selected2--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/tabs/notion--view-tab-selected2--rest--light.json#L1)

</details>

### breadcrumb

- Spec: [docs/specs/breadcrumb.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/breadcrumb.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:227](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L227-L230)).
- Visual pass: **present** ([docs/specs/breadcrumb.md:104](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/breadcrumb.md#L104-L118)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Notion's topbar page path, live (items, type, separator, hover plate). [apps/docs/src/pass-status.mjs:227](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L227-L230).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:38](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L38)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/breadcrumb.md:124](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/breadcrumb.md#L124)):

  > - Unverified: hover plate on screen (the browser pane was hidden), dark theme, Figma.


<details>
<summary>2 pinned product capture files</summary>

- [notion--path-2--hover--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/breadcrumb/notion--path-2--hover--light.json#L1)
- [notion--path-2--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/breadcrumb/notion--path-2--rest--light.json#L1)

</details>

## Batch 22 — Code and rules

Batch membership: [apps/docs/src/component-status.mjs:91](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L91).

### code

- Spec: [docs/specs/code.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:231](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L231-L234)).
- Visual pass: **present** ([docs/specs/code.md:120](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code.md#L120-L132)).
- Product captures: **yes**, 1 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's inline code in a conversation, live (size, fill, corner, inset). [apps/docs/src/pass-status.mjs:231](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L231-L234).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:39](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L39)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/code.md:131](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code.md#L131)):

  > Unverified: dark theme, forced colours.


<details>
<summary>1 pinned product capture files</summary>

- [chatgpt--inline-code--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/code/chatgpt--inline-code--rest--light.json#L1)

</details>

### code-block

- Spec: [docs/specs/code-block.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code-block.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:235](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L235-L238)).
- Visual pass: **present** ([docs/specs/code-block.md:152](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code-block.md#L152-L167)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Other reference files (excluded from product count): [github-copilot--chat-code-block--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/code-block/github-copilot--chat-code-block--rest--light.json#L1).
- Side-by-side: **recorded 2026-09-28** — ChatGPT's code block in a conversation, live (shell, header, buttons, code type). [apps/docs/src/pass-status.mjs:235](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L235-L238).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:37](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L37)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/code-block.md:165](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/code-block.md#L165-L166)):

  > (Area tokens over ChatGPT's pill scale; 14 mono throughout). No change. Unverified: hover and
  > `:target` paint on screen, dark theme, RTL.


<details>
<summary>2 pinned product capture files</summary>

- [chatgpt--code-block--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/code-block/chatgpt--code-block--rest--light.json#L1)
- [chatgpt--code-block-full--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/code-block/chatgpt--code-block-full--rest--light.json#L1)

</details>

### separator

- Spec: [docs/specs/separator.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/separator.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:239](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L239-L242)).
- Visual pass: **present** ([docs/specs/separator.md:118](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/separator.md#L118-L130)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-09-28** — Notion's page-menu rules, live, and ChatGPT's settings dividers on file (weight, ink, inset). [apps/docs/src/pass-status.mjs:239](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L239-L242).
- Owner approval: **yes** ([apps/docs/src/component-status.mjs:42](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L42)).
- Phase position: **all four recorded; officially complete by these gates**.
- Verbatim marker and continuation ([docs/specs/separator.md:129](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/separator.md#L129)):

  > Unverified: dark theme (#333 on the dark surface), forced colours.


<details>
<summary>2 pinned product capture files</summary>

- [chatgpt--settings-group-dividers--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/separator/chatgpt--settings-group-dividers--rest--light.json#L1)
- [figma--panel-section-divider--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/separator/figma--panel-section-divider--rest--light.json#L1)

</details>

## Batch 23 — Disclosure

Batch membership: [apps/docs/src/component-status.mjs:92](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L92).

### disclosure

- Spec: [docs/specs/disclosure.md:1](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/disclosure.md#L1).
- Audited spec: **recorded**, through the validated-pass attestation ([apps/docs/src/pass-status.mjs:15](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L15-L18)).
- Visual pass: **present** ([docs/specs/disclosure.md:205](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/disclosure.md#L205-L222)).
- Product captures: **yes**, 2 tracked files (pinned inventory below).
- Side-by-side: **recorded 2026-10-02** — Notion's toggle block (row, chevron square, title column, hover plate); divided against shadcn's accordion source. [apps/docs/src/pass-status.mjs:15](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L15-L18).
- Owner approval: **no — in review** ([apps/docs/src/component-status.mjs:48](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/component-status.mjs#L48)).
- Phase position: **phases 1–3 recorded; awaiting owner approval**.
- Freshness: validation is 2026-10-02, but the feedback log includes owner changes on 2026-10-06. Do not assume the prior comparison covers every later edit. [docs/specs/disclosure.md:234](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/disclosure.md#L234-L242)
- Verbatim marker and continuation ([docs/specs/disclosure.md:231](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/disclosure.md#L231-L232)):

  > - Unverified: Notion collapsed and dark, ChatGPT dark, a rendered shadcn accordion, dark paint on
  >   screen, find-in-page with the real browser find bar.


<details>
<summary>2 pinned product capture files</summary>

- [chatgpt--sidebar-section--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/disclosure/chatgpt--sidebar-section--rest--light.json#L1)
- [notion--toggle-block--rest--light.json](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/research/captures/disclosure/notion--toggle-block--rest--light.json#L1)

</details>

## Supplementary specs outside the batch list

These are supporting specs rather than additional approval families. Their markers are preserved for completeness; they are excluded from the family totals. Other non-family specs were also searched and had no `Unverified:` marker.

### inspector

- Verbatim marker and continuation ([docs/specs/inspector.md:85](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/inspector.md#L85)):

  > - Unverified: dark theme; keyboard order across the groups (each button is its own stop).


### overlay

- Verbatim marker and continuation ([docs/specs/overlay.md:110](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/overlay.md#L110-L111)):

  > driven by real pointer and key events over the DevTools protocol. Unverified: Firefox and
  > Safari, touch, screen readers, RTL alignment on screen, nested popovers.


### resizable-panel

- Verbatim marker and continuation ([docs/specs/resizable-panel.md:102](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/resizable-panel.md#L102)):

  > - Unverified: dark theme, RTL drag, touch, screen reader output.


## Proposals

- Recommended: review Disclosure and Alignment picker first, checking the changes made after their recorded comparisons. This recommendation follows their existing three evidence gates; it does not grant approval.
- Audit the six newer families explicitly. For Tag, reconcile the documented comparison with the pass registry once all prerequisites are confirmed. For the other five, finish the missing evidence before recording validation.
- Keep a current verification checklist alongside historical `Unverified:` notes, marking resolved items with dated evidence. Do not delete history or treat the marker counts as a release-risk score.

## Open questions

- Should Drawer’s shadcn comparison satisfy phase 3, or must it gain target-product evidence? The current definition specifically requires a target product; this report applies that definition. [apps/docs/src/pass-status.mjs:7](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/apps/docs/src/pass-status.mjs#L7-L11) [docs/specs/drawer.md:31](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/specs/drawer.md#L31-L37)
- Which audit covers each new family? No dedicated attestation was found for Custom select, Tag, Tag picker, Date picker, Drawer or Confirm dialog in the audited sources. Their records above identify the gaps.
- Which historical notes are superseded? For example, Panel, Color field, Color swatch, Color swatch picker, Input group and Badge group retain old comparison gaps alongside recorded later comparisons. This inventory preserves both and does not resolve the chronology into new approvals.

## Reproduce and verify

From the repository root, run:

```sh
python3 docs/research/astra/phase-status/generate.py --commit 4c1854202a8e109479d5b83ef24a8325231da056 --date 2026-10-07
```

The script resolves the repository relative to itself, reads only Git objects at the pinned SHA, and writes only this topic’s README and evidence.json. No dependencies, builds, product access or owner-status mutations are needed. `evidence.json` contains all capture paths and exact marker paragraphs for independent checking.

## closest to owner approval

1. **[disclosure](#disclosure) and [alignment-picker](#alignment-picker)** tie by the formal record: audited spec, Visual pass, product captures and registered comparison are present; owner approval is absent. Disclosure’s comparison is newer. Both need the owner to consider post-validation edits; Alignment picker was explicitly reopened.
2. **[tag](#tag)** follows by documented evidence: it has a Visual pass and a live product comparison, but no family audit attestation or validation entry. This is an inference about evidence proximity, not a claim that it is ready for approval.
3. **[custom-select](#custom-select)** has captures and a Visual pass, but the spec explicitly stops short of side-by-side. [tag-picker](#tag-picker) and [date-picker](#date-picker) lack the Visual pass heading as well. [drawer](#drawer) and [confirm-dialog](#confirm-dialog) also lack saved target-product captures.

## most unverified

**By missing required evidence:** [drawer](#drawer) and [confirm-dialog](#confirm-dialog) have the broadest formal gaps: no audit attestation, no Visual pass section, no saved target-product captures and no registered comparison. Drawer does have measured shadcn evidence; Confirm dialog records a blocked export. This ranks documentation gaps, not implementation quality.

**By retained marker count:** the maximum is 2 markers per family: [toast](#toast), [alignment-picker](#alignment-picker), [combobox](#combobox), [badge-group](#badge-group), [command-palette](#command-palette). Each is quoted in full above, including earlier notes that may have been superseded.

**Coverage:** 65 markers across 60 family specs, plus 3 markers in supporting specs. [progress](#progress), [slider](#slider), [chip](#chip), [model-picker](#model-picker), [scroll-to-latest](#scroll-to-latest) have no literal marker; that is not a claim of exhaustive verification.
