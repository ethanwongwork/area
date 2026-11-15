/*
 * Every behaviour timing in one place (plan C6, docs/MOTION.md "Timing"). Components import these and never write a
 * literal delay; a cohesion test (packages/react/tests/cohesion.test.mjs) fails on a new one. Motion durations are
 * tokens (`--area-duration-*`), not here: these are waits, windows and thresholds, in ms or px.
 */

/** Tooltip: waits 300 ms (owner's pick, plan C5.6), opens at once for 300 ms after another closes, closes at once. */
export const TOOLTIP = { delay: 300, skip: 300, close: 0 } as const;
/** Hover card: a patient open (700), and a close that waits for the pointer to cross to the card (300). */
export const HOVER_CARD = { delay: 700, close: 300 } as const;
/** Submenu: opens after 100 ms of rest (at once on click or a key); the safe path holds for up to 300 ms (plan C1.1). */
export const SUBMENU = { rest: 100, grace: 300 } as const;
/** Typeahead: one window for every list and menu; letters typed within it build one run. */
export const TYPEAHEAD = { reset: 1000 } as const;
/** Long press on touch. */
export const LONG_PRESS = 500;
/** Press and hold to repeat (Number field's steppers): the first repeat waits, the rest follow at the interval. */
export const PRESS_REPEAT = { delay: 400, interval: 60 } as const;
/** A press becomes a drag after this many px, or this many ms for press-drag-release pickers (plan C1.2). */
export const DRAG_THRESHOLD = { px: 5, ms: 200 } as const;
/** Toast: how long one without an action stays. */
export const TOAST = { duration: 5000 } as const;
/** Loading marks: wait `short` or `long` before showing, then stay at least `minVisible` so they never flash. */
export const LOADING = { short: 300, long: 1000, minVisible: 400 } as const;
/** Scroll area: the bar hides this long after scrolling stops. */
export const SCROLLBAR_HIDE = 600;
/** Video player: the controls hide after this long without input. */
export const MEDIA_IDLE = 2000;
/** A surface that just appeared ignores presses for this long, so a double-click can't hit it by accident (Approval). */
export const APPEAR_GUARD = 500;
/** The shared announcer: a pause before writing (so the same words twice are said twice), and when it clears. */
export const ANNOUNCE = { delay: 100, clear: 7000 } as const;
/** Copy feedback: how long "Copied" shows. */
export const COPY_FEEDBACK = 2000;
