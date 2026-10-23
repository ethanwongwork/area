# Motion sweep, 2026-10-22

Owner: "make sure all the motion interaction that was built recently is implemented correctly into all the
components". Recent motion work: the Easing setting (PR #141, `axes/easing.ts`), the Hover shadow lift and the state
settings (PR #146), and the motion strays fixed in the 2026-10-21 state audit.

## Method

`sweep.mjs` drives headless Edge against the built app (`desktop-dist`, port 4410), every one of the 119 families. For
each family it reads, per interactive element (and its `::before`), the transition entering (forced `:hover`) and
leaving (at rest), and whether hover changes any paint. Then it reads every transition and animation in the tiles
three times: at the defaults, with the Canvas on Easing Snappy, and at Motion 0. `analyze.mjs` lists departures from
`docs/MOTION.md`.

    node sweep.mjs out.json http://127.0.0.1:4410/      # SLUGS=a,b narrows
    node analyze.mjs out.json

## Findings

| Check | Result |
|---|---|
| Easing reaches the components | **No, fixed.** The Canvas scope (`canvasAttributes`, `apps/desktop/src/studio.tsx`) wrote every Inspector setting but Easing, so changing Easing in the Inspector moved nothing on the Components tab since 2026-10-19; only the Theme tab's own previews showed it. Now written; `apps/desktop/tests/canvas-scope.test.ts` checks every Inspector axis reaches the Canvas. |
| Every curve follows Easing | Yes, once on the scope: at Snappy every transition and animation in all 119 families reads a Snappy curve, `linear` (loops) or `steps()` (the OTP caret). Step's shimmer wrote the `linear` keyword instead of `--area-ease-linear` (same value; changed for consistency). `cohesion.test.mjs` now fails on any literal curve or duration in a transition or animation. |
| Motion 0 stops everything | Yes: no transition or animation lasts longer than 0 in any family. |
| Hover in at once, out on fast ease-out | Yes for every element whose hover changes paint, with one stray, fixed: Tree view's row controls (lock, visibility). The reveal rule's `transition: opacity …` replaced the Button's colour transition, so the hover plate vanished at once; the reveal now zeroes only its own clock (`--_reveal`). |
| Resting `will-change` | None. |

Read as intended, not strays:
- Fields (Select, Textarea, Input group) keep a 140ms `box-shadow` transition under hover: the focus halo fading out, and
  hover doesn't change the shadow (Input's rule, MOTION.md).
- Asset card's edge and lift fade in on `fast`: the Lift recipe.
- Nav and Table of contents: the selection marker (`::before`) carries a transition hover never triggers.
- A disabled Segmented item and a read-only Textarea carry the leave transition on hover, but nothing changes.
- Video player's `<track>` element reports an empty animation (a caption track, not motion).

Not covered: surfaces that open (menus, dialogs, drawers, toasts) are closed in the gallery tiles, so their enter and
exit were checked statically (every one reads the duration and Easing tokens) and by the cohesion test, not at runtime.
