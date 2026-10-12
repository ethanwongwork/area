/** The Dev Mode inspector recipe: Panel, Box model, Code block sm, Token row, Asset row and Link, composed as Figma
 * Dev Mode's Inspect panel lays them out (captures in docs/research/captures/inspector-rows/). No new component: the
 * header rows are a muted icon and a standalone Link. */
import type { CSSProperties, ReactNode } from "react";
import { AssetRow, BoxModel, Button, CodeBlock, Link, Panel, PanelSection, TokenRow } from "@area/react";
import { PilotClockIcon, PilotComponentIcon, PilotDownloadIcon, PilotHeartIcon, PilotMoreHorizontalIcon } from "../pilot-icons.tsx";
// @ts-expect-error — the docs' own highlighter is authored in JavaScript.
import { highlight } from "../../scripts/layout.mjs";

/* Dev Mode's header rows: a 16 icon in the muted ink, 8 to the text, rows 16 apart. */
const metaRows = { display: "grid", gap: "var(--area-space-12)", fontSize: "var(--area-text-xs-size)", lineHeight: "var(--area-text-xs-leading)" } as CSSProperties;
const metaRow = { display: "flex", alignItems: "center", gap: "var(--area-space-8)", color: "var(--area-fg-muted)" } as CSSProperties;
const metaIcon = { display: "inline-flex", inlineSize: "var(--area-icon-md)", blockSize: "var(--area-icon-md)" } as CSSProperties;
const Meta = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div style={metaRow}><span style={metaIcon} aria-hidden="true">{icon}</span>{children}</div>
);
const stack = { display: "grid" } as CSSProperties;

export const GalleryPanelDevMode = () => (
  <Panel size="sm" title="Button" aria-label="Inspect" style={{ "--area-panel-inline-size": "280px" } as CSSProperties}
    action={<Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="More layer actions" icon={<PilotMoreHorizontalIcon />} />}>
    <PanelSection heading="Component">
      <div style={metaRows}>
        <Meta icon={<PilotComponentIcon />}><Link variant="standalone" ink="muted" href="#main-component">Button / Primary</Link></Meta>
        <Meta icon={<PilotClockIcon />}>Edited 2 hours ago</Meta>
      </div>
    </PanelSection>
    <PanelSection heading="Layer properties">
      <BoxModel margin={0} border={1} padding={[6, 12, 6, 12]} radius={8} width={72} height={28} caption="border-box" />
    </PanelSection>
    <PanelSection heading="Layout">
      <CodeBlock size="sm" html={highlight("display: flex;\npadding: 6px 12px;\nalign-items: center;\ngap: 8px;\nborder-radius: 8px;")} />
    </PanelSection>
    <PanelSection heading="Colors">
      <div style={stack}>
        <TokenRow copyable swatch="var(--area-neutral-850)" name="neutral/850" value="#1D1D1D" />
        <TokenRow copyable swatch="var(--area-neutral-50)" name="neutral/50" value="#F7F7F7" />
      </div>
    </PanelSection>
    <PanelSection heading="Assets">
      <AssetRow preview={<PilotHeartIcon />} name="icon/heart" meta="SVG · 16 × 16"
        actions={<Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Download icon/heart" icon={<PilotDownloadIcon />} />} />
    </PanelSection>
  </Panel>
);
