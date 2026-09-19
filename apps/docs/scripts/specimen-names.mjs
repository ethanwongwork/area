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
