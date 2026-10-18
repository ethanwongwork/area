/** Tag gallery specimens: one variant per tile. docs/specs/tag.md. */
import { useState } from "react";
import { Tag } from "@area/react";
import { GlobeIcon } from "@area/icons";

export const GalleryTag = () => <Tag tone="info">Tag</Tag>;
export const GalleryTagNeutral = () => <Tag>Neutral</Tag>;
export const GalleryTagInfo = () => <Tag tone="info">Info</Tag>;
export const GalleryTagSuccess = () => <Tag tone="success">Success</Tag>;
export const GalleryTagWarning = () => <Tag tone="warning">Warning</Tag>;
export const GalleryTagCaution = () => <Tag tone="caution">Caution</Tag>;
export const GalleryTagDanger = () => <Tag tone="danger">Danger</Tag>;
export const GalleryTagDiscovery = () => <Tag tone="discovery">Discovery</Tag>;
export const GalleryTagGray = () => <Tag tone="gray">Gray</Tag>;
export const GalleryTagBrown = () => <Tag tone="brown">Brown</Tag>;
export const GalleryTagPink = () => <Tag tone="pink">Pink</Tag>;
export const GalleryTagSm = () => <Tag size="sm" tone="info">Tag</Tag>;
export const GalleryTagMd = () => <Tag size="md" tone="info">Tag</Tag>;
/* Notion's tag in a multi-select field: the × removes it. */
export const GalleryTagRemovable = () => {
  const [shown, setShown] = useState(true);
  return shown ? <Tag tone="info" onRemove={() => setShown(false)}>Tag</Tag> : <button type="button" onClick={() => setShown(true)}>Undo</button>;
};
export const GalleryTagIcon = () => <Tag tone="success" icon={<GlobeIcon size={12} />}>Public</Tag>;
export const GalleryTagDisabled = () => <Tag tone="info" disabled onRemove={() => {}}>Tag</Tag>;
