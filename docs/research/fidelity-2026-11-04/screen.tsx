/** The Workspace screen alone at its true size (1920 x 1080, scale 1), in Area's defaults, for measuring fidelity. */
import { createRoot } from "react-dom/client";
import { ScreenFigure, SHOWCASE } from "@src/setup-screen.tsx";
import { GALLERY_CONTROLS } from "@src/gallery/controls.ts";

const params = new URLSearchParams(location.search);
const mode = params.get("mode") === "dark" ? "dark" : "light";
const scope: Record<string, string> = { "data-area-theme": mode };
for (const c of GALLERY_CONTROLS) if (c.axis !== "theme" && !(c.axis === "contrast" && c.defaultValue === "system")) scope[`data-area-${c.axis}`] = c.defaultValue;
for (const [k, v] of params) if (k.startsWith("data-area-")) scope[k] = v;
document.documentElement.setAttribute("data-area-theme", mode);
createRoot(document.getElementById("root")!).render(
  <div style={{ width: 1920, height: 1080 }}><ScreenFigure scope={scope} hold={SHOWCASE} view={{ scale: 1 }} /></div>,
);
