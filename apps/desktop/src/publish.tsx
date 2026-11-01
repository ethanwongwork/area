/**
 * Publishing a system (the IA of 2026-10-29, "one place": https://claude.ai/artifact/TRWJYDWrxVaxCTvtJNxwD5). A system is
 * edited in place: its themes are the working copy, and what everyone else and every project sees is its last release
 * (src/systems.ts). While the working copy has changes, a system tab's Canvas bar ends in a Live / Working switch (how the
 * tab shows the system: rule 14) and Publish; with none, both are left out (rule 16).
 *
 * Publish opens a dialog that shows the change before it lands, as the owner asked ("even a simple color change might be
 * useful to have visualized and documented"): Live beside Publishing for the theme in use, every changed value in a
 * table, the kind (Fixes, Adds, Needs work in products, Area's words for patch, minor and major) and a note, which become
 * the version and its row in History. Discard changes sets the working copy back to Live.
 */
import { useState, type FormEvent } from "react";
import { Button, ConfirmDialog, Dialog, Field, Input, Radio, RadioGroup, Segmented, Table, TableCell, TableHeaderCell } from "@area/react";
import { canvasAttributes, useStudio } from "./studio.tsx";
import { ViewControls } from "./view-controls.tsx";
import { SHOWCASE, ScreenFigure } from "./setup-screen.tsx";
import { Tile } from "./tile.tsx";
import { GALLERY_CONTROLS } from "./gallery/controls.ts";
import { tabKind } from "./places.ts";
import { activeTheme, asLive, liveOf, nextVersion, proposedKind, RELEASE_KIND_LABEL, versionName, type Change, type ReleaseKind, type SystemTheme } from "./systems.ts";

type Kind = Exclude<ReleaseKind, "first">;
export const KINDS: ReadonlyArray<{ value: Kind; description: string }> = [
  { value: "fixes", description: "Values change; nothing is added or taken away." },
  { value: "adds", description: "Something new, such as a theme." },
  { value: "needs-work", description: "Something removed or renamed: products using it need work." },
];

const CONTROL = new Map(GALLERY_CONTROLS.map(control => [control.axis, control] as const));
const VALUE_NAMES: Record<string, string> = { material: "Material", colours: "Exact page colors", accent: "Exact accent" };

/** A change's setting, as the Inspector names it. */
export function changeLabel(change: Change): string {
  if (change.what === "added") return "Theme added";
  if (change.what === "removed") return "Theme removed";
  if (change.what === "name") return "Name";
  return CONTROL.get(change.what as never)?.label ?? VALUE_NAMES[change.what] ?? change.what;
}
/** A changed value, as the Inspector shows it ("Compact", "60%"). */
export function changeValue(change: Change, value: string | undefined): string {
  if (value === undefined) return change.what === "added" ? "—" : change.what === "removed" ? "—" : "Changed";
  return CONTROL.get(change.what as never)?.items.find(item => item.value === value)?.label ?? value;
}

/** A first note from the changes, for the person to edit: "Radius, Density and Accent in Default". */
export function draftNote(changes: readonly Change[]): string {
  const added = changes.filter(change => change.what === "added").map(change => change.theme);
  const removed = changes.filter(change => change.what === "removed").map(change => change.theme);
  const values = changes.filter(change => !["added", "removed"].includes(change.what));
  const list = (words: string[]) => words.length < 3 ? words.join(" and ") : `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`;
  const parts = [
    added.length ? `Adds ${list(added)}` : "",
    removed.length ? `Removes ${list(removed)}` : "",
    values.length ? `${list([...new Set(values.map(changeLabel))].slice(0, 4))}${values.length > 4 ? " and more" : ""} in ${list([...new Set(values.map(change => change.theme))])}` : "",
  ].filter(Boolean);
  return parts.join("; ");
}

/**
 * Live beside Publishing, each a theme's screen in a fitted tile (as Themes draws them), so the change is seen before it
 * lands. With nothing before (a new theme), the first tile says so.
 */
export function BeforeAfter({ before, after, empty, mode }: {
  before: { label: string; value: string; theme: SystemTheme } | null; after: { label: string; value: string; theme: SystemTheme }; empty: string; mode: "light" | "dark";
}) {
  return (
    <div className="studio-publish__pair">
      {before ? (
        <Tile span="wide" stage="screen" inert label={before.label} value={before.value}><ThemeScreen theme={before.theme} mode={mode} /></Tile>
      ) : (
        <Tile span="wide" stage="center" inert label="Nothing before" value=""><p className="studio-muted">{empty}</p></Tile>
      )}
      <Tile span="wide" stage="screen" inert label={after.label} value={after.value}><ThemeScreen theme={after.theme} mode={mode} /></Tile>
    </div>
  );
}

