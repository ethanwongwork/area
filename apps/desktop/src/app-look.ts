/**
 * The app's own look (owner, 2026-10-30: "it should follow the chosen system, which can be updated in a settings page like
 * cursors"; it reverses PRODUCT_UI.md rule 18's 2026-10-25 version, the app drawn in Area's shipped defaults). The Electron
 * UI is drawn in one system's theme as that system publishes it, Area's chosen theme until the person picks another in
 * Settings › Appearance, or, with Follow a system off, in settings of its own. Saved in this browser's storage (`appLook`).
 *
 * Pure: the places test imports nothing from React; `chromeOf` takes the systems and the defaults it falls back to.
 */
import { activeTheme, asLive, AREA_ID, type System } from "./systems.ts";

export interface AppLook {
  /** Draw the app in a system's published theme (true), or in `own`. */
  follow: boolean;
  /** The system it follows, and which of its themes (its chosen one when unset or gone). */
  system: string;
  theme?: string;
  /** The app's own settings, every Canvas axis (src/studio.tsx CanvasAxes); used while `follow` is off. */
  own: Record<string, string>;
  /** The app's own Material (src/material.ts), with `own`; the default Material when unset. */
  material?: unknown;
  /**
   * How the regions sit in the window, whatever the app is drawn in (owner, 2026-10-31, pick p5 of
   * docs/research/claude-code-ui-audit-2026-10-31.md, after Claude Code's two shells): sectioned, side by side with seams
   * (the default), or floating, the Canvas and the Inspector as Panels on the Sidebar's ground.
   */
  panels?: AppPanels;
  /*
   * Overrides for reading and access, over whatever the app is drawn in (owner, 2026-11-07: "build and implement some of
   * the cursor settings for appearance if they are helpful"; Cursor's UI Font Size, Reduce Motion, Follow System High
   * Contrast and Reduce Transparency, docs/research/settings-2026-11-07). Each is unset at its default.
   */
  /** The app's text size, a Type value ("12"–"16"), over the followed system's Type. */
  type?: string;
  /** Motion off whatever the Mac is set to: motion 0 and press feedback off, as `prefers-reduced-motion` resolves. */
  reduceMotion?: boolean;
  /** false: the theme's own contrast even when the Mac asks for more (on by default, as the tokens follow the Mac). */
  followContrast?: boolean;
  /** Opaque, unblurred fills whatever the Material, as `prefers-reduced-transparency` resolves. */
  reduceTransparency?: boolean;
}

/** The Type values the app's text size steps through. */
export const APP_TYPES = ["12", "13", "14", "15", "16"] as const;

export type AppPanels = "sectioned" | "floating";

/** The look the app starts in: Area's chosen theme, as published. */
export const followArea = (own: Record<string, string>): AppLook => ({ follow: true, system: AREA_ID, own });

/** A saved look, each part kept only while it still makes sense: an unknown system falls back to Area's in `chromeOf`. */
export function restoreAppLook(saved: unknown, defaults: Record<string, string>): AppLook {
  const value = (saved && typeof saved === "object" ? saved : {}) as Partial<AppLook>;
  const own: Record<string, string> = { ...defaults };
  if (value.own && typeof value.own === "object") for (const [axis, setting] of Object.entries(value.own)) if (axis in defaults && typeof setting === "string") own[axis] = setting;
  return {
    ...(value.material && typeof value.material === "object" ? { material: value.material } : {}),
    ...(value.panels === "floating" ? { panels: "floating" as const } : {}),
    ...(typeof value.type === "string" && (APP_TYPES as readonly string[]).includes(value.type) ? { type: value.type } : {}),
    ...(value.reduceMotion === true ? { reduceMotion: true } : {}),
    ...(value.followContrast === false ? { followContrast: false } : {}),
    ...(value.reduceTransparency === true ? { reduceTransparency: true } : {}),
    follow: value.follow !== false,
    system: typeof value.system === "string" && value.system ? value.system : AREA_ID,
    theme: typeof value.theme === "string" && value.theme ? value.theme : undefined,
    own,
  };
}

/**
 * What the app is drawn in: the followed system's theme as published (a system's unpublished working copy never reaches the
 * app, as it never reaches a project), else the app's own settings with `material`. A system that is gone falls back to
 * Area, a theme that is gone to the system's chosen one.
 */
export function chromeOf<M>(look: AppLook, systems: readonly System[], material: M): { canvas: Record<string, string>; material: M | System["themes"][number]["material"]; system?: System; theme?: string } {
  const drawn = drawnIn(look, systems, material);
  return { ...drawn, canvas: withOverrides(drawn.canvas, look) };
}

function drawnIn<M>(look: AppLook, systems: readonly System[], material: M): { canvas: Record<string, string>; material: M | System["themes"][number]["material"]; system?: System; theme?: string } {
  if (!look.follow) return { canvas: look.own, material: (look.material as M | undefined) ?? material };
  const chosen = systems.find(entry => entry.id === look.system) ?? systems.find(entry => entry.id === AREA_ID) ?? systems[0];
  if (!chosen) return { canvas: look.own, material: (look.material as M | undefined) ?? material };
  const published = asLive(chosen);
  const theme = published.themes.find(entry => entry.id === look.theme) ?? activeTheme(published);
  return { canvas: theme.canvas as unknown as Record<string, string>, material: theme.material, system: chosen, theme: theme.id };
}

/** The reading and access overrides on the settings the app is drawn in (contrast and transparency are applied where the
    Mac's preference and the Material are read, src/studio.tsx). A look of its own sets its Type in its own settings. */
function withOverrides(canvas: Record<string, string>, look: AppLook): Record<string, string> {
  if (!(look.follow && look.type) && !look.reduceMotion) return canvas;
  return {
    ...canvas,
    ...(look.follow && look.type ? { type: look.type } : {}),
    ...(look.reduceMotion ? { motion: "0", feedback: "off" } : {}),
  };
}
