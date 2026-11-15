import { MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { ScrollArea } from "./ScrollArea.tsx";
import { AnchoredMenu, MENU_OFFSET, OVERLAY_PADDING, TYPEAHEAD_RESET } from "./Overlays.tsx";
import { assignRef, useAnchoredPosition, useNativePopover, useOpenState } from "./overlay.ts";
import type { OverlayAlign, OverlaySide } from "./overlay.ts";
import { Children, forwardRef, useEffect, useId, useRef } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode, Ref } from "react";
import { cx, menuVariants } from "../variants.ts";
import { Spinner } from "./Spinner.tsx";
import { Tooltip } from "./Tooltip.tsx";
import { useLoadingDelay } from "./loading-delay.ts";
import type { Div } from "./shared.ts";
export interface MenuProps extends Div {
  /**
   * The button that opens it. With a trigger, the menu anchors to it and follows the ARIA
   * menu button pattern: Enter, Space or ArrowDown open it on the first item and ArrowUp on
   * the last; arrows, Home, End and typing move between items; choosing an item, Escape or
   * Tab closes it. Without one, the menu is a surface its host places (SplitButton,
   * ContextMenu, ModelPicker) and handles the item keys itself.
   */
  trigger?: ReactNode;
  /** Whether the menu is open, controlled. */
  open?: boolean;
  /** Whether the menu starts open, uncontrolled; closed by default. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** The trigger's side it opens on; bottom by default. */
  side?: OverlaySide;
  /** How it lines up with the trigger along that side; start by default. */
  align?: OverlayAlign;
  /** The gap from the trigger in pixels; 4 by default. */
  offset?: number;
  /**
   * With a trigger: an Area Tooltip that names it (below it, after the hover delay), for an icon-only trigger. A
   * Tooltip can't wrap a menu's trigger from outside, since both take the trigger over.
   */
  tooltip?: ReactNode;
  /**
   * Fixed above the rows, with a rule under it, and not scrolled with them: a heading (a string is set as a Menu
   * label) or a line about the list. Its own rows, if any, are reached by the arrows.
   */
  header?: ReactNode;
  /** Fixed below the rows, with a rule over it: an action row for the whole list (a MenuItem such as "Manage teams") or a hint. */
  footer?: ReactNode;
  /**
   * The rows are on their way: a loading row (a Spinner and `loadingText`) takes their place after a short wait (300 ms,
   * Spinner's `delay="short"`), and the menu is `aria-busy`.
   */
  loading?: boolean;
  /** The loading row's words. Defaults to "Loading". */
  loadingText?: ReactNode;
  /**
   * The row shown when the menu has no rows. Name what's missing ("No teams yet"). Defaults to "No items"; `null` shows
   * nothing, for a host that fills the menu only while it is open (Context menu).
   */
  emptyText?: ReactNode;
}

/** The loading row: it keeps its place while it waits, then shows the Spinner and the words together. */
function MenuLoadingRow({ children }: { children: ReactNode }) {
  const shown = useLoadingDelay("short");
  return (
    <div className="area-menu__loading" {...(shown ? {} : { "data-waiting": "" })}>
      <span className="area-menu__icon" aria-hidden="true"><Spinner size="sm" /></span>
      <span className="area-menu__text">{children}</span>
    </div>
  );
}

/* What the menu lists: its rows, or the loading or empty row in their place; and the header and footer around them. */
function menuBody(children: ReactNode, loading: boolean | undefined, loadingText: ReactNode, emptyText: ReactNode) {
  if (loading) return <MenuLoadingRow>{loadingText}</MenuLoadingRow>;
  if (Children.toArray(children).length === 0 && emptyText != null && emptyText !== false) return <div className="area-menu__empty"><span className="area-menu__text">{emptyText}</span></div>;
  return children;
}
const menuRegion = (part: "header" | "footer", content: ReactNode) => content == null || content === false ? null
  : <div className={`area-menu__${part}`}>{typeof content === "string" ? <MenuLabel>{content}</MenuLabel> : content}</div>;

