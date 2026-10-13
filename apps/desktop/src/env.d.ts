/** What electron/preload.cjs exposes to the page; absent in a plain browser. */
interface AreaDesktop {
  platform: string;
  /** Matches the window's native chrome (traffic lights, vibrancy) to the app's theme. */
  setTheme(theme: "light" | "dark"): void;
}
interface Window { areaDesktop?: AreaDesktop }


/** Demo name -> its code, read from src/content/demos at build time (scripts/snippets.mjs). */
declare module "virtual:demo-snippets" {
  const snippets: Record<string, string>;
  export default snippets;
}
