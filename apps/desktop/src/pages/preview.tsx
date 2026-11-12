/**
 * A project's Preview (owner, 2026-11-10: "Yes, build preview"; docs/research/desktop-app-analysis-2026-11-10, T2): the
 * project's own app, running on this Mac, on the Canvas. Area doesn't start it: the person runs it as they always do
 * and gives its address once (kept with the project). Choose reads the element they click (electron/preview.cjs): the
 * Inspector's Design view shows what it is, its picture and its styles; a value typed there is tried in the running
 * page only; a note and the tried values go to Chat as one card with the picture, and Chat makes them in the code.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Button, EmptyState, Input, PanelSection, Textarea } from "@area/react";
import { ArrowUpRightIcon, PointerIcon, RefreshIcon } from "@area/icons";
import { useStudio, Workspace } from "../studio.tsx";
import { ViewControls } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { RowField } from "../inspector-rows.tsx";
import { ChatChanges } from "../chat/changes.tsx";
import { OpenInEditor } from "../editors.tsx";
import { useChat } from "../chat/chat.tsx";
import { setPreview, type Project } from "../projects.ts";
import { addressLabel, elementKind, elementName, localAddress, pictureFile, previewMessage, previewRows, shownValue, STYLE_ROWS, withTweak, type ChosenElement, type Tweak } from "../preview.ts";

/** A source as React keeps it ("/work/shop/src/cart.tsx:12") as its file and its line. */
const sourcePath = (source: string) => source.replace(/:\d+(?::\d+)?$/, "");
const sourceLine = (source: string) => { const line = /:(\d+)(?::\d+)?$/.exec(source)?.[1]; return line ? Number(line) : undefined; };
const bridge = () => typeof window === "undefined" ? undefined : window.areaDesktop?.preview;
/** The guest element: Electron's <webview>, which React draws as any other tag. */
type Guest = HTMLElement & { reload(): void };

/** The address field: what a person types ("5173", "localhost:5173") and the button that keeps it. */
function AddressForm({ project, action, onDone }: { project: Project; action: string; onDone?: () => void }) {
  const { updateProject } = useStudio();
  const [value, setValue] = useState(project.preview ? addressLabel(project.preview) : "");
  const [refused, setRefused] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const address = localAddress(value);
    if (!address) { setRefused(true); return; }
    updateProject(project.id, current => setPreview(current, address));
    onDone?.();
  };
  return (
    <form className="studio-app-preview__address" onSubmit={submit}>
      <span className="studio-app-preview__field">
        <Input size="sm" fullWidth aria-label="Address" placeholder="localhost:5173" value={value} invalid={refused || undefined}
          onChange={event => { setValue(event.target.value); setRefused(false); }} />
      </span>
      <Button size="sm" variant="soft" tone="neutral" type="submit" disabled={!value.trim()}>{action}</Button>
      {refused ? <p className="studio-app-preview__refused" role="alert">Use an address on this Mac, such as localhost:5173.</p> : null}
    </form>
  );
}

/** One style of the chosen element: its value now, and a field to try another. */
function StyleRow({ label, value, onTry }: { label: string; value: string; onTry: (value: string) => Promise<void> }) {
  const [words, setWords] = useState(value);
  useEffect(() => setWords(value), [value]);
  const now = useRef(value);
  now.current = value;
  // A value the page didn't take (a typo) puts the field back to what the element has.
  const commit = () => { if (words.trim() && words.trim() !== value) void onTry(words.trim()).then(() => setWords(now.current)); else setWords(value); };
  return (
    <RowField label={label} orientation="horizontal" reset={false}>
      <Input size="sm" variant="soft" fullWidth value={words} onChange={event => setWords(event.target.value)} onBlur={commit}
        onKeyDown={event => { if (event.key === "Enter") commit(); if (event.key === "Escape") setWords(value); }} />
    </RowField>
  );
}

