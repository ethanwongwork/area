/** Documentation entries: pickers, colour and inspector parts. Format and rules: ../documentation.mjs and the area-component-docs skill. */
export default {
  "color-swatch": {
    // Spec: Job and boundaries, Peers.
    instead: [
      ["Letting someone choose one colour from a set", ["color-swatch-picker"], "Color swatch only displays; the picker adds radios, a selection ring and arrow keys."],
      ["Letting someone type or edit a colour", ["color-field", "color-picker"], "Color field is the hex field for inspector rows; Color picker is the full editor."],
      ["Naming a design token with its colour", ["token-row", "code"], "Code's swatch and Token row carry the token's name beside the colour."],
    ],
    // Spec: Variants, Owner decisions, Behavior and accessibility; source: ColorSwatch.tsx.
    practices: [
      ["Do", "Use sm in a field's leading icon slot, and md or lg where the swatch stands alone."],
      ["Do", "Put it in a menu row's or Custom select's icon slot to show what an option paints: there it is 14 in the 16 box (Figma's colour-row chit), so it reads the size of the glyphs beside it."],
      ["Do", "Pass any CSS colour string; a translucent colour shows over the checker, so its alpha is visible."],
      ["Do", "Give it a contextual aria-label (\"Brand primary\") when the default \"Color <value>\" says less than its context."],
      ["Do", "Set aria-hidden when a neighbouring label already names the colour, as Color field and Color swatch picker do."],
      ["Don't", "Use a swatch as a button or toggle: it has no hover, focus or selected state. Use Color swatch picker."],
      ["Don't", "Expect the colour to follow the theme: it is document data and stays as given; only the checker follows the theme."],
    ],
    // Spec: Anatomy and Decisions (edge, checker, radius).
    parts: {
      root: "The swatch: owns its size (sm, md, lg; the icon box less 2 in a menu or Custom select icon slot), the corner at a fifth of its side, the checker under the colour and the translucent ring over it.",
    },
    // Spec: Behavior and accessibility; source: ColorSwatch.tsx.
    aria: [
      ["role=\"img\"", "Always: the swatch is one image."],
      ["aria-label", "\"Color <value>\" by default; pass your own name where the context gives one."],
      ["aria-hidden", "Pass it when a neighbouring label already names the colour."],
    ],
  },

  "color-swatch-picker": {
    // Spec: Job and boundaries.
    instead: [
      ["Showing a colour without choosing it", ["color-swatch"], "Color swatch is the passive preview this picker draws in each cell."],
      ["Editing any colour freely", ["color-picker", "color-field"], "This picker chooses only among the colours you give it."],
      ["Choosing one option that isn't a colour", ["radio", "segmented", "list-box"], "They name their options with text; this one shows them as colours."],
    ],
    // Spec: Variants, Owner decisions, Behavior and accessibility; source: ColorSwatchPicker.tsx JSDoc.
    practices: [
      ["Do", "Give every item a human-readable label (\"Blue\"): it is the colour's only accessible name."],
      ["Do", "Name the group with label, and set name so a form submits the chosen colour."],
      ["Do", "Use grid with columns for a palette, row for a short wrapping set, and palette for a contiguous grid that fills its width."],
      ["Do", "Set value or defaultValue when a colour must start chosen; with neither, nothing is chosen, so required can fail."],
      ["Don't", "Repeat a value: each value is both the submitted value and the swatch's paint, and must be unique."],
      ["Don't", "Use colours that change with the theme for items: swatches are document colour data."],
    ],
    // Spec: Anatomy.
    parts: {
      root: "The radiogroup: lays out cells in columns, a wrapping row, or a contiguous palette; owns the arrow keys.",
      cell: "One option: a label around a hidden native radio and a Color swatch; owns hover, the selection ring and the focus ring.",
    },
    // Source: ColorSwatchPicker.tsx move(); native radio.
    keyboard: [
      ["Tab", "Moves focus into the group, to the checked colour (a native radio group)."],
      ["Left or Right", "Moves to the previous or next enabled colour and selects it, wrapping; mirrored in RTL."],
      ["Up or Down", "In grid and palette, moves to the row above or below in the same column and selects it, wrapping; in row, steps like Left and Right."],
      ["Home or End", "Selects the first or last enabled colour."],
      ["Space", "Selects the focused colour."],
    ],
    aria: [
      ["role=\"radiogroup\"", "On the root, named by aria-label, else label."],
      ["aria-label", "On each radio, from its item's label."],
      ["aria-disabled", "On the group when it is disabled; each radio is natively disabled too."],
    ],
  },

  "color-picker": {
    // Spec: Job and boundaries.
    instead: [
      ["A single colour value in an inspector row", ["color-field"], "Color field is the one-line hex and opacity field; the picker is the full editor."],
      ["Choosing among a fixed set of colours", ["color-swatch-picker"], "A fixed, labelled set needs only radios, not an editor."],
      ["Showing a colour without editing it", ["color-swatch"], "Color swatch is the passive preview."],
    ],
    // Spec: Variants, Second pass, Decisions, Excluded; source: ColorPicker.tsx JSDoc.
    practices: [
      ["Do", "Name it with aria-label or label (\"Fill colour\"): the name prefixes every inner control, as \"Fill colour hue\"."],
      ["Do", "Use variant=\"plain\" inside a Popover or Panel that already draws the surface; surface is for a picker standing alone."],
      ["Do", "Set alpha={false} for colours that cannot be translucent, such as a theme colour; values then stay six-digit."],
      ["Do", "Offer several views (spectrum, grid, sliders) when people choose in different ways; more than one adds a switcher."],
      ["Do", "Pass contrast with the background a text colour will sit on, so the ratio and the failing band show while choosing."],
      ["Do", "Leave saved colours off unless people reuse colours; pass swatches to show them and onAddSwatch to let people save the current colour (its button disables once that colour is saved)."],
      ["Don't", "Rely on the eyedropper: it shows only where the browser has the EyeDropper API."],
      ["Don't", "Use it for gradients, images or blend modes: it edits one solid colour, and those need their own editors."],
    ],
    // Spec: Anatomy, Second pass; source: ColorPicker.tsx.
    parts: {
      root: "The group: the floating surface (or plain), ten rows wide; owns the value, the model, the view and form reset.",
      header: "An optional row above the editor for a title, tabs or a close action, divided from it by a rule.",
      body: "The editor's column: the view switcher, the contrast row, the area or grid, the controls row and the value row.",
      views: "A small full-width Segmented that switches between spectrum, grid and sliders; shown only with more than one view.",
      contrast: "The contrast row: the pair swatch, the ratio and a pass or fail mark with the level.",
      "contrast-pair": "The current colour over the background it is checked against.",
      "contrast-ratio": "The ratio as n.nn : 1; a status named with the ratio, the background and pass or fail.",
      "contrast-unit": "The \" : 1\" after the ratio's number.",
      "contrast-level": "A check or a cross with AA or AAA, in the danger ink when the colour fails.",
      area: "The spectrum: saturation across, brightness up. Drag it, or focus it and use the arrows; it stays left to right in every script.",
      band: "With contrast set, the region of the area that fails, dotted between two edges.",
      "band-region": "The dotted fill of the failing region.",
      "band-edge": "The two lines that bound the failing region; either can be absent.",
      thumb: "The current-value marker on the area and the tracks: a white ring around the colour.",
      channel: "The area's hidden range input: its one Tab stop, a 2D slider for the keys and assistive technology.",
      grid: "The grid view: a contiguous palette (Color swatch picker), the Area palette by default.",
      controls: "The row under the area: the eyedropper, the tracks and the preview.",
      tracks: "The column of tracks: hue and opacity in spectrum view, one per channel in sliders view.",
      slider: "A pill track: a native range input whose gradient shows the channel it sets.",
      hue: "The hue track.",
      alpha: "The opacity track over the checker; absent without alpha.",
      "channel-row": "In sliders view, one channel: its letter and its track.",
      "channel-label": "The channel's letter (R, G, B…); hidden from assistive technology, since the track is named.",
      preview: "With preview, the new colour over the original.",
      "preview-new": "The new colour, an image named \"New <hex>\".",
      "preview-original": "The original colour, a button that restores it; disabled while the colour is unchanged.",
      values: "The value row: the model select, then the fields.",
      model: "A small soft Select of Hex, RGB, CSS, HSL, HSB and OKLCH.",
      fields: "The joined soft fields for the current model, with opacity at the end.",
      "text-field": "The hex or CSS field: keeps a draft while typing and commits on Enter or blur; Escape restores.",
      opacity: "The opacity percentage field; absent without alpha and in the CSS model, whose text carries alpha.",
      note: "A status line when an OKLCH value is outside sRGB and the nearest colour with less chroma is shown.",
      swatches: "Opt-in (swatches, onAddSwatch): the saved colours under a rule, a heading and a Color swatch picker at the row's size, nine to a row.",
      heading: "The saved colours' label and, with onAddSwatch, the save button.",
    },
    // Source: ColorPicker.tsx areaKey(), DraftInput; native range inputs.
    keyboard: [
      ["Tab", "Moves through the picker's controls in order; the area is one Tab stop."],
      ["Left or Right", "On the area, lowers or raises saturation; on a track, steps its value."],
      ["Up or Down", "On the area, raises or lowers brightness; on a track, steps its value."],
      ["Shift", "Held with an arrow on the area, steps by 10 instead of 1."],
      ["PageUp or PageDown", "On the area, raises or lowers brightness by 10."],
      ["Enter", "In the hex or CSS field, commits the draft."],
      ["Escape", "In the hex or CSS field, restores the last value."],
    ],
    aria: [
      ["role=\"group\", aria-label", "On the root, from aria-label or label; the name prefixes every inner control's name."],
      ["aria-roledescription, aria-valuetext", "On the area's range input: \"2D slider\", with the saturation and brightness it holds."],
      ["aria-disabled", "On the group when disabled; every inner control is disabled too."],
      ["aria-pressed", "On the eyedropper Button while it samples."],
      ["role=\"status\"", "On the contrast ratio, and on the out-of-sRGB note."],
    ],
  },

  calendar: {
    // Spec: Job and boundaries, Excluded.
    instead: [
      ["A field that opens a calendar", ["date-picker", "date-range-picker"], "They pair a field with a Calendar in a popover; Calendar alone is the grid."],
      ["Choosing a time of day", ["time-field"], "Calendar chooses dates only."],
    ],
    // Spec: Variants, Owner decisions, Decisions; source: Calendar.tsx JSDoc.
    practices: [
      ["Do", "Pick selectionMode for the job: single for one date, range for a span, multiple for several separate dates."],
      ["Do", "Show two months (visibleMonths 2) when ranges often cross a month boundary."],
      ["Do", "Use caption=\"menus\" when the date is likely far from today, such as a birthday: the month and the year become menus that jump straight there; the arrows stay."],
      ["Do", "Set min, max and isDateUnavailable for bounds and booked days: they can't be chosen, and unavailable days are struck through."],
      ["Do", "Use plain inside a Popover, Panel or card that already draws a surface."],
      ["Do", "Set firstDayOfWeek and locale for the reader's region, and translate the navigation buttons' names with labels."],
      ["Do", "Set headingLevel so the month titles fit the page's outline."],
      ["Don't", "Paint one calendar's selection in the accent: selection is neutral unless the theme makes it the accent."],
      ["Don't", "Turn on fixedWeeks unless the height must stay fixed: a sixth row of next month's dates makes the grid busier."],
    ],
    // Spec: Anatomy, Third-pass additions; source: Calendar.tsx.
    parts: {
      root: "The group: the floating surface by default, or plain; holds one or two months, or the week strip.",
      months: "The months side by side, when visibleMonths is 2.",
      month: "One month: its header and its grid.",
      header: "The month's title row: previous at the start, the title centred, next at the end, each arrow's side on the outer day's.",
      title: "The month and year, a heading (h2 by default); the first month's is a polite live region. With menus the heading stays, hidden, to name the grid.",
      nav: "A slot the width of a small Button at each end of the header: previous on the first month, next on the last.",
      menus: "With caption=\"menus\", the month and the year as two ghost Custom selects in the title's place, bounded by min and max.",
      grid: "The month's table, role grid, labelled by its title.",
      weekday: "A weekday column header in the muted ink, with the full name as its abbr.",
      cell: "A day's grid cell: carries the selection for assistive technology and draws the range band.",
      day: "The day's button, named with the full date: the plate for hover and selection, and today's ring.",
      "day-number": "The day's number, in tabular figures.",
      "day-weekday": "In the week strip, the weekday above the number.",
      "day-month": "In the week strip, the short month under the number.",
      marker: "A dot for a day that carries something, toned per date; described as \"Has events\".",
      week: "The week strip: a one-row grid between previous and next week buttons.",
    },
    // Source: Calendar.tsx key(), choose().
    keyboard: [
      ["Tab", "Moves into the grid at one day; the grid is one Tab stop, and the navigation buttons are their own."],
      ["Left or Right", "Moves one day, mirrored in RTL; focus crosses into the next month and stops at min and max."],
      ["Up or Down", "Moves one week."],
      ["Home or End", "Moves to the first or last day of the week."],
      ["PageUp or PageDown", "Moves one month, in the week strip too."],
      ["Shift+PageUp or Shift+PageDown", "Moves one year."],
      ["Enter or Space", "Chooses the focused day; in range mode the first choice anchors the range and the second completes it."],
      ["Escape", "In range mode, drops an anchored first day."],
    ],
    aria: [
      ["role=\"group\", aria-label", "On the root; \"Calendar\" unless you name it."],
      ["role=\"grid\", aria-labelledby", "On each month's table, labelled by its title."],
      ["aria-multiselectable", "On the grid in range and multiple modes."],
      ["aria-selected", "On a chosen day's cell, and on every cell of a range."],
      ["aria-current", "\"date\" on today."],
      ["aria-disabled", "On days outside the bounds or unavailable, which stay focusable; on the root when disabled."],
      ["aria-live", "\"polite\" on the first month's title, so a month change is announced once."],
      ["aria-description", "\"Has events\" on a day with a marker."],
    ],
  },

  "list-box": {
    // Spec: Job and boundaries, Review note.
    instead: [
      ["A choice that opens from a field", ["select", "custom-select", "combobox"], "Their lists are popups; List box stays in the page."],
      ["Running a command", ["menu", "context-menu"], "Menu runs a command and closes; List box keeps one value chosen."],
      ["Several independent on and off choices", ["toggle-group", "checkbox"], "List box holds one value only."],
      ["Going to another page or view", ["nav"], "Nav moves somewhere; List box chooses a value."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; source: ListBox.tsx JSDoc.
    practices: [
      ["Do", "Name the List box with aria-label or aria-labelledby: the listbox has no name of its own."],
      ["Do", "Use list for text options, which take Menu's rows and check the chosen one; use grid for icons, swatches or samples."],
      ["Do", "Give an option without text a textValue, so typing reaches it, and an aria-label, so it is named."],
      ["Do", "Set selectionFollowsFocus when a preview beside the set should follow the keys."],
      ["Do", "Group options with ListBoxSection: its title names the group, and the arrows cross from one group to the next."],
      ["Don't", "Use it for several selections: it holds one value."],
      ["Don't", "Give two options the same value: the value is also the option's key."],
    ],
    // Spec: Anatomy, Decisions.
    parts: {
      root: "The listbox: one Tab stop for the whole set; owns the arrow keys, typing and the chosen value.",
      item: "An option: in a list, Menu's row with the check at its end; in a grid, a square cell holding your content.",
      section: "A named group of options, its heading above its options.",
      heading: "The group's title, in Menu's label style; it names the group.",
      options: "The section's options; in a grid, a grid of their own.",
    },
    // Spec: States, Decisions.
    states: {
      disabled: "The option dims and the arrow keys skip it; on the set, every option is disabled.",
      selected: "The chosen option: in a list, the active plate and the check; in a grid, the active plate.",
    },
    // Source: ListBox.tsx move().
    keyboard: [
      ["Tab", "Enters at the last focused option, else the chosen one, else the first; the next Tab leaves the set."],
      ["Up or Down", "Moves to the previous or next option; in a grid, to the nearest option in the row above or below, across sections."],
      ["Left or Right", "In a grid, moves to the previous or next option in reading order; mirrored in RTL."],
      ["Home or End", "Moves to the first or last option."],
      ["Enter or Space", "Chooses the focused option."],
      ["A or Z", "Any letter: typing a letter or a prefix jumps to the next option whose text starts with it."],
    ],
    aria: [
      ["role=\"listbox\"", "On the root."],
      ["aria-orientation", "\"vertical\" on a list; unset on a grid."],
      ["role=\"option\", aria-selected", "On each option; true on the chosen one."],
      ["aria-disabled", "On a disabled option, and on the root when the whole set is disabled."],
      ["role=\"group\", aria-labelledby", "On a section, labelled by its heading."],
      ["aria-label", "Pass one on the root (or aria-labelledby), and on an option whose content is not text."],
    ],
  },

  "property-list": {
    // Spec: Job and boundaries.
    instead: [
      ["Showing items that nest", ["tree-view"], "Property list is flat: like items in one order."],
      ["Offering commands", ["menu"], "Property list orders values; Menu runs actions."],
      ["Editing one property", ["panel"], "A PanelRow holds one property; Property list orders several of a kind."],
    ],
    // Spec: Decisions, Open questions; source: PropertyList.tsx JSDoc.
    practices: [
      ["Do", "Use it for like properties whose order matters: fills, strokes, effects, shadows."],
      ["Do", "Name the list (label) and each item by its content (\"00A797 fill\"): the handle and the move announcement read them."],
      ["Do", "Set onReorder to make rows movable; handles appear only with it and with two or more items."],
      ["Do", "Put visibility and remove buttons in actions, and set inactive on a hidden property: its value dims, its buttons don't."],
      ["Do", "Place it in a Panel, where it takes the panel's row and field gaps."],
      ["Don't", "Name items by position (\"Fill 2\"): positions change with every move."],
      ["Don't", "Nest lists or select several rows: nesting and multi-select are out of scope."],
    ],
    // Spec: Decisions; source: PropertyList.tsx.
    parts: {
      root: "The list: rows a row gap apart; owns the order, the drag, the drop line and the move announcement.",
      item: "One property: the handle (when reorderable), the value, then its actions.",
      handle: "A button with a grip in the side inset, shown on hover, focus or drag (always on touch); drag it or use the arrow keys.",
      value: "Your value editor (a Color field, a Select); it dims while the item is inactive.",
      actions: "Your icon buttons after the value, such as visibility and remove; the last ends on the row's action column.",
      indicator: "The drop line in the gap where a dragged row will land; not drawn beside the row's own place.",
    },
    // Spec: Decisions (drag, inactive).
    states: {
      dragging: "A row is being dragged: it stays in place, faded, while the drop line follows the pointer.",
      inactive: "The property is off: its value dims to half; its actions stay full strength so it can be turned back on.",
    },
    // Source: PropertyList.tsx keyMove().
    keyboard: [
      ["Tab", "Moves to a row's handle, then to its value and actions."],
      ["Up or Down", "On a handle, moves the row one place; focus stays on its handle and the move is announced."],
      ["Home or End", "On a handle, moves the row to the top or the bottom."],
      ["Escape", "During a pointer drag, cancels it and keeps the order."],
    ],
    aria: [
      ["aria-label", "On the list, from aria-label or label; on each handle, \"Reorder <label>, position n of m\"."],
      ["aria-describedby", "On a reorderable list: hidden instructions to use the arrow keys on a handle."],
      ["aria-live", "A polite hidden region announces each move (\"<label> moved to position n of m\")."],
    ],
  },

  panel: {
    // Spec: Job and boundaries.
    instead: [
      ["Presenting content on its own surface", ["card"], "Card presents content; Panel holds rows that act on something beside it."],
      ["A surface that floats over the page", ["popover", "dialog", "drawer"], "They overlay the page; a Panel stays beside its subject."],
      ["Ordering like properties in an inspector", ["property-list"], "Property list adds reordering; put it in a Panel section."],
    ],
    // Spec: Variants, Owner decisions, Decisions; source: primitives.tsx JSDoc.
    practices: [
      ["Do", "Use sm for Figma-density inspectors and md (default) elsewhere, with the controls inside at the panel's tier."],
      ["Do", "Group rows in PanelSections with headings; make long sections collapsible, with a summary for when they're closed."],
      ["Do", "Use PanelRow for a caption above one or two equal control columns, and PanelStack for a control that needs the whole width."],
      ["Do", "Set actionColumn when some rows have a trailing icon button, so every row's controls end at the same edge."],
      ["Do", "Use flush for a panel docked to the window's edge, and resizable on the edge that faces the content."],
      ["Do", "Keep one field style per panel: every field soft, Selects included."],
      ["Don't", "Float a Panel over the page: it has no overlay lift. Use Popover or Dialog."],
      ["Don't", "Put the panel's main action in its last row: use footer, which stays pinned outside the scroll."],
    ],
    // Spec: Anatomy, Decisions; source: primitives.tsx Panel, PanelSection, PanelRow, PanelStack.
    parts: {
      root: "The surface, 240 wide by default (--area-panel-inline-size), with its edge, corner and resting shadow; flush drops them.",
      resize: "With resizable, the separator on one edge: drag it, or focus it and use the arrow keys.",
      bar: "The header row: the title and an action at its end, with a rule beneath unless bareBar.",
      title: "The panel's title, a heading (h2 by default) that names the panel region.",
      body: "A Scroll area between the bar and the footer, holding the sections and rows, inset on every side.",
      section: "A group of rows, divided from the next by a full-width rule.",
      heading: "The section's heading row: its text and, at the end, its actions.",
      "heading-text": "The section's heading element (h3 by default).",
      actions: "Icon buttons at the end of a section heading, such as add or visibility.",
      toggle: "In a collapsible section, the heading's disclosure button.",
      "toggle-text": "The heading's text inside the toggle.",
      chevron: "The toggle's chevron in the side inset; shown on hover or focus, turned while collapsed.",
      summary: "Shown in the heading while the section is collapsed, such as colour chips and a count.",
      rows: "A collapsible section's rows, hidden while it is collapsed.",
      row: "A PanelRow: a caption above one or two equal control columns, and an optional trailing action square.",
      "row-label": "A row's caption, muted; give two to caption each column.",
      "row-controls": "The row's control columns: one control spans both, two share them equally.",
      "row-action": "The trailing square for one icon button.",
      stack: "A PanelStack: a label above a control that needs the whole width.",
      footer: "Pinned below the body, outside its scroll, with a rule above unless bareFooter.",
    },
    // Source: primitives.tsx (data-collapsed, data-resizable, data-resizing).
    states: {
      collapsed: "A collapsible section is closed: its rows hide, the chevron turns and the summary shows.",
      resizable: "The panel has a resize separator on one edge.",
      resizing: "The separator is being dragged.",
    },
    // Source: primitives.tsx separator onKeyDown; native button.
    keyboard: [
      ["Enter or Space", "On a collapsible heading, opens or closes its section."],
      ["Left or Right", "On the separator, moves the edge by a small step (Shift for a larger one)."],
      ["Home or End", "On the separator, sets the minimum or maximum width."],
      ["Escape", "During a drag, puts the width back where it started."],
    ],
    aria: [
      ["role=\"region\", aria-labelledby", "When the panel has a title and no aria-label: the title names the region."],
      ["aria-label", "Names the region instead of the title."],
      ["aria-expanded, aria-controls", "On a collapsible section's toggle, pointing at its rows."],
      ["role=\"separator\", aria-valuenow", "On the resize separator, with its minimum and maximum and the width in pixels as its value text."],
      ["role=\"group\", aria-labelledby", "On a PanelRow, labelled by its captions."],
    ],
  },

  "box-model": {
    // Spec: Job and boundaries.
    instead: [
      ["Editing padding or corner radius", ["box-field"], "Box field edits them; Box model only shows them."],
      ["Listing values as labelled rows", ["description-list"], "Description list reads value by value; Box model draws them as one diagram."],
    ],
    // Spec: Variants, Behavior and accessibility; source: BoxModel.tsx JSDoc.
    practices: [
      ["Do", "Pass the values you know: margin, border and padding per side, the corner radii and the content's width and height."],
      ["Do", "Give per-side values in CSS order (top, right, bottom, left), or as named sides."],
      ["Do", "Use info (default) for the measuring blue, or neutral for a greyscale diagram."],
      ["Do", "Add a caption such as \"border-box\" to note the sizing model."],
      ["Don't", "Expect the drawn numbers to be read one by one: the diagram is one image, named by a summary of its values."],
      ["Don't", "Use it as a ruler or an overlay on a canvas: it is a fixed diagram for an inspector."],
    ],
    // Spec: Anatomy, Decisions; source: BoxModel.tsx.
    parts: {
      root: "The margin box: a grey ground inside a solid edge at the container corner.",
      label: "A box's name (Margin, Border, Padding) at its top start; rename them with labels.",
      side: "A box's value zone on one side: top, right, bottom or left.",
      value: "A drawn number: spacing in the tone's ink, border widths in the default ink, the size strong; a missing value shows a dash.",
      border: "The border box on the surface, with its border widths and corner radii.",
      corner: "A corner radius, set on its corner's diagonal.",
      padding: "The padding box, filled in the tone.",
      content: "The centre box with the content's width × height.",
      caption: "A note at the bottom end of the margin, such as \"border-box\".",
    },
    aria: [
      ["role=\"img\", aria-label", "Always: named from the values given, as \"Margin 24, border 1, padding 16, radius 8, size 608 × 184\"."],
    ],
  },

  "token-row": {
    // Spec: Job and boundaries, Excluded.
    instead: [
      ["Naming a token in running text", ["code"], "Code is the inline token; Token row widens it to a row."],
      ["Editable fills that reorder", ["property-list"], "Token row is read-only."],
      ["A labelled value that isn't a token", ["description-list"], "Description list pairs a label with its value."],
    ],
    // Spec: Variants, Decisions, Excluded; source: TokenRow.tsx JSDoc.
    practices: [
      ["Do", "Pass swatch for a colour token; other tokens (spacing, radius, numbers) are the plain token."],
      ["Do", "Show the resolved value when a developer will copy it."],
      ["Do", "Set copyable when a click should copy; copyText overrides what is copied (else the value, else the name)."],
      ["Do", "Use outline to keep only the token's edge, without its fill."],
      ["Do", "Stack rows in an inspector column: each fills its container and narrows with it."],
      ["Don't", "Add a detach or go-to-variable action: Token row only names and copies."],
      ["Don't", "Show an alias chain (a token pointing at a token) in one row."],
    ],
    // Spec: Anatomy; source: TokenRow.tsx.
    parts: {
      root: "The row: Code's token plate (its ground, edge, corner and type) widened to the row, the name at its start; a button when copyable.",
      value: "The token's resolved value, muted and in tabular figures, at the row's end.",
    },
    // Source: TokenRow.tsx (a native button when copyable).
    keyboard: [
      ["Tab", "When copyable, moves focus to the row."],
      ["Enter or Space", "When copyable, copies; \"Copied\" is announced once."],
    ],
    aria: [
      ["aria-label", "When copyable: \"Copy <name>, <value>\" unless you name it."],
      ["aria-live", "When copyable, a polite hidden region says copiedLabel (\"Copied\") after a copy."],
    ],
  },

  "asset-row": {
    // Spec: Job and boundaries.
    instead: [
      ["A file being uploaded, with its progress", ["file-upload"], "File upload's rows show progress, status, retry and remove."],
      ["Naming a design token", ["token-row"], "Token row shows a token's name and value."],
      ["A command in a list", ["menu"], "A Menu row runs something; an Asset row lists an asset."],
    ],
    // Spec: Variants, Decisions (action), Behavior and accessibility; source: AssetRow.tsx JSDoc.
    practices: [
      ["Do", "Give a detail line with the format and size (\"SVG · 24 × 24\")."],
      ["Do", "Pass an image URL to fill the preview, or an icon or vector element to centre in it."],
      ["Do", "Leave previewAlt empty when the name says what the image is; set it when the image adds something."],
      ["Do", "Put a download or export button in actions, with an accessible name."],
      ["Don't", "Hide the action until hover: it stays visible at rest, so it is never hover-only."],
      ["Don't", "Use it for a file being uploaded: that is File upload's row."],
    ],
    // Spec: Anatomy, Decisions; source: AssetRow.tsx, asset-row.css.
    parts: {
      root: "The row: the preview inset on every side, the text beside it and the actions at the end.",
      preview: "The preview well, with a light ring: an image fills it; an icon or vector sits centred.",
      text: "The name over the detail line; both truncate with an ellipsis.",
      name: "The asset's name, in the strong weight.",
      meta: "The detail line, muted.",
      actions: "Your trailing buttons, such as download.",
    },
    aria: [
      ["alt", "On an image preview, from previewAlt; empty by default, since the name says what it is."],
      ["aria-hidden", "On the preview well when it holds an element rather than an image."],
    ],
  },

  "preview-frame": {
    // Spec: Job and boundaries.
    instead: [
      ["A picture in a card, cropped to cover", ["card"], "Card's media crops to fill; Preview frame shows the whole asset."],
      ["A thumbnail in a list row", ["asset-row"], "Asset row's preview identifies an asset; the frame shows it large."],
      ["A colour mark at text size", ["color-swatch"], "Color swatch sits inline; the frame fills an inspector's column."],
    ],
    // Spec: Variants, Excluded, Decisions (content fit), Behavior and accessibility.
    practices: [
      ["Do", "Put it at the head of an inspector for the one selected thing: an icon, an image or a colour."],
      ["Do", "Pick the aspect for the content: square for an icon or component, landscape for a layout, wide for a colour."],
      ["Do", "Use ground=\"checker\" for an asset with transparency, and subtle for a grey well that matches Box model."],
      ["Do", "Give it a label when its content isn't already named; an img with its own alt needs none."],
      ["Don't", "Expect small content to be enlarged: images are contained and only scaled down, and an icon keeps its own size."],
      ["Don't", "Use it as an image viewer or a selectable tile: it has no zoom, pan, hover or selection."],
    ],
    // Spec: Anatomy, Decisions; source: PreviewFrame.tsx.
    parts: {
      root: "The frame: fills its column at a fixed aspect, rounded at the container corner, with its content centred and inset.",
      paint: "With color, the layer that fills the frame with that colour, over the checker so its alpha shows.",
    },
    aria: [
      ["role=\"img\", aria-label", "With label: the frame is one image named by it, and its content is presentational."],
    ],
  },

  "file-upload": {
    // Spec: Job and boundaries.
    instead: [
      ["An image attached to a message before it is sent", ["attachment"], "Attachment is the composer's thumbnail; File upload is a standalone zone."],
      ["Listing a layer's exportable assets", ["asset-row"], "Asset row is a read-only row; File upload's rows follow an upload."],
    ],
    // Spec: Variants, Behavior and accessibility; source: FileUpload.tsx JSDoc.
    practices: [
      ["Do", "Set accept, maxSize and multiple: drops are checked like the picker, and misses come back through onReject with the reason."],
      ["Do", "Put the types and size allowed in hint; it also describes the upload button."],
      ["Do", "Show each file as a FileUploadItem in a FileUploadList, reporting progress, then complete or an error with retry."],
      ["Do", "Set name when a form should submit the chosen files."],
      ["Do", "Set invalid to give the zone the field's error edge when a choice fails your validation."],
      ["Don't", "Expect it to upload: you send the files and report each one's progress."],
      ["Don't", "Rely on drag and drop alone: the zone's button is how keyboard and screen-reader users choose files."],
    ],
    // Spec: Anatomy, Decisions; source: FileUpload.tsx.
    parts: {
      root: "The zone: the field's edge and corner around a centred column; a click anywhere opens the picker, and it takes dropped files.",
      icon: "The upload glyph, in a tile at the top.",
      text: "The prompt and the hint.",
      prompt: "The upload button followed by \"or drag and drop\" (labels.drag).",
      action: "\"Click to upload\" (labels.action): a button drawn as a Link, the zone's keyboard and assistive-technology handle.",
      hint: "The line under the prompt, such as the types and size allowed; it describes the button.",
      input: "The hidden native file input, opened by the zone and the button; it carries accept, multiple and name.",
    },
    // Spec: States; source: FileUpload.tsx.
    states: {
      dragging: "Files are over the zone: its edge takes the selection colour and a plate fills it.",
      invalid: "The edge turns the field's invalid colour, and the button carries aria-invalid.",
      disabled: "The zone dims; the picker doesn't open and drops are ignored.",
    },
    // Source: FileUpload.tsx (a native button; the input is out of the Tab order).
    keyboard: [
      ["Tab", "Moves focus to the upload button; the file input is not a Tab stop."],
      ["Enter or Space", "Opens the file picker."],
    ],
    aria: [
      ["aria-describedby", "On the upload button, pointing at the hint when there is one."],
      ["aria-invalid", "On the upload button while invalid."],
      ["aria-hidden", "On the hidden file input and the icon."],
      ["role=\"status\"", "On each FileUploadItem's status, so uploading, complete or the error is announced."],
    ],
  },

  "scroll-area": {
    // Spec: Job and boundaries.
    instead: [
      ["Jumping to the end of a growing list", ["scroll-to-latest"], "Scroll to latest is a button over a scroller; Scroll area is the scroller."],
      ["Paged horizontal content with its own controls", ["card"], "Card's carousel pages through items; Scroll area only scrolls."],
    ],
    // Spec: Variants, Behavior and accessibility; source: ScrollArea.tsx JSDoc.
    practices: [
      ["Do", "Size the region on the root (block-size or max-block-size); the content scrolls inside it."],
      ["Do", "Pass viewportProps={{ tabIndex: -1 }} when the content has its own Tab stops, so the scroller isn't an extra one."],
      ["Do", "Name the scroller with viewportProps' aria-label when it is a region of its own."],
      ["Do", "Keep hover (default) for panels and lists; use scroll for a bar only while scrolling, and always when overflow must be obvious."],
      ["Do", "Use viewportRef to scroll from code or follow new content."],
      ["Don't", "Use it for a list long enough to need virtualising: it renders every child."],
      ["Don't", "Look for a size, a track fill or arrow buttons: the bar is one quiet thumb."],
    ],
    // Spec: Anatomy, Decisions.
    parts: {
      root: "The region: you size it; it clips its content and positions the bars.",
      viewport: "The native scroller with its platform bar hidden; a Tab stop by default, so keys scroll it.",
      content: "The content wrapper, watched so the bars follow its size.",
      scrollbar: "An overlay track at the end edge (bottom for horizontal), one per overflowing axis; press it to bring the thumb to the pointer.",
      thumb: "The round thumb, sized to the visible share of the content; drag it to scroll.",
    },
    // Spec: States.
    states: {
      scrolling: "The bar shows while scrolling and hides shortly after the last scroll (scrollHideDelay).",
      "overflow-x": "The content is wider than the region, so a horizontal bar exists.",
      "overflow-y": "The content is taller than the region, so a vertical bar exists.",
    },
    // Spec: Behavior and accessibility (the native scroller's keys).
    keyboard: [
      ["Tab", "Moves focus to the scroller, unless viewportProps sets tabIndex -1."],
      ["Up or Down", "Scrolls the focused region a step."],
      ["Left or Right", "Scrolls a region that overflows sideways."],
      ["PageUp or PageDown", "Scrolls the focused region by a page."],
    ],
    aria: [
      ["aria-hidden", "On the overlay bars: they repeat what the native scroller exposes."],
      ["tabindex", "0 on the scroller by default; pass -1 through viewportProps when the content has its own Tab stops."],
      ["aria-label", "Pass it through viewportProps when the scroller is a region of its own."],
    ],
  },
};
