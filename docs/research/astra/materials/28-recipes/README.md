# 28 · Material recipes from the owner's references

**Question (owner, 2026-10-17):** "i want to simplify the outputs lets start with these examples only, what
combination of shadows, gradients, transparency, etc will it take to achieve each of these?" (eight images: onboarding
cards, Aero buttons, a liquid-glass toolbar, a green jelly toggle, a terminal tile, a light tile with a bowl button, a
car console, a frosted folder).

**Answer:** each reference is rebuilt in plain CSS beside the image, with its recipe by layer (fill, stroke,
effects, not a lever) and a matrix of which levers (27-levers) it takes. All eight are reachable with the levers plus
Elevation, with five changes to the lever model and three things that are not material levers (findings.html).

**Page:** https://claude.ai/artifact/NXTVuD3ajRMbHaJZmaPCXR

## Files

- `recipes.json`: per reference, the layer stack and the lever values.
- `samples.json`, `sample.mjs`: colours sampled from the images (3x3 averages at named points: fills, edges, gradient
  stops, shadows), in headless Edge. Sizes and blurs in the rebuilds are matched by eye against the image, not measured.
- `findings.html`: what the references teach (also on the page).
- `template.html`, `build.mjs`: the page. The reference images are the owner's and are not in the repository; pass
  their folder to `build.mjs`.

## Findings

1. Rings take the part's own colour, darker (1, 2, 4): a *tone ring*, not black.
2. A catch-light (a bright inner edge away from the light) is its own lever (4, 5, 6).
3. Wells reverse the gradient (5, 6).
4. A radial highlight needs a position independent of the light (2: glow from below).
5. The transparency floor follows content: text 0.56 / 0.62; accent icons 0 in light, 0.71 in dark; empty chrome
   none (3).
6. Elevation's resting shadow is far tighter than reference 1's; it needs a larger, softer role or range.
7. Glow should reach indicators (7).
8. Not levers: glyph effects (5, 6; D13), squircle corners (5, 6, 7; Radius, `corner-shape`), illustrations.
