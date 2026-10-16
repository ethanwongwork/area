/** Copy button gallery specimens: one variant per tile. docs/specs/copy-button.md. */
import { CopyButton, Input, InputGroup } from "@area/react";

/* Icon-only, as ChatGPT's message and code copies: named Copy, the check holds for two seconds. */
export const GalleryCopyButton = () => <CopyButton value="npm install @area/react" />;
/* With a label: the label stays and only the icon turns to a check (Untitled UI). */
export const GalleryCopyButtonLabelled = () => <CopyButton variant="outline" value="https://area.design/components/copy-button">Copy link</CopyButton>;
export const GalleryCopyButtonSm = () => <CopyButton size="sm" value="#0A84FF" label="Copy hex" />;
export const GalleryCopyButtonMd = () => <CopyButton size="md" value="#0A84FF" label="Copy hex" />;
export const GalleryCopyButtonLg = () => <CopyButton size="lg" value="#0A84FF" label="Copy hex" />;
/* A value read when pressed: the function runs at the click, so it copies what is there then. */
export const GalleryCopyButtonRead = () => <CopyButton variant="outline" value={() => new Date().toISOString()}>Copy timestamp</CopyButton>;
/* At the end of a field, as Untitled UI's input with a trailing copy. */
export const GalleryCopyButtonInField = () => (
  <InputGroup style={{ inlineSize: "var(--area-input-inline-size)", maxInlineSize: "100%" }}>
    <Input aria-label="Invite link" readOnly defaultValue="https://area.design/invite/david-tee" />
    <CopyButton value="https://area.design/invite/david-tee" label="Copy invite link" />
  </InputGroup>
);
export const GalleryCopyButtonDisabled = () => <CopyButton value="" label="Copy" disabled />;
