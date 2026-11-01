# Typefaces and the type ramp (2026-10-31)

Owner: "i want to add font switching to other open source web safe fonts … also open to adding some for display
only that you can pair with generic typefaces for body. also confirm that the current type ramp is robust … im
worried there arent enough styles or weights but i do like the simpler ramp overall."

Research only; nothing in the tokens or the app has changed.

## Method

- Candidates: about 90 open-licensed families, read from Google Fonts' own metadata (`fonts.google.com/metadata/fonts`,
  2026-10-31) for axes, italics, scripts and date added; licences checked in `google/fonts` `METADATA.pb` where a
  family is new (Google Sans Flex, Mona Sans: OFL).
- Metrics measured from the font files with fontTools (`metrics.py`, `stem.py` in this folder; data in
  `metrics.json`, `stems.txt`): cap height and x-height (glyph bounds of H and x), average lowercase advance, natural
  line height, and the lowercase stem (a horizontal slice through `l` at half the x-height) at 400, 500 and 600.
- To rerun: `python3 -m venv venv && venv/bin/pip install fonttools brotli`, download the TTFs (the Google Fonts CSS
  API with a plain user agent returns TTF links), then `venv/bin/python3 -I metrics.py fonts/*.ttf`.
- Google Fonts' builds are subset and strip `ss`/`cv` features (fonts.css already says this for Geist), so the
  feature columns below are not a reading of the full fonts. Ship faces from their npm builds, as Geist is.

## What Area's geometry already handles, and what is Geist-specific

Font-relative already (switching a face needs nothing here): insets use the `cap` unit and `text-box: trim-both cap
alphabetic` (`inset.css`), so control heights, first-line alignment and centring follow whatever cap height the face
has. Tabular figures are asked for by feature, 48 times.

Written for Geist (each must become a property of the face):

| Value | Today | Why it changes per face |
|---|---|---|
| `font-feature-settings` | `"rlig" 1, "calt" 0, "ss11" 1` | ss11 is Geist's; `calt 0` turns off Inter's useful contextual forms |
| `weight-strong` | 500 | 500 thickens stems by 16% (Public Sans) to 36% (IBM Plex Sans); Geist's step is 26% |
| `weight-icon` | 1.125px at 14 | matched to Geist's 14px stem (1.18px); faces measure 1.02 to 1.27px |
| title and display tracking | −0.01 to −0.03em, hand-built | faces with an optical-size axis (Inter, DM Sans, Newsreader, Fraunces, Source Serif 4, Bricolage, Google Sans Flex) already tighten; manual tracking double-corrects (typography.ts says so) |
| small-text tracking | +0.0025 to +0.01em | Geist is drawn for 0 at UI sizes; opsz faces open themselves |
| fallback face | Geist's ascent/descent overrides | each face needs its own metric-matched fallback |
| display leading | 1.0 (56/56, 72/72) | serifs with tall ascenders and accents (Playfair, Fraunces, Newsreader) collide at 1.0 on two lines |

