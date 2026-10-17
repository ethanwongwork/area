// The article families from Wikipedia's page (2026-10-17): Reference list, Table of contents, Figure, Infobox,
// Inline list, Abbreviation, Hatnote, Navbox.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { Abbreviation, Figure, Hatnote, Infobox, InfoboxRow, InfoboxSection, InlineList, Navbox, NavboxGroup, ReferenceList, ReferenceListItem, TableOfContents } from "../dist/modules/index.js";

test("a reference list numbers its notes; one citation links back with ↑, several with ↑ a b c", () => {
  const html = render(h(ReferenceList, { columns: true }, [
    h(ReferenceListItem, { key: 1, id: "n1", backlinks: ["c1"] }, "One"),
    h(ReferenceListItem, { key: 2, id: "n2", backlinks: ["c2a", "c2b"], highlighted: true }, "Two"),
  ]));
  assert.match(html, /^<ol class="area-reference-list area-reference-list--blue area-reference-list--columns">/);
  assert.match(html, /<li id="n1" class="area-reference-list__item"><span class="area-reference-list__backlinks"><a class="area-reference-list__backlink" href="#c1" aria-label="Back to citation">↑<\/a><\/span><span class="area-reference-list__text">One<\/span><\/li>/);
  assert.match(html, /<li id="n2" class="area-reference-list__item" data-highlighted="">.*<span aria-hidden="true">↑<\/span><a class="area-reference-list__backlink" href="#c2a" aria-label="Back to citation a">a<\/a><a class="area-reference-list__backlink" href="#c2b" aria-label="Back to citation b">b<\/a>/);
});

test("a table of contents is a marker Nav of links to the headings, the current one marked as the location", () => {
  const items = [{ id: "a", label: "A" }, { id: "b", label: "B", children: [{ id: "b1", label: "B1" }] }, { id: "c", label: "C", children: [{ id: "c1", label: "C1" }] }];
  const html = render(h(TableOfContents, { items, current: "b1", collapse: true }));
  assert.match(html, /^<nav class="area-nav area-nav--marker area-toc" aria-label="Contents">/);
  assert.match(html, /<div class="area-toc__title" aria-hidden="true">Contents<\/div>/);
  assert.match(html, /aria-current="location" href="#b1"/);
  assert.doesNotMatch(html, /href="#c1"/, "collapse hides the subsections of a section not being read");
  assert.match(render(h(TableOfContents, { items, title: false, "aria-label": "On this page" })), /aria-label="On this page"/);
});

test("a figure wraps its media and caption; frame and align are classes", () => {
  const html = render(h(Figure, { frame: "framed", align: "end", caption: "Cap" }, h("img", { src: "x.jpg", alt: "X" })));
  assert.equal(html.replace(/^<link [^>]*>/, ""), '<figure class="area-figure area-figure--framed area-figure--end"><div class="area-figure__media"><img src="x.jpg" alt="X"/></div><figcaption class="area-figure__caption">Cap</figcaption></figure>');
});

test("an infobox is a named aside of titled sections of label and value rows", () => {
  const html = render(h(Infobox, { title: "David Tee", caption: "In 2025", media: h("img", { alt: "" }) }, h(InfoboxSection, { title: "Details" }, h(InfoboxRow, { label: "Born" }, "1988"))));
  assert.match(html, /^<aside class="area-infobox area-infobox--none" aria-label="David Tee">/);
  assert.match(html, /<figure class="area-infobox__media"><img alt=""\/><figcaption class="area-infobox__caption">In 2025<\/figcaption><\/figure>/);
  assert.match(html, /<section class="area-infobox__section"><div class="area-infobox__heading">Details<\/div><dl class="area-infobox__rows"><div class="area-infobox__row"><dt class="area-infobox__label">Born<\/dt><dd class="area-infobox__value">1988<\/dd><\/div><\/dl><\/section>/);
});

test("an inline list keeps its list role and puts each child in an item", () => {
  assert.equal(render(h(InlineList, { separator: "bar" }, "A", "B")), '<ul role="list" class="area-inline-list area-inline-list--bar"><li class="area-inline-list__item">A</li><li class="area-inline-list__item">B</li></ul>');
});

test("an abbreviation is focusable and never uses the browser's title", () => {
  const html = render(h(Abbreviation, { title: "Bachelor of Design" }, "BDes"));
  assert.match(html, /<abbr class="area-abbr" tabindex="0"/);
  assert.doesNotMatch(html, /title=/);
});

test("a hatnote is a note", () => {
  assert.equal(render(h(Hatnote, null, "See also")), '<div role="note" class="area-hatnote">See also</div>');
});

test("a navbox is a nav named by its title, with a toggle that controls its body", () => {
  const open = render(h(Navbox, { title: "Studio" }, h(NavboxGroup, { label: "People" }, "x")));
  assert.match(open, /^<nav class="area-navbox" aria-labelledby="([^"]+)-title"><div class="area-navbox__header"><div class="area-navbox__title" id="\1-title">Studio<\/div><button[^>]*aria-expanded="true" aria-controls="\1-body"[^>]*>.*Hide/);
  assert.match(open, /<div class="area-navbox__group"><div class="area-navbox__label">People<\/div><div class="area-navbox__list">x<\/div><\/div>/);
  const closed = render(h(Navbox, { title: "Studio", defaultExpanded: false }));
  assert.match(closed, /aria-expanded="false"/);
  assert.match(closed, /hidden=""/);
  assert.match(closed, /Show/);
});
