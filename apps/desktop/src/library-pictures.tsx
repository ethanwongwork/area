/**
 * A library change seen before it lands (docs/research/system-inventory-2026-11-08, Q6): Publish's pictures for the
 * families a publish changes, beside or in place of the theme screens, which a library-only change leaves identical.
 *   a default or structure  the family's Default tile drawn with Live's defaults, then with the publishing ones, each
 *                           named by the family and badged by its version ("Live", "Publishing", "1.0", "2.0")
 *   a value left out        the gallery tile that shows it, marked Left out (Back in when it returns)
 *   a family left out       its Default tile, marked Left out
 * At most FAMILIES_SHOWN families and twice as many pictures; the table under them lists every change.
 */
import type { ReactNode } from "react";
import { SystemDefaults } from "@area/react";
import { Tile } from "./tile.tsx";
import { Demo, familyTiles } from "./pages/components.tsx";
import { familyName, manifestFor, defaultsOf } from "./inventory.tsx";
import { tileChoices } from "./library.ts";
import type { Change, SystemLibrary } from "./systems.ts";

const FAMILIES_SHOWN = 4; /* pick */

export function LibraryPictures({ before, after, changes, beforeLabel, afterLabel }: {
  before: SystemLibrary; after: SystemLibrary; changes: readonly Change[]; beforeLabel: string; afterLabel: string;
}) {
  const liveDefaults = defaultsOf(before), nextDefaults = defaultsOf(after);
  const families = [...new Set(changes.flatMap(change => change.family ? [change.family] : []))].slice(0, FAMILIES_SHOWN);
  // Before-and-after pairs first, so each pair shares a row; then the single tiles.
  const pairs: ReactNode[] = [], singles: ReactNode[] = [];
  for (const slug of families) {
    const all = familyTiles(slug);
    if (!all.length) continue;
    const own = changes.filter(change => change.family === slug);
    const name = familyName(slug);
    const first = all[0]!;
    const drawn = (key: string, label: string, value: string, status: "published" | "archived" | undefined, defaults: typeof liveDefaults, demo: string) => (
      <Tile key={key} span="wide" stage="center" inert label={label} value={value} status={status}>
        <SystemDefaults value={defaults}><Demo name={demo} /></SystemDefaults>
      </Tile>
    );
    if (own.some(change => change.what === "family-left-out" || change.what === "family-included")) {
      const out = own.some(change => change.what === "family-left-out");
      singles.push(drawn(`${slug}:family`, name, out ? "Left out" : "Back in", out ? "archived" : "published", nextDefaults, first.demo));
      continue;
    }
    if (own.some(change => change.what === "default")) {
      pairs.push(drawn(`${slug}:before`, name, beforeLabel, undefined, liveDefaults, first.demo));
      pairs.push(drawn(`${slug}:after`, name, afterLabel, undefined, nextDefaults, first.demo));
    }
    const manifest = manifestFor(slug);
    for (const change of own.filter(entry => entry.what === "left-out" || entry.what === "included")) {
      const tile = manifest && all.find(entry => tileChoices(entry.name, manifest).some(choice => choice.axis === change.axis && choice.value === change.value));
      if (!tile) continue;
      const out = change.what === "left-out";
      singles.push(drawn(`${slug}:${change.axis}:${change.value}`, `${name} ${tile.value.toLowerCase()}`, out ? "Left out" : "Back in", out ? "archived" : "published", nextDefaults, tile.demo));
    }
  }
  const tiles = [...pairs, ...singles].slice(0, FAMILIES_SHOWN * 2);
  if (!tiles.length) return null;
  // Two across, as Publish's theme pair (app.css .studio-publish__pair), so a name and its badge fit.
  return <div className="studio-publish__pair">{tiles}</div>;
}
