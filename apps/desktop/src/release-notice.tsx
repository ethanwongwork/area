/**
 * A project told about its system's newer versions (docs/research/system-inventory-2026-11-08, Q7). A project keeps the
 * version it was made with; Fixes and Adds reach it on their own, and a release that Needs work in products waits for it
 * (src/systems.ts `followedVersion`). While one waits, the project's Overview opens with this notice: what the newer
 * version changes, which of the project's layers use something it leaves out (written uses in each screen's source,
 * src/library.ts `usesIn`), Review (the changes in a table, as Publish lists them) and Update (the project moves to the
 * newest version). Nothing changes in the project until it updates.
 */
import { useState, type ReactNode } from "react";
import { LibraryPictures } from "./library-pictures.tsx";
import { Alert, Button, Dialog, Table, TableCell, TableHeaderCell } from "@area/react";
import { useStudio } from "./studio.tsx";
import { screenFile } from "./design-panel.tsx";
import { changeLabel, changePlace, changeValue, draftNote } from "./publish.tsx";
import { componentName, familyName } from "./inventory.tsx";
import { usesIn, valueLabel } from "./library.ts";
import { changesBetween, followedVersion, releasesAfter, versionName, type Change, type Release } from "./systems.ts";
import type { Project } from "./projects.ts";

/** Something the newer version leaves out, and the project's layers that use it (by name). */
interface Use { what: string; layers: string[] }

/** What a project's layers use of what `changes` leave out. */
function usesOf(project: Project, changes: readonly Change[]): Use[] {
  const out = changes.filter(change => change.family && (change.what === "left-out" || change.what === "family-left-out"));
  return out.flatMap(change => {
    const component = componentName(change.family!);
    if (!component) return [];
    const state = change.axis === "state";
    const layers = project.pages.flatMap(page => page.layers).filter(layer => {
      const code = layer.kind === "screen" ? screenFile(layer.ref)?.code : undefined;
      if (!code) return false;
      return change.what === "family-left-out" ? usesIn(code, component) > 0
        : state ? usesIn(code, component, change.value!.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())) > 0
        : usesIn(code, component, change.axis, change.value) > 0;
    }).map(layer => layer.name);
    const what = change.what === "family-left-out" ? familyName(change.family!) : `${familyName(change.family!)}'s ${valueLabel(change.family!, change.axis!, change.value!).toLowerCase()}`;
    return layers.length ? [{ what, layers }] : [];
  });
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export function ReleaseNotice({ project }: { project: Project }) {
  const { workingSystem, updateProject } = useStudio();
  const [reviewing, setReviewing] = useState(false);
  const followed = followedVersion(workingSystem, project.release);
  const waiting = releasesAfter(workingSystem, followed);
  if (!waiting.length || workingSystem.id !== project.system) return null;
  const fromRelease = workingSystem.releases.find(release => release.version === followed)!;
  const latest = waiting.at(-1)!;
  const changes = changesBetween(fromRelease, latest);
  const uses = usesOf(project, changes);
  const name = versionName(workingSystem.name, latest.version);
  const update = () => { updateProject(project.id, current => ({ ...current, release: latest.version })); setReviewing(false); };
  const summary = (latest.note || draftNote(changes) || "It changes what products use").replace(/\.$/, "");
  const usesLine = uses.length
    ? uses.map(use => `${use.what} is left out; ${plural(use.layers.length, "layer")} here ${use.layers.length === 1 ? "uses" : "use"} it`).join(". ") + "."
    : "Nothing here uses what it leaves out.";
  return (
    <>
      <Alert tone="info" layout="multiline" title={`${name} is out`}
        action={<>
          <Button size="sm" variant="ghost" tone="neutral" onClick={() => setReviewing(true)}>Review</Button>
          <Button size="sm" onClick={update}>Update</Button>
        </>}>
        {summary}. {usesLine} This project stays on {versionName(workingSystem.name, followed)} until you update.
      </Alert>
      {reviewing ? <ReviewUpdate name={name} from={versionName(workingSystem.name, followed)} changes={changes} uses={uses} waiting={waiting}
        pictures={<LibraryPictures before={fromRelease.library} after={latest.library} changes={changes} beforeLabel="Now" afterLabel={latest.version} />}
        onUpdate={update} onClose={() => setReviewing(false)} /> : null}
    </>
  );
}

/** Review: every change between the project's version and the newest, as Publish lists them, and what here uses them. */
function ReviewUpdate({ name, from, changes, uses, waiting, pictures, onUpdate, onClose }: {
  name: string; from: string; changes: readonly Change[]; uses: readonly Use[]; waiting: readonly Release[]; pictures: ReactNode; onUpdate: () => void; onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={next => { if (!next) onClose(); }} title={`Update to ${name}`}
      description={`From ${from}, through ${plural(waiting.length, "version")}. The project's layers keep what they say; what a version leaves out is no longer offered.`}
      footer={<>
        <Button variant="ghost" tone="neutral" onClick={onClose}>Not now</Button>
        <Button onClick={onUpdate}>Update to {name}</Button>
      </>}>
      <div className="studio-publish">
        {pictures}
        {uses.length ? (
          <Table aria-label="Used here">
            <thead><tr><TableHeaderCell>Left out</TableHeaderCell><TableHeaderCell>Used by</TableHeaderCell></tr></thead>
            <tbody>{uses.map(use => <tr key={use.what}><TableCell>{use.what}</TableCell><TableCell>{use.layers.join(", ")}</TableCell></tr>)}</tbody>
          </Table>
        ) : null}
        <Table aria-label="Changes">
          <thead><tr><TableHeaderCell>Where</TableHeaderCell><TableHeaderCell>Setting</TableHeaderCell><TableHeaderCell>Now</TableHeaderCell><TableHeaderCell>After</TableHeaderCell></tr></thead>
          <tbody>
            {changes.map((change, at) => (
              <tr key={at}>
                <TableCell>{changePlace(change)}</TableCell>
                <TableCell>{changeLabel(change)}</TableCell>
                <TableCell className="studio-muted">{changeValue(change, change.before, "before")}</TableCell>
                <TableCell>{changeValue(change, change.after, "after")}</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Dialog>
  );
}
