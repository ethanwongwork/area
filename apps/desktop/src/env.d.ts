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
  /** The app menu's tab commands (electron/main.cjs): ⌘T, ⌘⇧T, ⌘⇧H, ⌘W, ⌃Tab, ⌃⇧Tab, ⌘1–9. Returns the unsubscribe. */
  onCommand?(listener: (command: TabCommand, index?: number) => void): () => void;
}
type TabCommand = "new-tab" | "reopen-tab" | "close-tab" | "next-tab" | "previous-tab" | "tab" | "home" | "settings";
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
    /** Interface name (ButtonProps) -> prop -> its JSDoc. */
    propDocs: Record<string, Record<string, string>>;
  };
  export default sources;
}
