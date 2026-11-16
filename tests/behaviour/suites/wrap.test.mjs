// Alert and Toast agree on action placement (plan B6.7, VS10): actions wrap to a second row only when the text no
// longer fits beside them (flex-wrap, never a width query), the text keeps the icon's line and is never cut to make
// room for them, the second row ends on the text column's end ui-cluster under the text, and the close stays in the
// top corner, as far from the top as from the side. A title beside a corner close (plan B6.5, the one named exception):
// the title's cap on the inset with or without the close, the close centred on the cap with its glyph on the side
// column and its corner from the nearer distance. Fixture: fixtures/wrap.jsx (type 12, 13, 16 × every density; Corner
// 0, 10 and Pill for the titled surfaces).
import assert from "node:assert/strict";
import { behaviour } from "../suite.mjs";

const read = (page, id) => page.eval(id => {
  const el = document.getElementById(id);
  const part = name => el.querySelector(`:scope > [class$="__${name}"]`)?.getBoundingClientRect().toJSON();
  const box = el.getBoundingClientRect(), icon = part("icon"), text = part("content"), actions = part("actions"), close = part("dismiss");
  const button = el.querySelector(`:scope > [class$="__actions"] > *`).getBoundingClientRect().toJSON();
  const cut = [...el.querySelectorAll(`:scope > [class$="__content"] *`)].some(t => t.scrollWidth > t.clientWidth + 1);
  return { box: { top: box.top, right: box.right }, icon, text, actions, button, close, cut };
}, id);

