import { useSystemDefault } from "./SystemDefaults.tsx";
import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { CHANGE_MARK, changeStatus, type ChangeStatusInput } from "./change-status.ts";
import { forwardRef, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { tabsVariants } from "../variants.ts";
import { type Div, NO_ITEMS } from "./shared.ts";
import { useTabIndicator } from "./tab-indicator.ts";
/* --- Tabs ----------------------------------------------------------------- */


/**
 * One tab. It is keyed by `value`, as Segmented's, Toggle group's and Custom select's items are (components audit
 * 2026-11-07, O7); `id` is the deprecated key, still read for one release.
 */
export type TabsItem = { label: ReactNode; icon?: ReactNode; trailing?: ReactNode; disabled?: boolean; content?: ReactNode;
  /** How what the tab holds changed: its label takes the change's ink and the word is read out (components audit D6). */
  status?: ChangeStatusInput;
  /** Changed since it was last looked at: a dot after the label, apart from the status. */
  unseen?: boolean }
  & ({ value: string; /** @deprecated Use `value`. */ id?: string } | { /** @deprecated Use `value`. */ id: string; value?: undefined });

export interface TabsProps extends Omit<Div, "defaultValue"> {
  /** The tabs' height and type size; md by default. */
  size?: VariantProps<typeof MANIFESTS.tabs>["size"];
  /** horizontal (the default): a row over the panel. vertical: a column beside it. */
  orientation?: VariantProps<typeof MANIFESTS.tabs>["orientation"] | "horizontal";
  /**
   * How the selected tab is marked. `marker` (default): a rounded underline, labels on the panel's content edge.
   * `plate`: a soft plate behind the selected tab and plain muted labels, for a panel's or an inspector's views.
   */
  selection?: VariantProps<typeof MANIFESTS.tabs>["selection"] | "marker";
  /** A rule under the tabs that the indicator lies on. */
  track?: boolean;
  /** The tabs, in order. */
  items?: TabsItem[];
  /** The selected tab's id, controlled. */
  value?: string;
  /** The tab selected at first, uncontrolled; the first enabled tab by default. */
  defaultValue?: string;
  /** automatic (the default): an arrow key selects the tab it moves to. manual: arrows move focus and Enter or Space selects. */
  activationMode?: "automatic" | "manual";
  /** @deprecated Use `items`. */
  tabs?: TabsItem[];
  /** Names the tab list (default "Views"). */
  "aria-label"?: string;
  /** @deprecated Use `aria-label`. */
  label?: string;
  /** Called with the selected tab's id and the press or key that chose it. */
  onValueChange?: (value: string, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
}

export const Tabs = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, tabs: legacyTabs, value: controlledValue, defaultValue, onValueChange, "aria-label": ariaLabel, label, size = "md", orientation = "horizontal", activationMode = "automatic", track, selection: selectionProp, className, children, ...rest },
  ref,
) {
  // The system's default (SystemDefaults) where the use gives none; the underline (marker) otherwise.
  const selection = useSystemDefault("tabs", "selection", selectionProp, ["marker", "plate"]) ?? "marker";
  // Each tab's key: its value, else its deprecated id.
  const source = items ?? legacyTabs ?? NO_ITEMS;
  const tabs = useMemo(() => source.map(tab => ({ ...tab, id: (tab.value ?? tab.id)! })), [source]);
  const id = useId();
  const [localValue, setLocalValue] = useState(defaultValue ?? tabs.find(tab => !tab.disabled)?.id);
  const candidate = controlledValue ?? localValue;
  const value = tabs.find(tab => tab.id === candidate && !tab.disabled)?.id ?? tabs.find(tab => !tab.disabled)?.id;
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const list = useRef<HTMLDivElement>(null);
  useTabIndicator(list, buttons, value, tabs);
  const select = (next: string, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
    if (controlledValue === undefined) setLocalValue(next);
    onValueChange?.(next, event);
  };
  return (
    <div ref={ref} className={tabsVariants({ size, track, orientation, selection }, className)} {...rest}>
      <div ref={list} className="area-tabs__list" role="tablist" aria-label={ariaLabel ?? label ?? "Views"} aria-orientation={orientation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.id}`}
            ref={node => { if (node) buttons.current.set(tab.id, node); else buttons.current.delete(tab.id); }}
            aria-selected={tab.id === value}
            aria-controls={`${id}-panel-${tab.id}`}
            onClick={event => select(tab.id, event)}
            onKeyDown={event => {
              const keys = orientation === "vertical" ? ["ArrowUp", "ArrowDown", "Home", "End"] : ["ArrowLeft", "ArrowRight", "Home", "End"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const enabled = tabs.filter(item => !item.disabled);
              const index = enabled.findIndex(item => item.id === tab.id);
              const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
              const step = (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) * (orientation === "horizontal" && rtl ? -1 : 1);
              const next = enabled[event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + step + enabled.length) % enabled.length];
              if (next) { if (activationMode === "automatic") select(next.id, event); buttons.current.get(next.id)?.focus(); }
            }}
            // Only the selected tab is in the tab order; arrow keys move between them.
            tabIndex={tab.id === value ? 0 : -1}
            disabled={tab.disabled}
            className="area-tabs__tab"
            {...(tab.id === value ? { "data-selected": "" } : {})}
            {...(tab.disabled ? { "data-disabled": "" } : {})}
            data-status={changeStatus(tab.status)}
          >
            {tab.icon ? <span className="area-tabs__icon" aria-hidden="true">{tab.icon}</span> : null}
            {/* The hidden strong copy reserves the selected width, so selecting a tab never moves the row; the text part is the
                trimmed slot, centred on its cap (a column of parts cannot be trimmed). */}
            <span className="area-tabs__label"><span className="area-tabs__text">{tab.label}</span><span className="area-tabs__reserve" aria-hidden="true">{tab.label}</span></span>
            {tab.status ? <span className="area-sr-only">{` ${CHANGE_MARK[changeStatus(tab.status)].word}`}</span> : null}
            {tab.unseen ? <span className="area-tabs__unseen"><span className="area-sr-only"> Unseen</span></span> : null}
            {tab.trailing}
          </button>
        ))}
      </div>
      {tabs.map(tab => <div key={tab.id} className="area-tabs__panel" role="tabpanel" id={`${id}-panel-${tab.id}`} aria-labelledby={`${id}-tab-${tab.id}`} hidden={tab.id !== value} tabIndex={0}>
        {tab.content ?? (tab.id === value ? children : null)}
      </div>)}
    </div>
  );
});

