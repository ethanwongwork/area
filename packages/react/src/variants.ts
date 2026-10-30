/** Public, React-free class helpers derived from literal component manifests. */
import { type ComponentManifest, MANIFESTS } from "@area/styles/manifest";
export type { ComponentManifest };
export { MANIFESTS };
import * as manifests from "@area/styles/manifest";

type Camel<S extends string> = S extends `${infer Head}-${infer Tail}` ? `${Head}${Capitalize<Camel<Tail>>}` : S;
type Flags<M> = M extends { booleans: readonly (infer B extends string)[] } ? B : never;
export type VariantProps<M extends ComponentManifest> = {
  [K in keyof M["variants"]]?: M["variants"][K][number];
} & { [K in Flags<M> as Camel<K>]?: boolean };
type Elements<M> = M extends { elements: readonly (infer E extends string)[] } ? E : never;
type States<M> = M extends { states: readonly (infer S extends string)[] } ? S : never;

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
const camel = (value: string) => value.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export function classesFor<M extends ComponentManifest>(manifest: M, props: VariantProps<M> = {}, className?: string): string {
  const flags = new Map((manifest.booleans ?? []).map(flag => [camel(flag), flag]));
  for (const [key, value] of Object.entries(props)) {
    if (!Object.hasOwn(manifest.variants, key) && !flags.has(key)) throw new RangeError(`${manifest.block}: unknown option ${key}`);
    if (value === undefined) continue;
    if (flags.has(key)) {
      if (typeof value !== 'boolean') throw new TypeError(`${manifest.block}: ${key} must be boolean`);
    } else if (!manifest.variants[key]!.includes(value as string)) {
      throw new RangeError(`${manifest.block}: invalid ${key}=${String(value)}`);
    }
  }
  const resolved = { ...manifest.defaults, ...Object.fromEntries(Object.entries(props).filter(([,v])=>v !== undefined)) };
  const parts = [manifest.block];
  for (const key of Object.keys(manifest.variants)) {
    if (resolved[key] !== undefined) parts.push(`${manifest.block}--${resolved[key]}`);
  }
  for (const [key, flag] of flags) if ((props as Record<string, unknown>)[key]) parts.push(`${manifest.block}--${flag}`);
  return cx(...parts, className);
}

export function createVariants<const M extends ComponentManifest>(manifest: M) {
  const fn = (props?: VariantProps<M>, className?: string) => classesFor(manifest, props, className);
  fn.manifest = manifest;
  fn.element = (name: Elements<M>) => {
    if (!manifest.elements?.includes(name)) throw new RangeError(`${manifest.block}: unknown element ${name}`);
    return `${manifest.block}__${name}`;
  };
  return fn;
}

