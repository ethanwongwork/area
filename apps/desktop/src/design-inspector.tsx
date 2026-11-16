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
 *   On click   where it goes in a flow (the user flows study, 2026-11-08): the next step, another layer of the page, or
 *              Back; the first link makes the page a flow (src/flow.ts), and a link is a change like the others
 *
 * Each value is read from the element as drawn and shown as the token it matches, or as it is with "off scale". A choice
 * is a change: drawn on the stage at once and logged in the project (projects.ts `logChange`). The log sits at the
 * view's foot (the owner's pick), each change undoable, and Send to chat puts them all in Chat's composer as one card (the
 * chat workflow study, P9), for the agent to write into the screen's source; once sent they stay drawn, marked sent, until
 * cleared.
 */
import { useEffect, useMemo, useState, type RefObject } from "react";
import { Button, Count, CustomSelect, Input, PanelSection } from "@area/react";
import { ArrowUpIcon, DismissIcon, SendIcon } from "@area/icons";
import { ChromeButton, useStudio } from "./studio.tsx";
import { useChat } from "./chat/chat.tsx";
import { RowField } from "./inspector-rows.tsx";
import { FAMILIES } from "./pages/components.tsx";
import { describe, elementAt, parentOf, pathOf, propertiesOf, screensIn, type PropertyRow } from "./design-edit.ts";
import { toJsx, type DocNode } from "./design-doc.ts";
import { BACK, clearSent, logChange, markSent, pendingChanges, setLink, undoChange, type DesignChange, type Project, type ProjectPage, type Layer } from "./projects.ts";
import { isFlow, readFlow, stepName } from "./flow.ts";

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
  /**
   * On a layer that is edited as a design (src/design-editor.tsx): makes the change as an edit to it, which logs it.
   * True when it did; without it (or when it can't), the change is an override drawn on the screen's code.
   */
  onEdit?: (property: string, value: string, words: { target: string; label: string; name: string; from: string; to: string }) => boolean;
}

/** The chosen element's properties. */
export function ElementPanel({ project, page, layer, stage, path, onSelect, onEdit }: ElementPanelProps) {
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
    // And after every edit to the layer's own design (a new document each time).
  }, [key, drawn, stage, layer.doc]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!read) return <PanelSection heading="Selection"><p className="studio-muted">This element is no longer in the screen.</p></PanelSection>;
  const change = (row: PropertyRow, value: string, label: string) => {
    const words = { target: read.target, label: read.label, name: row.name, from: row.currentLabel.replace(/, (off scale|mixed)$/, ""), to: label };
    if (onEdit?.(row.property, value, words)) return;
    updateProject(project.id, current => logChange(current, { page: page.id, layer: layer.id, path, ...words, property: row.property, value }));
  };
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
      {page.layers.length > 1 ? <GoesTo project={project} page={page} layer={layer} path={path} target={read.target} label={read.label} /> : null}
    </>
  );
}

/**
 * On click › Goes to: where the element goes when the flow is played. "Next step" is no link (a step with no links goes
 * on to the next); a choice sets the element's link (projects.ts `setLink`) and logs it as a change, whose Undo puts the
 * link back, so it goes to Chat with the others for the agent to wire the navigation.
 */
function GoesTo({ project, page, layer, path, target, label }: { project: Project; page: ProjectPage; layer: Layer; path: number[]; target: string; label: string }) {
  const { updateProject } = useStudio();
  const flow = isFlow(page) ? readFlow(page) : null;
  const nameOf = (id: string) => id === BACK ? "Back" : id === NEXT ? "Next step" : (() => { const other = page.layers.find(entry => entry.id === id); return other ? flow ? stepName(flow, other) : other.name : "A removed layer"; })();
  const current = (page.links ?? []).find(link => link.from === layer.id && link.path.join("/") === path.join("/"))?.to ?? NEXT;
  const others = flow ? flow.ordered.map(step => step.layer).filter(entry => entry.id !== layer.id) : page.layers.filter(entry => entry.id !== layer.id);
  const items = [{ value: NEXT, label: "Next step" }, ...others.map(entry => ({ value: entry.id, label: nameOf(entry.id) })), { value: BACK, label: "Back" }];
  const go = (to: string) => {
    if (to === current) return;
    updateProject(project.id, now => logChange(setLink(now, page.id, { from: layer.id, path, label: label || target, to: to === NEXT ? "" : to }), {
      page: page.id, layer: layer.id, path, target, label, property: "link", name: "Goes to", from: nameOf(current), to: nameOf(to), value: to === NEXT ? "" : to, was: current === NEXT ? "" : current,
    }));
  };
  return (
    <PanelSection heading="On click">
      <RowField label="Goes to" orientation="horizontal" reset={false}>
        <CustomSelect size="sm" variant="soft" fullWidth aria-label="Goes to" items={items} value={current} onValueChange={go} />
      </RowField>
      {!flow ? <p className="studio-design__about">A link makes this page a flow: its layers in order are the steps.</p> : null}
    </PanelSection>
  );
}
/** CustomSelect takes no empty value: the next step's sentinel. */
const NEXT = "__next";

