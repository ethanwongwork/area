import type { CSSProperties } from "react";
import { Button } from "@area/react";
import { ArrowIcon, PlusIcon } from "../icons.tsx";
import { ReviewPair } from "./review.tsx";

export const ButtonDefault = () => <Button>Button</Button>;

export const ButtonVariants = () => (
  <>
    <Button variant="solid">Solid</Button>
    <Button variant="soft">Soft</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
  </>
);

export const ButtonTones = () => (
  <>
    <Button tone="neutral">Neutral</Button>
    <Button tone="accent">Accent</Button>
    <Button tone="info">Info</Button>
    <Button tone="success">Success</Button>
    <Button tone="warning">Warning</Button>
    <Button tone="caution">Caution</Button>
    <Button tone="danger">Danger</Button>
    <Button tone="discovery">Discovery</Button>
  </>
);

export const ButtonToneMatrix = () => (
  <>
    {(["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery"] as const).map(
      (tone) => (
        <div key={tone} style={{ display: "flex", gap: "var(--area-space-8)" }}>
          <Button tone={tone} variant="solid" size="sm">
            {tone}
          </Button>
          <Button tone={tone} variant="soft" size="sm">
            {tone}
          </Button>
          <Button tone={tone} variant="outline" size="sm">
            {tone}
          </Button>
          <Button tone={tone} variant="ghost" size="sm">
            {tone}
          </Button>
        </div>
      ),
    )}
  </>
);

export const ButtonPill = () => (
  <>
    <Button pill>Pill</Button>
    <Button pill variant="outline" tone="neutral">
      Pill
    </Button>
    <Button pill variant="soft" tone="discovery">
      Pill
    </Button>
  </>
);

export const ButtonSelected = () => (
  <>
    <Button variant="ghost" tone="neutral" selected>
      Selected
    </Button>
    <Button variant="ghost" tone="neutral">
      Not selected
    </Button>
  </>
);

export const ButtonSizes = () => (
  <>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </>
);

export const ButtonWithIcon = () => (
  <>
    <Button variant="outline" tone="neutral" icon={<PlusIcon />}>
      Button
    </Button>
    <Button variant="outline" tone="neutral" trailingIcon={<ArrowIcon />}>
      Button
    </Button>
  </>
);

export const ButtonIconOnly = () => (
  <Button variant="outline" tone="neutral" iconOnly icon={<PlusIcon />} aria-label="Add item" />
);

export const ButtonLoading = () => <Button loading>Button</Button>;

export const ButtonDisabled = () => (
  <>
    <Button disabled>Solid</Button>
    <Button variant="outline" tone="neutral" disabled>
      Outline
    </Button>
  </>
);

/*
 * Button pass review (2026-09-25, docs/specs/button.md). "Before" restores the pass-0 values
 * through the private properties, so both columns run the current component.
 */
const before = {
  weight: { "--_weight": "var(--area-weight-strong)" } as CSSProperties,
  gap: { "--_gap": "var(--area-gap-md)" } as CSSProperties,
  shadow: { "--_shadow": "var(--area-shadow-1)" } as CSSProperties,
  ghostHover: { "--_bg": "var(--_surface)" } as CSSProperties,
  outlineHover: { "--_bg": "var(--_surface)" } as CSSProperties,
  softHover: { "--_bg": "var(--_surface-hover)", "--_border": "var(--_surface-active)" } as CSSProperties,
};
/* Hover paint held at rest so both columns can be compared without a pointer. */
const after = {
  ghostHover: { "--_bg": "var(--area-bg-hover)" } as CSSProperties,
  outlineHover: { "--_bg": "var(--_surface-hover)" } as CSSProperties,
  softHover: { backgroundImage: "linear-gradient(var(--area-bg-hover), var(--area-bg-hover))", borderColor: "var(--area-bg-hover)" } as CSSProperties,
};
const variants = ["solid", "soft", "outline", "ghost"] as const;
export const GalleryReviewButton = () => (
  <div style={{ display: "grid", gap: "var(--area-space-32)" }}>
    <ReviewPair title="Labels at 400; solid keeps 500"
      basis="Owner type ramp: 400 everywhere except labels on fills. ChatGPT's soft and ghost buttons and Notion's ghost buttons are 400; Notion's solid is 500. Every variant was 500."
      before={<>{variants.map((variant) => <Button key={variant} variant={variant} tone="neutral" style={before.weight}>Save</Button>)}</>}
      after={<>{variants.map((variant) => <Button key={variant} variant={variant} tone="neutral">Save</Button>)}</>} />
    <ReviewPair title="Icon to label 8 → 6"
      basis="Notion puts 6px between icon and label at 28 and 32px (ChatGPT 4, Untitled 4 + 2); Tree view uses 6."
      before={<><Button variant="ghost" tone="neutral" icon={<PlusIcon />} style={before.gap}>New page</Button><Button variant="outline" tone="neutral" trailingIcon={<ArrowIcon />} style={before.gap}>Continue</Button></>}
      after={<><Button variant="ghost" tone="neutral" icon={<PlusIcon />}>New page</Button><Button variant="outline" tone="neutral" trailingIcon={<ArrowIcon />}>Continue</Button></>} />
    <ReviewPair title="Hover paint, shown at rest: ghost 5% wash, outline one rung up"
      basis="ChatGPT and Notion hover ghost buttons with a 5% black wash (242–243 on white); Area's ghost hovered at 247, its outline at 247 (ChatGPT's outline 241). Neutral ghost now uses the shared bg-hover wash; outline takes surface-hover (243). Soft is unchanged (owner: keep its border)."
      before={<><Button variant="ghost" tone="neutral" style={before.ghostHover}>Ghost</Button><Button variant="outline" tone="neutral" style={before.outlineHover}>Outline</Button></>}
      after={<><Button variant="ghost" tone="neutral" style={after.ghostHover}>Ghost</Button><Button variant="outline" tone="neutral" style={after.outlineHover}>Outline</Button></>} />
    <ReviewPair title="Soft hover, shown at rest: stronger, stroke kept"
      basis="ChatGPT's soft pill steps 5% → 10% black (242 → 230); Area's soft stepped one rung (247 → 243). Neutral soft now lays the shared 5% wash over its fill (about 235) and turns its border translucent, so the stroke stays one step darker (about 224). Rest is unchanged."
      before={<><Button variant="soft" tone="neutral">Rest</Button><Button variant="soft" tone="neutral" style={before.softHover}>Hover</Button></>}
      after={<><Button variant="soft" tone="neutral">Rest</Button><Button variant="soft" tone="neutral" style={after.softHover}>Hover</Button></>} />
    <ReviewPair title="No drop shadow"
      basis="Neither ChatGPT nor Notion shadows a button of any variant. Solid, soft and outline carried a 0.5px shadow."
      before={<>{variants.slice(0, 3).map((variant) => <Button key={variant} variant={variant} tone="neutral" style={before.shadow}>Save</Button>)}</>}
      after={<>{variants.slice(0, 3).map((variant) => <Button key={variant} variant={variant} tone="neutral">Save</Button>)}</>} />
  </div>
);