export function ProjectPreview() {
  const { openProject, updateProject, setInspectorView, showInspector } = useStudio();
  const { setChanges, setDraft, composer } = useChat();
  const preview = bridge();
  const address = openProject?.preview;
  // Whether anything answers at the address: asked when the page opens, on Try again, and when the window comes back.
  const [running, setRunning] = useState<boolean | null>(null);
  const [asked, setAsked] = useState(0);
  useEffect(() => {
    if (!address || !preview) { setRunning(null); return; }
    let alive = true;
    const check = () => preview.check(address).then(state => { if (alive) setRunning(current => current && state.running ? current : state.running); }, () => { if (alive) setRunning(false); });
    setRunning(null);
    check();
    const again = () => { if (!alive) return; preview.check(address).then(state => { if (alive && state.running) setRunning(true); }, () => {}); };
    addEventListener("focus", again);
    return () => { alive = false; removeEventListener("focus", again); };
  }, [address, preview, asked]);
  const guest = useRef<Guest | null>(null);
  const [choosing, setChoosing] = useState(false);
  const [chosen, setChosen] = useState<ChosenElement | null>(null);
  const [tweaks, setTweaks] = useState<Tweak[]>([]);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const letGo = useCallback(() => { preview?.clear(); setChosen(null); setTweaks([]); setNote(""); }, [preview]);
  // Another address, another app: what was chosen belongs to the one before.
  useEffect(() => { setChosen(null); setTweaks([]); setNote(""); setChoosing(false); }, [address]);
  useEffect(() => () => { preview?.cancel(); }, [preview]);
  const choose = async () => {
    if (!preview) return;
    if (choosing) { preview.cancel(); return; }
    setChoosing(true);
    const element = await preview.pick().catch(() => null);
    setChoosing(false);
    if (!element) return;
    setChosen(element); setTweaks([]); setNote("");
    showInspector();
    setInspectorView("design");
  };
  const tryStyle = async (name: string, label: string, value: string) => {
    if (!preview || !chosen) return;
    const from = chosen.styles[name] ?? "";
    const next = await preview.style(name, value).catch(() => null);
    if (!next) return;
    setChosen(next);
    // A value the page didn't take (a typo) leaves the style as it was: nothing to tell Chat.
    if ((next.styles[name] ?? "") !== from) setTweaks(current => withTweak(current, { name, label, from, to: next.styles[name] ?? "" }));
  };
  // The app went to another page: what was chosen is no longer on screen.
  const live = Boolean(address && running);
  useEffect(() => {
    const view = guest.current;
    if (!view || !live) return;
    const moved = () => { setChosen(null); setTweaks([]); setNote(""); setChoosing(false); };
    view.addEventListener("did-navigate", moved);
    return () => view.removeEventListener("did-navigate", moved);
  }, [live]);
  if (!openProject) return null;
  const project = openProject;
  const send = () => {
    if (!chosen || !address) return;
    const name = elementName(chosen);
    const file = chosen.picture ? pictureFile(chosen.picture, `${elementKind(chosen)}.png`) : null;
    setChanges({
      title: `${name} in the preview`, items: previewRows(chosen, tweaks, note), prompt: previewMessage(address, chosen, tweaks, note),
      ...(file ? { pictures: [file] } : {}), onSent: letGo,
    });
    setDraft(current => current.trim() ? current : tweaks.length ? "Make these changes." : "Take this note in.");
    setInspectorView("chat");
    requestAnimationFrame(() => composer.current?.focus());
  };
  const label = address ? addressLabel(address) : "";
  const canvas = !preview ? (
    <EmptyState size="sm" title="The preview needs the desktop app" description="A project's running app shows here in Area's desktop app." />
  ) : !address ? (
    <EmptyState size="sm" title="No address yet" description="Start your app the way you usually do, then give the address it runs at on this Mac. It shows here, and Choose points Chat at any part of it."
      actions={<AddressForm project={project} action="Show preview" />} />
  ) : running === false ? (
    <EmptyState size="sm" title={`Nothing is running at ${label}`} description="Start your app, then try again. Area shows it here and doesn't start it for you."
      actions={<Button size="sm" variant="soft" tone="neutral" onClick={() => setAsked(count => count + 1)}>Try again</Button>} />
  ) : running ? (
    // The guest: electron/preview.cjs decides what it may load and gives it nothing of Area's.
    <webview ref={guest as never} className="studio-app-preview__view" src={address} partition="preview" data-choosing={choosing ? "" : undefined} />
  ) : null;
  return (
    <Workspace
      canvasTitle={`${project.name} preview`}
      canvasLead={address ? <span className="studio-app-preview__where" title={address}>{label}</span> : undefined}
      canvasActions={address && running ? (
        <ViewControls>
          <Button size="sm" variant="ghost" tone="neutral" icon={<PointerIcon />} selected={choosing} onClick={choose}>Choose</Button>
          <Button size="sm" variant="ghost" tone="neutral" icon={<RefreshIcon />} onClick={() => { letGo(); guest.current?.reload(); }}>Reload</Button>
          <Button size="sm" variant="ghost" tone="neutral" icon={<ArrowUpRightIcon />} onClick={() => preview?.open(address)}>Open in browser</Button>
        </ViewControls>
      ) : undefined}
      canvas={<div className="studio-app-preview" data-empty={address && running ? undefined : ""}>{canvas}</div>}
      inspector={{
        code: <ChatChanges />,
        design: chosen ? (<>
          <PanelSection heading={elementName(chosen)}>
            {chosen.picture ? <img className="studio-app-preview__picture" src={chosen.picture} width={Math.round(chosen.rect.width) + 16} alt={`${elementName(chosen)}, as it is drawn now`} /> : null}
            <Facts label="Element" items={[
              ["Element", elementKind(chosen)],
              chosen.source ? ["Written in", <span title={chosen.source}>{chosen.source.split("/").slice(-2).join("/")}</span>] : null,
              ["Size", `${Math.round(chosen.rect.width)} × ${Math.round(chosen.rect.height)}`],
              chosen.page && chosen.page !== "/" ? ["Page", chosen.page] : null,
            ]} />
            <div className="studio-inspector-actions">
              {project.folder && chosen.source ? <OpenInEditor folder={project.folder} path={sourcePath(chosen.source)} line={sourceLine(chosen.source)} /> : null}
              <Button size="sm" variant="soft" tone="neutral" onClick={choose}>Choose another</Button>
              <Button size="sm" variant="soft" tone="neutral" onClick={letGo}>Let go</Button>
            </div>
          </PanelSection>
          <PanelSection heading="Styles">
            {STYLE_ROWS.map(row => <StyleRow key={row.name} label={row.label} value={shownValue(chosen.styles[row.name])} onTry={value => tryStyle(row.name, row.label, value)} />)}
            <p className="studio-inspector-note">A value you type is tried in the running app only. Send it to Chat to have it made in the code.</p>
          </PanelSection>
          <PanelSection heading="Tell Chat">
            <Textarea size="sm" fullWidth rows={3} aria-label="Note" placeholder="What should change about this?" value={note} onChange={event => setNote(event.target.value)} />
            <div className="studio-inspector-actions">
              <Button size="sm" variant="solid" disabled={!tweaks.length && !note.trim()} onClick={send}>Send to chat</Button>
            </div>
          </PanelSection>
        </>) : (
          <PanelSection heading="Preview">
            {address && !editing ? (<>
              <Facts label="Preview" items={[["Address", <span title={address}>{label}</span>], ["App", running === null ? "Looking" : running ? "Running" : "Not running"]]}
                note={running ? "Choose, then click any part of the app: its styles show here, and a note about it goes to Chat with its picture." : "Area shows the app you start yourself; it doesn't start one."} />
              <div className="studio-inspector-actions">
                <Button size="sm" variant="soft" tone="neutral" onClick={() => setEditing(true)}>Change address</Button>
                <Button size="sm" variant="soft" tone="neutral" onClick={() => updateProject(project.id, current => setPreview(current, null))}>Remove address</Button>
              </div>
            </>) : address ? (
              <AddressForm project={project} action="Save" onDone={() => setEditing(false)} />
            ) : <p className="studio-inspector-note">No address yet. Give the address your app runs at on this Mac, and it shows on the Canvas.</p>}
          </PanelSection>
        ),
      }}
    />
  );
}
