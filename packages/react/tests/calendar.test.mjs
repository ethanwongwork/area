import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Calendar, MANIFESTS, calendarVariants } from '../dist/modules/index.js';

const render = props => renderToString(h(Calendar, { today: '2026-09-26', 'aria-label': 'Due date', ...props }), { identifierPrefix: 'calendar-test-' });
const days = html => [...html.matchAll(/data-date="([\d-]+)"/g)].map(m => m[1]);

test('a month is a labelled grid of its own weeks with one tab stop', () => {
  const html = render({ defaultValue: '2026-09-15' });
  assert.match(html, /role="grid"/);
  assert.match(html, /September 2026/);
  // Five weeks for September 2026; fixedWeeks keeps six.
  assert.equal(days(html).length, 35);
  assert.equal(days(render({ defaultValue: '2026-09-15', fixedWeeks: true })).length, 42);
  assert.equal(days(html)[0], '2026-08-30');
  assert.equal((html.match(/tabindex="0"/gi) || []).length, 1);
  assert.match(html, /aria-selected="true"[^>]*><button[^>]*data-date="2026-09-15"/);
  assert.match(html, /aria-current="date"[^>]*data-date="2026-09-26"|data-date="2026-09-26"[^>]*aria-current="date"/);
  assert.match(html, /abbr="Sunday"/);
  assert.equal(MANIFESTS.calendar.defaults.variant, 'surface'); // audit F-21: the floating plate is the default
  assert.equal(MANIFESTS.calendar.variants.tone, undefined);
  assert.throws(() => calendarVariants({ variant: 'card' }), RangeError);
});

test('ranges paint a band with solid ends and select every day in between', () => {
  const html = render({ selectionMode: 'range', defaultValue: { start: '2026-09-15', end: '2026-09-19' }, name: 'trip' });
  assert.equal((html.match(/data-range="start"/g) || []).length, 1);
  assert.equal((html.match(/data-range="middle"/g) || []).length, 3);
  assert.equal((html.match(/data-range="end"/g) || []).length, 1);
  assert.equal((html.match(/aria-selected="true"/g) || []).length, 5);
  assert.match(html, /name="trip-start" value="2026-09-15"/);
  assert.match(html, /name="trip-end" value="2026-09-19"/);
  assert.match(html, /aria-multiselectable="true"/);
});

test('outside days never repeat the selection of a neighbouring month', () => {
  const html = render({ selectionMode: 'range', visibleMonths: 2, defaultValue: { start: '2026-09-24', end: '2026-10-06' } });
  assert.equal((html.match(/data-range="end"/g) || []).length, 1);
  assert.equal((html.match(/data-range="start"/g) || []).length, 1);
});

test('bounds disable days; unavailable days are marked for strike-through', () => {
  const html = render({ defaultMonth: '2026-09', min: '2026-09-03', max: '2026-09-28', isDateUnavailable: d => d === '2026-09-12' });
  // Unavailable days stay focusable (aria-disabled, APG date grid) so the arrows can cross them (audit F-9).
  const day = iso => html.match(new RegExp(`<button[^>]*data-date="${iso}"[^>]*>`))[0];
  assert.match(day('2026-09-02'), /aria-disabled="true"/);
  assert.doesNotMatch(day('2026-09-02'), /disabled=""/);
  assert.match(day('2026-09-12'), /aria-disabled="true"/);
  assert.doesNotMatch(day('2026-09-03'), /disabled/);
  assert.match(render({ disabled: true }), /data-date="[^"]+"[^>]*disabled=""|disabled=""[^>]*data-date=/);
  assert.match(html, /data-date="2026-09-12"[^>]*data-unavailable="true"|data-unavailable="true"[^>]*data-date="2026-09-12"/);
});

test('weeks can start on Monday and names follow the locale', () => {
  const html = render({ firstDayOfWeek: 1, locale: 'en-GB', defaultValue: '2026-09-28' });
  assert.equal(days(html)[0], '2026-08-31');
  assert.match(html, /abbr="Monday"/);
});

test('multiple selection submits one field per date', () => {
  const html = render({ selectionMode: 'multiple', defaultValue: ['2026-09-08', '2026-09-10'], name: 'office' });
  assert.equal((html.match(/name="office"/g) || []).length, 2);
  assert.equal((html.match(/data-selected="true"/g) || []).length, 2);
});

test('day treatments, markers and weekday styles', () => {
  const html = render({ days: 'circle', weekdayStyle: 'narrow', markers: { '2026-09-14': 'info' } });
  assert.match(html, /area-calendar--circle/);
  assert.match(html, /abbr="Sunday"[^>]*>S</);
  assert.match(html, /data-date="2026-09-14"[^>]*aria-description="Has events"|aria-description="Has events"[^>]*data-date="2026-09-14"/);
  assert.match(html, /area-calendar__marker" data-tone="info"/);
  assert.match(render({ days: 'tile', weekdayStyle: 'abbreviated' }), />Sun</);
});

test('the week layout shows seven days from the week start with weekday and month', () => {
  const html = render({ layout: 'week', firstDayOfWeek: 1, defaultValue: '2026-09-30' });
  assert.match(html, /area-calendar--week/);
  assert.equal(days(html).length, 7);
  assert.equal(days(html)[0], '2026-09-28');
  assert.match(html, /aria-label="Week of Monday, September 28, 2026"/);
  assert.match(html, /area-calendar__day-month">Oct</);
  assert.equal((html.match(/tabindex="0"/gi) || []).length, 1);
});
