/**
 * History, a system's last section (the IA of 2026-10-29): every publish, newest first, each its version, kind, date, note
 * and where it came from (the system itself, or a project's exploration), drawn as its theme in use beside the version
 * before it, so the changelog is seen rather than read. A version chosen shows its facts in the Inspector, with Restore,
 * which makes it the working copy to publish again (a revert is a new publish, never a rewrite of History).
 *
 * Location: #system/<system>/history/<version>.
 */
import { useState } from "react";
import { Button, ConfirmDialog, PanelSection } from "@area/react";
import { useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { Facts } from "../facts.tsx";
import { ThemeScreen } from "../publish.tsx";
import { liveOf, RELEASE_KIND_LABEL, type Release } from "../systems.ts";

/** A release's card is the feed's 300 card, as a theme's. */
const RELEASE_MIN = 300; /* pick */

const dateOf = (at: string) => new Date(at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const inUse = (release: Release) => release.themes.find(theme => theme.id === release.theme) ?? release.themes[0]!;

export function HistoryPage() {
  const { item, select, workingSystem, changes, revertSystem, theme } = useStudio();
  const [restoring, setRestoring] = useState(false);
  const releases = workingSystem.releases;
  const live = liveOf(workingSystem);
  const chosen = releases.find(release => release.version === item) ?? null;
  const newestFirst = [...releases].reverse();
  return (
    <Workspace
      canvasTitle="History"
      canvas={<>
        <div className="studio-sections">
          {newestFirst.map(release => {
            const at = releases.indexOf(release);
            const before = at > 0 ? releases[at - 1]! : null;
            return (
              <CanvasSection key={release.version} id={`release-${release.version}`} title={`v${release.version} · ${RELEASE_KIND_LABEL[release.kind]}`}
                lede={`${dateOf(release.at)}${release.from ? ` · from ${release.from}` : ""}${release === live ? " · Live" : ""}. ${release.note || "No note."}`}>
                <TileGrid span="wide" cards min={RELEASE_MIN}>
                  {before ? (
                    <Tile span="wide" stage="fit" inert label={`Before · v${before.version}`} value={inUse(before).name}
                      selected={false} onSelect={() => select(release.version, { replace: true })}>
                      <ThemeScreen theme={inUse(before)} mode={theme} />
                    </Tile>
                  ) : null}
                  <Tile span="wide" stage="fit" inert label={`v${release.version}`} value={inUse(release).name}
                    selected={chosen === release} onSelect={() => select(release.version, { replace: true })}>
                    <ThemeScreen theme={inUse(release)} mode={theme} />
                  </Tile>
                </TileGrid>
              </CanvasSection>
            );
          })}
        </div>
        {chosen && restoring ? (
          <ConfirmDialog open title={`Restore v${chosen.version}?`} confirmLabel="Restore"
            description={`The working copy becomes v${chosen.version}, ready to publish as the next version. ${changes.length ? `Its ${changes.length} unpublished ${changes.length === 1 ? "change is" : "changes are"} replaced.` : "Nothing published changes until you publish."}`}
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
          <PanelSection heading={`v${chosen.version}`}>
            <Facts label="Version" items={[
              ["Kind", RELEASE_KIND_LABEL[chosen.kind]],
              ["Published", dateOf(chosen.at)],
              ["From", chosen.from ?? workingSystem.name],
              ["Note", chosen.note || "None"],
              ["Themes", chosen.themes.map(entry => entry.name).join(", ")],
              ["Live", chosen === live ? "Yes" : "No"],
            ]} />
          </PanelSection>
        </>) : (
          <PanelSection heading="History">
            <Facts label="History" items={[
              ["Live", `v${live.version}`],
              ["Publishes", releases.length],
              ["Unpublished", changes.length ? `${changes.length} ${changes.length === 1 ? "change" : "changes"}` : "None"],
            ]} />
          </PanelSection>
        ),
      }}
    />
  );
}
