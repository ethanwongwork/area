import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner.tsx";
import { MANIFESTS, switchVariants, type VariantProps } from "../variants.ts";

type SwitchAxes = VariantProps<typeof MANIFESTS.switch>;
type Options = Omit<SwitchAxes, "rounded" | "size" | "track" | "labelPosition" | "fullWidth"> & {
  /** The height and type; the track follows the type size: `md` (default), `sm` or `lg`. */
  size?: SwitchAxes["size"];
  /** `short` (default) or `long`, a wider track with a pill thumb. */
  track?: SwitchAxes["track"];
  /** Which side of the switch the label sits: `end` (default) or `start`. */
  labelPosition?: SwitchAxes["labelPosition"];
  /** Fills its container's width, the label and the switch at opposite ends, as in a settings row. */
  fullWidth?: boolean;
};
export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & Options & {
  /** The setting's visible name. */
  label?: ReactNode;
  /** A line under the label, read as the switch's description. */
  description?: ReactNode;
  /** Pending: a spinner shows and presses are ignored; off by default. */
  loading?: boolean;
  /** Unset: a pill while the theme's `pills` list names this component (the default). `true` forces a pill, `false` the radius setting's corner. */
  pill?: boolean;
  /** @deprecated Ignored: set `--area-switch-color` (and `--area-switch-color-hover`) on any Switch for a custom on color. */
  tone?: "neutral" | "custom";
  /** Called with the new state and the change event. */
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  "data-hover"?: string;
  "data-active"?: string;
  "data-focus-visible"?: string;
};

/** A native form switch for a setting that takes effect immediately. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({
  size,
  labelPosition,
  track,
  tone: _tone,
  fullWidth,
  pill,
  label,
  description,
  checked,
  defaultChecked = false,
  loading = false,
  disabled,
  readOnly,
  onCheckedChange,
  onChange,
  onClick,
  className,
  style,
  "data-hover": hover,
  "data-active": active,
  "data-focus-visible": focus,
  "aria-describedby": describedBy,
  ...rest
}, ref) {
  // The system's defaults (SystemDefaults) where the use gives none.
  size = useSystemDefault("switch", "size", size, switchVariants.manifest.variants.size);
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!, []);
  const id = useId();
  const initial = useRef(defaultChecked);
  const [local, setLocal] = useState(defaultChecked);
  const value = checked ?? local;
  const blocked = !!(disabled || readOnly || loading);

  useEffect(() => {
    const form = input.current?.form;
    const reset = (event: Event) => queueMicrotask(() => {
      if (!event.defaultPrevented && checked === undefined) setLocal(initial.current);
    });
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [checked, rest.form]);

  return (
    <label
      className={switchVariants({ size, labelPosition, track, fullWidth, pill: pill === true, rounded: pill === false }, className)}
      style={style}
      dir={rest.dir}
      data-disabled={disabled ? "" : undefined}
      data-read-only={readOnly ? "" : undefined}
      data-loading={loading ? "" : undefined}
      data-hover={hover}
      data-active={active}
      data-focus-visible={focus}
    >
      <input
        {...rest}
        ref={input}
        className="area-switch__control"
        type="checkbox"
        role="switch"
        checked={value}
        disabled={disabled}
        readOnly={readOnly}
        aria-readonly={readOnly || undefined}
        aria-busy={loading || undefined}
        aria-labelledby={rest["aria-labelledby"] ?? (label ? `${id}-label` : undefined)}
        aria-describedby={[describedBy, description ? `${id}-description` : null].filter(Boolean).join(" ") || undefined}
        onChange={event => {
          if (blocked) return;
          onChange?.(event);
          if (event.defaultPrevented) return;
          if (checked === undefined) setLocal(event.target.checked);
          onCheckedChange?.(event.target.checked, event);
        }}
        onClick={event => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
      />
      <span className="area-switch__track" aria-hidden="true">
        <span className="area-switch__thumb" />
      </span>
      {loading ? <span className="area-switch__loading"><Spinner /></span> : null}
      {(label || description) ? (
        <span className="area-switch__text">
          {label ? <span id={`${id}-label`} className="area-switch__label">{label}</span> : null}
          {description ? <span id={`${id}-description`} className="area-switch__description">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
});
