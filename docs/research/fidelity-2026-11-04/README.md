# Fidelity pass (2026-11-04)

Owner: "in general the fidelity of all these ui/components dont look as polished as seeing vector examples in figma, why
is that?" Measured on the Workspace screen at true size (1920 × 1080, a 2× display, Area's defaults; 548 elements, 131
painted). Artifact: Fidelity Pass, https://claude.ai/artifact/ML6aoMQzMFev48hnz8CxUv (`page.html`; its menu and type
crops were captures, not kept).

| Guess | Result | Evidence |
|---|---|---|
| Fractional sizes blur edges | Wrong | 78 of 131 painted boxes fall between device pixels (text-box trims give heights like 16.86, 35.09; without the trims 49 vertical cases drop to 10), but Chrome snaps box edges at paint: a card's 1px edge reads as two full device rows (234, 234). At most a device pixel of unevenness in repeated rows |
| Text sits off centre in controls | Wrong | the cap's centre within 0.36 of the box's in all 36 controls with a painted box |
| Shadows are fainter than kits' | Held | darkest pixel under the open menu: 248 at Menu lift 3 (default), 242 at 5, 235 with a common kit's shadow-lg (`0 12 16 −4 / 8%`, `0 4 6 −2 / 3%`) |
| Text smaller and tighter than kits' | Held, by choice | 13/18 against most kits' 14/20 |
| Area shown scaled down | Held | a 1920 screen fitted to a 380 card is 0.2: 13px text at 2.6, a 1px edge at 0.2 |
| Text rendering | Not measured | Electron draws grayscale anti-aliased; needs a Figma frame beside it |

What follows: show components at 1:1 (built: `one-to-one.md`, PRODUCT_UI rule 26); deeper default floating shadow (a
foundation change, the owner's call); keep trimmed text on half pixels (small). Open: the owner's own Figma frame for a
point-by-point comparison.

Tools (Electron, hidden window): `screen.tsx` + `build.mjs` (ENTRY=screen.tsx) draw the Workspace alone; `measure.cjs`
reports off-grid boxes, strokes, cap centres, shadows; `pixels.cjs` reads a column of grey levels from a capture;
`shot.cjs` captures with injected CSS or settings; `probe.cjs` runs one expression.
