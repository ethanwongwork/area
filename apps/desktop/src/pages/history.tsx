/**
 * Versions, a system's last section (the IA of 2026-10-29; History until 2026-10-31, renamed to match a project's
 * Versions, PRODUCT_UI.md rule 24): its release notes, every publish, newest first, each its version, kind, date, note
 * and where it came from (the system itself, or a project's exploration), drawn as its theme in use beside the version
 * before it, so the changelog is seen rather than read. A version chosen shows its facts in the Inspector, with Restore,
 * which makes it the working copy to publish again (a revert is a new publish, never a rewrite of History).
 *
 * Location: #system/<system>/history/<version>.
 */
import { useState } from "react";
import { Button, ConfirmDialog, Meter, PanelSection, TreeView, type TreeViewNode } from "@area/react";
import { SETTING_GROUPS } from "@area/tokens/config";
import { useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { Facts } from "../facts.tsx";
import { changeLabel, changePlace, changeValue, ThemeScreen } from "../publish.tsx";
import { liveOf, RELEASE_KIND_LABEL, versionName, type Change, type Release } from "../systems.ts";

/** A release's card is the feed's 300 card, as a theme's. */
const RELEASE_MIN = 300; /* pick */

const dateOf = (at: string) => new Date(at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const inUse = (release: Release) => release.themes.find(theme => theme.id === release.theme) ?? release.themes[0]!;

/*
 * Where the unpublished changes are, as a stacked Meter (owner, 2026-10-30, docs/research/inspector-panel-2026-10-30,
 * "A stacked meter"): one part per heading of the Inspector's Theme view, in its order, so a part's colour always means
 * the same heading. A meter has eight colours, so the first seven headings keep their own and the rest share Other
 * (States, Effects, Material, and themes added, removed or renamed).
 */
const CHANGE_PARTS = ["Page", "Accent", "Emphasis", "Size", "Shape", "Stroke", "Shadow", "Other"] as const;
function partOf(what: string): (typeof CHANGE_PARTS)[number] {
  // Exact page colours are the Page heading's; the exact accent is the accent setting's own change.
  const heading = what === "colours" ? "Page" : SETTING_GROUPS.find(group => group.settings.includes(what))?.heading;
  return CHANGE_PARTS.find(part => part === heading) ?? "Other";
}

/*
 * The unpublished changes as a file tree (owner, 2026-10-30, "A file-tree density for Tree view"): each theme a branch
 * marked A when it is new, D when it is gone, M when its settings changed, and under it each setting it changed, M, with
 * its new value at the end, as a source tree lists changed files.
 */
function changeTree(changes: readonly Change[]): TreeViewNode[] {
  // The library's changes (every theme shares them) are their own branch, Components (src/publish.tsx changePlace).
  const themes = [...new Set(changes.map(changePlace))];
  return themes.map(theme => {
    const own = changes.filter(change => changePlace(change) === theme);
    const values = own.filter(change => change.what !== "added" && change.what !== "removed");
    return {
      id: `theme:${theme}`, label: theme,
      status: own.some(change => change.what === "added") ? "added" : own.some(change => change.what === "removed") ? "deleted" : "modified",
      children: values.length ? values.map((change, index) => ({
        id: `theme:${theme}:${change.what}:${index}`, label: changeLabel(change), status: "modified" as const,
        trailing: changeValue(change, change.after),
      })) : undefined,
    };
  });
}

export function HistoryPage() {
  const { item, select, workingSystem, changes, revertSystem, theme } = useStudio();
  const [restoring, setRestoring] = useState(false);
  const releases = workingSystem.releases;
  const live = liveOf(workingSystem);
  const chosen = releases.find(release => release.version === item) ?? null;
  const newestFirst = [...releases].reverse();
  return (
    <Workspace
      canvasTitle="Versions"
      canvas={<>
        <div className="studio-sections">
          {newestFirst.map(release => {
            const at = releases.indexOf(release);
            const before = at > 0 ? releases[at - 1]! : null;
            return (
              <CanvasSection key={release.version} id={`release-${release.version}`} title={versionName(workingSystem.name, release.version)}
                lede={`${RELEASE_KIND_LABEL[release.kind]}, published ${dateOf(release.at)}${release.from ? ` from ${release.from}` : ""}${release === live ? "; live now" : ""}. ${release.note || "No note."}`}>
                <TileGrid span="wide" cards min={RELEASE_MIN}>
                  {before ? (
                    <Tile span="wide" stage="screen" inert label={`Before, ${versionName(workingSystem.name, before.version)}`} value={inUse(before).name}
                      selected={false} onSelect={() => select(release.version, { replace: true })}>
                      <ThemeScreen theme={inUse(before)} mode={theme} />
                    </Tile>
                  ) : null}
                  <Tile span="wide" stage="screen" inert label={versionName(workingSystem.name, release.version)} value={inUse(release).name}
                    selected={chosen === release} onSelect={() => select(release.version, { replace: true })}>
                    <ThemeScreen theme={inUse(release)} mode={theme} />
                  </Tile>
                </TileGrid>
              </CanvasSection>
            );
          })}
        </div>
        {chosen && restoring ? (
          <ConfirmDialog open title={`Restore ${versionName(workingSystem.name, chosen.version)}?`} confirmLabel="Restore"
            description={`Your draft becomes ${versionName(workingSystem.name, chosen.version)}, ready to publish as the next version. ${changes.length ? `Its ${changes.length} unpublished ${changes.length === 1 ? "change is" : "changes are"} replaced.` : "Nothing published changes until you publish."}`}
            onOpenChange={next => { if (!next) setRestoring(false); }} onConfirm={() => { revertSystem(chosen.version); setRestoring(false); }} />
        ) : null}
      </>}
      inspector={{
        design: chosen ? (<>
          {chosen !== live || changes.length ? (
            <PanelSection>
              <div className="studio-inspector-actions">
                <Button size="sm" variant="soft" tone="neutral" onClick={() => setRestoring(true)}>{chosen === live ? "Discard changes" : "Restore"}</Button>
              </div>
            </PanelSection>
          ) : null}
          <PanelSection heading={versionName(workingSystem.name, chosen.version)}>
            <Facts label="Version" items={[
              ["Kind", RELEASE_KIND_LABEL[chosen.kind]],
              ["Published", dateOf(chosen.at)],
              ["From", chosen.from ?? workingSystem.name],
              ["Themes", chosen.themes.map(entry => entry.name).join(", ")],
              ["Live", chosen === live ? "Yes" : "No"],
            ]} note={chosen.note || undefined} />
          </PanelSection>
        </>) : (
          <>
            <PanelSection heading="Versions">
              <Facts label="Versions" items={[
                ["Live", versionName(workingSystem.name, live.version)],
                ["Publishes", releases.length],
                changes.length ? null : ["Unpublished", "None"],
              ]} />
            </PanelSection>
            {changes.length ? (
              <PanelSection heading="Unpublished" count={changes.length}>
                <Meter aria-label="Unpublished changes by group" valueText={null}
                  segments={CHANGE_PARTS.map(part => ({ label: part, value: changes.filter(change => partOf(change.what) === part).length }))} />
                <TreeView size="sm" guides aria-label="Unpublished changes" items={changeTree(changes)}
                  defaultExpandedIds={[...new Set(changes.map(change => `theme:${change.theme}`))]} />
              </PanelSection>
            ) : null}
          </>
        ),
      }}
    />
  );
}
