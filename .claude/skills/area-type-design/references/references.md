# Working from reference fonts

Area Serif is built on **Libre Baskerville** (Impallari Type, SIL Open Font License 1.1, reserved font name "Libre
Baskerville"). The OFL allows modifying and redistributing its outlines on three conditions: don't use the reserved
name, keep the copyright and licence with the font, and distribute any derivative only under the OFL (it may be
bundled with software, not sold on its own). Source: https://github.com/impallari/Libre-Baskerville (`sources/`).

**Georgia Pro** (Microsoft, licensed with the OS) and **Serrif** (Displaay; installed as a trial whose terms allow
internal testing only and forbid modifying, converting or making derivatives of the font data) are measurement-only
references. The rules below apply to those two.

## Allowed

- Measuring installed reference fonts with fontTools: heights, stems, serifs, widths, apertures, contrast, kerning
  values, feature lists (`docs/research/serif-typeface-2026-11-10/tools/`).
- Rendering them beside Area Serif for comparison: `proof.py --refs`, `overlay.py`, `overlay.tile()`. Outlines are
  drawn to an image and discarded.
- Describing a trait as numbers or words in the plan and the skill.

## Never

- Importing, tracing, converting, instancing-and-saving or copying any point of a reference outline into a source.
- Committing renders of a reference font, or publishing them outside the owner's private review pages.
- Naming the family after, or close to, either reference.

## Borrowing a trait

1. Measure it (`measure.py`, `extra.py` or a scanline in `lib.py`).
2. Name the variables that make it (for example Serrif's serif: tip 26, near the stem 62, projection 82).
3. Freeze what must not change in Area Serif.
4. Put the principle into `params.py` or the kit, one pass.
5. Recheck counters, color, spacing and the overlays.

If structure, texture and distinctive glyphs together still identify one reference at a glance, differentiate more:
start with proportion and the distinctive letters. Legal questions get a plain "this is not legal advice" and a
referral; design is protected as a registered design in the EU, so a near-copy of a recent face is a risk even
without copying data.