/** Data-state adapter for plain HTML; React may use native or ARIA state instead. */
export function stateAttributes<M extends ComponentManifest>(manifest: M, state: Partial<Record<States<M>, boolean>> = {}): Record<string, string | true> {
  const out: Record<string, string | true> = {};
  for (const [name,value] of Object.entries(state)) {
    if (!manifest.states?.includes(name)) throw new RangeError(`${manifest.block}: unknown state ${name}`);
    if (value !== undefined && typeof value !== 'boolean') throw new TypeError(`${manifest.block}: ${name} must be boolean`);
    const attribute = manifest.stateAttributes?.[name] ?? `data-${name}`;
    if (value) out[attribute] = attribute.startsWith("aria-") ? "true" : attribute.startsWith("data-") ? "" : true;
  }
  return out;
}
export const buttonVariants = /* @__PURE__ */ createVariants(manifests.button);
export const buttonGroupVariants = /* @__PURE__ */ createVariants(manifests.buttonGroup);
export const splitButtonVariants = /* @__PURE__ */ createVariants(manifests.splitButton);
export const toolbarVariants = /* @__PURE__ */ createVariants(manifests.toolbar);
export const alignmentPickerVariants = /* @__PURE__ */ createVariants(manifests.alignmentPicker);
export const colorSwatchVariants = /* @__PURE__ */ createVariants(manifests.colorSwatch);
export const colorSwatchPickerVariants = /* @__PURE__ */ createVariants(manifests.colorSwatchPicker);
export const colorFieldVariants = /* @__PURE__ */ createVariants(manifests.colorField);
export const fieldVariants = /* @__PURE__ */ createVariants(manifests.field);
export const inputVariants = /* @__PURE__ */ createVariants(manifests.input);
export const numberFieldVariants = /* @__PURE__ */ createVariants(manifests.numberField);
export const inputGroupVariants = /* @__PURE__ */ createVariants(manifests.inputGroup);
export const fileUploadVariants = /* @__PURE__ */ createVariants(manifests.fileUpload);
export const fileUploadListVariants = /* @__PURE__ */ createVariants(manifests.fileUploadList);
export const fileUploadItemVariants = /* @__PURE__ */ createVariants(manifests.fileUploadItem);
export const toggleGroupVariants = /* @__PURE__ */ createVariants(manifests.toggleGroup);
export const meterVariants = /* @__PURE__ */ createVariants(manifests.meter);
export const boxModelVariants = /* @__PURE__ */ createVariants(manifests.boxModel);
export const tokenRowVariants = /* @__PURE__ */ createVariants(manifests.tokenRow);
export const assetRowVariants = /* @__PURE__ */ createVariants(manifests.assetRow);
export const folderVariants = /* @__PURE__ */ createVariants(manifests.folder);
export const filePageVariants = /* @__PURE__ */ createVariants(manifests.filePage);
export const fileImageVariants = /* @__PURE__ */ createVariants(manifests.fileImage);
export const fileTileVariants = /* @__PURE__ */ createVariants(manifests.fileTile);
export const fileGridVariants = /* @__PURE__ */ createVariants(manifests.fileGrid);
export const assetCardVariants = /* @__PURE__ */ createVariants(manifests.assetCard);
export const assetGridVariants = /* @__PURE__ */ createVariants(manifests.assetGrid);
export const previewFrameVariants = /* @__PURE__ */ createVariants(manifests.previewFrame);
export const passwordFieldVariants = /* @__PURE__ */ createVariants(manifests.passwordField);
export const otpFieldVariants = /* @__PURE__ */ createVariants(manifests.otpField);
export const timeFieldVariants = /* @__PURE__ */ createVariants(manifests.timeField);
export const stepperVariants = /* @__PURE__ */ createVariants(manifests.stepper);
export const stepperStepVariants = /* @__PURE__ */ createVariants(manifests.stepperStep);
export const editableTextVariants = /* @__PURE__ */ createVariants(manifests.editableText);
export const timelineVariants = /* @__PURE__ */ createVariants(manifests.timeline);
export const timelineItemVariants = /* @__PURE__ */ createVariants(manifests.timelineItem);
export const descriptionListVariants = /* @__PURE__ */ createVariants(manifests.descriptionList);
export const emptyStateVariants = /* @__PURE__ */ createVariants(manifests.emptyState);
export const scrollAreaVariants = /* @__PURE__ */ createVariants(manifests.scrollArea);
export const linkVariants = /* @__PURE__ */ createVariants(manifests.link);
export const citationVariants = /* @__PURE__ */ createVariants(manifests.citation);
export const toggletipVariants = /* @__PURE__ */ createVariants(manifests.toggletip);
export const paginationVariants = /* @__PURE__ */ createVariants(manifests.pagination);
export const treeViewVariants = /* @__PURE__ */ createVariants(manifests.treeView);
export const composerVariants = /* @__PURE__ */ createVariants(manifests.composer);
export const composerGroupVariants = /* @__PURE__ */ createVariants(manifests.composerGroup);
export const indicatorAnchorVariants = /* @__PURE__ */ createVariants(manifests.indicatorAnchor);
export const badgeGroupVariants = /* @__PURE__ */ createVariants(manifests.badgeGroup);
export const badgeVariants = /* @__PURE__ */ createVariants(manifests.badge);
export const alertVariants = /* @__PURE__ */ createVariants(manifests.alert);
export const avatarVariants = /* @__PURE__ */ createVariants(manifests.avatar);
export const selectVariants = /* @__PURE__ */ createVariants(manifests.select);
export const textareaVariants = /* @__PURE__ */ createVariants(manifests.textarea);
export const checkboxVariants = /* @__PURE__ */ createVariants(manifests.checkbox);
export const checkboxGroupVariants = /* @__PURE__ */ createVariants(manifests.checkboxGroup);
export const radioVariants = /* @__PURE__ */ createVariants(manifests.radio);
export const radioGroupVariants = /* @__PURE__ */ createVariants(manifests.radioGroup);
export const switchVariants = /* @__PURE__ */ createVariants(manifests.switchControl);
export const spinnerVariants = /* @__PURE__ */ createVariants(manifests.spinner);
export const skeletonVariants = /* @__PURE__ */ createVariants(manifests.skeleton);
export const progressVariants = /* @__PURE__ */ createVariants(manifests.progress);
export const separatorVariants = /* @__PURE__ */ createVariants(manifests.separator);
export const tableVariants = /* @__PURE__ */ createVariants(manifests.table);
export const tabsVariants = /* @__PURE__ */ createVariants(manifests.tabs);
export const segmentedVariants = /* @__PURE__ */ createVariants(manifests.segmented);
export const sliderVariants = /* @__PURE__ */ createVariants(manifests.slider);
export const sliderRangeVariants = /* @__PURE__ */ createVariants(manifests.sliderRange);
export const chipVariants = /* @__PURE__ */ createVariants(manifests.chip);
export const panelVariants = /* @__PURE__ */ createVariants(manifests.panel);
export const propertyListVariants = /* @__PURE__ */ createVariants(manifests.propertyList);
export const boxFieldVariants = /* @__PURE__ */ createVariants(manifests.boxField);
export const comboboxVariants = /* @__PURE__ */ createVariants(manifests.combobox);
export const customSelectVariants = /* @__PURE__ */ createVariants(manifests.customSelect);
export const tagVariants = /* @__PURE__ */ createVariants(manifests.tag);
export const tagPickerVariants = /* @__PURE__ */ createVariants(manifests.tagPicker);
export const datePickerVariants = /* @__PURE__ */ createVariants(manifests.datePicker);
export const confirmDialogVariants = /* @__PURE__ */ createVariants(manifests.confirmDialog);
export const drawerVariants = /* @__PURE__ */ createVariants(manifests.drawer);
export const commandPaletteVariants = /* @__PURE__ */ createVariants(manifests.commandPalette);
export const contextMenuVariants = /* @__PURE__ */ createVariants(manifests.contextMenu);
export const promptSuggestionsVariants = /* @__PURE__ */ createVariants(manifests.promptSuggestions);
export const messageVariants = /* @__PURE__ */ createVariants(manifests.message);
export const scrollToLatestVariants = /* @__PURE__ */ createVariants(manifests.scrollToLatest);
export const modelPickerVariants = /* @__PURE__ */ createVariants(manifests.modelPicker);
export const navVariants = /* @__PURE__ */ createVariants(manifests.nav);
export const toastVariants = /* @__PURE__ */ createVariants(manifests.toast);
export const menuVariants = /* @__PURE__ */ createVariants(manifests.menu);
export const popoverVariants = /* @__PURE__ */ createVariants(manifests.popover);
export const tooltipVariants = /* @__PURE__ */ createVariants(manifests.tooltip);

