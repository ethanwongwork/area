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
}

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
  if (!look.follow) return { canvas: look.own, material: (look.material as M | undefined) ?? material };
  const chosen = systems.find(entry => entry.id === look.system) ?? systems.find(entry => entry.id === AREA_ID) ?? systems[0];
  if (!chosen) return { canvas: look.own, material: (look.material as M | undefined) ?? material };
  const published = asLive(chosen);
  const theme = published.themes.find(entry => entry.id === look.theme) ?? activeTheme(published);
  return { canvas: theme.canvas as unknown as Record<string, string>, material: theme.material, system: chosen, theme: theme.id };
}