/** One property's row: a choice of tokens or values, or the words. */
function PropertyField({ row, onChange }: { row: PropertyRow; onChange: (value: string, label: string) => void }) {
  const [words, setWords] = useState(row.current);
  useEffect(() => setWords(row.current), [row.current]);
  if (row.size) return <RowField label={row.name} orientation="horizontal" reset={false}><SizeControl row={row} onChange={onChange} /></RowField>;
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

/**
 * A size: Hug, Fill or Fixed, and its length (a vector tool's W and H). Typing a length makes it Fixed; Field's id and
 * label go on to the choice.
 */
function SizeControl({ row, onChange, ...field }: { row: PropertyRow; onChange: (value: string, label: string) => void } & Record<string, unknown>) {
  const length = row.size!.length;
  const [typed, setTyped] = useState(String(length));
  useEffect(() => setTyped(String(length)), [length]);
  const commit = () => {
    const next = Math.round(Number(typed));
    if (!Number.isFinite(next) || next < 1) { setTyped(String(length)); return; }
    if (next !== length || row.current !== "fixed") onChange(`fixed:${next}`, `${next}`);
  };
  const modes = row.options!;
  return (
    <div className="studio-design__size-field">
      <CustomSelect size="sm" variant="soft" fullWidth {...field} aria-label={row.name} items={modes} value={row.current} disabled={modes.length < 2}
        onValueChange={next => { if (next === row.current) return; if (next === "fixed") onChange(`fixed:${length}`, `${length}`); else onChange(next, modes.find(mode => mode.value === next)!.label); }} />
      <Input size="sm" variant="soft" fullWidth inputMode="numeric" aria-label={`${row.name} in pixels`} value={typed}
        onChange={event => setTyped(event.target.value.replace(/[^0-9.]/g, ""))} onBlur={commit}
        onKeyDown={event => {
          if (event.key === "Enter") commit();
          if (event.key === "Escape") setTyped(String(length));
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const next = Math.max(1, (Number(typed) || length) + (event.key === "ArrowUp" ? 1 : -1) * (event.shiftKey ? 10 : 1));
            setTyped(String(next));
            onChange(`fixed:${next}`, `${next}`);
          }
        }} />
    </div>
  );
}

/* --- The log ----------------------------------------------------------------------------------------------------------- */

/** An inserted node as one line of JSX, for Chat ("<Badge tone="success">Complete</Badge>"). */
const jsxOf = (node: DocNode) => {
  const code = toJsx({ version: 1, root: [node], next: 0 }).split("\n").filter(line => /^ {6}\S/.test(line)).map(line => line.trim());
  const first = code[0] ?? "";
  return code.length > 1 ? `${first} …` : first;
};

/** A change in words: "Variant: Solid → Soft", "Added: 2 of 4 in .ex-head__actions", "Removed: was 3 of 5". */
const said = (change: DesignChange) => change.property === "insert" ? `${change.name}: ${change.to}`
  : change.property === "remove" ? `${change.name}: was ${change.from}`
  : `${change.name}: ${change.from || "none"} → ${change.to}`;
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
    for (const change of list) lines.push(`${number++}. ${thing(change)}: ${said(change)}${change.value.startsWith("var(") ? `, token ${change.value.slice(4, -1)}` : ""}${change.property === "insert" && change.op?.op !== "batch" && change.op?.op === "insert" ? ` (${jsxOf(change.op.node)})` : ""}`);
    // A layer edited as a design has its whole code, written from it, for the agent to match.
    if (layer?.doc && list.some(change => change.node)) lines.push(`   The layer's design as code: the Code tab of ${layer.name}.`);
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
  const { setChanges, setDraft, composer } = useChat();
  const pending = useMemo(() => pendingChanges(project), [project]);
  const sent = project.changes.length - pending.length;
  if (!project.changes.length) return null;
  const layerName = (change: DesignChange) => project.pages.find(entry => entry.id === change.page)?.layers.find(entry => entry.id === change.layer)?.name;
  // Send to chat puts the changes in the composer as one card (the chat workflow study, P9), with room for a sentence;
  // they are marked sent once the message goes. The agent reads the full list (changesMessage); the bubble shows the card.
  const send = () => {
    const page = pending.length && pending.every(change => change.page === pending[0]!.page) ? project.pages.find(entry => entry.id === pending[0]!.page)?.name : undefined;
    setChanges({
      title: `${pending.length === 1 ? "1 design change" : `${pending.length} design changes`}${page ? ` on ${page}` : ""}`,
      items: pending.map(change => ({ thing: thing(change), change: said(change) })),
      prompt: changesMessage(project, pending, screenFile),
      onSent: () => updateProject(project.id, current => markSent(current)),
    });
    setDraft(current => current.trim() ? current : "Make these changes.");
    setInspectorView("chat");
    requestAnimationFrame(() => composer.current?.focus());
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
                  <span className="studio-design__change-what">{thing(change)}{elsewhere ? <span className="studio-muted">, {layerName(change)}</span> : null}</span>
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
