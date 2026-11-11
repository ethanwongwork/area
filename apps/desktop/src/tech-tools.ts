/**
 * Technical tools (owner, 2026-11-10: "options to toggle on for more technical users, so depending on what type of
 * designer or engineer you are, both can use it"; docs/research/desktop-app-analysis-2026-11-10, T6): one switch in
 * Settings › Coding apps, off by default. On, a project with a folder gains Files: its tree, a code editor and a
 * terminal (src/pages/files.tsx). Off, nothing of them shows.
 */
import { useEffect, useState } from "react";
import { readStored, writeStored } from "./storage.ts";

const KEY = "tech-tools", EVENT = "area-tech-tools";
export function useTechTools(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(() => readStored<boolean>(KEY, false) === true);
  useEffect(() => {
    const follow = () => setOn(readStored<boolean>(KEY, false) === true);
    addEventListener(EVENT, follow);
    return () => removeEventListener(EVENT, follow);
  }, []);
  return [on, next => { writeStored(KEY, next); dispatchEvent(new Event(EVENT)); }];
}