const menuItemsOf = (menu: HTMLElement) =>
  [...menu.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([disabled]):not([aria-disabled="true"]:not([data-inactive]))')]
    .filter(item => item.closest('[role="menu"]') === menu);

export const Menu = /* @__PURE__ */ forwardRef<HTMLDivElement, MenuProps>(function Menu({ trigger, open, defaultOpen, onOpenChange, side, align, offset, tooltip, header, footer, loading, loadingText = "Loading", emptyText = "No items", className, onKeyDown, children: rows, ...rest }, ref) {
  const typeahead = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const body = menuBody(rows, loading, loadingText, emptyText);
  const top = menuRegion("header", header), bottom = menuRegion("footer", footer);
  const framed = top !== null || bottom !== null;
  const busy = loading ? { "aria-busy": true as const } : {};
  if (trigger !== undefined) {
    // The consumer's handlers run first and can cancel the menu's own; a consumer's name wins
    // over the trigger's (audit D-12: they used to be overwritten).
    const surface = (extra: Div & { ref?: Ref<HTMLDivElement> }) => {
      const chain = <E extends { defaultPrevented: boolean }>(theirs: ((event: E) => void) | undefined, ours: ((event: E) => void) | undefined) =>
        theirs && ours ? (event: E) => { theirs(event); if (!event.defaultPrevented) ours(event); } : theirs ?? ours;
      const own = {
        "aria-labelledby": rest["aria-labelledby"] ?? (rest["aria-label"] ? undefined : extra["aria-labelledby"]),
        onKeyDown: chain(onKeyDown, extra.onKeyDown), onClick: chain(rest.onClick, extra.onClick), onPointerMove: chain(rest.onPointerMove, extra.onPointerMove),
        ref: (node: HTMLDivElement | null) => { assignRef(ref, node); assignRef(extra.ref as never, node); },
      };
      // An anchored menu can outgrow the room beside its trigger, so it scrolls as a Scroll area
      // (docs/specs/scroll-area.md, "Adoption"); focus stays on its items, so the scroller is no Tab stop.
      // With a header or footer, only the rows scroll: the frame holds the three, the Scroll area the rows (V5).
      if (framed) return <div role="menu" className={menuVariants({}, className)} {...busy} {...rest} {...extra} {...own}>
        {top}<ScrollArea className="area-menu__list" viewportProps={{ tabIndex: undefined }}>{body}</ScrollArea>{bottom}
      </div>;
      return <ScrollArea role="menu" className={menuVariants({}, className)} {...busy} {...rest} {...extra} viewportProps={{ tabIndex: undefined }} {...own}>{body}</ScrollArea>;
    };
    // The tooltip takes the trigger after the menu has, so both sets of handlers and refs compose.
    const wrapTrigger = tooltip == null ? undefined : (menuTrigger: ReactNode) => <Tooltip side="bottom" trigger={menuTrigger}>{tooltip}</Tooltip>;
    return <AnchoredMenu trigger={trigger} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} side={side} align={align} offset={offset} id={rest.id} surface={surface} wrapTrigger={wrapTrigger} />;
  }
  /* A hosted menu: Up/Down move between items (wrapping), Home/End jump to the ends and a
     printable key moves to the next item starting with it, as in the WAI menu pattern. */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const menu = event.currentTarget;
    // A nested submenu handles its own keys.
    if (event.defaultPrevented || (event.target as HTMLElement).closest('[role="menu"]') !== menu) return;
    const items = menuItemsOf(menu);
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next: HTMLElement | undefined;
    switch (event.key) {
      case "ArrowDown": next = items[(index + 1) % items.length]; break;
      case "ArrowUp": next = items[(index - 1 + items.length) % items.length]; break;
      case "Home": next = items[0]; break;
      case "End": next = items.at(-1); break;
      default:
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey || event.key === " ") return;
        typeahead.current += event.key.toLocaleLowerCase();
        if (timer.current) clearTimeout(timer.current);
        // One typeahead window for every list (audit D-11): 1s, as Radix and React Aria.
        timer.current = setTimeout(() => { typeahead.current = ""; }, TYPEAHEAD_RESET);
        next = [...items.slice(index + 1), ...items.slice(0, index + 1)]
          .find(item => (item.textContent ?? "").trim().toLocaleLowerCase().startsWith(typeahead.current));
    }
    if (!next) return;
    event.preventDefault();
    next.focus();
  };
  return <div ref={ref} role="menu" className={menuVariants({}, className)} onKeyDown={handleKeyDown} {...busy} {...rest}>
    {framed ? <>{top}<div className="area-menu__list">{body}</div>{bottom}</> : body}
  </div>;
});

