import { forwardRef, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { treeViewVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

export interface TreeViewNode {
  id: string;
  label: string;
  children?: TreeViewNode[];
  icon?: ReactNode;
  trailing?: ReactNode;
  /**
   * Row controls at the end, such as lock and visibility toggles. Shown on hover, focus and
   * selection; give a control `data-pinned` to keep it visible (a locked or hidden layer).
   * The tree keeps one Tab stop, so give each control `tabIndex={-1}` and a keyboard
   * equivalent elsewhere. Clicks on a control do not activate the row.
   */
  actions?: ReactNode;
  disabled?: boolean;
}
export interface TreeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: TreeViewNode[];
  /** Navigation activates a row; checkbox mode toggles its checked state. */
  selectionMode?: VariantProps<typeof MANIFESTS.treeView>["selectionMode"];
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[], event: SyntheticEvent) => void;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedChange?: (ids: string[], event: SyntheticEvent) => void;
  onActivate?: (id: string) => void;
  currentId?: string;
}

type VisibleNode = { node: TreeViewNode; depth: number; parentId?: string; position: number; count: number };
function flatten(items: TreeViewNode[], expanded: Set<string>, depth = 1, parentId?: string): VisibleNode[] {
  return items.flatMap((node, index) => [
    { node, depth, parentId, position: index + 1, count: items.length },
    ...(node.children?.length && expanded.has(node.id) ? flatten(node.children, expanded, depth + 1, node.id) : []),
  ]);
}

/** A single-tab-stop hierarchical list. Arrow keys navigate; Space activates or checks. */
export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(function TreeView(
  { items, selectionMode = "navigation", expandedIds, defaultExpandedIds = [], onExpandedChange,
    selectedIds, defaultSelectedIds = [], onSelectedChange, onActivate, currentId,
    className, onKeyDown, ...rest }, ref,
) {
  const [ownExpanded, setOwnExpanded] = useState(defaultExpandedIds);
  const [ownSelected, setOwnSelected] = useState(defaultSelectedIds);
  const expanded = useMemo(() => new Set(expandedIds ?? ownExpanded), [expandedIds, ownExpanded]);
  const selected = useMemo(() => new Set(selectedIds ?? ownSelected), [selectedIds, ownSelected]);
  const visible = useMemo(() => flatten(items, expanded), [items, expanded]);
  const [focused, setFocused] = useState<string | null>(null);
  const root = useRef<HTMLDivElement | null>(null);
  const typeahead = useRef("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeId = visible.some(row => row.node.id === focused && !row.node.disabled) ? focused :
    visible.find(row => row.node.id === currentId && !row.node.disabled)?.node.id ??
    visible.find(row => !row.node.disabled)?.node.id;
  const focusItem = (id: string) => {
    setFocused(id);
    root.current?.querySelector<HTMLElement>(`[role="treeitem"][data-tree-id="${CSS.escape(id)}"]`)?.focus();
  };
  const setExpansion = (id: string, open: boolean, event: SyntheticEvent) => {
    const next = new Set(expanded);
    if (open) next.add(id); else next.delete(id);
    if (expandedIds === undefined) setOwnExpanded([...next]);
    onExpandedChange?.([...next], event);
  };
  const activate = (id: string, event: SyntheticEvent) => {
    if (selectionMode === "checkbox") {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id); else next.add(id);
      if (selectedIds === undefined) setOwnSelected([...next]);
      onSelectedChange?.([...next], event);
    } else {
      if (selectedIds === undefined) setOwnSelected([id]);
      onSelectedChange?.([id], event);
      onActivate?.(id);
    }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const eventId = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]')?.dataset.treeId ?? activeId;
    if (event.defaultPrevented || !eventId) return;
    const enabled = visible.filter(row => !row.node.disabled);
    const index = enabled.findIndex(row => row.node.id === eventId);
    const current = visible.find(row => row.node.id === eventId)!;
    let next: string | undefined;
    switch (event.key) {
      case "ArrowDown": next = enabled[Math.min(index + 1, enabled.length - 1)]?.node.id; break;
      case "ArrowUp": next = enabled[Math.max(index - 1, 0)]?.node.id; break;
      case "Home": next = enabled[0]?.node.id; break;
      case "End": next = enabled.at(-1)?.node.id; break;
      case "ArrowRight":
        if (current.node.children?.length) {
          if (!expanded.has(eventId)) setExpansion(eventId, true, event);
          else next = current.node.children.find(child => !child.disabled)?.id;
        }
        break;
      case "ArrowLeft":
        if (current.node.children?.length && expanded.has(eventId)) setExpansion(eventId, false, event);
        else next = current.parentId;
        break;
      case "Enter": case " ": activate(eventId, event); break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          typeahead.current += event.key.toLocaleLowerCase();
          if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
          typeaheadTimer.current = setTimeout(() => { typeahead.current = ""; }, 300);
          const ordered = [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)];
          next = ordered.find(row => row.node.label.toLocaleLowerCase().startsWith(typeahead.current))?.node.id;
          if (!next && typeahead.current.length > 1) {
            typeahead.current = event.key.toLocaleLowerCase();
            next = ordered.find(row => row.node.label.toLocaleLowerCase().startsWith(typeahead.current))?.node.id;
          }
        } else return;
    }
    event.preventDefault();
    if (next) focusItem(next);
  };
  return <div {...rest} ref={element => { root.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }} role="tree" className={treeViewVariants({ selectionMode }, className)} onKeyDown={handleKeyDown}>
    {visible.map(({ node, depth, position, count }) => {
      const branch = Boolean(node.children?.length);
      const open = expanded.has(node.id);
      return <div key={node.id} role="treeitem" data-tree-id={node.id} data-disabled={node.disabled ? "" : undefined}
        aria-level={depth} aria-posinset={position} aria-setsize={count} aria-expanded={branch ? open : undefined}
        aria-selected={selectionMode === "navigation" ? selected.has(node.id) : undefined}
        aria-checked={selectionMode === "checkbox" ? selected.has(node.id) : undefined}
        aria-current={currentId === node.id ? "page" : undefined}
        aria-disabled={node.disabled || undefined} tabIndex={node.id === activeId ? 0 : -1}
        style={{ "--_tree-depth": depth - 1 } as React.CSSProperties}
        onFocus={() => setFocused(node.id)} onClick={event => { if (!node.disabled) { focusItem(node.id); activate(node.id, event); } }}>
        <span className="area-tree-view__chevron" aria-hidden="true" onClick={event => { if (!branch || node.disabled) return; event.stopPropagation(); setExpansion(node.id, !open, event); focusItem(node.id); }}>
          {branch && <Glyph name="chevron-down" />}
        </span>
        {selectionMode === "checkbox" && <span className="area-tree-view__check" aria-hidden="true">{selected.has(node.id) && <Glyph name="check-inset" />}</span>}
        {node.icon && <span className="area-tree-view__icon" aria-hidden="true">{node.icon}</span>}
        <span className="area-tree-view__label">{node.label}</span>
        {node.trailing && <span className="area-tree-view__trailing">{node.trailing}</span>}
        {node.actions && <span className="area-tree-view__actions" onClick={event => event.stopPropagation()}>{node.actions}</span>}
      </div>;
    })}
  </div>;
});
