/** OTP field gallery specimens: one variant per tile. docs/specs/otp-field.md. */
import { useState } from "react";
import { Field, OTPField } from "@area/react";

export const GalleryOTPField = () => <OTPField aria-label="Verification code" />;
/* Part of the code typed: the caret waits in the next slot. */
export const GalleryOTPFieldPartial = () => <OTPField aria-label="Verification code" defaultValue="482" />;
export const GalleryOTPFieldFilled = () => <OTPField aria-label="Verification code" defaultValue="482915" />;
/* Two groups of three, as a code is read out. */
export const GalleryOTPFieldGroups = () => <OTPField aria-label="Verification code" groups={[3, 3]} defaultValue="482915" />;
/* Four digits: a PIN. */
export const GalleryOTPFieldFour = () => <OTPField aria-label="PIN" length={4} defaultValue="27" />;
export const GalleryOTPFieldMask = () => <OTPField aria-label="PIN" length={4} mask defaultValue="2741" />;
export const GalleryOTPFieldAlphanumeric = () => <OTPField aria-label="Recovery code" characters="alphanumeric" length={8} groups={[4, 4]} defaultValue="K7Q2" />;
export const GalleryOTPFieldSoft = () => <OTPField variant="soft" aria-label="Verification code" defaultValue="482" />;
export const GalleryOTPFieldSm = () => <OTPField size="sm" aria-label="Verification code" defaultValue="482915" />;
export const GalleryOTPFieldMd = () => <OTPField size="md" aria-label="Verification code" defaultValue="482915" />;
export const GalleryOTPFieldLg = () => <OTPField size="lg" aria-label="Verification code" defaultValue="482915" />;
export const GalleryOTPFieldInvalid = () => (
  <Field label="Label" error="Error message">
    <OTPField defaultValue="482915" />
  </Field>
);
export const GalleryOTPFieldDisabled = () => <OTPField aria-label="Verification code" defaultValue="482" disabled />;
/* Checks the code once every slot is filled. */
export const GalleryOTPFieldComplete = () => {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "wrong">("idle");
  return (
    <Field label="Label" description={state === "ok" ? "Success message" : "Helper text. Try 123456."}
      error={state === "wrong" ? "Error message" : undefined}>
      <OTPField value={code} onValueChange={next => { setCode(next); setState("idle"); }}
        onComplete={next => setState(next === "123456" ? "ok" : "wrong")} />
    </Field>
  );
};
