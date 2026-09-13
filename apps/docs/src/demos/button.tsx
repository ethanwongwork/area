import { Button } from "@area/react";
import { ArrowIcon, PlusIcon } from "../icons.tsx";

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
    <Button size="xs">Extra small</Button>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="xl">Extra large</Button>
  </>
);

export const ButtonWithIcon = () => (
  <>
    <Button variant="outline" tone="neutral" icon={<PlusIcon />}>
      Add item
    </Button>
    <Button variant="outline" tone="neutral" trailingIcon={<ArrowIcon />}>
      Continue
    </Button>
  </>
);

export const ButtonIconOnly = () => (
  <Button variant="outline" tone="neutral" iconOnly icon={<PlusIcon />} aria-label="Add item" />
);

export const ButtonLoading = () => <Button loading>Saving</Button>;

export const ButtonDisabled = () => (
  <>
    <Button disabled>Solid</Button>
    <Button variant="outline" tone="neutral" disabled>
      Outline
    </Button>
  </>
);
