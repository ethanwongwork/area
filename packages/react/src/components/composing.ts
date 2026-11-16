/**
 * Whether a key event belongs to an input-method composition (plan C4): `isComposing`, or `keyCode` 229, which
 * Safari and some IMEs send for the Enter that confirms a candidate while `isComposing` is already false
 * (audit G-15). Every Enter handler on a text input returns early when this is true, so confirming 日本 never also
 * submits, runs a command or commits the field. A cohesion test checks each one.
 */
export function composing(event: { nativeEvent?: { isComposing?: boolean }; isComposing?: boolean; keyCode?: number }): boolean {
  return !!(event.nativeEvent?.isComposing ?? event.isComposing) || event.keyCode === 229;
}
