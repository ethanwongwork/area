// SystemDefaults (docs/research/system-inventory-2026-11-08): a system's default props per family reach every use that
// gives none; a use's own prop wins; a value the family doesn't have is ignored; no provider changes nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Accordion, AccordionItem, Alert, Badge, Button, Field, Input, InputGroup, NumberField, Segmented, Select, SystemDefaults, Tabs, Textarea, Toolbar } from '../dist/modules/index.js';

const within = (value, node) => render(h(SystemDefaults, { value }, node));
const items = [{ id: 'one', label: 'One' }, { id: 'two', label: 'Two' }];

test('without a provider every family keeps its own defaults', () => {
  assert.match(render(h(Button, null, 'Button')), /area-button--solid/);
  assert.match(render(h(Input, { 'aria-label': 'Placeholder' })), /area-input--outline/);
  assert.doesNotMatch(render(h(Tabs, { items, 'aria-label': 'Tabs' })), /area-tabs--plate/);
});

test("a system's defaults reach uses that give none, and a use's own prop wins", () => {
  const value = { button: { variant: 'soft', size: 'lg' }, input: { variant: 'soft' }, select: { variant: 'soft' }, textarea: { variant: 'soft' },
    inputGroup: { variant: 'soft' }, numberField: { variant: 'soft' }, tabs: { selection: 'plate' }, field: { orientation: 'horizontal' } };
  const button = within(value, h(Button, null, 'Button'));
  assert.match(button, /area-button--soft/);
  assert.match(button, /area-button--lg/);
  assert.match(within(value, h(Button, { variant: 'ghost' }, 'Button')), /area-button--ghost/);
  assert.match(within(value, h(Input, { 'aria-label': 'Placeholder' })), /area-input--soft/);
  assert.match(within(value, h(Input, { variant: 'outline', 'aria-label': 'Placeholder' })), /area-input--outline/);
  assert.match(within(value, h(Select, { 'aria-label': 'Label' }, h('option', null, 'Option one'))), /area-select--soft/);
  assert.match(within(value, h(Textarea, { 'aria-label': 'Label' })), /area-textarea--soft/);
  assert.match(within(value, h(InputGroup, null, 'x')), /area-input-group--soft/);
  assert.match(within(value, h(NumberField, { 'aria-label': 'Value' })), /area-number-field--soft/);
  assert.match(within(value, h(Tabs, { items, 'aria-label': 'Tabs' })), /area-tabs--plate/);
  assert.doesNotMatch(within(value, h(Tabs, { items, selection: 'marker', 'aria-label': 'Tabs' })), /area-tabs--plate/);
  assert.match(within(value, h(Field, { label: 'Label' }, h('input'))), /area-field--horizontal/);
});

test("a value the family doesn't have is ignored", () => {
  const html = within({ button: { variant: 'gradient' }, tabs: { selection: 'pill' } }, h('div', null, h(Button, null, 'Button'), h(Tabs, { items, 'aria-label': 'Tabs' })));
  assert.match(html, /area-button--solid/);
  assert.doesNotMatch(html, /area-tabs--plate|area-tabs--pill/);
});

test('more families: a badge, an alert; a parent still wins over the system', () => {
  const value = { badge: { variant: 'outline', tone: 'info' }, alert: { layout: 'banner' }, accordionItem: { variant: 'divided' }, segmented: { size: 'lg' } };
  const badge = within(value, h(Badge, null, 'Badge'));
  assert.match(badge, /area-badge--outline/);
  assert.match(badge, /area-badge--info/);
  assert.match(within(value, h(Alert, { title: 'Title' }, 'Description')), /area-alert--banner/);
  assert.match(within(value, h(AccordionItem, { heading: 'Title' }, 'Body')), /area-accordion-item--divided/);
  // An Accordion's own variant reaches its items before the system's.
  const grouped = within(value, h(Accordion, { variant: 'plain' }, h(AccordionItem, { value: 'a', heading: 'Title' }, 'Body')));
  assert.match(grouped, /area-accordion-item--plain/);
  const items = [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }];
  assert.match(within(value, h(Segmented, { items, 'aria-label': 'Segmented' })), /area-segmented--lg/);
  assert.match(within(value, h(Segmented, { items, size: 'sm', 'aria-label': 'Segmented' })), /area-segmented--sm/);
});
