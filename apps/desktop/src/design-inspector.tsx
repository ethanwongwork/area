/**
 * The Inspector's Design view on a project's page (owner, 2026-11-06: "shouldnt the actual figma style design panel be
 * there?"): with an element chosen on the stage (src/design-select.tsx), its properties, Area-aware (owner's pick):
 *
 *   Component  its manifest's props (Variant, Tone, Size …)
 *   Words      the text it shows
 *   Layout     direction and gap (a flex or grid frame), padding
 *   Fill       its fill and its words' ink, as color roles
 *   Type       its type role and weight
 *   Corner     its radius
 *
 * Each value is read from the element as drawn and shown as the token it matches, or as it is with "off scale". A choice
 * is a change: drawn on the stage at once and logged in the project (projects.ts `logChange`). The log sits at the
 * view's foot (the owner's pick), each change undoable, and Send to chat puts them all in Chat as one message, for the
 * agent to write into the screen's source; they stay drawn, marked sent, until cleared.
 */
import { useEffect, useMemo, useState, type RefObject } from "react";
import { Button, Count, CustomSelect, Input, PanelSection } from "@area/react";
import { ArrowUpIcon, DismissIcon, SendIcon } from "@area/icons";
import { ChromeButton, useStudio } from "./studio.tsx";
import { useChat } from "./chat/chat.tsx";
import { RowField } from "./inspector-rows.tsx";
import { FAMILIES } from "./pages/components.tsx";
import { describe, elementAt, parentOf, pathOf, propertiesOf, screensIn, type PropertyRow } from "./design-edit.ts";
import { clearSent, logChange, markSent, pendingChanges, undoChange, type DesignChange, type Project, type ProjectPage, type Layer } from "./projects.ts";

/** Sentinels for CustomSelect, which takes no empty value: a variant at its default, and a value off the scale. */
const DEFAULT = "__default", OFF = "__off";
const GROUPS: PropertyRow["group"][] = ["Component", "Text", "Layout", "Fill", "Type", "Corner"];

/** A family's own name for a component key ("Button"), else its root class in words. */
const familyName = (key: string | undefined, fallback: string) => FAMILIES.find(entry => entry.manifest === key)?.name ?? fallback;

export interface ElementPanelProps {
  project: Project;
  page: ProjectPage;
  layer: Layer;
  stage: RefObject<HTMLElement | null>;
  path: number[];
  onSelect: (path: number[] | null) => void;
}

/** The chosen element's properties. */
export function ElementPanel({ project, page, layer, stage, path, onSelect }: ElementPanelProps) {
  const { updateProject } = useStudio();
  const [read, setRead] = useState<{ target: string; label: string; component: boolean; rows: PropertyRow[]; parent: number[] | null } | null>(null);
  // Read again whenever the element or what is drawn on it changes (after the stage draws the changes).
  const drawn = JSON.stringify(project.changes.filter(entry => entry.page === page.id && entry.layer === layer.id).map(entry => [entry.path, entry.property, entry.value]));
  const key = path.join("/");
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const root = stage.current ? screensIn(stage.current)[0] : undefined;
        const element = root ? elementAt(root, path) : null;
        if (!root || !element) { setRead(null); return; }
        const named = describe(element, root);
        const parent = parentOf(element, root);
        setRead({ target: familyName(named.key, named.target), label: named.label, component: Boolean(named.key), rows: propertiesOf(element, root), parent: parent ? pathOf(parent, root) : null });
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [key, drawn, stage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!read) return <PanelSection heading="Selection"><p className="studio-muted">This element is no longer in the screen.</p></PanelSection>;
  const change = (row: PropertyRow, value: string, label: string) => updateProject(project.id, current => logChange(current, {
    page: page.id, layer: layer.id, path, target: read.target, label: read.label, property: row.property, name: row.name, from: row.currentLabel.replace(/ · (off scale|mixed)$/, ""), to: label, value,
  }));
  return (
    <>
      <PanelSection heading={read.target} actions={<>
        {read.parent ? <ChromeButton label="Select parent" icon={<ArrowUpIcon />} onClick={() => onSelect(read.parent)} /> : null}
        <ChromeButton label="Deselect" keys={["Esc"]} icon={<DismissIcon />} onClick={() => onSelect(null)} />
      </>}>
        {read.label ? <p className="studio-design__about">{read.label}</p> : null}
        {read.component ? <p className="studio-design__about">Its spacing, fill, type and corner come from its props and the theme.</p> : null}
      </PanelSection>
      {GROUPS.map(group => {
        const rows = read.rows.filter(row => row.group === group);
        if (!rows.length) return null;
        return (
          <PanelSection key={group} heading={group === "Text" ? "Words" : group}>
            {rows.map(row => <PropertyField key={row.property} row={row} onChange={(value, label) => change(row, value, label)} />)}
          </PanelSection>
        );
      })}
    </>
  );
}

