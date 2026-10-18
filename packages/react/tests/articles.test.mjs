// The article families first built from Wikipedia's page (2026-10-17; reworked after round 33): Reference list, Table of contents, Figure, Infobox,
// Inline list, Abbreviation, Hatnote, LinkGroups.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup as render } from "react-dom/server";
import { VideoPlayer, Abbreviation, Figure, Hatnote, Infobox, InfoboxRow, InfoboxSection, InlineList, LinkGroups, LinkGroup, ReferenceList, ReferenceListItem, TableOfContents } from "../dist/modules/index.js";

test("a reference list is ChatGPT's sources: publisher, linked title and what it covers, set apart by em dashes; numbered notes link back", () => {
  const html = render(h(ReferenceList, { title: "Sources" }, h(ReferenceListItem, { source: "Epson", title: "Report", href: "https://x.test", description: "durability" })));
  assert.match(html, /^<section class="area-reference-list area-reference-list--number" aria-labelledby="([^"]+)-title"><div class="area-reference-list__title" id="\1-title" role="heading" aria-level="3">Sources<\/div><ol class="area-reference-list__list"><li class="area-reference-list__item"><div class="area-reference-list__text">Epson<span class="area-reference-list__dash"> — <\/span><a [^>]*href="https:\/\/x.test"[^>]*>Report/);
  assert.match(html, /<span class="area-reference-list__dash"> — <\/span>durability<\/div><\/li><\/ol><\/section>$/);
  assert.match(render(h(ReferenceList, { marker: "bullet" })), /<ul class="area-reference-list__list">/);
  const notes = render(h(ReferenceList, { marker: "number", "aria-label": "Notes", start: 3 }, h(ReferenceListItem, { id: "n2", backlinks: ["c2a", "c2b"], highlighted: true }, "Two")));
  assert.match(notes, /<ol class="area-reference-list__list" start="3" style="--_start:2"><li id="n2" class="area-reference-list__item" data-target=""><div class="area-reference-list__text">Two<span class="area-reference-list__backlinks">.*aria-label="Back to citation 1">.*aria-label="Back to citation 2"><svg.*<\/svg><span class="area-reference-list__count" aria-hidden="true">2<\/span><\/a>/);
});

test("a table of contents is a marker Nav of links to the headings, the current one marked as the location", () => {
  const items = [{ id: "a", label: "A" }, { id: "b", label: "B", children: [{ id: "b1", label: "B1" }] }];
  const html = render(h(TableOfContents, { items, current: "b1" }));
  assert.match(html, /^<nav class="area-nav area-nav--marker area-toc" aria-label="On this page">/);
  assert.match(html, /<div class="area-toc__title" aria-hidden="true">On this page<\/div>/);
  assert.match(html, /aria-current="location" href="#b1"/);
  assert.doesNotMatch(render(h(TableOfContents, { items, levels: 1 })), /href="#b1"/, "levels 1 shows sections only");
  assert.match(render(h(TableOfContents, { items, title: false, "aria-label": "Contents" })), /aria-label="Contents"/);
});

test("a figure wraps its media and caption", () => {
  const html = render(h(Figure, { caption: "Cap" }, h("img", { src: "x.jpg", alt: "X" })));
  assert.equal(html.replace(/^<link [^>]*>/, ""), '<figure class="area-figure"><div class="area-figure__media"><img src="x.jpg" alt="X"/></div><figcaption class="area-figure__caption">Cap</figcaption></figure>');
});

test("an infobox is a named aside: a header, then sections of label and value rows", () => {
  const html = render(h(Infobox, { title: "David Tee", subtitle: "Designer", media: h("img", { alt: "" }) }, h(InfoboxSection, { title: "Details" }, h(InfoboxRow, { label: "Born" }, "1988"))));
  assert.match(html, /^<aside class="area-infobox area-infobox--columns" aria-label="David Tee"><div class="area-infobox__header"><div class="area-infobox__media"><img alt=""\/><\/div><div class="area-infobox__title-row"><div class="area-infobox__heading-group"><div class="area-infobox__title">David Tee<\/div><div class="area-infobox__subtitle">Designer<\/div><\/div><\/div><\/div>/);
  assert.match(render(h(Infobox, { title: "X", layout: "stacked", action: h("button", null, "a") })), /class="area-infobox area-infobox--stacked".*<div class="area-infobox__action"><button>a<\/button><\/div>/);
  assert.match(html, /<section class="area-infobox__section"><div class="area-infobox__heading">Details<\/div><dl class="area-infobox__rows"><div class="area-infobox__row"><dt class="area-infobox__label">Born<\/dt><dd class="area-infobox__value">1988<\/dd><\/div><\/dl><\/section>/);
  assert.match(render(h(Infobox, { title: "X", framed: true })), /class="area-infobox area-infobox--columns area-infobox--framed"/);
});

