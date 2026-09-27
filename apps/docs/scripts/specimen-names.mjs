/** Public specimen names: category-value; compositions use lowerCamelCase.
 * This labels examples, not new component props. Existing URL anchors stay stable.
 */
const camel = (text) => text.trim().replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
  .replace(/[^a-z0-9]+([a-z0-9])/g, (_, next) => next.toUpperCase());
const states = new Set(['checked', 'selected', 'disabled', 'disabled-checked', 'disabled-selected', 'disabled-indeterminate', 'invalid', 'invalid-selected', 'loading', 'readonly', 'read-only', 'hover', 'active', 'focus', 'indeterminate']);
export function specimenName(example, family) {
  const { title } = example;
  const id = family === "switch" ? title.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase().replaceAll(" ", "-") : example.id;
  const matrix = id.match(/^variant-(.+)-tone-(.+)$/);
  if (matrix) return `${camel(matrix[1])}-${camel(matrix[2])}`;
  const buttonMatrix = id.match(/^tone-(.+)-variant-(.+)$/);
  if (buttonMatrix) return `${camel(buttonMatrix[2])}-${camel(buttonMatrix[1])}`;
  const dot = id.match(/^dot-(soft|outline)-(.+)$/);
  if (dot) return `dot${dot[1][0].toUpperCase()}${dot[1].slice(1)}-${camel(dot[2])}`;
  if (id.startsWith('state-')) return `state-${camel(id.slice(6))}`;
  if (states.has(id)) return `state-${camel(id === 'readonly' ? 'read-only' : id)}`;
  const size = title.match(/^(?:Control )?Size\s*\/\s*(.+)$/i) ?? title.match(/^Size\s+(sm|md|lg)$/i);
  if (size) {
    const value = size[1].toLowerCase();
    const aliases = family === 'kbd' ? {} : { 'extra small': 'xs', small: 'sm', medium: 'md', large: 'lg', 'extra large': 'xl' };
    return `size-${aliases[value] ?? value}`;
  }
  if (id.startsWith('group-')) return `group-${camel(id.slice(6))}`;
  if (id.startsWith('anchor-')) return `anchor-${camel(id.slice(7))}`;
  if (id === 'table-status') return 'composition-tableStatus';
  if (['nav-new', 'card-heading', 'custom-brand'].includes(id)) return `composition-${camel(id)}`;
  if (title.includes('/')) return title.split('/').map(camel).join('-');
  if (['soft', 'solid', 'outline', 'ghost', 'plain'].includes(id)) return `variant-${id}`;
  return camel(title);
}

/*
 * Gallery grouping. Every family shows its tiles in the same order of groups, each under a
 * heading, and a tile is labelled by its value within the group (`sm`, not `size-sm`):
 * Default, Variants, Tones, Sizes, Layout, Content, States, Behavior, then the full
 * variant × tone matrix, which is a reference rather than a first read.
 */
export const SPECIMEN_GROUPS = ['Default', 'Variants', 'Tones', 'Sizes', 'Layout', 'Content', 'States', 'Behavior', 'Templates', 'Variant × tone'];
// Treatments and shapes (Button pill, Switch long, Skeleton circle) are both a component's visual variants.
const TREATMENTS = new Set(['solid', 'soft', 'outline', 'ghost', 'color', 'modern', 'dotSoft', 'dotOutline', 'pill', 'long', 'circle']);
const LAYOUT = new Set(['horizontal', 'vertical', 'fullWidth', 'labelEnd', 'labelStart', 'right', 'bottom', 'left', 'top',
  'landscape', 'portrait', 'twoMonths', 'monday', 'week', 'tile', 'compact', 'immersive', 'carousel', 'iconOnly',
  'wrapped', 'hiddenLineNumbers', 'visibleRows', 'compactRows', 'columnDividers', 'striped', 'grouped', 'multiline']);
const TONES = new Set(['accent', 'custom', 'neutral', 'info', 'success', 'warning', 'danger']);
const STATES = new Set(['empty', 'collapsed']);
const FAMILY_GROUPS = {
  indicator: { presence: 'Variants', outOfOffice: 'States', count: 'Content' },
  menu: { danger: 'Tones' },
};
export function specimenGroup(name, family) {
  if (name === 'default' || name.startsWith('default-')) return 'Default';
  const override = FAMILY_GROUPS[family]?.[name.split('-')[0]];
  if (override) return override;
  const [head, ...rest] = name.split('-');
  const value = rest.join('-');
  if (TREATMENTS.has(head) && value) return 'Variant × tone';
  if (['variant', 'appearance', 'kind', 'shape'].includes(head) || (!value && TREATMENTS.has(head))) return 'Variants';
  if (head === 'tone' || (!value && TONES.has(head) && family !== 'menu' && family !== 'toast')) return 'Tones';
  if (family === 'toast' && TONES.has(head) && !value) return 'Tones';
  if (head === 'size' || head === 'presenceSize' || head === 'sizes' || name === 'small') return 'Sizes';
  if (['layout', 'resize', 'side', 'orientation', 'placement', 'spacing', 'horizontal', 'vertical'].includes(head) || (!value && LAYOUT.has(head))
    || family === 'separator') return 'Layout';
  if (['state', 'validation'].includes(head) || (!value && STATES.has(head)) || head === 'loading') return 'States';
  if (['behavior', 'steps', 'action'].includes(head)) return 'Behavior';
  // Compositions of a component's slots with other components, not variants of it.
  if (head === 'template') return 'Templates';
  return 'Content';
}
/** The tile label inside its group: the value without the group's own prefix. */
export function specimenLabel(name, group) {
  if (group === 'Default') return 'default';
  const [head, ...rest] = name.split('-');
  const prefixes = { Variants: ['variant', 'appearance', 'kind', 'shape', 'presence'], Tones: ['tone'], Sizes: ['size', 'presenceSize'], Layout: ['layout', 'side', 'orientation'], States: ['state'], Behavior: ['behavior'], Content: ['composition', 'content'], Templates: ['template'] };
  return (prefixes[group] ?? []).includes(head) && rest.length ? rest.join('-') : name;
}
