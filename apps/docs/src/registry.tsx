/**
 * The demo registry.
 *
 * One module imports every demo, and the build renders each of them with react-dom/server
 * while reading the same file's source for the code sample. Preview and snippet therefore
 * come from a single artefact and cannot drift -- which was the one thing the previous
 * system's documentation could not promise, since its snippets were hand-typed strings
 * with no relationship to what was rendered.
 */
import * as button from "./demos/button.tsx";
import * as form from "./demos/form.tsx";
import * as display from "./demos/display.tsx";
import * as nav from "./demos/nav.tsx";

export const DEMOS = { ...button, ...form, ...display, ...nav } as Record<string, () => unknown>;

export const SOURCES = {
  button: "src/demos/button.tsx",
  form: "src/demos/form.tsx",
  display: "src/demos/display.tsx",
  nav: "src/demos/nav.tsx",
};
