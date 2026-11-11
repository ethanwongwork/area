/**
 * Save, ask for review and publish (owner, 2026-11-11: "GitHub next"; docs/research/desktop-app-analysis-2026-11-10,
 * T4): under a project's Changes, what its folder keeps. Save keeps every change in the folder as a version on the
 * project's own line of work; Ask for review sends the saves to GitHub and opens a review there; Publish puts the
 * review into the project's main line. The words are the app's (PRODUCT_UI.md rule 24); electron/github.cjs runs git.
 */
import { useCallback, useEffect, useState } from "react";
import { Button, ConfirmDialog, Input, Link, PanelSection } from "@area/react";
import { Facts } from "../facts.tsx";
import { useChat } from "./chat.tsx";

const bridge = () => typeof window === "undefined" ? undefined : window.areaDesktop?.git;

export function ProjectVersions({ folder, project }: { folder: string; project: string }) {
  const { session } = useChat();
  const [read_, setState] = useState<GitState | null>(null);
  const [words, setWords] = useState("");
  const [busy, setBusy] = useState<"save" | "review" | "publish" | null>(null);
  const [said, setSaid] = useState<{ tone: "error" | "done"; text: string; url?: string } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const read = useCallback(() => { void bridge()?.state(folder, project).then(setState, () => setState(null)); }, [folder, project]);
  // Read again when the window comes back (a save made in an editor) and when a reply ends (Claude changed files).
  useEffect(() => { read(); addEventListener("focus", read); return () => removeEventListener("focus", read); }, [read]);
  useEffect(() => { if (!session.running) read(); }, [session.running, read]);
  if (!bridge() || !read_ || read_.kind === "none") return null;
  if (read_.kind === "plain") return (
    <PanelSection heading="Versions">
      <p className="studio-inspector-note">This folder doesn't keep versions. Set it up with git, or open a folder that does, and saves and reviews work here.</p>
    </PanelSection>
  );
  const state = read_ as Extract<GitState, { kind: "git" }>;
  const act = async (which: "save" | "review" | "publish") => {
    const git = bridge()!;
    setBusy(which); setSaid(null);
    const result = which === "save" ? await git.save(folder, project, words)
      : which === "review" ? await git.review(folder, project, "", "") : await git.publish(folder, project);
    setBusy(null);
    if ("error" in result && result.error) { setSaid({ tone: "error", text: result.error }); return; }
    if (result.ok) setState(result.state);
    if (which === "save") { setWords(""); setSaid({ tone: "done", text: "Saved." }); }
    if (which === "review") setSaid({ tone: "done", text: "Review open on GitHub.", url: (result as { url?: string }).url });
    if (which === "publish") setSaid({ tone: "done", text: "Published into the main line." });
  };
  const unsaved = state.files.length;
  const open = state.review?.state === "OPEN" ? state.review : null;
  return (
    <PanelSection heading="Versions">
      <Facts label="Versions" items={[
        state.github ? ["On GitHub", <Link href={`https://github.com/${state.github.owner}/${state.github.name}`} target="_blank" rel="noreferrer">{`${state.github.owner}/${state.github.name}`}</Link>] : ["On GitHub", "Not yet"],
        ["Not saved", unsaved ? (unsaved === 1 ? "1 file" : `${unsaved} files`) : "Nothing"],
        ["Saved", state.saves ? `${state.saves} since the last publish` : "Nothing new"],
        state.github ? ["Review", open ? <Link href={open.url} target="_blank" rel="noreferrer">{`#${open.number} open`}</Link> : "Not asked"] : null,
      ]} />
      {unsaved ? (
        <form className="studio-versions__save" onSubmit={event => { event.preventDefault(); if (words.trim() && !busy) void act("save"); }}>
          <span className="studio-versions__field"><Input size="sm" fullWidth aria-label="What changed" placeholder="What changed" value={words} onChange={event => setWords(event.target.value)} /></span>
          <Button size="sm" variant="soft" tone="neutral" type="submit" disabled={!words.trim() || busy !== null}>{busy === "save" ? "Saving…" : "Save"}</Button>
        </form>
      ) : null}
      <div className="studio-inspector-actions">
        {state.github && state.signedIn && state.saves && !open ? <Button size="sm" variant="soft" tone="neutral" disabled={busy !== null || unsaved > 0} onClick={() => void act("review")}>{busy === "review" ? "Asking…" : "Ask for review"}</Button> : null}
        {open ? <Button size="sm" variant="solid" disabled={busy !== null || unsaved > 0} onClick={() => setPublishing(true)}>{busy === "publish" ? "Publishing…" : "Publish"}</Button> : null}
        {state.github && !state.signedIn ? <Button size="sm" variant="soft" tone="neutral" onClick={() => { void navigator.clipboard?.writeText("gh auth login"); setCopied(true); }}>{copied ? "Copied" : "Copy gh auth login"}</Button> : null}
      </div>
      {state.github && !state.signedIn ? <p className="studio-inspector-note">To ask for reviews, sign in to GitHub on this Mac: run the copied line in Terminal.</p> : null}
      {unsaved && (state.saves || open) ? <p className="studio-inspector-note">Save what's new before asking for review or publishing.</p> : null}
      {said ? <p className="studio-inspector-note" role={said.tone === "error" ? "alert" : "status"} data-tone={said.tone}>
        {said.text}{said.url ? <> <Link href={said.url} target="_blank" rel="noreferrer">Open it</Link></> : null}
      </p> : null}
      {publishing && open ? (
        <ConfirmDialog open title={`Publish review #${open.number}?`} confirmLabel="Publish"
          description={`Its saves go into ${state.main} on GitHub, the project's main line, and this folder goes back to it.`}
          onOpenChange={next => { if (!next) setPublishing(false); }} onConfirm={() => { setPublishing(false); void act("publish"); }} />
      ) : null}
    </PanelSection>
  );
}