/** One property's row: a choice of tokens or values, or the words. */
function PropertyField({ row, onChange }: { row: PropertyRow; onChange: (value: string, label: string) => void }) {
  const [words, setWords] = useState(row.current);
  useEffect(() => setWords(row.current), [row.current]);
  if (!row.options) {
    const commit = () => { if (words.trim() && words !== row.current) onChange(words, words); };
    return (
      <RowField label={row.name} orientation="horizontal" reset={false}>
        <Input size="sm" variant="soft" fullWidth value={words} onChange={event => setWords(event.target.value)} onBlur={commit}
          onKeyDown={event => { if (event.key === "Enter") commit(); if (event.key === "Escape") setWords(row.current); }} />
      </RowField>
    );
  }
  const items = [
    ...(row.offScale ? [{ value: OFF, label: row.currentLabel, disabled: true }] : []),
    ...row.options.map(option => ({ value: option.value || DEFAULT, label: option.label })),
  ];
  return (
    <RowField label={row.name} orientation="horizontal" reset={false}>
      <CustomSelect size="sm" variant="soft" fullWidth aria-label={row.name} items={items} value={row.offScale ? OFF : row.current || DEFAULT}
        onValueChange={next => { if (next === OFF) return; const option = row.options!.find(entry => (entry.value || DEFAULT) === next); if (option) onChange(option.value, option.label); }} />
    </RowField>
  );
}

/* --- The log ----------------------------------------------------------------------------------------------------------- */

/** A change in words: "Variant: Solid → Soft". */
const said = (change: DesignChange) => `${change.name}: ${change.from || "none"} → ${change.to}`;
const thing = (change: DesignChange) => !change.label ? change.target : change.target === "Frame" ? `Frame ${change.label}` : `${change.target} “${change.label}”`;

/** The message Chat gets: every pending change, by page and layer, with the screen's file. */
export function changesMessage(project: Project, changes: readonly DesignChange[], screenFile: (layer: Layer) => string | null): string {
  const lines = [`Make ${changes.length === 1 ? "this design change" : `these ${changes.length} design changes`} in ${project.name}, then tell me what you changed:`];
  let number = 1;
  const groups = new Map<string, DesignChange[]>();
  for (const change of changes) groups.set(`${change.page}/${change.layer}`, [...(groups.get(`${change.page}/${change.layer}`) ?? []), change]);
  for (const [at, list] of groups) {
    const [pageId, layerId] = at.split("/");
    const page = project.pages.find(entry => entry.id === pageId);
    const layer = page?.layers.find(entry => entry.id === layerId);
    const file = layer ? screenFile(layer) : null;
    lines.push("", `${page?.name ?? "A page"} › ${layer?.name ?? "a layer"}${file ? ` (${file})` : ""}`);
    for (const change of list) lines.push(`${number++}. ${thing(change)}: ${said(change)}${change.value.startsWith("var(") ? `, token ${change.value.slice(4, -1)}` : ""}`);
  }
  lines.push("", "Keep them to Area's components, props and tokens.");
  return lines.join("\n");
}

export interface ChangeLogProps {
  project: Project;
  /** The layer on the stage: its changes are named without their layer. */
  page: ProjectPage;
  layer: Layer | null;
  /** Opens a change's element: its layer on the stage and the element chosen. */
  onOpen: (change: DesignChange) => void;
  screenFile: (layer: Layer) => string | null;
}

/** The Design view's foot: the changes not yet sent, newest first, and Send to chat. */
export function ChangeLog({ project, page, layer, onOpen, screenFile }: ChangeLogProps) {
  const { updateProject, setInspectorView } = useStudio();
  const { session } = useChat();
  const pending = useMemo(() => pendingChanges(project), [project]);
  const sent = project.changes.length - pending.length;
  if (!project.changes.length) return null;
  const layerName = (change: DesignChange) => project.pages.find(entry => entry.id === change.page)?.layers.find(entry => entry.id === change.layer)?.name;
  const send = () => {
    session.send(changesMessage(project, pending, screenFile), `${project.name} · ${pending.length} design ${pending.length === 1 ? "change" : "changes"}`);
    updateProject(project.id, current => markSent(current));
    setInspectorView("chat");
  };
  return (
    <section className="studio-design__log" aria-label="Changes">
      <div className="studio-design__log-head">
        <h3 className="studio-design__log-title">Changes {pending.length ? <Count variant="soft" size="sm" count={pending.length} /> : null}</h3>
        {sent ? <Button size="sm" variant="ghost" tone="neutral" onClick={() => updateProject(project.id, clearSent)}>{`Clear ${sent} sent`}</Button> : null}
      </div>
      {pending.length ? (
        <ol className="studio-design__changes">
          {[...pending].reverse().map(change => {
            const elsewhere = change.layer !== layer?.id || change.page !== page.id;
            return (
              <li key={change.id} className="studio-design__change">
                <button type="button" className="studio-design__change-open" onClick={() => onOpen(change)}>
                  <span className="studio-design__change-what">{thing(change)}{elsewhere ? <span className="studio-muted"> · {layerName(change)}</span> : null}</span>
                  <span className="studio-design__change-how">{said(change)}</span>
                </button>
                <ChromeButton label={`Undo ${change.name} on ${thing(change)}`} icon={<DismissIcon />}
                  onClick={() => updateProject(project.id, current => undoChange(current, change.id))} />
              </li>
            );
          })}
        </ol>
      ) : <p className="studio-muted studio-design__log-note">{`${sent} sent to Chat. They stay drawn until you clear them.`}</p>}
      {pending.length ? (
        <Button size="sm" fullWidth icon={<SendIcon />} onClick={send}>{pending.length === 1 ? "Send 1 change to chat" : `Send ${pending.length} changes to chat`}</Button>
      ) : null}
    </section>
  );
}
