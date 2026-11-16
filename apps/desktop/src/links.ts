/**
 * Links in (docs/research/desktop-app-analysis-2026-11-10, U9): an `area://` link names a place in the app, the same
 * place a tab's hash does (src/places.ts): `area://system/area/components/button`, `area://project/<id>/preview`. A
 * link opens from chat, from another app or from a link copied with Copy Link (⌘⇧C). Pure: the links test imports it.
 */
import { hrefOf, type Place } from "./places.ts";

export const SCHEME = "area";

/** A place's link. */
export const linkOf = (place: Place) => `${SCHEME}://${hrefOf(place).replace(/^#/, "")}`;

/**
 * The hash a link names ("area://project/x/preview" → "#project/x/preview"), or null when it is not one of Area's.
 * `area:project/x` (no slashes) reads the same. Only a path's characters pass: never a script or another host.
 */
export function hashOfLink(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const match = /^area:(?:\/\/)?([^?#\s]*)$/i.exec(url.trim());
  if (!match) return null;
  const path = match[1]!.replace(/^\/+|\/+$/g, "");
  if (!path || !/^[A-Za-z0-9._~%/-]+$/.test(path)) return null;
  return `#${path}`;
}
