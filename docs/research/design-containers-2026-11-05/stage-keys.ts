/** The design viewer's one import from src/stage.tsx, alone, so the page doesn't bundle the whole app (build.mjs points
 *  design-viewer.tsx's `./stage.tsx` here). The page passes no Back, so these keys never fire; kept as the app's. */
import { useEffect, useRef } from "react";

export function useStageKeys({ onBack, enabled }: { onBack: () => void; enabled: boolean }) {
  const back = useRef(onBack);
  back.current = onBack;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      const up = event.key === "ArrowUp" && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey;
      const escape = event.key === "Escape" && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
      if (!up && !escape) return;
      const target = event.target as Element | null;
      if (escape && (event.defaultPrevented || target?.closest("input, textarea, select, [contenteditable], [role='combobox'], [role='menu'], [role='listbox']")
        || document.querySelector(":popover-open, dialog[open]"))) return;
      event.preventDefault();
      back.current();
    };
    addEventListener("keydown", onKey, true);
    return () => removeEventListener("keydown", onKey, true);
  }, [enabled]);
}
