/** Tag gallery specimens: one variant per tile. docs/specs/tag.md. */
import { useState } from "react";
import { Tag } from "@area/react";
import { GlobeIcon } from "@area/icons";

export const GalleryTag = () => <Tag tone="info">personal</Tag>;
export const GalleryTagNeutral = () => <Tag>Draft</Tag>;
export const GalleryTagInfo = () => <Tag tone="info">personal</Tag>;
export const GalleryTagSuccess = () => <Tag tone="success">complete</Tag>;
export const GalleryTagWarning = () => <Tag tone="warning">blocked</Tag>;
export const GalleryTagCaution = () => <Tag tone="caution">later</Tag>;
export const GalleryTagDanger = () => <Tag tone="danger">urgent</Tag>;
export const GalleryTagDiscovery = () => <Tag tone="discovery">work</Tag>;
export const GalleryTagGray = () => <Tag tone="gray">archived</Tag>;
export const GalleryTagBrown = () => <Tag tone="brown">reading</Tag>;
export const GalleryTagPink = () => <Tag tone="pink">ideas</Tag>;
export const GalleryTagSm = () => <Tag size="sm" tone="info">personal</Tag>;
export const GalleryTagMd = () => <Tag size="md" tone="info">personal</Tag>;
/* Notion's tag in a multi-select field: the × removes it. */
export const GalleryTagRemovable = () => {
  const [shown, setShown] = useState(true);
  return shown ? <Tag tone="info" onRemove={() => setShown(false)}>personal</Tag> : <button type="button" onClick={() => setShown(true)}>Restore</button>;
};
export const GalleryTagIcon = () => <Tag tone="success" icon={<GlobeIcon />}>Public</Tag>;
export const GalleryTagDisabled = () => <Tag tone="info" disabled onRemove={() => {}}>personal</Tag>;
