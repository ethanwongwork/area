// Toggle group: a set of toggle buttons the group keeps the state of, any number pressed or at
// most one. One Tab stop and arrow keys between the toggles (Radix, React Aria); inside a Toolbar
// the toggles join the toolbar's own roving instead. Spec: docs/specs/toggle-group.md.
import { createContext, forwardRef, useContext, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent } from "react";
import { buttonGroupVariants, toggleGroupVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button, type ButtonProps } from "./Button.tsx";
import { InToolbar, ToolbarSize, toolbarItemProps } from "./toolbar-context.ts";

type ToggleGroupVariants = VariantProps<typeof MANIFESTS.toggleGroup>;

interface ToggleGroupContextValue {
  pressed: (value: string) => boolean;
  toggle: (value: string) => void;
  disabled: boolean;
  inToolbar: boolean;
}
const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** The pressed toggles' values (controlled). */
  value?: string[];
  /** The toggles pressed at first (uncontrolled). */
  defaultValue?: string[];
  /** Called with the next set of pressed values. */
  onValueChange?: (value: string[]) => void;
  /** `multiple`: any number pressed (bold, italic, underline). `single`: at most one, and pressing it again releases it. A choice that always has one answer is a Segmented. */
  selectionMode?: "multiple" | "single";
  /** `soft`: Segmented's track, pressed toggles raised. `outline`: joined at their edges (ButtonGroup's look). `ghost`: apart, as a Toolbar group. */
  variant?: ToggleGroupVariants["variant"];
  size?: ToggleGroupVariants["size"];
  /** Fill the container; the toggles share its width. */
  fullWidth?: boolean;
  /** Disables every toggle. */
  disabled?: boolean;
}

const itemsIn = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>("[data-area-toggle-item]")].filter(item => !(item as HTMLButtonElement).disabled);

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  { value: valueProp, defaultValue, onValueChange, selectionMode = "multiple", variant, size: sizeProp, fullWidth, disabled = false,
    className, onKeyDown, onFocusCapture, onBlurCapture, ...rest },
  ref,
) {
  const inToolbar = useContext(InToolbar);
  const toolbarSize = useContext(ToolbarSize);
  const size = sizeProp ?? toolbarSize;
  const [local, setLocal] = useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? local;
  // Presses read the latest set, so two in one tick (before a re-render) both count.
  const latest = useRef(value);
  latest.current = value;
  const lastFocused = useRef<HTMLElement | null>(null);
  const [rootTabIndex, setRootTabIndex] = useState(0);

  const context: ToggleGroupContextValue = {
    pressed: item => value.includes(item),
    toggle: item => {
      const current = latest.current;
      const next = current.includes(item) ? current.filter(v => v !== item) : selectionMode === "single" ? [item] : [...current, item];
      latest.current = next;
      if (valueProp === undefined) setLocal(next);
      onValueChange?.(next);
    },
    disabled,
    inToolbar,
  };

  // outline is ButtonGroup's joined look; soft (Segmented's track) and ghost (Toolbar's toggles) are the group's own.
  const classes = toggleGroupVariants({ variant, size, fullWidth }, cx(
    variant === "outline" ? buttonGroupVariants({ variant: "outline", size, fullWidth }) : undefined, className));

  // Inside a Toolbar the toolbar owns focus: the toggles are its roving items and the group adds no Tab stop.
  if (inToolbar) {
    return <ToggleGroupContext.Provider value={context}><div ref={ref} role="group" className={classes} onKeyDown={onKeyDown} {...rest} /></ToggleGroupContext.Provider>;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const root = event.currentTarget;
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-area-toggle-item]");
    if (!item) return;
    const items = itemsIn(root), index = items.indexOf(item);
    if (index < 0) return;
    const rtl = getComputedStyle(root).direction === "rtl";
    let next = -1;
    if (event.key === (rtl ? "ArrowLeft" : "ArrowRight") || event.key === "ArrowDown") next = (index + 1) % items.length;
    else if (event.key === (rtl ? "ArrowRight" : "ArrowLeft") || event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next < 0) return;
    event.preventDefault();
    items[next]?.focus();
  }

  return (
    <ToggleGroupContext.Provider value={context}>
      <div ref={ref} role="group" {...rest} className={classes} tabIndex={disabled ? -1 : rootTabIndex}
        onFocusCapture={event => {
          onFocusCapture?.(event);
          if (event.defaultPrevented) return;
          const root = event.currentTarget;
          if (event.target === root) {
            // One Tab stop: entering the group lands on the toggle used last, else the first pressed one, else the first.
            const items = itemsIn(root);
            const destination = (lastFocused.current && items.includes(lastFocused.current) ? lastFocused.current : null)
              ?? items.find(item => item.getAttribute("aria-pressed") === "true") ?? items[0];
            destination?.focus();
          } else if ((event.target as HTMLElement).matches("[data-area-toggle-item]")) {
            lastFocused.current = event.target as HTMLElement;
            setRootTabIndex(-1);
          }
        }}
        onBlurCapture={event => {
          onBlurCapture?.(event);
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setRootTabIndex(0);
        }}
        onKeyDown={handleKeyDown} />
    </ToggleGroupContext.Provider>
  );
});

export interface ToggleGroupItemProps extends Omit<ButtonProps, "selected" | "defaultSelected" | "onSelectedChange" | "variant" | "size" | "fullWidth"> {
  /** The value this toggle adds to the group's set when pressed. */
  value: string;
}

/** One toggle in a ToggleGroup: a Button whose pressed state the group keeps. */
export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function ToggleGroupItem(
  { value, disabled, ...rest },
  ref,
) {
  const group = useContext(ToggleGroupContext);
  if (!group) throw new Error("ToggleGroupItem must be inside a ToggleGroup");
  // Button runs onClick first and skips the toggle when it calls preventDefault.
  return (
    <Button ref={ref} variant="ghost" {...rest}
      {...(group.inToolbar ? toolbarItemProps : { tabIndex: -1, "data-area-toggle-item": "" })}
      selected={group.pressed(value)}
      disabled={group.disabled || disabled}
      onSelectedChange={() => group.toggle(value)} />
  );
});

export { toggleGroupVariants };
