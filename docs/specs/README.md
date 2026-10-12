# Component specs

One spec sheet per component built or refined under
[Building a component](../COMPONENT_ADAPTATION.md). A spec records the evidence behind
each value, the decisions and their reasons, and the owner's feedback. Start a new spec
from [the template](TEMPLATE.md). Raw measurements live in
[`docs/research/captures/`](../research/captures/), and the shared cross-product baseline is
[research/BASELINE.md](../research/BASELINE.md).

Completion is recorded only in `apps/desktop/src/content/component-status.mjs`; a spec status of
"accepted" mirrors it.

| Component | Spec status | Notes |
|---|---|---|
| [Indicator](indicator.md) (count, activity, presence status) | accepted | Pilot. 24 captures; dot, count, cutout and placement rebuilt from them and owner feedback |
| [Model picker](model-picker.md) | accepted | Ghost trigger in the composer, Menu of radio rows with notes (48), 4 below, flips above |
| [Accordion](accordion.md) | in review | Plain (Notion toggle: leading chevron, title column) and divided (trailing chevron, rules); Accordion single or multiple; AccordionItem stands alone. Was Disclosure |
| [Scroll to latest](scroll-to-latest.md) | accepted | Round outline icon Button, 24 above the composer and centred (ChatGPT), shown 200 from the end |
| [Message](message.md) | accepted | ChatGPT turns: bubble 10/16 at 70% (composer corner 16), prose 16/24, muted 32 icon actions on the text edge, streaming dot |
| [Prompt suggestions](prompt-suggestions.md) | accepted | ChatGPT home rows: composer width, 24 below, 48 rows, icons under the composer's "+" |
| [Hover card](hover-card.md) | accepted | Popover surface after 700 ms rest (Radix; GitHub ≈ 750), 300 ms close, start-aligned, identity row, never on touch |
| [Context menu](context-menu.md) | accepted | Menu at the pointer (Notion: corner at the pointer), flips on screen, Shift+F10 / Menu key |
| [Command palette](command-palette.md) | accepted | Notion "Search or ask": 600 wide, 77 from the top, search row 48, grouped Menu rows, key hints; modal or inline |
| [Combobox](combobox.md) | accepted | Input + Menu-styled listbox in the top layer; filter, create, groups, custom value; WAI list autocomplete |
| [Resizable panel](resizable-panel.md) | accepted | Panel `resizable`: window-splitter separator on one edge, Figma geometry and focus pill, keyboard steps |
| [Box field](box-field.md) | accepted | Padding and corner radius, linked or one field per side/corner, on the inspector grid |
| [Property list](property-list.md) | accepted | Reorderable fills/strokes/effects: handle in the inset, drop line, keyboard moves with announcement |
| [Inspector](inspector.md) | accepted | PanelRow grid (two columns + trailing square), section actions, Figma Design panel recipe |
| [NumberField](number-field.md) | accepted | Figma: the letter or icon is the scrub handle; unit follows the number; soft inspector recipe |
| [Toast](toast.md) | accepted | Popover's 12 inset and corner, 40 tall with or without controls, shared lift, muted description; `Toaster` / `useToaster` host (audit E-11) |
| [Dialog](dialog.md) | accepted | Close 8/8 as a 32px ghost Button, title centred on it, 15 title-to-description, shared lift, 13% scrim, modal `trigger` |
| [Popover](popover.md) | accepted | Menu's lift, 320 wide, 16 gaps, anchored `trigger`; pass 3: close in an even corner, strong title, arrow tiles |
| [Menu](menu.md) | accepted | Label at 36, shared hover/focus wash, neutral danger hover, floating lift, arrow keys and typeahead |
| [Split button](split-button.md) | accepted | New: standalone (survey of 15 systems), Notion proportions, full-height divider, native popover menu |
| [Button group](button-group.md) | accepted | Full-height divider in the control line |
| [Button](button.md) | accepted | First pass: labels 400 (solid 500), 6px icon gap, no shadow; ChatGPT, Notion, Figma, Untitled captured |
| [Composer](composer.md) | accepted | First pass: 16/24 text, faint ring and soft shadow, 8px action gap (ChatGPT); auto-grow width fix |
| [Tree view](tree-view.md) | accepted | First pass: secondary ink at rest, 8px start, 16px chevron slot, 20px indent (Nav, Notion) |
| [Alert](alert.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Alignment picker](alignment-picker.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Avatar](avatar.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Card](card.md) | accepted | Layouts, size axis, linked cards, slots and templates (2026-09-27); neutral 25 media, lighter edge, soft shadow |
| [Checkbox](checkbox.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Chip](chip.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Code](code.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; confirmed. Token deprecated for `<Code swatch>` (audit H-25) |
| [Code block](code-block.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Color field](color-field.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Color swatch](color-swatch.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Color swatch picker](color-swatch-picker.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Field](field.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; confirmed |
| [Input](input.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Input group](input-group.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Kbd](kbd.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; confirmed |
| [Nav](nav.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Panel](panel.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; confirmed |
| [Progress](progress.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Radio](radio.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Segmented](segmented.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Select](select.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Separator](separator.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; confirmed |
| [Skeleton](skeleton.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Slider](slider.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; confirmed |
| [Spinner](spinner.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Switch](switch.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Table](table.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Tabs](tabs.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; confirmed |
| [Textarea](textarea.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; confirmed |
| [Toolbar](toolbar.md) | accepted | Cohesion audit, 2026-09-26: Area, ChatGPT, Notion and Figma captures and Untitled UI source; changed |
| [Calendar](calendar.md) | accepted | New: single, range and multiple selection, two months, bounds; Notion's react-day-picker geometry (32/28 cells), shadcn and React Aria behavior |
| [Color picker](color-picker.md) | accepted | Figma pass: ten-row width, 16px pill tracks, ringed thumbs, eyedropper, Hex/RGB/CSS/HSL/HSB value row, header slot. 11 Figma captures |
| [Breadcrumb](breadcrumb.md) | accepted | First pass: current-page ink bug fixed, 400, separators rgb(131) with 4px gaps, Notion hover plate |
| [Pagination](pagination.md) | in review | New, 2026-10-08: 32 squares with a 2 gap (shadcn, Untitled UI), the selected plate on the current page, ghost Button steps, compact "Page 2 of 10"; no target product has a pager |
| [Link](link.md) | in review | New, 2026-10-08: inherited ink and type, underline at 40% of the ink (Notion) one stroke 2 below (ChatGPT); standalone, muted, action, external |
| [Scroll area](scroll-area.md) | in review | New, 2026-10-09: native scroller with Figma's overlay bar (10 track, 6 round thumb 2 in), shown on hover, scroll or always |
| [File upload](file-upload.md) | in review | New, 2026-10-09: drop zone (Untitled's 16/24, 12 gap, the field's edge) and upload rows (Progress lg, ghost sm actions, uploading / complete / error) |
| [Board](board.md) | in review | New, 2026-10-10: Notion's board view: 276 columns 12 apart, a Tag-toned header with a count, the tone's tint, white cards with Notion's lift and a toned ring, hover actions |
| [Zoom control](zoom-control.md) | accepted | New, 2026-10-10: Figma's "48%" zoom menu on Area's ghost Button sm and Menu: typed zoom, in, out, fit, 50 / 100 / 200% presets, view toggles |
| [Citation](citation.md) | in review | New, 2026-10-10: ChatGPT's source pill after a sentence (18 round, 4 / 8, #f3, 12 favicon, name cut at 15ch, +N), 11px type; a link, with a Hover card preview |
| [Date range picker](date-range-picker.md) | accepted | New, 2026-10-10: Date picker's field and panel for a range ("Oct 4 – 10, 2026"); Notion's preset rows above a range Calendar (one or two months), Clear |
| [Shortcut list](shortcut-list.md) | accepted | New, 2026-10-10: a sheet of keyboard shortcuts; name at the start, Kbd keycaps (or quiet keys) at the end, 36 rows with dividers, a muted group title; ChatGPT's ⌘/ dialog and Figma's shortcuts panel |
| [Search field](search-field.md) | in review | New, 2026-10-10: Input with the search glyph; a clear action (InputAction's box, out of the Tab order) once there is text, Escape to clear, a Kbd shortcut hint while empty; ChatGPT, Notion and Figma captured |
| [Meter](meter.md) | accepted | New, 2026-10-10: a value in a range; ChatGPT's usage row (label, 4, description and value, 5, bar) over Progress's bar; neutral, warning, danger |
| [Box model](box-model.md) | in review | New, 2026-10-12: a read-only margin / border / padding / size diagram from Figma Dev Mode's layer properties (32 rings, 24 rows, value chips on lines, a dashed size box), info or neutral tone |
| [Editable text](editable-text.md) | accepted | New, 2026-10-11: text that becomes a field in place (Figma layer rename, Notion titles); 8 side padding in both states so nothing moves, 1px inset field-focus outline on the selection surface |
| [Timeline](timeline.md) | accepted | New, 2026-10-11: events on one 1px line with dot, icon or avatar markers in a 24 column, text 36 from its start (Figma version history, Notion page updates) |
| [Description list](description-list.md) | accepted | New, 2026-10-10: labelled values in a native dl; columns after Notion's page properties (160 term column, 34 rows), justified / divided / framed after ChatGPT's settings card in Table's frame |
| [Toggle group](toggle-group.md) | accepted | New, 2026-10-10: a set of toggle Buttons the group keeps (any number, or at most one); joined as ButtonGroup (soft, outline) or apart as a Toolbar group (ghost); one Tab stop, arrow keys |
| [Empty state](empty-state.md) | accepted | New, 2026-10-10: a centred icon tile, title, muted line and actions; md after ChatGPT's Trash and Sites (48 tile, 18/24 title, 16 / 8 / 16), sm after Notion's Library (40 tile, 14/20 title, 12 / 2 / 8) |
| [Toggletip](toggletip.md) | in review | New, 2026-10-09: a 16 info or help mark in a box one text line tall (stroke-control ink, the ghost Button's plates); Tooltip's surface for the note; previews on hover and focus (ChatGPT, Notion), a press pins it (Fluent, Spectrum, Carbon) |
| [Overlay behavior](overlay.md) | accepted | 2026-09-27: anchoring, dismissal, focus and keyboard for Popover, Menu and Tooltip; ChatGPT menu captured, nine design systems read |
| [Tooltip](tooltip.md) | accepted | First pass: 10px radius and 10px text sides (owner, after ChatGPT), 12px-blur lift; ChatGPT, Notion captured, Figma read |
| [Badge group](badge-group.md) | accepted | First pass: badge-shaped +N overflow at the group size, overlay at content width; Primer is the reference |
| [Count](count.md) | accepted | Own element, not a Badge: inline 16 / 20 scale, Indicator count formatting, Nav and Tabs trailing slot |
| [Badge](badge.md) | accepted | Pass 2: 16 / 20 / 24 scale (md 20 default), neutral ink, 2px dismiss gap, uppercase removed. 22 reference captures, 80 Area captures, validator |
| [Icon set](icons.md) | research | Stroke census across Fluent, ChatGPT, Notion, Figma and Cursor; construction proposal and 12-icon pilot |
| [Type ramp](typography.md) | research | Product type census; proposal for six sizes, a lighter weight policy and two text colors |

Every component now has a spec. The decisions recorded before the evidence process were
moved into the specs; [prior decisions](PRIOR_DECISIONS.md) maps where each went. The
cross-family findings are in the [cohesion audit](../research/cohesion-audit.md).
