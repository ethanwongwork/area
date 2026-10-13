/** What electron/preload.cjs exposes to the page; absent in a plain browser. */
interface AreaDesktop {
  platform: string;
  /** Matches the window's native chrome (traffic lights, vibrancy) to the app's theme. */
  setTheme(theme: "light" | "dark"): void;
}
interface Window { areaDesktop?: AreaDesktop }

/** Each demo's source by its name (scripts/demo-sources.mjs, at build time). */
declare module "area:demo-sources" {
  const sources: Record<string, string>;
  export default sources;
}

