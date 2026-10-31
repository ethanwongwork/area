/**
 * Theme setup's page (src/studio.tsx routes `theme-setup` here): the Setup chat over its product screen (theme-setup.tsx).
 */
import { useStudio } from "../studio.tsx";
import { useViewOption } from "../view-controls.tsx";
import type { Mode } from "./theme-settings.ts";
import { ThemeSetup } from "./theme-setup.tsx";

/**
 * New theme (theme-setup.tsx): one question per setting with every option drawn, under Themes. Foundations, every setting's
 * values side by side, was the other way through until 2026-10-30, when the owner simplified each system to its sections
 * (src/app-nav.tsx SYSTEM_SECTIONS) and its settings moved to Themes' Playground. The `flow` stays for the route.
 */
type Flow = "setup";
export function ThemePage(_: { flow: Flow }) {
  const { navigate } = useStudio();
  const [mode, setMode] = useViewOption<Mode>("theme-mode", "light", ["light", "dark"]);
  return <ThemeSetup mode={mode} setMode={setMode} onBrowse={() => navigate({ page: "themes" })} />;
}
