/**
 * Files, a technical tool (owner, 2026-11-10: "a code editor … plus terminal access … options to toggle on";
 * docs/research/desktop-app-analysis-2026-11-10, T6), shown only while Settings › Coding apps › Technical tools is on: a
 * project folder's tree in the Sidebar, the chosen file in a code editor on the Canvas (⌘S saves), and a terminal under
 * it that runs the person's own commands in the folder (electron/tools.cjs). The terminal is outside Chat's approvals,
 * as Terminal is: it says so.
 *
 * The editor is a text editor with highlighting, not an IDE: the words are a plain text field over the same text drawn
 * with Code block's syntax colors, so typing, selection and undo are the field's own.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button, EmptyState, Input, PanelSection, TreeView } from "@area/react";
import { DismissIcon, PlayIcon, StopIcon, TerminalIcon } from "@area/icons";
import { SidebarList, useStudio, Workspace } from "../studio.tsx";
import { ViewControls } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { ChatChanges } from "../chat/changes.tsx";
import { OpenInEditor } from "../editors.tsx";
import { useTechTools } from "../tech-tools.ts";
import { appendOutput, fileTree, foldersOf, type TermLine } from "../files.ts";
// @ts-expect-error — the highlighter is authored in JavaScript.
import { escapeHtml, highlight } from "../content/highlight.mjs";

/** A file's text as highlighted lines (Code block's syntax classes); JSX-like files only, the rest plain. */
const highlighted = (path: string, text: string): string =>
  /\.(tsx|jsx|ts|js|mjs|cjs|html|svelte|vue)$/i.test(path) ? (highlight as (code: string) => string)(text) : (escapeHtml as (code: string) => string)(text);

const tools = () => typeof window === "undefined" ? undefined : window.areaDesktop?.tools;

/** The folder's file paths, read again when the window comes back. */
function useFiles(folder: string | undefined): string[] | null {
  const [files, setFiles] = useState<string[] | null>(null);
  useEffect(() => {
    if (!folder) { setFiles(null); return; }
    let alive = true;
    const read = () => window.areaDesktop?.folder?.files(folder).then(list => { if (alive) setFiles(list); }, () => { if (alive) setFiles([]); });
    read();
    addEventListener("focus", read);
    return () => { alive = false; removeEventListener("focus", read); };
  }, [folder]);
  return files;
}

interface Open { path: string; text: string; saved: string; at: number }

function CodeEditor({ file, onChange, onSave }: { file: Open; onChange: (text: string) => void; onSave: () => void }) {
  const field = useRef<HTMLTextAreaElement>(null);
  const shown = useRef<HTMLPreElement>(null);
  const lines = file.text.split("\n").length;
  const html = useMemo(() => highlighted(file.path, file.text), [file.path, file.text]);
  const keys = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "s") { event.preventDefault(); onSave(); return; }
    // Tab indents two spaces (the field's own undo keeps it); Shift-Tab and Escape leave the field.
    if (event.key === "Tab" && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      document.execCommand("insertText", false, "  ");
    }
  };
  return (
    <div className="studio-editor">
      <div className="studio-editor__numbers" aria-hidden="true">{Array.from({ length: lines }, (_, index) => <span key={index}>{index + 1}</span>)}</div>
      <div className="studio-editor__text">
        <pre ref={shown} className="studio-editor__shown area-code-block__pre" aria-hidden="true" dangerouslySetInnerHTML={{ __html: `${html}\n` }} />
        <textarea ref={field} className="studio-editor__field" aria-label={`Edit ${file.path}`} spellCheck={false} autoCapitalize="off" autoCorrect="off" wrap="off"
          value={file.text} onChange={event => onChange(event.target.value)} onKeyDown={keys} />
      </div>
    </div>
  );
}

