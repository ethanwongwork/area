/** Password field gallery specimens: one variant per tile. docs/specs/password-field.md. */
import { useState } from "react";
import { Button, Field, PasswordField } from "@area/react";

export const GalleryPasswordField = () => <PasswordField aria-label="Password" placeholder="Password" />;
/* With a password: the eye shows it. */
export const GalleryPasswordFieldFilled = () => <PasswordField aria-label="Password" defaultValue="tee-studio-2026" />;
/* Shown: the closed eye hides it again. */
export const GalleryPasswordFieldVisible = () => <PasswordField aria-label="Password" defaultValue="tee-studio-2026" defaultVisible />;
export const GalleryPasswordFieldSoft = () => <PasswordField variant="soft" aria-label="Password" defaultValue="tee-studio-2026" />;
export const GalleryPasswordFieldSm = () => <PasswordField size="sm" aria-label="Password" defaultValue="tee-studio-2026" />;
export const GalleryPasswordFieldMd = () => <PasswordField size="md" aria-label="Password" defaultValue="tee-studio-2026" />;
export const GalleryPasswordFieldLg = () => <PasswordField size="lg" aria-label="Password" defaultValue="tee-studio-2026" />;
export const GalleryPasswordFieldInvalid = () => (
  <Field label="Password" error="Incorrect password">
    <PasswordField defaultValue="tee-studio" />
  </Field>
);
export const GalleryPasswordFieldDisabled = () => <PasswordField aria-label="Password" defaultValue="tee-studio-2026" disabled />;
/* Choosing a new password: new-password lets the browser suggest one. */
export const GalleryPasswordFieldNew = () => (
  <Field label="New password" description="At least 12 characters">
    <PasswordField autoComplete="new-password" />
  </Field>
);
/* Signing in: submitting hides the password again. */
export const GalleryPasswordFieldForm = () => {
  const [sent, setSent] = useState(false);
  return (
    <form style={{ display: "grid", gap: "var(--area-space-8)", inlineSize: "var(--area-input-inline-size)", maxInlineSize: "100%" }}
      onSubmit={event => { event.preventDefault(); setSent(true); }}>
      <Field label="Password">
        <PasswordField defaultValue="tee-studio-2026" defaultVisible onChange={() => setSent(false)} />
      </Field>
      <Button type="submit" variant="solid">{sent ? "Signed in" : "Sign in"}</Button>
    </form>
  );
};
