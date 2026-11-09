// Setting row and Settings group: a page of preferences. A row is a setting's name, its description and an optional
// help (a Toggletip or a Link), with its control at the end, under the text when the row is narrow; a setting that
// differs from its default carries a dot after its name and a Reset on hover or focus. Settings group stacks rows under
// an optional heading, ruled between them. Spec: docs/specs/setting-row.md (components audit N4, 2026-11-07).
import { Children, cloneElement, forwardRef, isValidElement, useId } from "react";
import type { AriaAttributes, HTMLAttributes, MouseEvent, ReactElement, ReactNode } from "react";
import { settingRowVariants, settingsGroupVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { SectionHeading } from "./AppShell.tsx";

type SettingRowVariants = VariantProps<typeof MANIFESTS.settingRow>;

interface ControlProps extends AriaAttributes {
  id?: string;
  disabled?: boolean;
}

const FOCUSABLE = "input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [href], [tabindex]:not([tabindex='-1'])";

const mergeIds = (...values: Array<string | undefined>) => {
  const ids = values.flatMap(value => value?.trim().split(/\s+/) ?? []).filter(Boolean);
  return ids.length ? [...new Set(ids)].join(" ") : undefined;
};

export interface SettingRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onReset"> {
  /** The setting's name, a few words in sentence case: it names the control. */
  label: ReactNode;
  /** One line on what the setting does or what its values mean, in the muted ink under the name. */
  description?: ReactNode;
  /**
   * After the name: a Toggletip that explains the setting, or a Link to more about it. It sits outside the label, so
   * its words never join the control's name (Field's `labelAction`).
   */
  labelAction?: ReactNode;
  /**
   * The control, at the row's end: a Switch, Select, Segmented, Slider, Number field or Button. The row names it with
   * the label and describes it with the description (its `id`, `aria-labelledby` and `aria-describedby`), so the
   * control must forward them; pass `controlId` when it is not the row's only element child.
   */
  children?: ReactNode;
  /** The control's id when you set it yourself; otherwise one is generated. */
  controlId?: string;
  /** The setting differs from its default: a dot after the name, said with the control's description ("Modified"). */
  modified?: boolean;
  /** Puts the setting back to its default. Draws Reset while `modified`, shown on hover or focus. */
  onReset?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Reset's name and tooltip (default "Reset “<label>” to default", or "Reset to default" when the label isn't text). */
  resetLabel?: string;
  /** The words the modified dot is said as (default "Modified"). */
  modifiedLabel?: string;
  /**
   * `horizontal` (default): the control at the row's end, under the text when the row is narrower than both. `vertical`:
   * always under the text, for a control that needs the line (pictures, a list, a text area).
   */
  orientation?: SettingRowVariants["orientation"];
  /** The setting can't be changed here: the words take the disabled ink and the control is disabled. */
  disabled?: boolean;
}

