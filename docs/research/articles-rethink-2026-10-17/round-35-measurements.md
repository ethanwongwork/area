# Round 35 measurements (2026-10-17)

Computed styles read in the owner's Chrome (read-only). ChatGPT in a temporary chat (not saved to history); Notion on a
public notion.site page (notioner.notion.site, "欄、表格、標題、目錄與分隔線"); Wikipedia on en.wikipedia.org/wiki/Lisa_Su.
Read with `getComputedStyle` and `getBoundingClientRect` (the capture script was not injected: ChatGPT's page blocks
returned markup with query strings).

## ChatGPT: "Sources" under an answer (light)

| Part | Value |
|---|---|
| heading | `h3`, 16 / 26, 600, rgb(13, 13, 13); margin 24 above |
| list | `ul`, disc markers in rgb(13, 13, 13), padding-inline-start 32, 8 under the heading |
| item | 16 / 26, 400, rgb(13, 13, 13); items back to back (52-tall two-line item, the next at +52); li padding 4, margin −4 |
| item content | "Publisher — Title ↗ — description": publisher and title each a link, " — " plain text in the item ink |
| link | the item ink, `text-decoration: underline dotted 1px rgb(143, 143, 143)`, offset 2 |
| external mark | 16 × 16 svg, 4 after the title |
| inline citation | a pill (favicon + publisher) after a sentence; Area's Citation default |

## Notion: table of contents block (light)

| Part | Value |
|---|---|
| block | padding 8 |
| row | `a` > `div` 14 / 18.2, 400, rgb(44, 44, 43); padding 6 2 (rows about 30); a faint underline drawn as a gradient (rgba(28, 19, 1, 0.11)) |
| levels | 24 per level (margin-inline-start) |

## Notion: floating outline on the page edge (light)

| Part | Value |
|---|---|
| resting | a column of 2px bars 12 apart, corner 2; the current bar rgb(50, 48, 44), the others lighter; bar width by level (16 at the top level) |
| panel (hover) | 232 wide, corner 14, white, padding 12 12 0, shadow 0 20 24 rgba(25,25,25,.05), 0 5 8 rgba(25,25,25,.027) |
| row | 13 / 16.9, 400, padding 4 (25 tall); others rgb(125, 122, 117) (Notion's secondary ink), current rgb(39, 131, 222) (Notion blue) |
| levels | 12 per level |

## Wikipedia: infobox rows (Vector 2022, light)

| Part | Value |
|---|---|
| table | 14.08 / 21.12 (0.88 of the body), padding 2.816, border-spacing 3 |
| title | 17.6 / 21.12 (1.25em), 700 |
| row | th label 700, 123 of 296; td value 170; cells padding 1: rows 3 + 2 × 1 = 5 apart, the value 4 after the label |
