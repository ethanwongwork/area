# Changelog

`@area/icons` follows semantic versioning (README, "Versions, deprecation and credits"). The drawings' history before
versioning, review round by review round, is in `docs/specs/icons.md`.

## 0.1.0 (unreleased)

The first versioned state.

- 808 icons, all approved and in the main entry (`@area/icons/review` is empty), each an outline and a filled
  component.
- MIT licence for Area's drawings (`LICENSE`).
- Size curve: the line grows with size^0.45 up to 24, larger sizes scale the 24px master.
- 12px cuts for chevron-down, check, add, info, open, link, bell, arrow-up and globe, with their turns; `size={12}` is
  slot-aware (`--area-type-icon-xs-cut`).
- Accessible name (`title`, `aria-label`, `aria-labelledby`) and right-to-left mirroring for 23 icons (`mirrored`,
  `rtl.css`).
- Metadata: name, components, category, keyline, fill, status, batch, turns, aliases, `rtl`, `cuts`, `source`, search
  `keywords` and other libraries' `names`; `categories` and `batches`.
- Raw SVGs at 12, 16, 20 and 24, a 16px sprite, `icons.json`; `THIRD_PARTY_NOTICES.md` for Fluent's globe.