/** One preference: its name, description and help at the start, its control at the end. */
export const SettingRow = /* @__PURE__ */ forwardRef<HTMLDivElement, SettingRowProps>(function SettingRow(
  { label, description, labelAction, children, controlId: controlIdProp, modified, onReset, resetLabel, modifiedLabel = "Modified", orientation, disabled, className, ...rest },
  ref,
) {
  const reactId = useId().replace(/:/g, "");
  const items = Children.toArray(children);
  const at = items.findIndex(isValidElement);
  const control = at >= 0 ? items[at] as ReactElement<ControlProps> : undefined;
  const controlId = controlIdProp ?? control?.props.id ?? `area-setting-${reactId}`;
  const labelId = `${controlId}-label`;
  const descriptionId = `${controlId}-description`;
  const modifiedId = `${controlId}-modified`;
  const hasDescription = description !== undefined && description !== null && description !== false && description !== "";
  if (control) {
    items[at] = cloneElement(control, {
      id: controlId,
      "aria-labelledby": mergeIds(control.props["aria-labelledby"], labelId),
      "aria-describedby": mergeIds(control.props["aria-describedby"], hasDescription ? descriptionId : undefined, modified ? modifiedId : undefined),
      disabled: disabled || control.props.disabled || undefined,
    });
  }
  // Reset goes away once the setting is back at its default, taking focus with it: hand focus to the control, as a
  // removed Chip hands it to its neighbour, rather than dropping it to the page.
  const reset = (event: MouseEvent<HTMLButtonElement>) => {
    const doc = event.currentTarget.ownerDocument;
    const box = event.currentTarget.closest(".area-setting-row")?.querySelector<HTMLElement>(".area-setting-row__control");
    onReset?.(event);
    // After React has committed the reset (a discrete event's update lands before the next task).
    setTimeout(() => {
      const active = doc.activeElement;
      if (active && active !== doc.body && active.isConnected) return;
      // The control itself when it takes focus (a Switch, a Select), else its first stop (a Segmented's chosen option).
      const target = [doc.getElementById(controlId), box?.querySelector<HTMLElement>(FOCUSABLE)].find(node => node?.matches(FOCUSABLE));
      target?.focus({ preventScroll: true });
    }, 0);
  };
  const text = typeof label === "string" || typeof label === "number" ? String(label) : null;
  const resetWords = resetLabel ?? (text ? `Reset “${text}” to default` : "Reset to default");
  return (
    <div
      ref={ref}
      className={settingRowVariants({ orientation }, className)}
      data-modified={modified ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      {...rest}
    >
      <div className={settingRowVariants.element("body")}>
        <div className={settingRowVariants.element("text")}>
          <div className={settingRowVariants.element("heading")}>
            <label className={settingRowVariants.element("label")} id={labelId} htmlFor={controlId}>{label}</label>
            {modified ? <span className={settingRowVariants.element("modified")} id={modifiedId}><span className="area-sr-only">{modifiedLabel}</span></span> : null}
            {labelAction ? <span className={settingRowVariants.element("help")}>{labelAction}</span> : null}
            {modified && onReset ? (
              <span className={settingRowVariants.element("reset")}>
                <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<Glyph name="reset" />} aria-label={resetWords} title={resetWords}
                  disabled={disabled || undefined} onClick={reset} />
              </span>
            ) : null}
          </div>
          {hasDescription ? <p className={settingRowVariants.element("description")} id={descriptionId}>{description}</p> : null}
        </div>
        {items.length ? <div className={settingRowVariants.element("control")}>{items}</div> : null}
      </div>
    </div>
  );
});

export interface SettingsGroupProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The group's heading, a few words (Section heading's title). Leave it out for a section's first group. */
  heading?: ReactNode;
  /** A muted line under the heading (Section heading's lede). */
  description?: ReactNode;
  /** The heading's level, 2 by default (a settings page's title is its 1). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** The rows in a frame (the Blocks edge, the container corner, the surface), inset 16; without it they sit on the page. */
  framed?: boolean;
  /** Setting rows. */
  children?: ReactNode;
}

/** Setting rows under an optional heading, a rule between them; a `section` named by its heading. */
export const SettingsGroup = /* @__PURE__ */ forwardRef<HTMLElement, SettingsGroupProps>(function SettingsGroup(
  { heading, description, headingLevel = 2, framed, className, children, "aria-labelledby": labelledBy, ...rest },
  ref,
) {
  const headingId = `area-settings-group-${useId().replace(/:/g, "")}`;
  return (
    <section ref={ref} className={settingsGroupVariants({ framed }, className)} aria-labelledby={labelledBy ?? (heading ? headingId : undefined)} {...rest}>
      {heading ? <SectionHeading title={heading} lede={description} level={headingLevel} titleId={headingId} /> : null}
      <div className={settingsGroupVariants.element("rows")}>{children}</div>
    </section>
  );
});

export { settingRowVariants, settingsGroupVariants };