/** A non-interactive heading that names the following group of menu items. */
export const MenuLabel = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuLabel({ className, children, ...rest }, ref) {
  // The text has its own element so the label can take the rows' text inset (inset.css).
  return <div ref={ref} className={cx("area-menu__label", className)} {...rest}><span className="area-menu__label-text">{children}</span></div>;
});

/** A visual and semantic boundary between related groups of menu actions. */
export const MenuSeparator = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuSeparator({ className, ...rest }, ref) {
  return <div ref={ref} role="separator" className={cx("area-menu__separator", className)} {...rest} />;
});

export interface MenuSubProps extends Omit<Div, "children"> {
  /** The row's label. */
  label: ReactNode;
  /** A leading icon in the row's icon box. */
  icon?: ReactNode;
  /** The row cannot open its submenu. */
  disabled?: boolean;
  /** The submenu's rows. */
  children: ReactNode;
}

/**
 * A row that opens a nested menu beside it (audit D-10 A, owner 2026-09-30): `aria-haspopup`,
 * Right (Left in right-to-left), Enter or Space opens it on its first row, Left or Escape closes
 * it back to the row, and the pointer opens it on hover. It is a nested `popover="auto"`, so
 * Escape and an outside press close the innermost menu first, and closing the parent closes it.
 * The trailing chevron points along the reading direction.
 */
export const MenuSub = /* @__PURE__ */ forwardRef<HTMLDivElement, MenuSubProps>(function MenuSub(
  { label, icon, disabled, className, children, ...rest }, ref,
) {
  const id = useId();
  const row = useRef<HTMLButtonElement | null>(null);
  const surfaceNode = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useOpenState(undefined, false, undefined);
  const entry = useRef(false);
  useNativePopover(surfaceNode, row, open, setOpen);
  // Beside the parent menu, 4 from its edge as every menu from its trigger, with the first row
  // level with this one (the submenu's own 4px padding is taken out).
  useAnchoredPosition(row, surfaceNode, open, {
    side: "right", align: "start", offset: MENU_OFFSET, padding: OVERLAY_PADDING,
    anchorRect: node => {
      const own = node.getBoundingClientRect();
      const menu = node.closest("[role='menu']")?.getBoundingClientRect() ?? own;
      const inset = surfaceNode.current ? parseFloat(getComputedStyle(surfaceNode.current).paddingTop) + parseFloat(getComputedStyle(surfaceNode.current).borderTopWidth) : 0;
      return { x: menu.x, y: own.y - inset, width: menu.width, height: own.height };
    },
  });
  useEffect(() => {
    if (!open || !entry.current) return;
    entry.current = false;
    surfaceNode.current?.querySelector<HTMLElement>("[role^='menuitem']:not(:disabled, [aria-disabled='true'])")?.focus({ preventScroll: true });
  }, [open]);
  // Moving to another row of the parent menu closes the submenu (hover intent without a delay).
  useEffect(() => {
    if (!open) return;
    const parent = row.current?.closest("[role='menu']");
    if (!parent) return;
    const onFocusIn = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target !== row.current && target.closest("[role='menu']") === parent) setOpen(false);
    };
    parent.addEventListener("focusin", onFocusIn);
    return () => parent.removeEventListener("focusin", onFocusIn);
  }, [open]);
  const rtl = () => row.current ? getComputedStyle(row.current).direction === "rtl" : false;
  const openKey = () => (rtl() ? "ArrowLeft" : "ArrowRight");
  const closeKey = () => (rtl() ? "ArrowRight" : "ArrowLeft");
  return <>
    <button ref={row} type="button" role="menuitem" className="area-menu__item area-menu__item--sub" aria-haspopup="menu" aria-expanded={open}
      aria-controls={id} disabled={disabled} data-keep-open="" {...(disabled ? { "data-disabled": "" } : {})}
      onClick={() => { entry.current = true; setOpen(true); }}
      onPointerEnter={event => { if (event.pointerType === "mouse" && !disabled) setOpen(true); }}
      onKeyDown={event => {
        if (disabled) return;
        if (event.key === openKey() || event.key === "Enter" || event.key === " ") {
          event.preventDefault(); event.stopPropagation(); entry.current = true; setOpen(true);
          if (open) surfaceNode.current?.querySelector<HTMLElement>("[role^='menuitem']:not(:disabled)")?.focus({ preventScroll: true });
        }
      }}>
      {icon ? <span className="area-menu__icon" aria-hidden="true">{icon}</span> : null}
      <span className="area-menu__text">{label}</span>
      <span className="area-menu__sub-chevron" aria-hidden="true"><Glyph name="chevron-down" /></span>
    </button>
    <Menu ref={node => { surfaceNode.current = node; assignRef(ref, node); }} id={id} popover="auto" tabIndex={-1} aria-label={typeof label === "string" ? label : undefined}
      className={className} {...rest}
      onKeyDown={event => {
        if (event.key !== "Escape" && event.key !== closeKey()) return;
        if ((event.target as HTMLElement).closest("[role='menu']") !== event.currentTarget) return;
        event.preventDefault(); event.stopPropagation();
        setOpen(false);
        row.current?.focus({ preventScroll: true });
      }}>
      {children}
    </Menu>
  </>;
});

