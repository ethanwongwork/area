/**
 * A component's picture (the brief's `preview.screenshot`; docs/research/desktop-app-analysis-2026-11-10, T7): the
 * component as Area draws it, under the project's theme settings, in light or dark, as a PNG.
 *
 * Area's desktop app draws it: its capture mode (apps/desktop/electron/main.cjs `--capture`, `--clip`) opens the
 * component's own page hidden, with the theme's settings, and saves the specimen alone. So a picture needs the Area
 * checkout this command belongs to (or AREA_LIBRARY), with the app built and Electron installed; without them the
 * tool says what is missing. It shows the component's default specimen. A theme's settings are applied; its exact
 * colors, own accent and material are not (they live in the written CSS, which the app's page doesn't load).
 */
import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export interface PictureAsk { slug: string; mode: "light" | "dark"; settings: Readonly<Record<string, string>> }
export interface Picture { png: Buffer; }

/** What the capture is started with: the app's folder, then its arguments. Pure, so the test can read it. */
export function captureArgs(app: string, file: string, ask: PictureAsk): string[] {
  const settings = Object.fromEntries(Object.entries(ask.settings).filter(([axis]) => axis !== "theme"));
  return [app, `--capture=${file}`, `--hash=#system/area/components/${ask.slug}`, "--clip=.studio-stage__content > *", "--pad=16", `--theme=${ask.mode}`,
    ...(Object.keys(settings).length ? [`--store=${JSON.stringify({ canvas: settings })}`] : [])];
}

/** Why no picture can be drawn from this checkout, or null when one can. */
export function pictureBlocker(root: string): string | null {
  if (!existsSync(join(root, "apps", "desktop", "dist", "index.html"))) return "Area's desktop app isn't built in the Area checkout this command runs from (npm run build -w @area/desktop).";
  if (!existsSync(join(root, "node_modules", "electron"))) return "Electron isn't installed in the Area checkout this command runs from (npm install).";
  return null;
}

export async function picture(root: string, ask: PictureAsk): Promise<Picture> {
  const blocker = pictureBlocker(root);
  if (blocker) throw new Error(blocker);
  if (!/^[a-z0-9-]{1,64}$/.test(ask.slug)) throw new Error(`"${ask.slug}" is not a component's slug.`);
  const electron = (await import(pathToFileURL(join(root, "node_modules", "electron", "index.js")).href)).default as string;
  const work = mkdtempSync(join(tmpdir(), "area-picture-"));
  const file = join(work, "picture.png");
  try {
    await new Promise<void>((done, fail) => {
      // Its own data folder, so a picture never waits on, or touches, the app a person has open.
      execFile(electron, [...captureArgs(join(root, "apps", "desktop"), file, ask), `--user-data-dir=${join(work, "data")}`], { timeout: 30_000 }, error => {
        if (existsSync(file)) done();
        else fail(new Error(error && (error as { code?: number }).code === 3 ? `Area has no page for the component "${ask.slug}".` : `The picture couldn't be drawn${error ? `: ${String(error.message).split("\n")[0]}` : "."}`));
      });
    });
    return { png: readFileSync(file) };
  } finally { rmSync(work, { recursive: true, force: true }); }
}
