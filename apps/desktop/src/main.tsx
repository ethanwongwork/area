import { createRoot } from "react-dom/client";
import { Studio } from "./studio.tsx";

// The platform decides the Titlebar's start inset (macOS traffic lights); a browser has none.
if (window.areaDesktop) document.documentElement.setAttribute("data-platform", window.areaDesktop.platform);
createRoot(document.getElementById("studio")!).render(<Studio />);
