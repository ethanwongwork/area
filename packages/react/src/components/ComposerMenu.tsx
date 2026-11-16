// ComposerMenu, one of the chat additions around the Composer. Spec: docs/specs/composer-menu.md.
import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { composerMenuVariants } from "../variants.ts";
// ---- Composer menu ----

export interface ComposerMenuItem {
  id: string;
  label: ReactNode;
  /** A 16 icon in the row's icon slot: the file's kind, the command's mark. */
  icon?: ReactNode;
  /** A file's folder, muted at the row's end and cut from its start. */
  path?: string;
}
export interface ComposerMenuGroup { label?: string; items: ComposerMenuItem[] }

interface ComposerMenuBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "aria-label"> {
  /** The highlighted row, which the field names with aria-activedescendant (`${id}-${item.id}`). */
  activeId?: string;
  /** Called with the row that is chosen. */
  onPick: (item: ComposerMenuItem) => void;
  /** Rows the pointer moves over become the highlighted row. */
  onActiveChange?: (id: string) => void;
  /** Shown when nothing matches. */
  emptyLabel?: string;
}

type ComposerMenuName =
  | {
    /** Names the list ("Files and folders", "Commands"); the field points at it with aria-controls. */
    "aria-label": string;
    label?: undefined;
  }
  | {
    "aria-label"?: string;
    /** @deprecated Use `aria-label`, which wins. Kept for one release. */
    label: string;
  };

type ComposerMenuCollection =
  | {
    /** The rows, in groups; a group's `label` is its visible heading. */
    items: ComposerMenuGroup[];
    groups?: undefined;
  }
  | {
    items?: undefined;
    /** @deprecated Use `items`. Kept for one release. */
    groups: ComposerMenuGroup[];
  };

export type ComposerMenuProps = ComposerMenuBaseProps & ComposerMenuName & ComposerMenuCollection;

/** The @ and / suggestions above the Composer. The field keeps focus; the arrows, Enter, Tab and Esc are the field's. */
export const ComposerMenu = forwardRef<HTMLDivElement, ComposerMenuProps>(function ComposerMenu(
  { "aria-label": ariaLabel, label, items, groups: groupsProp, activeId, onPick, onActiveChange, emptyLabel = "No matches", id: idProp, className, ...rest }, ref,
) {
  const groups = items ?? groupsProp ?? [];
  const own = useId();
  const id = idProp ?? own;
  const empty = groups.every(group => group.items.length === 0);
  return (
    <div ref={ref} id={id} role="listbox" aria-label={ariaLabel ?? label} className={composerMenuVariants({}, ["area-menu", className].filter(Boolean).join(" "))} {...rest}>
      {empty ? <div className="area-menu__empty" role="presentation"><span className="area-menu__text">{emptyLabel}</span></div> : null}
      {groups.filter(group => group.items.length).map((group, g) => {
        const rows = group.items.map(item => (
          <div key={item.id} id={`${id}-${item.id}`} role="option" aria-selected={item.id === activeId}
            className="area-menu__item" data-highlighted={item.id === activeId ? "" : undefined}
            onPointerDown={event => event.preventDefault()} onPointerMove={() => onActiveChange?.(item.id)} onClick={() => onPick(item)}>
            {item.icon ? <span className="area-menu__icon" aria-hidden="true">{item.icon}</span> : null}
            <span className="area-menu__text">{item.label}</span>
            {item.path ? <span className="area-composer-menu__path"><bdi>{item.path}</bdi></span> : null}
          </div>
        ));
        return group.label ? (
          <div key={group.label} role="group" aria-labelledby={`${id}-group-${g}`}>
            <div id={`${id}-group-${g}`} className="area-menu__label" role="presentation"><span className="area-menu__label-text">{group.label}</span></div>
            {rows}
          </div>
        ) : <div key={`group-${g}`} role="presentation">{rows}</div>;
      })}
    </div>
  );
});