let runs = 0;
function Terminal({ folder, onClose }: { folder: string; onClose: () => void }) {
  const [id] = useState(() => `term-${++runs}`);
  const [lines, setLines] = useState<TermLine[]>([{ stream: "note", text: "Commands run here with your own permissions, in the project's folder. Claude doesn't see or approve them. Programs that take over the screen don't work here.\n" }]);
  const [command, setCommand] = useState("");
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [back, setBack] = useState(-1);
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bridge = tools();
    if (!bridge) return;
    const offOut = bridge.onOutput((run, text, stream) => { if (run === id) setLines(current => appendOutput(current, text, stream)); });
    const offExit = bridge.onExit((run, end) => {
      if (run !== id) return;
      setRunning(false);
      const said = end.error ? `${end.error}\n` : end.signal ? "Stopped.\n" : end.code ? `Ended with code ${end.code}.\n` : "";
      if (said) setLines(current => [...current, { stream: "note", text: said }]);
    });
    return () => { offOut(); offExit(); bridge.stop(id); };
  }, [id]);
  useEffect(() => { const box = output.current; if (box) box.scrollTop = box.scrollHeight; }, [lines]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const line = command;
    if (running) { tools()?.input(id, line); setLines(current => [...current, { stream: "in", text: `${line}\n` }]); setCommand(""); return; }
    if (!line.trim()) return;
    if (line.trim() === "clear") { setLines([]); setCommand(""); return; }
    setLines(current => [...current, { stream: "in", text: `$ ${line}\n` }]);
    setHistory(current => [line, ...current.filter(entry => entry !== line)].slice(0, 50));
    setBack(-1);
    setRunning(true);
    tools()?.run(id, folder, line);
    setCommand("");
  };
  const recall = (event: KeyboardEvent<HTMLInputElement>) => {
    if (running || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
    event.preventDefault();
    const next = Math.max(-1, Math.min(history.length - 1, back + (event.key === "ArrowUp" ? 1 : -1)));
    setBack(next);
    setCommand(next < 0 ? "" : history[next]!);
  };
  return (
    <section className="studio-terminal" aria-label="Terminal">
      <div className="studio-terminal__head">
        <span className="studio-terminal__title">Terminal</span>
        {running ? <Button size="sm" variant="ghost" tone="neutral" icon={<StopIcon />} onClick={() => tools()?.stop(id)}>Stop</Button> : null}
        <Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<DismissIcon />} aria-label="Close terminal" onClick={onClose} />
      </div>
      <div ref={output} className="studio-terminal__output" role="log" aria-live="polite" tabIndex={0}>
        {lines.map((line, index) => <span key={index} data-stream={line.stream}>{line.text}</span>)}
      </div>
      <form className="studio-terminal__line" onSubmit={submit}>
        <span className="studio-terminal__prompt" aria-hidden="true">{running ? "›" : "$"}</span>
        <span className="studio-terminal__field">
          <Input size="sm" fullWidth monospace aria-label={running ? "Input for the running command" : "Command"} placeholder={running ? "Input for the running command" : "A command, such as npm run dev"}
            value={command} onChange={event => setCommand(event.target.value)} onKeyDown={recall} autoComplete="off" spellCheck={false} />
        </span>
        <Button size="sm" variant="soft" tone="neutral" type="submit" icon={running ? undefined : <PlayIcon />} disabled={!running && !command.trim()}>{running ? "Send" : "Run"}</Button>
      </form>
    </section>
  );
}