/** A floating search field and its related menu, outside the menu's action-list semantics. */
/**
 * @deprecated A searchable list is a Combobox (a field that filters a list) or a Command palette
 * (a filtered command list); both own active-descendant keys this surface never had (audit D-22).
 * Kept so existing markup renders.
 */
export const MenuSearch = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuSearch({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-menu__search-surface", className)} {...rest} />;
});

export interface MenuItemProps extends HTMLAttributes<HTMLButtonElement> {
  /** `danger` for an action that destroys something; neutral when unset. */
  tone?: (typeof MANIFESTS.menu.elementModifiers.item)[number];
  /** The keys that do the same, at the row's end. */
  shortcut?: ReactNode;
  /** The row cannot be chosen; arrows skip past it. */
  disabled?: boolean;
  /**
   * Makes the row a checkable item (`role="menuitemcheckbox"`). The whole row is the control: toggle `checked` in
   * `onClick`. Hosts keep the menu open for checkbox rows and close it for a radio choice, as for an action.
   */
  checked?: boolean;
  /** With `checked`, makes the row one choice of several (`role="menuitemradio"`), as a mode or model menu. */
  radio?: boolean;
  /** How a checkable row shows its state: a trailing check (default) or a switch. */
  indicator?: "check" | "switch";
  /** A muted note under the label (a model's summary, a setting's effect). */
  description?: ReactNode;
  /** A leading icon in the row's icon box, as Nav item, Tabs and Command palette rows take. */
  icon?: ReactNode;
  /**
   * Pushed to the row's end, before the shortcut: a count, a badge, a status, as Nav item's, Tabs items' and Tree
   * view nodes' `trailing`. Muted, in the row's type.
   */
  trailing?: ReactNode;
  /**
   * Choosing the row leaves the menu open (`data-keep-open`), for a menu of view options whose effect shows behind it
   * (sort, group, show); a menu of commands closes. Checkbox rows always stay open.
   */
  keepOpen?: boolean;
  /**
   * Can't act now, for a reason that will pass or that the person can change: drawn as disabled, but the arrows,
   * typeahead and the pointer still reach it, so it can say why in `inactiveText`. Choosing it does nothing and
   * leaves the menu open (`aria-disabled`). `disabled` is for a row that truly can't act.
   */
  inactive?: boolean;
  /** Why an inactive row can't act ("Upgrade to export"), in its note under the label, in place of `description`, and as its accessible description. */
  inactiveText?: ReactNode;
}

