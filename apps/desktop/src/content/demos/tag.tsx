/** Tag gallery specimens: one variant per tile. docs/specs/tag.md. */
import { useState } from "react";
import { Tag } from "@area/react";
import { GlobeIcon } from "@area/icons";

export const GalleryTag = () => <Tag color="blue">Tag</Tag>;
export const GalleryTagNeutral = () => <Tag>Neutral</Tag>;
export const GalleryTagBlue = () => <Tag color="blue">Blue</Tag>;
export const GalleryTagGreen = () => <Tag color="green">Green</Tag>;
export const GalleryTagOrange = () => <Tag color="orange">Orange</Tag>;
export const GalleryTagYellow = () => <Tag color="yellow">Yellow</Tag>;
export const GalleryTagRed = () => <Tag color="red">Red</Tag>;
export const GalleryTagPurple = () => <Tag color="purple">Purple</Tag>;
export const GalleryTagGray = () => <Tag color="gray">Gray</Tag>;
export const GalleryTagBrown = () => <Tag color="brown">Brown</Tag>;
export const GalleryTagPink = () => <Tag color="pink">Pink</Tag>;
export const GalleryTagMd = () => <Tag size="md" color="blue">Tag</Tag>;
export const GalleryTagLg = () => <Tag size="lg" color="blue">Tag</Tag>;
/* Notion's tag in a multi-select field: the × removes it. */
export const GalleryTagRemovable = () => {
  const [shown, setShown] = useState(true);
  return shown ? <Tag color="blue" onDismiss={() => setShown(false)}>Tag</Tag> : <button type="button" onClick={() => setShown(true)}>Undo</button>;
};
export const GalleryTagIcon = () => <Tag color="green" icon={<GlobeIcon size={12} />}>Public</Tag>;
export const GalleryTagDisabled = () => <Tag color="blue" disabled onDismiss={() => {}}>Tag</Tag>;