export const colorPickerVariants = /* @__PURE__ */ createVariants(manifests.colorPicker);
export const calendarVariants = /* @__PURE__ */ createVariants(manifests.calendar);

export const indicatorVariants = /* @__PURE__ */ createVariants(manifests.indicator);
export const countVariants = /* @__PURE__ */ createVariants(manifests.count);
export const accordionItemVariants = /* @__PURE__ */ createVariants(manifests.accordionItem);
export const stepVariants = /* @__PURE__ */ createVariants(manifests.step);
export const editSummaryVariants = /* @__PURE__ */ createVariants(manifests.editSummary);
export const diffVariants = /* @__PURE__ */ createVariants(manifests.diff);
export const approvalVariants = /* @__PURE__ */ createVariants(manifests.approval);
export const planVariants = /* @__PURE__ */ createVariants(manifests.plan);
export const turnNoticeVariants = /* @__PURE__ */ createVariants(manifests.turnNotice);
export const attachmentVariants = /* @__PURE__ */ createVariants(manifests.attachment);
export const composerMenuVariants = /* @__PURE__ */ createVariants(manifests.composerMenu);
export const queueVariants = /* @__PURE__ */ createVariants(manifests.queue);
export const timestampVariants = /* @__PURE__ */ createVariants(manifests.timestamp);
export const accordionVariants = /* @__PURE__ */ createVariants(manifests.accordion);

export const presenceVariants = /* @__PURE__ */ createVariants(manifests.presence);
export const referenceListVariants = /* @__PURE__ */ createVariants(manifests.referenceList);
export const tableOfContentsVariants = /* @__PURE__ */ createVariants(manifests.tableOfContents);
export const figureVariants = /* @__PURE__ */ createVariants(manifests.figure);
export const inlineListVariants = /* @__PURE__ */ createVariants(manifests.inlineList);
export const abbreviationVariants = /* @__PURE__ */ createVariants(manifests.abbreviation);
export const hatnoteVariants = /* @__PURE__ */ createVariants(manifests.hatnote);
export const linkGroupsVariants = /* @__PURE__ */ createVariants(manifests.linkGroups);
export const videoPlayerVariants = /* @__PURE__ */ createVariants(manifests.videoPlayer);
export const surfaceVariants = /* @__PURE__ */ createVariants(manifests.surface);
export const stackVariants = /* @__PURE__ */ createVariants(manifests.stack);
