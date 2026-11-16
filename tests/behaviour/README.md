# Behaviour tests

Real-browser tests for what a component does: keys, focus, pointer, typeahead timing, forms, modals and hit
targets. Each suite renders the real components from the built packages (`packages/react/dist`,
`packages/styles/dist`) in a headless Microsoft Edge (a guest profile that never signs in) and drives it over the
DevTools protocol with real input (`Input.dispatchMouseEvent`, `Input.dispatchKeyEvent`, `Input.imeSetComposition`),
never synthetic DOM events. No dependency beyond esbuild.

```sh
npm run build                    # the suites test dist, so build after a source change
npm run test:behaviour           # every suite
npm run test:behaviour -- menu   # one suite (menu, list, forms, modal, hit)
npm run test:behaviour -- menu --test-name-pattern=typeahead
```

`AREA_BEHAVIOUR_EDGE` points at another Chromium binary; `AREA_BEHAVIOUR_HEADED=1` shows the window.

## Layout

- `harness.mjs`: bundles a fixture, serves it on a free port, launches Edge, and gives a `Page`: `click`, `hover`,
  `move` / `path`, `down` / `up`, `press`, `type`, `compose` / `commitComposition`, `waitFor`, `rect`, `style`, `hit`
  (elementFromPoint), `active()` (document.activeElement's role and name from the accessibility tree), `focusedNode()`,
  `axTree()`, `settle()` (finite transitions done), `clock.tick(ms)`, `step(name, fn)`.
- `suite.mjs`: `behaviour(fixture, ({ it, gap }) => …)` over `node:test`, one browser per suite, a fresh page per test.
- `fixtures/<suite>.jsx`: the page a suite drives. `suites/<suite>.test.mjs`: the assertions.
- `hit-probe.mjs`: the in-page 24 px target probe.

**Time.** Pages run on a fixture clock: `Date.now` and every `setTimeout` / `setInterval` of 50 ms or more are
virtual and move only on `page.clock.tick(ms)`. A typeahead window or a tooltip delay is asserted at an exact
millisecond, never raced. Shorter timers, promises, frames, CSS transitions and `performance.now` are real.

**Failures** name the step, the steps before it, the focused element, the last console errors, and print the page's
accessibility tree.

## Expected failures

`gap("<plan item>", name, fn)` asserts the reference behaviour that a plan item (docs/research/system-evaluation-
2026-11-11/README.md, section 5) will build. While the gap is open, an assertion inside fails and the test passes,
reporting `gap <item> still open`. When the behaviour starts to hold, the test **fails** with "Plan item … looks fixed":
change `gap(...)` to `it(...)` in the same change that fixes it. Only an `AssertionError` counts as the gap; a missing
element, a timeout or a failed `must(condition, why)` precondition fails the test, so a broken fixture never hides as
a known gap. Per-family tables (`GAPS`, `NO_RESET`, `NOT_REQUIRED`, …) at the top of a suite hold the marks: delete
the family's entry to unmark it.

## A family adopting a shared hook inherits a suite

The suites assert behaviour, not implementation: a test reads only roles, names, focus, ARIA state, FormData and
elementFromPoint. When a family adopts a shared hook (`useMenuNavigation`, `createTypeahead`, `useFormField`,
`useModalDialog`, the hit-target rule), add it to the suite's fixture and its family list; the same loop of tests
then runs on it. For example, a new value family joins the form contract by one line in `fixtures/forms.jsx`
(`FAMILIES`) and one in `suites/forms.test.mjs` (`DEFAULTS`, plus `CHANGE`, the real input that changes its value);
a menu host joins by rendering it in `fixtures/menu.jsx` and running the menu tests against its selector.

## Add a fixture

1. `fixtures/<name>.jsx` imports from `@area/react` and `@area/styles/area.css`, renders into `#root`, and sets
   `window.__ready = true` after two frames. Read the query (`location.search`) for variants of the page.
2. Give every element a test reads a stable `id` or `data-*` hook; record actions in `window.__log`.
3. `suites/<name>.test.mjs` calls `behaviour("<name>", ({ it, gap }) => …)`. Use `{ fresh: false }` for tests that
   only read the page or touch only their own part of it.

## Check that a suite bites

`AREA_BEHAVIOUR_MUTATE='[["<code in the bundle>", "<broken code>"]]'` rewrites the bundled code before the page
loads. For example, shortening Menu's typeahead window must fail the menu suite:

```sh
AREA_BEHAVIOUR_MUTATE='[["TYPEAHEAD_RESET = 1e3", "TYPEAHEAD_RESET = 300"]]' npm run test:behaviour -- menu
```
