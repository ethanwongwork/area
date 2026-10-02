# Filled variants: more ink, not a negative (2026-10-01)

The owner's question: how would Fluent fill the bots? Filled should not mean that everything white
turns black and everything black turns white; it should read as more ink, well considered.

| Sheet | Shows |
|---|---|
| `1-fluent-filled-objects.png` | Fluent regular beside filled: bot, bot_add, bot_sparkle, incognito, glasses, hat_graduation, crown, emoji, guest, headset_vr, person, backpack, food_cake, beaker |
| `2-fluent-filled-figures.png` | emoji_meme, people, person_support, animal_cat, animal_dog, animal_rabbit, bug, headset, person_board, video_person, hat_graduation_sparkle, person_star, glasses_off, bot_add |
| `4-refs-bots.png` | The bots and hats beside Fluent, Lucide, Phosphor (regular and fill) and Hugeicons |
| `5-refs-everyday.png` | Sixteen everyday concepts across the same libraries: each one's character |
| `3-bot-filled-more-ink.png` | Batch 61: outline, the filled variant now (head flooded, face knocked out), and the prototype (the hat fills, the face stays as drawn) |

## What Fluent does

- **Masses fill; lines stay lines.** Bodies, heads, cups and hats fill. Legs, tails, antennae,
  bands, straps and handles keep the regular weight (bug, cat, dog, headset, backpack).
- **Solid stays solid.** A part already solid in the regular stays solid when filled. emoji_meme's
  sunglasses stay black, with their highlights, and the face fills around them. Nothing that was ink
  becomes white because the part around it filled.
- **The accessory that names the variant fills; a see-through frame stays open.** incognito's hat
  fills and its glasses stay rings. glasses alone fill their lenses, because the lenses are the
  object.
- **A subject in a frame: fill one of them, never invert a line drawing.** video_person keeps the
  frame as a line and fills the person. guest and person_board fill the card and turn the person
  into a simplified solid negative silhouette (a solid head, not a ring).
- **Small marks on a filled mass become knockouts** (bot's and emoji's eyes, the crown's jewel, the
  cake's icing), because ink on ink would vanish. These are the only places white appears.
- **Separation comes from space drawn into the regular.** people, bot and hat_graduation part
  their pieces with gaps that already exist in the regular icon. Filled doesn't cut new seams
  that crowd a face.

## Proposed principle for Area (draft, for the owner)

Filled is the outline with more ink, put where the icon's identity is:

1. Fill the masses that name the icon. Keep thin parts (bands, legs, handles, frames around a
   subject) as lines at the icon weight.
2. Never invert. Whatever is ink in the outline stays ink; whatever is solid stays solid. White
   appears only where a small mark sits on a newly filled mass and would otherwise vanish.
3. A face, screen or frame holding features stays as drawn when filling it would turn those
   features into a negative; fill the part around it or the accessory instead (the bots' hats).
4. Separate filled parts with the space the outline already has. Where a new gap would crowd a
   feature, fill less rather than cut more.

Applied to batch 61 (sheet 3, prototype): each hat fills (crown, dome, cone, board and skull cap,
puffs and band, goggles); the head, eyes and mouth stay as drawn; the Agent's lenses and the
Guard's visor stay black. The plain `bot` keeps its filled head, because the head is its
identity. The prototype sources are in `prototype/` (`bot-*-h.svg`); they are not in the icon set.

Open:

- Adopt the principle for batch 61 (the prototype), and record it in the icon skill and spec.
- Then audit the whole filled set against it: icons whose filled variant inverts a line drawing
  inside a filled container are the candidates.

Re-render the Fluent sheets (from the repository root):

```bash
D=docs/research/icon-review/2026-10-01; F=$(dirname $(node -p 'require.resolve("@fluentui/svg-icons/package.json")'))/icons
node $D/prototype/fluent-sheet.mjs $F $D/1-fluent-filled-objects.png bot_16 bot_add_16 bot_sparkle_16 incognito_16 glasses_16 hat_graduation_16 crown_16 emoji_16 guest_16 headset_vr_20 person_16 backpack_16 food_cake_16 beaker_16
```

## Other libraries (2026-10-01)

Lucide (ISC), Phosphor (MIT) and Hugeicons' free set (MIT) are fetched into `apps/docs/.cache/refs`
by `node apps/docs/scripts/icon-refs.mjs fetch` (not dependencies, not committed). Sheets come
from the concept table `docs/research/icon-references.json`:
`node apps/docs/scripts/icon-refs.mjs sheet out.png bots everyday`. Look, never trace. Cursor
stays rules-only. SF Symbols is not installed here; its licence allows viewing in Apple's app, so
it is compared by eye and kept out of the repository.

What each brings (sheets 4 and 5):

- **Lucide:** strict geometry, 2px on 24 (about 1.33 at 16, heavier than Area), outline only,
  one telling detail per object (the bell's clapper, the house's door). Little to learn for
  filled; much for coverage (2,100 icons, tagged).
- **Phosphor:** six weights from one drawing, so its fill is designed, not derived. Fill adds ink
  inside rings (the search lens becomes a solid disc in its ring), keeps details as knockouts
  (the envelope's flap lines) and adds playful specifics: a tassel on the mortarboard, "12" on
  the calendar, a grille mouth on the robot, panels on the cap.
- **Hugeicons:** 1.5 on 24, every corner a superellipse (a squircle), which is its whole
  character; asymmetric details (the file's folded corner at the bottom right, three dots in
  the chat). The free set is stroke only (no solid to compare).
- **Fluent:** friendly round ends, filled cuts with knockouts and solid-on-solid marks (the
  sunglasses on emoji_meme), text lines in chat, a dot grid in calendar.

Where Area could be more specific, worth an owner look (not changes yet):

- calendar has no content; Fluent and Hugeicons show a dot grid, Phosphor a date;
- search filled is a bolder line; Phosphor's filled lens is the more-ink answer;
- chat is empty; Fluent's lines or Hugeicons' dots say "message" sooner;
- the bots could take one Phosphor-like specific each (the mortarboard's tassel, the cap's
  panels), within the 16px gap rules.

## The whole-set audit (plan)

1. **Coverage.** Map all of Area's icons to each library by name and tags (Lucide `tags.json`,
   Phosphor's metadata, Fluent and Hugeicons names; Cursor's concept table in
   `icon-inventory.md`), then review by hand. Output: concepts three or more libraries have and
   Area lacks, and Area's own.
2. **Visual.** One reference sheet per batch (this tool, with batch headings), noting per icon a
   detail worth borrowing, a proportion off against the set, and its filled treatment under the
   more-ink principle.
3. **Decisions.** Findings go to the owner by batch number, as the review sheets do now.
