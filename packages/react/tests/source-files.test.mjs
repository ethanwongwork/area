// Source structure matches families (system evaluation 2026-11-11, F9; docs/ARCHITECTURE.md): one CSS file per block
// family, named by its slug, and one React file per family, named by its export, each holding its parts. A sheet or a
// module that is not a family's says why below.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const { COMPONENT_PAGES } = await import('../../../apps/desktop/src/content/pages.mjs');
const families = COMPONENT_PAGES.filter(page => !page.docsOnly);
const sheets = new URL('../../styles/src/components/', import.meta.url);
const modules = new URL('../src/components/', import.meta.url);

/** Families that share one sheet, and why. */
const SHARED_FAMILY_SHEET = {
  checkbox: ['choice', 'its rules and Radio\'s interleave through shared :is(.area-checkbox, .area-radio) rules'],
  radio: ['choice', 'its rules and Checkbox\'s interleave through shared :is(.area-checkbox, .area-radio) rules'],
};
/** Sheets that are not one family's, and why. */
const OTHER_SHEETS = {
  choice: 'Checkbox and Radio (above)',
  popup: "shared: the floating frame Popover and Menu both draw, before their own sheets",
  overlay: 'shared: Popover, Menu and Tooltip in the top layer, after their own sheets',
  presence: "Indicator's status variant, a compatibility block",
  token: "Code's deprecated name",
};
const pascal = slug => slug.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
const exportOf = page => (page.exportName ?? (page.imports ?? '').split(',')[0] ?? '').trim() || pascal(page.slug);

test('every family has its own sheet, named by its slug, and every sheet is a family\'s or says why', () => {
  const files = new Set(readdirSync(sheets).filter(name => name.endsWith('.css')).map(name => name.slice(0, -4)));
  for (const { slug } of families) {
    const file = SHARED_FAMILY_SHEET[slug]?.[0] ?? slug;
    assert.ok(files.has(file), `${slug} has no packages/styles/src/components/${file}.css`);
  }
  const slugs = new Set(families.map(page => page.slug));
  for (const file of files) assert.ok(slugs.has(file) || file in OTHER_SHEETS, `${file}.css is not a family's sheet; name it by its family's slug or list it with a reason`);
});

test('every family\'s component is declared in its own React file, named by its export', () => {
  const sources = Object.fromEntries(readdirSync(modules).filter(name => /\.tsx?$/.test(name)).map(name => [name, readFileSync(new URL(name, modules), 'utf8')]));
  for (const page of families) {
    const name = exportOf(page);
    const declaration = new RegExp(`^export (?:const|function) ${name}\\b`, 'm');
    const found = Object.keys(sources).filter(file => declaration.test(sources[file]));
    assert.deepEqual(found, [`${name}.tsx`], `${page.slug}: ${name} is declared in ${found.join(', ') || 'no file'}, not in its own ${name}.tsx`);
  }
});
