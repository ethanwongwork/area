# ChatGPT dark theme, read live (2026-10-01)

Source: chatgpt.com in the owner's Chrome (Claude in Chrome), Settings → Appearance → Mode set
to Dark with the owner's permission, then restored to System. Values are the page's own
resolved custom properties (`getComputedStyle(document.body)`) and computed styles; no
personal content is recorded. Used by audit S21c (dark pass) and the owner's preference for a
near-black dark mode.

## Theme base

| Setting | Value |
|---|---|
| Appearance → Background | #000000 |
| Appearance → Foreground | #EDEDED |

## Resolved tokens

| Token | Dark value |
|---|---|
| `--app-color-background-shell` | #000000 |
| `--app-color-background-surface` / `-surface-under` / `-primary-inverse` | #0e0e0e |
| `--app-color-background-elevated-primary` / `-card` / `-application-menu` | #212121 |
| `--app-color-background-elevated-primary-opaque` | #1b1b1b |
| `--app-color-background-elevated-secondary` / `-control` / `-button-secondary` | #303030 |
| `--color-background-composer-surface` | #212121 |
| `--color-background-composer-action-bar` | #1b1b1b |
| `--app-color-background-button-*-hover` | #ffffff1a |
| `--app-color-background-button-*-active` | #ffffff0d |
| `--app-color-border` | #ffffff26 |
| `--app-color-border-light` | #ffffff0d |
| `--app-color-border-heavy` | #ffffff33 |
| `--app-color-border-focus` | #3a83f7 |
| `--app-color-text-foreground` / `-icon-primary` | #ededed |
| `--app-color-text-secondary` / `-icon-secondary` | #cdcdcd |
| `--app-color-text-foreground-tertiary` / `-icon-tertiary` | #afafaf |
| `--app-color-simple-scrim` | #00000080 |
| `--modal-backdrop-fade-shadow` | 0 8px 16px 0 #00000059, 0 2px 8px 0 #0003, inset 0 0 0 1px #ffffff0d |
| `--shadow-card` | 0px 4px 16px 0px #0000000d |

## Computed surfaces

| Element | Background | Edge | Radius | Shadow |
|---|---|---|---|---|
| Page (`body`) | rgb(14, 14, 14) on a #000 shell | — | — | — |
| Settings card | rgb(14, 14, 14) | 1px rgba(255, 255, 255, 0.15) | 16 | none |
| Theme dropdown menu | oklab(0.2478 0 0 / 0.9) (≈ #212121 at 90%) | inset 0 0 1px rgba(255, 255, 255, 0.2) | 16 | 0 8px 16px -4px rgba(0, 0, 0, 0.12) |
| Menu row | — | — | 12 (36 tall) | — |

## Area mapping (2026-10-01)

- `bg-page` dark: neutral 975 (#020202), the ramp's nearest rung to #000 (was 900, #121212).
- `scrim` dark: #00000080 (was #000000a6).
- Surfaces keep 850 (#1d1d1d) and controls 800 (#282828), a step under ChatGPT's #212121 /
  #303030, so raised surfaces still separate from a near-black page.
