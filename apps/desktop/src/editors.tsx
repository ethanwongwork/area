/**
 * Open in editor (docs/research/desktop-app-analysis-2026-11-10, U9): a project's files open in the editor a person
 * uses, at the line that matters, from the Changes view, the Preview's chosen element and the Overview's Code section.
 * The editors are those installed (electron/links.cjs asks macOS); Settings › Coding apps chooses one, kept between
 * launches. Default app opens a file the way Finder would.
 */
import { useCallback, useEffect, useState } from "react";
import { Button } from "@area/react";
import { readStored, writeStored } from "./storage.ts";

export interface Editor { id: string; name: string }
/** Always offered: the file's own app, and Finder. */
export const DEFAULT_APP: Editor = { id: "default", name: "Default app" };
const KEY = "editor", EVENT = "area-editor";
let known: Editor[] | null = null;
let asking: Promise<Editor[]> | null = null;
const ask = () => asking ??= (window.areaDesktop?.editors?.() ?? Promise.resolve([])).then(list => (known = list), () => (known = []));

/** The editors installed, then Default app; empty until macOS has answered, and outside the desktop app. */
export function useEditors(): Editor[] {
  const [list, setList] = useState<Editor[]>(known ?? []);
  useEffect(() => { let alive = true; void ask().then(next => { if (alive) setList(next); }); return () => { alive = false; }; }, []);
  return window.areaDesktop?.openIn ? [...list, DEFAULT_APP] : [];
}

/** The chosen editor: the one kept, else the first installed, else Default app. */
export function useEditor(): [Editor | null, (id: string) => void] {
  const editors = useEditors();
  const [kept, setKept] = useState(() => readStored<string>(KEY, ""));
  useEffect(() => { const follow = () => setKept(readStored<string>(KEY, "")); addEventListener(EVENT, follow); return () => removeEventListener(EVENT, follow); }, []);
  const chosen = editors.find(entry => entry.id === kept) ?? editors[0] ?? null;
  return [chosen, id => { writeStored(KEY, id); dispatchEvent(new Event(EVENT)); }];
}

/** "Open in Cursor" for a file (at a line) in a project's folder; nothing outside the desktop app. */
export function OpenInEditor({ folder, path, line, label }: { folder: string; path: string; line?: number; label?: string }) {
  const [editor] = useEditor();
  const [failed, setFailed] = useState<string | null>(null);
  const open = useCallback(async () => {
    if (!editor) return;
    const result = await window.areaDesktop!.openIn!(editor.id, folder, path, line);
    setFailed(result === "ok" ? null : result);
  }, [editor, folder, path, line]);
  if (!editor) return null;
  return (<>
    <Button size="sm" variant="soft" tone="neutral" onClick={open} title={failed ?? undefined}>{label ?? `Open in ${editor.id === DEFAULT_APP.id ? "default app" : editor.name}`}</Button>
    {failed ? <span className="studio-inspector-note" role="status">{failed}</span> : null}
  </>);
}