test("an inline list keeps its list role and puts each child in an item", () => {
  assert.equal(render(h(InlineList, { separator: "rule" }, "A", "B")), '<ul role="list" class="area-inline-list area-inline-list--rule"><li class="area-inline-list__item">A</li><li class="area-inline-list__item">B</li></ul>');
});

test("an abbreviation is focusable and never uses the browser's title", () => {
  const html = render(h(Abbreviation, { title: "Bachelor of Design" }, "BDes"));
  assert.match(html, /<abbr class="area-abbr" tabindex="0"/);
  assert.doesNotMatch(html, /title=/);
});

test("an abbreviation's tooltip is phrasing content, valid inside a paragraph", () => {
  const html = render(h("p", null, h(Abbreviation, { title: "Bachelor of Design" }, "BDes")));
  assert.match(html, /<abbr class="area-abbr" tabindex="0" aria-describedby="([^"]+)">BDes<\/abbr><span role="tooltip" class="area-tooltip area-tooltip--top" id="\1" popover="manual">Bachelor of Design<\/span><\/p>$/);
  assert.doesNotMatch(html, /<div/);
});

test("a hatnote is a note", () => {
  assert.equal(render(h(Hatnote, null, "See also")), '<div role="note" class="area-hatnote">See also</div>');
});

test("link groups are a nav named by its title, with labelled lists of links", () => {
  const html = render(h(LinkGroups, { title: "Studio", divided: true }, h(LinkGroup, { label: "People" }, "x", "y")));
  assert.match(html, /^<nav class="area-link-groups area-link-groups--divided" aria-labelledby="([^"]+)-title"><h2 class="area-link-groups__title" id="\1-title">Studio<\/h2><div class="area-link-groups__groups">/);
  assert.match(html, /<div class="area-link-groups__label" id="([^"]+)-label">People<\/div><ul class="area-link-groups__list" role="list" aria-labelledby="\1-label"><li>x<\/li><li>y<\/li><\/ul>/);
  assert.doesNotMatch(html, /aria-expanded/);
});

test("a video player is a named group: the video, and only the round play before the first play", () => {
  const html = render(h(VideoPlayer, { label: "Sample", src: "x.mp4" }));
  assert.match(html, /^<div role="group" aria-label="Sample" tabindex="0" class="area-video-player area-video-player--floating area-video-player--auto"><video src="x.mp4" class="area-video-player__media" playsinline=""><\/video>/i);
  assert.match(html, /<button type="button" class="area-video-player__start area-video-player__surface" aria-label="Play"><svg[^>]*data-area-glyph="play-filled"/);
  assert.doesNotMatch(html, /area-video-player__controls/);
  const floating = render(h(VideoPlayer, { label: "S", src: "x.mp4", autoPlay: true, controls: "always" }));
  assert.match(floating, /area-video-player--always" data-started="">.*area-video-player__transport.*aria-label="Volume".*aria-label="Back 15 seconds".*aria-label="Play".*aria-label="Forward 15 seconds".*area-video-player__timeline.*aria-label="Seek"/);
  assert.match(floating, /class="area-video-player__controls area-video-player__surface"/);
  assert.match(floating, /class="area-button[^"]*area-button--ghost[^"]*"[^>]*aria-label="Play"/, "the floating controller's buttons are Area's ghost Buttons");
  assert.match(render(h(VideoPlayer, { label: "S", src: "x.mp4", autoPlay: true, layout: "bar" })), /area-video-player__scrim.*aria-label="Seek".*aria-label="Volume"/);
  const minimal = render(h(VideoPlayer, { label: "S", src: "x.mp4", autoPlay: true, layout: "minimal" }));
  assert.match(minimal, /area-video-player__start/);
  assert.doesNotMatch(minimal, /aria-label="Seek"/);
});

