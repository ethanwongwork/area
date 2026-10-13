# Cursor 3.24.12 rings (read from /Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/, 2026-10-12)

## token ring (composer context-usage indicator)
- workbench.desktop.main.js: component `o8b`: `<div class="inline-flex items-center justify-center"><svg class=absolute><circle class=token-ring-background fill=none><circle class=token-ring-progress fill=none stroke-linecap=round>`
  size = e.size||16, strokeWidth = e.strokeWidth||2, r = (size - stroke)/2 - 1, C = 2πr, dashoffset = C - pct/100·C, transform rotate(-90 c c).
- Used once: `pe(o8b,{percentage, size:15, strokeWidth:2})` inside `.composer-context-usage-indicator` (padding 0 4px, radius 4; opacity .65 → 1 on hover when clickable). The wrapper sets padding-top 1px, margin-left 1px.
- CSS: `.token-ring-background{stroke:var(--cursor-stroke-tertiary)}` `.token-ring-progress{stroke:var(--cursor-icon-secondary)}`; high contrast: background → icon-quaternary.

## circular-progress-indicator (Bugbot "Reviewing" button)
- component `bYo`: `<svg width=14 height=14 viewBox="0 0 14 14"><circle cx=7 cy=7 r=6 fill=none stroke=currentColor stroke-width=1.5 opacity=0.25><circle cx=7 cy=7 r=6 fill=none stroke=currentColor stroke-width=2 stroke-linecap=round>`
  svg transform rotate(-90deg); arc `transition: stroke-dashoffset 0.2s ease`; offset clamped to [0, C].
- CSS: `.circular-progress-indicator{display:block;height:14px;width:14px}`.
- Used as a Button's leftContent while running (label "Reviewing"), replacing the idle icon; falls back to it while progress is known.
