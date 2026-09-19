import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./primitives.tsx";
import { MANIFESTS, switchVariants, type VariantProps } from "../variants.ts";

type Options = VariantProps<typeof MANIFESTS.switch>;
export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & Options & {
  label?: ReactNode;
  description?: ReactNode;
  loading?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  "data-hover"?: string;
  "data-active"?: string;
  "data-focus-visible"?: string;
};

/** A native form switch for a setting that takes effect immediately. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({
  size,
  labelPosition,
  fullWidth,
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
  "data-hover": hover,
  "data-active": active,
  "data-focus-visible": focus,
  "aria-describedby": describedBy,
  ...rest
}, ref) {
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
      className={switchVariants({ size, labelPosition, fullWidth }, className)}
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
          onCheckedChange?.(event.target.checked);
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
      {loading ? <span className="area-switch__loading"><Spinner size="sm" /></span> : null}
      {(label || description) ? (
        <span className="area-switch__text">
          {label ? <span id={`${id}-label`} className="area-switch__label">{label}</span> : null}
          {description ? <span id={`${id}-description`} className="area-switch__description">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
});