export function FilesPage() {
  const { openProject, place, select } = useStudio();
  const [on] = useTechTools();
  const folder = openProject?.folder;
  const files = useFiles(folder);
  const tree = useMemo(() => fileTree(files ?? []), [files]);
  const path = place.item;
  const [open, setOpen] = useState<Open | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [expanded, setExpanded] = useState<string[]>([]);
  useEffect(() => { if (path) setExpanded(current => [...new Set([...current, ...foldersOf(path)])]); }, [path]);
  // A file opens when it is chosen; one with changes not saved asks before another replaces it.
  useEffect(() => {
    if (!folder || !path) { setOpen(null); return; }
    let alive = true;
    void tools()?.read(folder, path).then(result => {
      if (!alive) return;
      if ("error" in result) { setOpen(null); setProblem(result.error); return; }
      setProblem(null);
      setOpen({ path: result.path, text: result.text, saved: result.text, at: result.at });
    });
    return () => { alive = false; };
  }, [folder, path]);
  const dirty = Boolean(open && open.text !== open.saved);
  const save = useCallback(async () => {
    if (!open || !folder || !dirty) return;
    const result = await tools()!.write(folder, open.path, open.text, open.at);
    if ("error" in result) { setProblem(result.error); return; }
    setProblem(null);
    setOpen(current => current && { ...current, saved: current.text, at: result.at });
  }, [open, folder, dirty]);
  const choose = (id: string) => {
    if (id.startsWith("dir:")) { setExpanded(current => current.includes(id) ? current.filter(entry => entry !== id) : [...current, id]); return; }
    if (dirty && !confirm(`${open!.path} has changes not saved. Open ${id} and lose them?`)) return;
    select(id);
  };
  if (!openProject) return null;
  if (!on || !folder || !tools()) {
    return <Workspace canvasTitle="Files" canvas={<div className="studio-app-preview" data-empty="">
      <EmptyState size="sm" title={!folder ? "No folder yet" : "Technical tools are off"}
        description={!folder ? "Choose this project's folder on its Overview first." : "Turn on Technical tools in Settings › Coding apps to see the folder's files, edit them and run commands."} />
    </div>} inspector={{ code: <ChatChanges /> }} />;
  }
  const lines = open ? open.text.split("\n").length : 0;
  return (
    <Workspace
      canvasTitle={open ? `Files: ${open.path}` : "Files"}
      sidebar={<SidebarList>
        {files === null ? null : files.length ? (
          <TreeView aria-label={`${openProject.name}'s files`} className="studio-sidebar__tree" items={tree} currentId={path} selectedIds={path ? [path] : []}
            expandedIds={expanded} onExpandedChange={setExpanded} onActivate={choose} />
        ) : <p className="studio-inspector-note">This folder has no files yet.</p>}
      </SidebarList>}
      canvasLead={open ? <span className="studio-app-preview__where" title={open.path}>{open.path}{dirty ? " · not saved" : ""}</span> : undefined}
      canvasActions={<ViewControls>
        {open ? <Button size="sm" variant="ghost" tone="neutral" disabled={!dirty} onClick={() => void save()}>Save</Button> : null}
        {showTerminal ? null : <Button size="sm" variant="ghost" tone="neutral" icon={<TerminalIcon />} onClick={() => setShowTerminal(true)}>Terminal</Button>}
      </ViewControls>}
      canvas={<div className="studio-files" data-terminal={showTerminal ? "" : undefined}>
        <div className="studio-files__editor">
          {problem ? <p className="studio-inspector-note" role="alert" data-tone="error">{problem}</p> : null}
          {open ? <CodeEditor file={open} onChange={text => setOpen(current => current && { ...current, text })} onSave={() => void save()} />
            : <div className="studio-files__empty"><EmptyState size="sm" title="Choose a file" description="Pick a file from the list to read or edit it. ⌘S saves." /></div>}
        </div>
        {showTerminal ? <Terminal folder={folder} onClose={() => setShowTerminal(false)} /> : null}
      </div>}
      inspector={{
        code: <ChatChanges />,
        design: open ? (
          <PanelSection heading={open.path.split("/").at(-1)!}>
            <Facts label="File" items={[["Folder", open.path.includes("/") ? open.path.split("/").slice(0, -1).join("/") : "The project's folder"], ["Lines", String(lines)], ["Saved", dirty ? "Not yet" : "Yes"]]} />
            <div className="studio-inspector-actions"><OpenInEditor folder={folder} path={open.path} /></div>
          </PanelSection>
        ) : <PanelSection heading="Files"><p className="studio-inspector-note">Choose a file to edit it here. The terminal runs your own commands in the project's folder.</p></PanelSection>,
      }}
    />
  );
}
