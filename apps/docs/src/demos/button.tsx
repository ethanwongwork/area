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
    <Button tone="accent">Accent</Button>
    <Button tone="neutral">Neutral</Button>
    <Button tone="danger">Danger</Button>
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
