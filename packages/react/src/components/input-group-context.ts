import { createContext } from "react";

/**
 * State a Field puts on an InputGroup (disabled, validation), handed to the controls inside it.
 * The group paints from its controls (`:has(...)` in input-group.css), and a disabled group must
 * disable its inputs, not only its label (audit B-14).
 */
export interface InputGroupState {
  disabled?: boolean;
  validationStatus?: "error" | "success" | "warning";
}
export const InputGroupContext = createContext<InputGroupState>({});