/** A theme's screen, as Themes and Home draw it, in the app's light or dark. */
export function ThemeScreen({ theme, mode }: { theme: SystemTheme; mode: "light" | "dark" }) {
  return <ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={{ ...canvasAttributes(theme.canvas, theme.material), "data-area-theme": mode }} />;
}

/**
 * The end of a system tab's Canvas bar: Live / Draft and Publish, while the working copy has changes. Draft is Figma's word
 * for what is not published yet; the app's copy says design words, not git's (owner, 2026-10-31: "the whole merge, repo,
 * commit, push terminology should be updated to design friendly terms"; Working until then).
 */
export function PublishControls() {
  const { place, live, setLive, changes } = useStudio();
  const [publishing, setPublishing] = useState(false);
  if (tabKind(place) !== "system" || place.page === "theme-setup" || !changes.length) return null;
  return (
    <>
      <ViewControls>
        <Segmented size="sm" aria-label="Show" value={live ? "live" : "working"} onValueChange={value => setLive(value === "live")}
          items={[{ value: "live", label: "Live" }, { value: "working", label: "Draft" }]} />
        <Button size="sm" onClick={() => setPublishing(true)}>Publish {changes.length} {changes.length === 1 ? "change" : "changes"}</Button>
      </ViewControls>
      {/* Outside the bar's group, whose text never wraps. */}
      {publishing ? <PublishDialog onClose={() => setPublishing(false)} /> : null}
    </>
  );
}

export function PublishDialog({ onClose }: { onClose: () => void }) {
  const { workingSystem, changes, publishSystem, revertSystem, theme } = useStudio();
  const proposed = proposedKind(changes);
  const [kind, setKind] = useState<Kind>(proposed);
  const [note, setNote] = useState(() => draftNote(changes));
  const [discarding, setDiscarding] = useState(false);
  const live = liveOf(workingSystem);
  const version = nextVersion(live.version, kind);
  const now = activeTheme(workingSystem);
  const was = asLive(workingSystem).themes.find(entry => entry.id === now.id);
  const submit = (event?: FormEvent) => { event?.preventDefault(); publishSystem(kind, note || draftNote(changes)); onClose(); };
  if (discarding) return (
    <ConfirmDialog open title="Discard changes?" tone="danger" confirmLabel="Discard changes"
      description={`${workingSystem.name} goes back to ${versionName(workingSystem.name, live.version)}, as everyone else sees it. The ${changes.length} unpublished ${changes.length === 1 ? "change is" : "changes are"} lost.`}
      onOpenChange={next => { if (!next) setDiscarding(false); }} onConfirm={() => { revertSystem(); onClose(); }} />
  );
  return (
    <Dialog open onOpenChange={next => { if (!next) onClose(); }} title={`Publish ${versionName(workingSystem.name, version)}`}
      description={`Everyone using ${workingSystem.name} and every project on it gets ${versionName(workingSystem.name, version)}. It goes in Versions with this note.`}
      footer={<>
        <Button variant="ghost" tone="danger" className="studio-publish__discard" onClick={() => setDiscarding(true)}>Discard changes</Button>
        <Button variant="ghost" tone="neutral" onClick={onClose}>Cancel</Button>
        <Button onClick={() => submit()}>Publish {versionName(workingSystem.name, version)}</Button>
      </>}>
      <form className="studio-publish" onSubmit={submit}>
        <BeforeAfter before={was ? { label: `Live in ${versionName(workingSystem.name, live.version)}`, value: was.name, theme: was } : null} after={{ label: `Publishing as ${versionName(workingSystem.name, version)}`, value: now.name, theme: now }} empty={`${now.name} is new.`} mode={theme} />
        <Table aria-label="Changes">
          <thead><tr><TableHeaderCell>Theme</TableHeaderCell><TableHeaderCell>Setting</TableHeaderCell><TableHeaderCell>Live</TableHeaderCell><TableHeaderCell>Publishing</TableHeaderCell></tr></thead>
          <tbody>
            {changes.map((change, at) => (
              <tr key={at}>
                <TableCell>{change.theme}</TableCell>
                <TableCell>{changeLabel(change)}</TableCell>
                <TableCell className="studio-muted">{changeValue(change, change.before)}</TableCell>
                <TableCell>{changeValue(change, change.after)}</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
        <RadioGroup label="Kind" value={kind} onValueChange={value => setKind(value as Kind)}>
          {KINDS.map(entry => (
            <Radio key={entry.value} variant="soft" layout="list" value={entry.value} label={RELEASE_KIND_LABEL[entry.value]} meta={versionName(workingSystem.name, nextVersion(live.version, entry.value))}
              description={entry.value === proposed ? `${entry.description} Proposed from the changes.` : entry.description} />
          ))}
        </RadioGroup>
        <Field label="Note"><Input fullWidth value={note} onChange={event => setNote(event.target.value)} placeholder={draftNote(changes)} /></Field>
      </form>
    </Dialog>
  );
}