/** A string shortcut's keys: each leading modifier glyph on its own, then the rest as written ("⌘⇧P" → ⌘, ⇧, P). */
const MODIFIER_GLYPHS = "⌘⇧⌥⌃";
function shortcutKeys(text: string) {
  const keys: string[] = [];
  let rest = text;
  while (rest.length > 1 && MODIFIER_GLYPHS.includes(rest[0]!)) { keys.push(rest[0]!); rest = rest.slice(1); }
  return rest ? [...keys, rest] : keys;
}

export const MenuItem = /* @__PURE__ */ forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { tone, shortcut, disabled, checked, radio, indicator = "check", description: descriptionProp, icon, trailing, keepOpen, inactive: inactiveProp, inactiveText, className, children, onClick, ...rest },
  ref,
) {
  const checkable = checked !== undefined;
  const reasonId = useId();
  // Disabled wins: a native disabled row can't take focus, so it can't be inactive.
  const inactive = Boolean(inactiveProp) && !disabled;
  const reason = inactive && inactiveText != null && inactiveText !== false;
  // The reason is the row's note and its description, said once: hidden from the row's name, read through describedby.
  const description = reason ? <span id={reasonId} aria-hidden="true">{inactiveText}</span> : descriptionProp;
  return (
    <button
      ref={ref}
      type="button"
      role={checkable ? (radio ? "menuitemradio" : "menuitemcheckbox") : "menuitem"}
      aria-checked={checkable ? checked : undefined}
      className={cx("area-menu__item", tone === "danger" && "area-menu__item--danger", className)}
      disabled={disabled}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(keepOpen || inactive ? { "data-keep-open": "" } : {})}
      {...(inactive ? { "data-inactive": "", "aria-disabled": true } : {})}
      onClick={inactive ? event => event.preventDefault() : onClick}
      {...(reason ? { ...rest, "aria-describedby": [rest["aria-describedby"], reasonId].filter(Boolean).join(" ") } : rest)}
    >
      {icon ? <span className="area-menu__icon" aria-hidden="true">{icon}</span> : null}
      {description ? <span className="area-menu__lines"><span className="area-menu__text">{children}</span><span className="area-menu__description">{description}</span></span>
        : icon || typeof children === "string" || typeof children === "number" ? <span className="area-menu__text">{children}</span> : children}
      {/* Every key is a keycap (owner, 2026-10-22): a string shortcut is set in the small keycaps, its leading modifier
          glyphs each their own key and the rest verbatim ("⌘L" → ⌘ · L), as a Kbd passed in draws it (visual pass
          2026-10-26: "⌘L" set as one cap beside Kbd's "⌘ K" read as two spacings in one menu). The row hides a Kbd's
          spoken chord anyway; the item carries aria-keyshortcuts. */}
      {trailing != null && trailing !== false ? <span className="area-menu__trailing">{trailing}</span> : null}
      {shortcut ? <span className="area-menu__shortcut">{typeof shortcut === "string"
        ? <span className="area-kbd area-kbd--sm area-kbd--default">{shortcutKeys(shortcut).map((key, i) => <kbd key={i} className="area-kbd__key">{key}</kbd>)}</span> : shortcut}</span> : null}
      {checkable && indicator === "switch" ? (
        <span className="area-switch area-switch--sm area-menu__toggle" aria-hidden="true">
          <span className="area-switch__track" data-checked={checked ? "" : undefined}><span className="area-switch__thumb" /></span>
        </span>
      ) : null}
      {checkable && indicator === "check" ? (
        <span className="area-menu__check" aria-hidden="true">
          <Glyph name="check" />
        </span>
      ) : null}
    </button>
  );
});

