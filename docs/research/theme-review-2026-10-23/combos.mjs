// Partial Canvas settings; restoreCanvas fills the rest with defaults (and drops unknown values — the sweep reads back
// what the Canvas actually applied).
export const COMBOS = {
  base: {},
  loud: { accent: "yellow", action: "accent", selection: "accent", "label-tint": "4", "solid-light": "400", "solid-dark": "850", "selected-tint": "tint" },
  dusty: { accent: "355", "accent-strength": "30", "status-colours": "match", action: "accent", selection: "accent", "label-tint": "2", "solid-light": "850", "solid-dark": "400" },
  tinted: { neutral: "warm", "tint-hue": "accent", accent: "teal", "tint-light": "16", "tint-dark": "16", "ink-tint": "4", "ground-light": "90", "ground-dark": "24", "layers-light": "8", "layers-dark": "8", "card-tone-light": "-4", "card-tone-dark": "4", action: "accent", selection: "accent", "selected-tint": "tint" },
  flat: { "ground-dark": "0", "layers-light": "0", "layers-dark": "0", stroke: "0", surface: "0", "shadow-rest": "0", elevation: "0", "card-tone-light": "4", "card-tone-dark": "-4", "tint-light": "0", "tint-dark": "0", selection: "neutral" },
  contrast: { contrast: "8", "tint-hue": "accent", accent: "purple", "tint-light": "16", "tint-dark": "16", "layers-light": "8", "layers-dark": "8", "ground-light": "92", "ground-dark": "20", action: "accent" },
  fills: { "fill-hover": "4", "fill-selected": "4", "fill-pressed": "1", "danger-hover": "neutral", "selected-tint": "neutral", "stroke-hover": "4", "selected-stroke": "3", "focus-ring": "bold", stroke: "8", surface: "2", "shadow-rest": "8", elevation: "8", "shadow-hover": "8", "shadow-field": "8", "shadow-light": "4" },
  lime: { neutral: "cool", accent: "95", action: "accent", selection: "accent", "ground-light": "94", "ground-dark": "16", "layers-light": "2", "layers-dark": "2", "tint-hue": "200", "tint-light": "10", "tint-dark": "10", "label-tint": "4", "accent-strength": "60" },
  big: { type: "16", density: "36", radius: "pill", pills: "button field segmented chip badge count switch avatar" },
  small: { type: "12", density: "28", radius: "0", pills: "" },
};
COMBOS.grey = { "ground-light": "91", "layers-light": "8", "ground-dark": "24", "layers-dark": "8", action: "accent", selection: "accent", "selected-tint": "neutral", "card-tone-light": "-4", "card-tone-dark": "4" };
COMBOS.grey0 = { "ground-light": "90", "layers-light": "0", "ground-dark": "20", "layers-dark": "8", accent: "green", action: "accent", selection: "accent", "fill-hover": "4", "fill-selected": "4" };
// The defaults before the defaults review (2026-10-25, docs/research/defaults-2026-10-25/), to compare the new ones with.
COMBOS.old = { type: "14", radius: "8", "layers-light": "4", "layers-dark": "4", selection: "accent" };