Size: x-heights run from 0.546em (Inter) to 0.405em (EB Garamond); Geist is 0.530. At the same pixel size Source Sans
3 reads 9% smaller and Inter 3% larger, which moves the ramp, the 16 icon's pairing and every row's look. CSS
`font-size-adjust: ex-height 0.53` (Baseline 2024; in Electron's Chromium) renders any text face at Geist's x-height,
so the ramp holds. Display faces should not be adjusted: a low x-height is their character.

## Measurements (regular, per em)

Text faces, sorted by x-height. *x adj* is Geist's x-height over the face's (the `size-adjust` that holds the ramp).
*Stem* is the 400 lowercase stem against Geist's. *Strong* and *Emphasis* are the weights whose stem matches Geist's
500 and 600 steps over its own 400 (interpolated between measured 400, 500 and 600 instances; verify by eye).

| Face | x | cap | x/cap | width | x adj | stem | strong | emphasis | axes | italic | scripts |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Inter | .546 | .728 | .75 | .536 | 0.97 | 1.05 | 520 | 640 | opsz 14–32, wght | yes | 8 |
| Noto Sans | .536 | .714 | .75 | .530 | 0.99 | 1.05 | 520 | 630 | wdth, wght | yes | 9 |
| **Geist** (today) | .530 | .710 | .75 | .534 | 1.00 | 1.00 | 500 | 600 | wght | yes in 1.9.0 | 6 |
| Mona Sans | .525 | .729 | .72 | .527 | 1.01 | 0.96 | 500 | 590 | wdth 75–125, wght | yes | 4 |
| Public Sans | .517 | .723 | .72 | .529 | 1.03 | 1.08 | 570 | 750 | wght | yes | 4 |
| IBM Plex Sans | .516 | .698 | .74 | .505 | 1.03 | 0.95 | 470 | 570 | wdth 75–100, wght | yes | 7 |
| Google Sans Flex | .510 | .716 | .71 | .513 | 1.04 | 1.01 | 490 | 590 | opsz 1–144, wdth, ROND, slnt | slnt | 11 |
| Instrument Sans | .510 | .720 | .71 | .525 | 1.04 | 0.95 | 490 | 580 | wdth 75–100, wght 400–700 | yes | 3 |
| DM Sans | .504 | .700 | .72 | .522 | 1.05 | 1.00 | 530 | 640 | opsz 9–40, wght | yes | 3 |
| Figtree | .500 | .700 | .71 | .507 | 1.06 | 0.95 | 540 | 660 | wght | yes | 3 |
| Atkinson Hyperlegible Next | .496 | .668 | .74 | .487 | 1.07 | 1.00 | 500 | 640 | wght 200–800 | yes | 3 |
| Source Sans 3 | .486 | .656 | .74 | .475 | 1.09 | 0.98 | 530 | 660 | wght | yes | 8 |

Reading serifs (could set Articles' body): Literata .507 x, opsz 7–72, 8 scripts, strong 520; Source Serif 4 .492,
opsz 8–60, strong 540; Newsreader .441, opsz 6–72, strong 490.

Display faces: Instrument Serif (.510 x, stem 0.81: thin, 400 and italic only), Fraunces (.469, opsz 9–144, SOFT,
WONK), Playfair 2 (.415, opsz 5–1200, wdth), Young Serif (.500, one weight, stem 1.63), Gloock (.508, stem 1.71), DM
Serif Display (.481, stem 1.69), Bodoni Moda (.460, opsz 6–96), Bricolage Grotesque (.517, opsz 12–96, wdth 75–100),
Unbounded (.566, wide, stem 1.55), Space Grotesk (.489), Funnel Display (.500).

Mono: Geist Mono (today), JetBrains Mono (.550 x, the tallest: reads largest), IBM Plex Mono (.516), Google Sans Code
(.523, 12 scripts), Atkinson Hyperlegible Mono (.496, width .632: the widest), Fragment Mono (.524, one weight),
Martian Mono (.600 x, wdth 75–112), Fira Code (no italic), Commit Mono (OFL, npm only).

## Shortlist

**Text faces** (UI and body). Required: variable weight, a true italic, x/cap at or above 0.70, digital-first drawing,
an open licence.

| Face | Character | Why it earns a place |
|---|---|---|
| Geist | precise, neutral grotesk | today's default |
| System | SF Pro / Segoe UI Variable | no download, native rendering and optical sizes; Notion's stack. Metrics differ by OS, so it can't be size-matched |
| Inter | the neutral standard | largest x-height (best at 11–13), opsz gives a display cut, 2,871 glyphs; Figma's UI face |
| IBM Plex Sans | technical, humanist grotesk | a superfamily (Serif, Mono, Condensed, CJK) for one-family systems |
| Source Sans 3 | humanist, narrow | the narrowest (.475): fits dense tables; reads small, so needs the adjust |
| Public Sans | civic, sturdy | the heaviest regular (1.08): holds up on low-DPI and in dark mode |
| DM Sans | geometric, friendly | opsz 9–40; consumer products |
| Mona Sans | industrial grotesk | widths 75–125: one family gives a condensed UI and a wide display |
| Google Sans Flex | rounded-capable humanist | opsz, width and a Rounded axis: the only open face with an SF Rounded-like option; 11 scripts; new (2025-11) |
| Atkinson Hyperlegible Next | accessibility | drawn for low vision: distinct I l 1, 0 O, open counters |
| Noto Sans | coverage | the widest script support; the choice for multilingual products |

Not shortlisted as text faces: Manrope, Onest, Lexend, Sora, Outfit, Space Grotesk, Unbounded (no italic); Plus
Jakarta Sans, Red Hat Text (stems 0.87–0.89 of Geist: light in dark mode); Figtree (close to DM Sans,
without opsz). Satoshi, General Sans, Clash and Cabinet (Fontshare) are free but not open source and can't be
redistributed in a package.

**Display faces** (titles from title-md up, and display; body stays the text face): Instrument Serif, Newsreader,
Fraunces, Source Serif 4, Playfair, Young Serif, Bricolage Grotesque, Mona Sans Expanded (wdth 125), Space Grotesk.
"Same as text" stays the default.

**Code faces:** Geist Mono, JetBrains Mono, IBM Plex Mono, Google Sans Code, Atkinson Hyperlegible Mono.

## The ramp

Today, per type size (`axes/type-size.ts`):

| Type | text-xs | text-sm | text-md / title-xs | title-sm | title-md | title-lg | display-sm | display-lg |
|---|---|---|---|---|---|---|---|---|
| 12 | 10/14 | 12/16 | 14/20 | 17/24 | 21/28 | 27/34 | 48/48 | 62/62 |
| 13 (default) | 11/14 | 13/18 | 15/22 | 19/26 | 22/30 | 30/38 | 52/52 | 67/68 |
| 14 | 12/16 | 14/20 | 16/24 | 20/28 | 24/32 | 32/40 | 56/56 | 72/72 |
| 16 | 14/20 | 16/24 | 18/28 | 23/32 | 27/36 | 37/46 | 64/64 | 82/82 |

Eight sizes and two weights. Peers: Radix Themes 9 sizes and 4 weights, Primer about 8, Apple 11 styles, Fluent 2 11
sizes and 2 weights, Material 3 15 styles and 2 weights. Area sits with the lean systems, and the product-UI part
(caption, UI, reading, three titles) is complete: no role a product screen needs is missing, and no added size
would be used by a component.

The gaps are in content and display, not UI:

1. **Inline bold has no token.** Nothing styles `strong` or `b`, so bold in a chat reply or an article is the
   browser's `bolder`, 700: an untokenised third weight that would ignore any face's tuning. Strong (500) is too soft
   for emphasis inside running text, by design. ChatGPT sets its answer's bold and h3 at 600 (reference-list.css),
   Cursor's docs inline strong at 700 (specs/typography.md). Proposal: `weight-emphasis`, 600 on Geist, for `strong`
   and `b` inside running text only; titles and labels never use it.
2. **No true italic.** Geist 1.7.2 (fonts.css) ships no italic, so `em`, citations and quotes are slanted by the
   browser. Geist 1.9.0 adds `Geist-Italic[wght].woff2` and Mono italics. Proposal: move to 1.9.0 and add the italic
   faces (check its metrics against 1.7.2 first).
3. **A hole between title-lg and display-sm.** Every step is ×1.2 to ×1.33 except 32 → 56 (×1.75). Marketing
   section headings, hero titles on narrow screens, onboarding and stat heroes fall in 40–48 (Fluent 40, Material
   45, Apple 34). Proposal: one role, `display-xs`, 40/44 at 14 (37/40 at 13), scaled like the others.
4. **Display has no responsive step.** 72px on a 375px phone is a two-word line. Proposal: a rule, not a role:
   display roles step down one rung under a narrow container.
5. **Titles have one weight.** Regular titles are the owner's direction and stay the default, but a display face
   or a brand often wants Medium or Semibold. Proposal (optional): a Title weight setting, Regular / Medium /
   Semibold, applying to title-sm and up; never to UI labels.

Not needed: more body sizes (an 18 reading size is text-md at type 16), an overline role (text-xs with caps
tracking is a composition), a light weight, a metric role (title roles with tabular figures).

## If the owner goes ahead

Built through `area-foundation-change` (and `area-component-intake` for `display-xs`):

- Three settings: Text face, Display face (default "Same as text"), Code face. A face preset carries its stack, its
  npm source (fontsource-variable or upstream, never Google's CSS), its features, strong and emphasis weights (the
  table above), the icon stroke factor (its stem against Geist's), the x-height adjust, its tracking mode (hand-built
  for faces without opsz, 0 for faces with it), a display leading floor, and its metric-matched fallback.
- Load only the chosen faces (`@font-face` per preset, emitted with the setting), so switching costs one download.
- Licences: every shortlisted face is OFL; record each in the brief's legal list.

## Owner's picks (2026-10-31, specimen page `verdicts`)

Every face and every proposal on the first page: Yes. No notes. So: all 11 text faces, all 9 display faces, all 5
code faces, and proposals 1–5 (emphasis weight, Geist 1.9.0 italic, `display-xs`, display step-down, Title weight)
plus "not added" as listed.

## Independent foundries and ABC Areal (2026-10-31, round 2)

Owner: "especially for the display fonts i want to leverage niche, type foundry, respected design typefaces that are
still able to be used in web products and are open source. look at ABC Areal."

**ABC Areal** (Dinamo, v1.009, on the owner's machine): a neo-grotesk, x .519, cap .716, width .500 (narrower than
Geist's .534), stem 1.05 × Geist's, `wght` 400–700, `slnt` −12–0 and a `DRKM` (dark mode) axis, 11 stylistic sets,
with Semi Mono and Mono siblings. **It can't ship in Area.** Its name table and Dinamo's terms (§9.5–9.6, §10) forbid
public servers, public repositories, sharing with third parties and embedding where end users can reach the files.
A licence holder could use it in their own product; Area could only take it as a font a user brings for their own
system, kept out of the repo (a later "custom typeface" setting).

What makes Areal distinctive is a quiet grotesk with flat-cut terminals plus mono siblings drawn with it. The open faces
built that way, rendered side by side:

| Face | Foundry | Mono | Note |
|---|---|---|---|
| Ronzino | Collletttivo | none (pair with Chivo Mono or Geist Mono) | closest letterforms to Areal; Regular, Medium, Bold, obliques; tnum; 694 glyphs |
| Chivo + Chivo Mono | Omnibus-Type | drawn as a pair | wght 100–900, italics |
| Reddit Sans + Reddit Mono | OrangeRed | drawn as a pair | identical metrics |
| Sono | Tyler Finck | `MONO` axis 0–1 | proportional, semi-mono, mono in one file, like Areal's three |
| Recursive | Arrow Type | `MONO` axis | with `CASL`; more technical |
| Space Grotesk + Space Mono | Colophon, Florian Karsten | the mono came first | quirkier |

**Display from independent foundries.** Gate: SIL OFL (licence file checked in each repository) and Latin Extended
coverage (28 or more of 29 test accents: ą ć ę ł ń ś ź ż ő ű ş ğ ı č ř ž ě ů ñ ç ã õ å ø æ œ ß € №), so a title in Polish,
Czech or Turkish doesn't fall back mid-word.

- On Google Fonts: Redaction (MCKL, 6 degraded cuts, added 2026-10-28), Hedvig Letters Serif (Kanon), Imbue (Tyler
  Finck), Roboto Serif (Commercial Type), Brygada 1918 (Capitalics), Piazzolla (Huerta Tipográfica), Cormorant
  (Christian Thalmann), Geologica (Monokrom), Syne (Bonjour Monde), Schibsted Grotesk (Bakken & Bæck), Familjen
  Grotesk (Familjen STHLM), Anybody (Tyler Finck), Big Shoulders (Patric King), Unbounded (NaN).
- Off Google Fonts, self-hosted from the foundry's repository: Le Murmure, Basteleur, Ouroboros, Grotesk
  (Velvetyne, gitlab.com/velvetyne), Apfel Grotezk, Ronzino, Absans (Collletttivo, github.com/collletttivo).
- English only (fail the accent gate): Bluu Next 22/29, Sporting Grotesque 18, Compagnon 14, Happy Times 12, Format
  1452 11, Avara 12 (and no licence file in its repo), Bagnard 9 (157 glyphs). Fine for a fixed English headline,
  not as a system's display face.
- Not open source though often listed as free: Fontshare (Satoshi, General Sans, Clash, Cabinet), Pangram Pangram
  (free for personal use only), Dinamo's trial fonts (pitching only).

Velvetyne's homepage showed only a statement supporting a student strike on 2026-10-31; its repositories and licences
are unchanged.

Code: Sligoil (Velvetyne, ink-trap mono, wght 90–120) added to the code list.

`inline-fonts.py` builds the published specimen with the off-Google faces as data URIs (the artifact page may load
fonts only from Google Fonts or data URIs). If they ship in Area, vendor the WOFF2 files with each OFL licence.

## Licensed faces from reputable foundries (2026-10-31, round 3)

Owner: "include some open source typefaces as examples but note that licensing is needed for certain ones, but it
would be great to include some high quality, well designed typefaces from reputable type foundries like pangram
pangram, abc dinamo, cotype, displaay.net, fontshare, etc".

**What the licences allow.**

| Source | Model | Can Area ship or serve it? |
|---|---|---|
| Klim, Displaay, Pangram Pangram, ABC Dinamo, CoType, Schick Toikka | commercial; trials for evaluation (Pangram: free personal use; Dinamo: pitching only; Displaay: full trials) | no |
| Fontshare, ITF FFL 2.0 (17 Aug 2026, read from Satoshi's download) | free for commercial use, self-hosting allowed for **your own** sites and apps | no: §02 bans redistribution through any "library, repository … application or platform" and making a font "available as a selectable font for third-party users" in a design tool, template editor or SaaS, even if they can't extract it |
| Fontshare families marked `sil_ofl` in its API (Archivo, Space Grotesk, Manrope …) | OFL | yes, as with Google Fonts |
| CoType's free Gridular, Orbikular, Betatron | free; terms not read | check before use |

So no licensed face can be a built-in choice. The model that works is Figma's: **a face installed on the user's
Mac**. The desktop app lists installed families beside the shipped ones, measures the chosen one locally (x-height,
stems, strong and emphasis weights, as `licensed.py` does) to tune the ramp, and marks any system that names it
"needs a web licence", with the foundry's link. Exported code names the family and leaves `@font-face` to the
licence holder. Nothing is downloaded, served or committed by Area.

**Measured** (`licensed.py`, in memory from the owner's installed trials and Fontshare downloads; no font file is
written, copied or published; `licensed-metrics.json`, `licensed-faces.tsv` without local paths). Trial files from
Klim and Schick Toikka are cut to about 70 glyphs, so their accent coverage says nothing about the retail fonts.

| Face | Foundry | x | stem ÷ Geist | strong / bold | axes |
|---|---|---|---|---|---|
| Söhne | Klim | .523 | 1.07 | static | — |
| Untitled Sans | Klim | .503 | 0.99 | 450 / 500 | wght |
| Die Grotesk | Klim | .520 | 1.07 | 490 / 680 | opsz 6–42, wght |
| Saans | Displaay | .519 | 0.92 | 460 / 550 | MONO 0–100, slnt, wght |
| ABC Areal | Dinamo | .519 | 1.05 | 490 / 640 | wght, slnt, DRKM |
| Switzer | Fontshare | .531 | 1.05 | 520 / 630 | wght |
| Satoshi | Fontshare | .484 | 0.82 | 470 / 580 | wght |
| General Sans | Fontshare | .527 | 0.84 | 460 / 510 | wght |
| Tiempos Headline | Klim | .524 | 1.33 | 510 / 640 | wght |
| Signifier | Klim | .450 | 1.05 | 480 / 610 | wght |
| Serrif | Displaay | .498 | 1.01 | 490 / 600 | wdth 50–100, slnt, wght |
| PP Kyoto | Pangram Pangram | .500 | 1.05 | static | — |

The full 34 (Calibre, Scto Grotesk, Supreme, Synonym, Author, Tiempos Text, Financier Text, Martina Plantijn, Family,
Untitled Serif, Edict Display, Erode, Zodiak, Gambetta, Sentient, Boska, Clash Display, Cabinet Grotesk, and the monos
Söhne Mono, Areal Mono, Serrif Mono, PP Right Serif Mono) are in `licensed-metrics.json` and on the specimen page
as images. Fontshare's sans run light: Satoshi, General Sans and Synonym stems are 0.80–0.84 of Geist's, so they
need their measured strong weight more than most. Saans is the commercial face closest to Areal's build: a grotesk
with a MONO axis.

Not installed, worth a trial: Pangram Pangram (PP Neue Montreal, PP Editorial New, PP Mori, PP Neue Machina, PP
Fragment, PP Supply), Dinamo (Diatype with Mono and Semi Mono, Favorit, Arizona, Monument Grotesk, Oracle, Ginto,
Gravity), CoType (Aeonik with Mono and Fono, RM Neue and RM Mono, Lock), Displaay (Haffer, Roobert, Matter, Reckless,
Tobias, Gellix), Klim (National 2, Domaine, Epicene).

## Owner's picks, rounds 2 and 3 (2026-10-31)

Yes to 100 of 104: every Areal match, every libre-foundry and English-only face, every licensed face, all five "Get
trials", every ramp proposal. No to Format 1452, Grotesk (Velvetyne), Imbue and Ouroboros. Avara is left out until its
repository has a licence file.

## Built: the typeface library in Typography (2026-10-31)

Owner: "a fontbook like experience for all these typefaces ... showing all the glyphs in each typeface in a similar
manner to the icons ... infrastructure and ui ... that supports both", and "type specimen like documentation for each
typeface ... just like google fonts. use tables". Placement and licensed faces: Typography, reading installed fonts.

- **Catalogue** `apps/desktop/src/content/typefaces/catalogue.mjs`: 107 faces (kept picks, Geist Serif and Geist Pixel
  from the geist package 1.9.0, Chivo Mono, Reddit Mono, Space Mono, and the trial foundries' faces), with foundry,
  designers, licence, links, siblings and a sentence each.
- **Facts** `scripts/typefaces.mjs` (fontkit, WOFF2 decompressed with wawoff2 so variations work) and the shared
  `scripts/typeface-facts.cjs` (this folder's stem method): 56 shipped faces, 403 files, `generated/faces.json`,
  `files.json`, `unicode.json` (Unicode 16.0 names), `styles/typefaces.css`. Its measurements agree with this folder's
  Python ones (Geist x .530, stem 1.00, strong 500, bold 600; Inter .546, 1.05, 520, 640).
- **Files**: Fontsource packages for the Google faces; the geist package for Geist, Geist Mono, Serif and Pixel; libre
  files with their OFL in `apps/desktop/assets/fonts/`. The renderer copies them to `dist/fonts` (25 MB).
- **Installed faces**: `electron/main.cjs` `area:fonts-installed` reads `~/Library/Fonts` and `/Library/Fonts` and returns
  facts only (characters, axes, features, metrics, tuning, styles, glyph names). Checked live: Söhne's trial (69
  characters, "Test Söhne"), its glyph names in the hover card and Inspector.
- **Glyph sheet** `src/glyph-sheet.tsx`, `styles/glyphs.css`: Icons' wall moved onto it unchanged; a face's Glyphs tab
  uses it by Unicode block, sizes 24 to 96, Font Book's popover (glyph name, block, U+ and Unicode name, Copy character).
- **A face's page**: Specimen (the sample on every role, a display face over a Geist body, the Styles table), Glyphs,
  About (tables: Overview, Licence, Metrics, Area tuning, Axes, Styles, OpenType features, Coverage) and Code.

Not done: the font-switching settings (Text, Display and Code face) and the ramp changes the owner approved. Google's
subsets drop many faces' stylistic sets, so the Features table reads what Fontsource serves.
