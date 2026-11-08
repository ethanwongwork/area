// Validation paint shared by every field (components audit 2026-11-07, O1): Field hands its control
// `data-validation-status`; a control's own `validationStatus`, `invalid` and `aria-invalid` win over it. Input's rule,
// in one place, so OTP field, Time field, the Date pickers, Custom select, Tag picker and the choice groups read it the
// same way.

export type ValidationStatus = "error" | "success" | "warning";

const truthy = (value: unknown) => value !== undefined && value !== null && value !== false && value !== "false";

/** The status a field paints: error when anything says invalid, else the control's own status, else the Field's. */
export function resolveValidation(options: {
  validationStatus?: ValidationStatus;
  invalid?: boolean;
  ariaInvalid?: unknown;
  fieldStatus?: string;
}): { invalid: boolean; status: ValidationStatus | undefined } {
  const { validationStatus, invalid, ariaInvalid, fieldStatus } = options;
  const field = fieldStatus === "error" || fieldStatus === "success" || fieldStatus === "warning" ? fieldStatus : undefined;
  const isInvalid = validationStatus === "error" || Boolean(invalid) || truthy(ariaInvalid) || (validationStatus === undefined && field === "error");
  return { invalid: isInvalid, status: isInvalid ? "error" : validationStatus ?? field };
}

/** The data hooks for a status: `data-invalid`, `data-success` or `data-warning`, as Input's shell carries them. */
export function validationAttributes(status: ValidationStatus | undefined): Record<string, string> {
  if (status === "error") return { "data-invalid": "" };
  if (status === "success") return { "data-success": "" };
  if (status === "warning") return { "data-warning": "" };
  return {};
}
