// The app's own look (owner, 2026-10-30): drawn in a system's theme as published, or settings of its own (src/app-look.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { chromeOf, restoreAppLook } from "../src/app-look.ts";
import { publish, starterSystem, withTheme, type Restorers } from "../src/systems.ts";

const DEFAULTS = { type: "13", radius: "10" } as Record<string, string>;
const RESTORE = {
  canvas: saved => ({ ...DEFAULTS, ...Object.fromEntries(Object.entries(saved as Record<string, unknown>).filter(([key, value]) => key in DEFAULTS && typeof value === "string")) }),
  material: saved => (saved && typeof saved === "object" ? saved : { bundle: "none", overrides: {} }),
  colours: saved => (saved && typeof saved === "object" ? saved : { light: null, dark: null }),
  accent: saved => (saved && typeof saved === "object" ? saved : { on: false, primary: "#006df5", secondary: null, tertiary: null, status: "harmonised" }),
} as Restorers;
const NOW = new Date("2026-10-30T12:00:00Z");
const MATERIAL = { bundle: "none", overrides: {} };
const radius = (value: string) => (theme: { canvas: Record<string, string> }) => ({ ...theme, canvas: { ...theme.canvas, radius: value } }) as never;

test("a look starts following Area; a saved one keeps only the settings it still knows", () => {
  assert.deepEqual(restoreAppLook(null, DEFAULTS), { follow: true, system: "area", theme: undefined, own: DEFAULTS });
  const saved = restoreAppLook({ follow: false, system: "northwind", theme: "dark", own: { type: "15", gone: "1", radius: 4 } }, DEFAULTS);
  assert.deepEqual(saved, { follow: false, system: "northwind", theme: "dark", own: { type: "15", radius: "10" } });
});

test("the app follows a system as published, never its working copy", () => {
  const area = { ...starterSystem("Area", [], RESTORE, "starter", NOW), id: "area" };
  const edited = withTheme(area, radius("4"));
  assert.equal(chromeOf({ follow: true, system: "area", own: DEFAULTS }, [edited], MATERIAL).canvas.radius, "10");
  const published = publish(edited, "fixes", "Corners", NOW);
  assert.equal(chromeOf({ follow: true, system: "area", own: DEFAULTS }, [published], MATERIAL).canvas.radius, "4");
});

test("off, the app takes its own settings; a followed system that is gone falls back to Area's", () => {
  const area = { ...starterSystem("Area", [], RESTORE, "starter", NOW), id: "area" };
  assert.equal(chromeOf({ follow: false, system: "area", own: { ...DEFAULTS, type: "15" } }, [area], MATERIAL).canvas.type, "15");
  const look = chromeOf({ follow: true, system: "gone", theme: "gone", own: DEFAULTS }, [area], MATERIAL);
  assert.equal(look.system?.id, "area");
  assert.equal(look.theme, area.theme);
});

test("reading and access overrides: text size over a followed system, reduce motion everywhere, unknown values dropped", () => {
  const area = { ...starterSystem("Area", [], RESTORE, "starter", NOW), id: "area" };
  const follows = { follow: true, system: "area", own: DEFAULTS };
  assert.equal(chromeOf({ ...follows, type: "15" }, [area], MATERIAL).canvas.type, "15");
  // A look of its own sets Type among its own settings; the override is a followed system's.
  assert.equal(chromeOf({ follow: false, system: "area", own: DEFAULTS, type: "15" }, [area], MATERIAL).canvas.type, "13");
  const still = chromeOf({ ...follows, reduceMotion: true }, [area], MATERIAL).canvas;
  assert.equal(still.motion, "0");
  assert.equal(still.feedback, "off");
  const saved = restoreAppLook({ follow: true, system: "area", own: {}, type: "40", reduceMotion: "yes", followContrast: false, reduceTransparency: true }, DEFAULTS);
  assert.equal(saved.type, undefined);
  assert.equal(saved.reduceMotion, undefined);
  assert.equal(saved.followContrast, false);
  assert.equal(saved.reduceTransparency, true);
});