behaviour("wrap", ({ it }) => {
  for (const type of [12, 13, 16]) for (const density of [28, 32, 36]) {
    const at = `type ${type}, density ${density}`;
    it(`${at}: actions stay beside the text when it fits, and wrap below it, whole, when it doesn't`, async page => {
      for (const family of ["alert", "toast"]) {
        const wide = await read(page, `${family}-${type}-${density}-wide`);
        const narrow = await read(page, `${family}-${type}-${density}-narrow`);
        // Wide: one row; the actions sit on the text's line.
        assert.ok(wide.button.top < wide.text.bottom, `${family} wide at ${at}: the actions left the text's line`);
        // Narrow: the actions take a second row, the text stays whole on the icon's line.
        assert.ok(narrow.actions.top >= narrow.text.bottom - 0.5, `${family} narrow at ${at}: the actions did not wrap`);
        assert.equal(narrow.cut, false, `${family} narrow at ${at}: the text was cut to make room`);
        if (narrow.icon) assert.ok(Math.abs(narrow.icon.top - narrow.text.top) < 4, `${family} narrow at ${at}: the text left the icon's line`);
        // The second row ends on the text column's end and stands ui-cluster under the text, read on the button.
        assert.ok(narrow.actions.right <= narrow.text.right + 0.5, `${family} narrow at ${at}: the actions pass the text column`);
        const cluster = await page.eval(id => { const probe = document.createElement("div"); probe.style.inlineSize = "var(--area-ui-cluster)"; document.getElementById(id).append(probe); const w = probe.getBoundingClientRect().width; probe.remove(); return w; }, `${family}-${type}-${density}-narrow`);
        assert.ok(Math.abs(narrow.button.top - narrow.text.bottom - cluster) <= 1, `${family} narrow at ${at}: second row ${narrow.button.top - narrow.text.bottom} below the text, not ui-cluster ${cluster}`);
        // The close keeps the top corner, as far from the top as from the side.
        for (const [width, m] of [["wide", wide], ["narrow", narrow]]) {
          assert.ok(Math.abs((m.close.top - m.box.top) - (m.box.right - m.close.right)) <= 1, `${family} ${width} at ${at}: the close is not square in its corner`);
        }
      }
      // The titled alert wraps its actions the same way.
      const line = await read(page, `alert-line-${type}-${density}-narrow`);
      assert.ok(line.actions.top >= line.text.bottom - 0.5 && !line.cut, `titled alert at ${at}: the actions did not wrap below the whole text`);
    }, { fresh: false });

    it(`${at}: a title's cap sits on the inset with or without a close; the close centres on the cap, its glyph on the column, its corner from the nearer distance`, async page => {
      for (const corner of ["0", "10", "pill"]) {
        for (const [family, inset, title, close, surfaceCorner] of [
          ["dialog", 16, ".area-dialog__title", ".area-dialog__dismiss", true],
          ["drawer", 16, ".area-drawer__title", ".area-drawer__dismiss", false], // a side drawer's corner meets the window
          ["popover", 12, ".area-popover__title", ".area-popover__header > .area-button", true],
        ]) {
          const where = `${family} at ${at}, Corner ${corner}`;
          const m = await page.eval((id, bare, title, close) => {
            const read = id => {
              const el = document.getElementById(id); if (!el) return null;
              const box = el.getBoundingClientRect(), t = el.querySelector(title);
              const probe = document.createElement("span"); probe.style.cssText = "display:block;block-size:1cap;line-height:1"; t.append(probe);
              const cap = probe.getBoundingClientRect().height; probe.remove();
              // The cap's top: a trimmed title's box top, or an untrimmed line's top plus its half-leading less the cap's
              // offset; read from a zero-size inline probe on the baseline instead, minus the cap.
              const base = document.createElement("span"); base.style.cssText = "display:inline-block;inline-size:0;block-size:0;vertical-align:baseline"; t.append(base);
              const baseline = base.getBoundingClientRect().top; base.remove();
              const c = el.querySelector(close)?.getBoundingClientRect(), icon = el.querySelector(close)?.querySelector("svg")?.getBoundingClientRect();
              const style = c ? getComputedStyle(el.querySelector(close)) : null;
              return { capTop: baseline - cap - box.top, capCentre: baseline - cap / 2, close: c && { top: c.top - box.top, side: box.right - c.right, centre: c.top + c.height / 2, h: c.height, radius: parseFloat(style.borderTopRightRadius), glyphSide: box.right - icon.right }, surface: parseFloat(getComputedStyle(el).borderTopRightRadius) };
            };
            return { withClose: read(id), bare: read(bare) };
          }, `${family}-close-${type}-${density}-${corner}`, family === "drawer" ? null : `${family}-bare-${type}-${density}-${corner}`, title, close);
          const w = m.withClose;
          assert.ok(Math.abs(w.capTop - inset) <= 0.75, `${where}: the cap sits ${w.capTop.toFixed(2)} from the edge beside a close, not on the ${inset} inset`);
          if (m.bare) assert.ok(Math.abs(m.bare.capTop - inset) <= 0.75, `${where}: the cap sits ${m.bare.capTop.toFixed(2)} without a close`);
          assert.ok(Math.abs(w.close.centre - w.capCentre) <= 0.75, `${where}: the close's centre is ${(w.close.centre - w.capCentre).toFixed(2)} off the cap's`);
          assert.ok(Math.abs(w.close.glyphSide - inset) <= 0.5, `${where}: the close's glyph is ${w.close.glyphSide} from the side, not on the ${inset} column`);
          if (surfaceCorner) {
            const near = Math.min(w.close.top, w.close.side);
            const expected = Math.min(w.close.h / 2, Math.max(corner === "0" ? 0 : Math.min(4, w.close.radius), w.surface - near));
            if (corner === "10") assert.ok(Math.abs(w.close.radius - expected) <= 0.5, `${where}: the close's corner ${w.close.radius} is not ${w.surface} less its nearer distance ${near}`);
            if (corner === "0") assert.equal(Math.abs(w.close.radius), 0, `${where}: the close is not square at Sharp`);
            assert.ok(w.close.radius <= w.close.h / 2, `${where}: the close's corner passes half its height`);
          }
        }
      }
    }, { fresh: false });
  }
});
