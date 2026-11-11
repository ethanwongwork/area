/** What electron/preload.cjs exposes to the page; absent in a plain browser. */
interface AreaDesktop {
  platform: string;
  /** Matches the window's native chrome (traffic lights, vibrancy) to the app's theme. */
  setTheme(theme: "light" | "dark"): void;
  /** The page ground as #rrggbb, for the window behind the page. Absent in an older shell. */
  setGround?(color: string): void;
  /** The Titlebar's height, so the traffic lights stay centred on it (macOS). */
  setTitlebar?(height: number): void;
  /** Shows a file of the Brand library (a path inside it, "originals/<id>.jpg") in Finder. */
  revealBrand?(path: string): void;
  /**
   * The workspace's systems, one system.json each in Application Support/Area/Systems (src/systems.ts). `read` answers
   * every file's contents at launch, or null in a capture (the page keeps its systems in its own storage then).
   */
  systems?: { read(): unknown[] | null; write(id: string, text: string): void; trash(id: string): void };
  /** The workspace's projects, one project.json each in Application Support/Area/Projects (src/projects.ts), as `systems`. */
  projects?: { read(): unknown[] | null; write(id: string, text: string): void; trash(id: string): void };
  /**
   * Licensed typefaces installed on this Mac (electron/main.cjs, "area:fonts-installed"): for each catalogue face, the
   * first of its family names found, and what the files say (src/pages/typefaces.tsx, InstalledFacts). Null in a capture.
   */
  installedFonts?(wanted: Array<{ id: string; names: string[] }>): Promise<Record<string, unknown> | null>;
  /**
   * The Inspector Chat's agent (electron/agent.cjs): the Claude Agent SDK in this repository. Each chat id is one
   * conversation; events come back as src/chat/recording.ts's ChatEvent. `status` fails or says unavailable in a capture.
   */
  agent?: {
    status(): Promise<{ available: boolean; reason?: string; cwd?: string }>;
    /** `images`: pictures as base64, sent to the agent as pictures; `mode`: how it helps (ask, suggest, change). */
    /** `folder`: the project's folder to work in (this repository without one); `about`: the project, for the agent's
     *  instructions; `resume`: a kept chat's session to go on from, on the chat's first prompt. */
    send(chat: string, request: { text: string; context?: string; model?: string; mode?: string; images?: Array<{ name: string; type: string; data: string }>;
      folder?: string; about?: { name: string; system?: string; theme?: string }; resume?: string }): void;
    /** An approval's answer, or a question's (`answers`, question text to the answer; none skips it). */
    answer(chat: string, toolUseId: string, reply: { allow?: boolean; always?: boolean; instead?: string; answers?: Record<string, string> }): void;
    stop(chat: string): void;
    close(chat: string): void;
    /** Undo edits by tool call id: "ok", or why not, per id. */
    undo(chat: string, ids: string[]): Promise<Record<string, string>>;
    /** What the chat has changed, a file at a time (electron/agent.cjs `changes`). */
    changes(chat: string): Promise<Array<{ file: string; path: string; ids: string[]; undone: string[]; before?: string | null; after?: string | null; large?: boolean; moved: boolean }>>;
    onEvent(listener: (chat: string, message: unknown) => void): () => void;
  };
  /** A project's folder (electron/folder.cjs): the picker, what a path is now, its files' names, Show in Finder. */
  folder?: {
    choose(suggested?: string | null): Promise<string | null>;
    state(path: string): Promise<FolderState>;
    files(path: string): Promise<string[]>;
    reveal(path: string): void;
  };
  /** An area:// link to open, as its place's hash (electron/links.cjs). */
  onLink?(listener: (hash: string) => void): () => void;
  /** The editors installed, and a file in a project's folder opened in one, "default" or "finder"; "ok" or why not. */
  editors?(): Promise<Array<{ id: string; name: string }>>;
  /** How many chats work now (main asks before quitting), and a notice for when the window is in the background. */
  setRunning?(count: number): void;
  notify?(notice: { title: string; body: string; hash: string }): void;
  /** Put an area:// link on the clipboard (Copy Link). */
  copyLink?(link: string): Promise<boolean>;
  openIn?(how: string, folder: string, path: string, line?: number): Promise<string>;
  /** The Preview of a project's running app and its Choose tool (electron/preview.cjs; src/preview.ts). */
  preview?: {
    check(address: string): Promise<{ url: string | null; running: boolean }>;
    pick(): Promise<import("./preview.ts").ChosenElement | null>;
    cancel(): void;
    style(name: string, value: string): Promise<import("./preview.ts").ChosenElement | null>;
    clear(): void;
    open(address: string): void;
  };
  /** Save, review and publish through a project folder's git and GitHub (electron/github.cjs). */
  git?: {
    state(folder: string, project: string): Promise<GitState>;
    save(folder: string, project: string, message: string): Promise<GitResult>;
    review(folder: string, project: string, title: string, body: string): Promise<GitResult & { url?: string }>;
    publish(folder: string, project: string): Promise<GitResult>;
  };
  /** Technical tools (electron/tools.cjs): a project folder's files and a terminal in it. Off until switched on. */
  tools?: {
    read(folder: string, path: string): Promise<{ path: string; text: string; at: number } | { error: string }>;
    write(folder: string, path: string, text: string, at?: number): Promise<{ ok: true; at: number } | { error: string }>;
    run(id: string, folder: string, command: string): void;
    input(id: string, text: string): void;
    stop(id: string): void;
    onOutput(listener: (id: string, text: string, stream: "out" | "err") => void): () => void;
    onExit(listener: (id: string, end: { code?: number | null; signal?: string | null; error?: string }) => void): () => void;
  };
  /** Kept chats, one file each beside their project or system (electron/folder.cjs; src/chat/store.ts). */
  chats?: {
    read(kind: "project" | "system" | "app", id: string): Promise<unknown[]>;
    write(kind: "project" | "system" | "app", id: string, chat: string, text: string): void;
    trash(kind: "project" | "system" | "app", id: string, chat: string): void;
  };
  /**
   * Write to folder (electron/output.cjs, @area/output): a system's published version written into a project's folder.
   * `where` is a destination ({ kind: "folder", path }; GitHub comes later as another kind). Absent in a capture.
   */
  output?: {
    choose(suggested?: string | null): Promise<string | null>;
    plan(where: OutputWhere, system: string, version: string): Promise<OutputPlan | { error: string }>;
    write(where: OutputWhere, system: string, version: string, prefer?: "markers" | "yours" | "area"): Promise<OutputPlan | { error: string }>;
    reveal(where: OutputWhere): void;
    /** Where the `area` command is on this Mac (Settings › Coding apps). */
    command(): Promise<string>;
  };
  /** The app menu's tab commands (electron/main.cjs): ⌘T, ⌘⇧T, ⌘⇧H, ⌘W, ⌃Tab, ⌃⇧Tab, ⌘1–9. Returns the unsubscribe. */
  onCommand?(listener: (command: TabCommand, index?: number) => void): () => void;
}
/** What a project's folder is now: there or not, whether git tracks it, whether a system was written into it. */
interface FolderState { exists: boolean; name: string; git?: boolean; system?: boolean }
type OutputWhere = { kind: "folder"; path: string };
/** What writing a system into a folder does (packages/output src/write.ts), file by file. */
interface OutputPlan {
  definition: { system: { id: string; name: string }; version: string; dir: string };
  steps: Array<{ path: string; action: "added" | "updated" | "unchanged" | "kept-edits" | "merged" | "conflict" | "exists" | "removed" | "left" | "skipped"; conflicts?: number }>;
  summary: Partial<Record<OutputPlan["steps"][number]["action"], number>>;
  notes: string[];
  library: string;
}
type TabCommand = "new-tab" | "reopen-tab" | "close-tab" | "next-tab" | "previous-tab" | "tab" | "home" | "settings" | "copy-link" | "open-chat";
interface Window { areaDesktop?: AreaDesktop }


/** Demo name -> its code, read from src/content/demos at build time (scripts/snippets.mjs). */
declare module "virtual:demo-snippets" {
  const snippets: Record<string, string>;
  export default snippets;
}

/** Every component's own files, read at build time (scripts/sources.mjs): file name -> text, and prop docs. */
declare module "virtual:component-sources" {
  const sources: {
    specs: Record<string, string>;
    css: Record<string, string>;
    react: Record<string, string>;
    /** The patterns' screens (src/content/examples/*.tsx), by file name. */
    screens: Record<string, string>;
    /** Interface name (ButtonProps) -> prop -> its JSDoc. */
    propDocs: Record<string, Record<string, string>>;
  };
  export default sources;
}

/** A project folder's versions as electron/github.cjs reads them. */
type GitState =
  | { kind: "none" | "plain" }
  | { kind: "git"; branch: string; main: string; working: string; onWorking: boolean; files: Array<{ status: string; path: string }>; saves: number;
      remote: string | null; github: { owner: string; name: string } | null; signedIn: boolean; review: { number: number; url: string; state: string; title: string } | null };
type GitResult = { ok: true; state: GitState } | { error: string; ok?: undefined };
