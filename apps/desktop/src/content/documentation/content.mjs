/** Documentation entries: surfaces, content, files, articles and media. Format and rules: ../documentation.mjs and the area-component-docs skill. */
export default {
  surface: {
    // Spec: Job and boundaries.
    instead: [
      ["One piece of content with media, a title, a description or a link", ["card"], "Card has those parts; Surface is the plain region that holds cards and controls."],
      ["Settings for the current selection, with a bar and sections", ["panel"], "Panel is the inspector region; Surface has no bar."],
      ["Floating content tied to a trigger", ["popover", "menu"], "Floating surfaces have their own shadow and dismissal; Surface sits in the layout."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; Surface.tsx JSDoc.
    practices: [
      ["Do", "Use surface for a raised region on the page, soft for a well inside one, and plain to group children without paint."],
      ["Do", "Read soft as what other systems call subtle, sunken or a well, and Surface as their Paper, Box or View."],
      ["Do", "Nest Surfaces rather than drawing your own boxes, so each corner stays concentric with the one around it."],
      ["Do", "Put a Surface straight inside a Card or Panel when it needs a region of its own; it takes their corner less their inset."],
      ["Do", "Lay out a Surface's content with Stack, choosing the gap by role."],
      ["Do", "Give a Surface a role and a name when it is a region a reader navigates to."],
      ["Don't", "Nest more than three layers; a fourth level is a floating surface such as a Menu or Dialog."],
      ["Don't", "Add your own border or shadow to a nested Surface: it already draws its one edge."],
    ],
    // Manifest: no elements.
    parts: {
      root: "The layer: owns its corner, inset, fill, edge and shadow, and the ground its controls step from.",
    },
    aria: [],
  },

  stack: {
    // Spec: Job and boundaries.
    instead: [
      ["Buttons that act as one control with shared edges", ["button-group"], "Button group joins the buttons; Stack only spaces them."],
      ["A bar of tools with arrow-key movement between them", ["toolbar"], "Toolbar owns the keyboard; Stack changes layout only."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; Stack.tsx JSDoc.
    practices: [
      ["Do", "Choose the gap by role: related for parts of one thing, group for members of a set, section for parts of a page."],
      ["Do", "Use spread for a row with a title at one end and its action at the other."],
      ["Do", "Use wrap for rows of chips or badges that may run past the width."],
      ["Do", "Give a Stack a role such as list when its children form one."],
      ["Don't", "Add margins to a Stack's children; the gap is the spacing."],
      ["Don't", "Use a section gap inside a small Surface; it stops at the Surface's inset."],
    ],
    // Manifest: no elements.
    parts: {
      root: "The row or column: owns its direction, gap, cross-axis alignment and wrapping.",
    },
    aria: [],
  },

  card: {
    // Spec: Job and boundaries.
    instead: [
      ["Controls that act on something else, such as an inspector's settings", ["panel"], "Card presents one piece of content; Panel hosts controls for the selection."],
      ["Interrupting the reader to confirm or decide", ["dialog", "confirm-dialog"], "A Card sits in the flow and never blocks the page."],
      ["A floating surface tied to a trigger", ["popover", "hover-card"], "Card is placed in the layout, not anchored to a control."],
      ["Rows of the same fields to compare", ["table", "description-list"], "A Card per row hides the columns a reader scans."],
    ],
    // Spec: Variants, Owner decisions, Behavior and accessibility; source: primitives.tsx Card JSDoc.
    practices: [
      ["Do", "Use vertical by default, horizontal for media beside text, thumbnail for lists of cards and immersive when the picture carries the card."],
      ["Do", "Make a whole card one link with CardLink inside CardTitle; the title becomes the link's name."],
      ["Do", "Set CardTitle's level so the card's heading fits the page outline."],
      ["Do", "Use size for the corner and inset only, and size a card nested in another one step down."],
      ["Do", "Name a CardCarousel with aria-label, and pair it with previous and next Buttons in the header."],
      ["Don't", "Put many actions in a linked card: keep them few, in the header action, footer or a reveal overlay."],
      ["Don't", "Build a video, weather or plan card as a new variant; compose it from Card's slots as a template."],
      ["Don't", "Rely on selected alone for meaning: set aria-selected or aria-pressed on the element that owns the choice."],
    ],
    // Spec: Anatomy; source: primitives.tsx.
    parts: {
      root: "The surface: owns the edge, corner, inset and resting shadow; size sets the corner and inset, layout arranges media and content.",
      media: "The picture slot, inset from the edge with a corner that follows the card's; bleed runs it flush on the sides it touches, well recesses it for a composition.",
      overlay: "Controls pinned to a corner of the media or the card; reveal hides them until the card is hovered or holds focus.",
      content: "The text column: pads the title so its cap sits as far from the top as from the side.",
      header: "A title row: the heading beside a trailing action, one control tall.",
      heading: "The header's text group: the title and description.",
      "header-action": "A Badge, icon Button or small icon centred on the title's first line; a Button reaches the inset in the corner.",
      title: "The card's heading, h3 unless you set level; trimmed to its cap.",
      description: "Muted supporting text under the title.",
      value: "A widget's leading figure, such as a temperature or price, with equal-width digits.",
      list: "A short list of points, each led by a 16 icon.",
      link: "The anchor inside the title whose hit area covers the whole card; Buttons elsewhere stay above it.",
      action: "A text link in the card that draws Link's underline.",
      carousel: "A row of frameless items that scrolls sideways with scroll snap, about a third of the row each with the next one showing.",
      footer: "The last row, usually Buttons, reaching the inset on the sides and bottom.",
    },
    // Spec: Review note 2026-10-15; source: CardProps.selected.
    states: {
      selected: "The chosen card of a set: a 2-wide selection stroke inside its edge, so nothing moves.",
    },
    // Spec: Behavior and accessibility; native anchor and focusable scroller.
    keyboard: [
      ["Tab", "Moves to the card's link, then to each Button in the card as its own stop, in DOM order. A reveal overlay shows while focus is inside."],
      ["Enter", "Follows the card's link."],
      ["Left or Right", "Scroll a focused carousel; it is a tab stop of its own."],
    ],
    aria: [
      ["aria-label", "Required on CardCarousel: it names the scrolling list."],
      ["aria-selected, aria-pressed", "Yours to set on the element that owns a selected card's choice; Card sets only data-selected."],
    ],
  },

  table: {
    // Spec: Job and boundaries.
    instead: [
      ["Labelled values about one subject", ["description-list", "property-list"], "A two-column table of terms and values reads better as a list of pairs."],
      ["A few items that each carry media and actions", ["card"], "Table compares fields across rows; a Card presents one piece of content."],
    ],
    // Spec: Variants, Behavior and accessibility, Feedback log; source: primitives.tsx Table JSDoc.
    practices: [
      ["Do", "Use TableHeaderCell for column headings: it sets scope=\"col\" for you."],
      ["Do", "Mark number columns numeric on both the cells and the heading, so digits line up at the end."],
      ["Do", "Make a row clickable with one TableLink and set interactive, so the hover plate and the click agree."],
      ["Do", "Name a table with aria-label or aria-labelledby; a wide one scrolls in a region that takes that name."],
      ["Do", "Use striped for long, wide rows, and columnDividers for dense comparisons."],
      ["Don't", "Set interactive on a table whose rows do nothing: the hover plate promises a click."],
      ["Don't", "Wrap Table in another table wrapper: it draws its own, and the edge doubles."],
      ["Don't", "Rely on data-selected alone: put the selection state on the row's Checkbox."],
    ],
    // Spec: Anatomy; source: TableCell, TableLink.
    parts: {
      root: "A native table inside a scrolling wrapper that draws the frame and corner; size sets the cells' block inset, flush drops the frame.",
      cell: "A td or th; numeric aligns it to the end in tabular figures, fit keeps it as narrow as its content without wrapping.",
      link: "A link stretched over its row, so the whole row is one target; other controls in the row sit above it and the row shows its focus.",
    },
    // Spec: Behavior and accessibility; source: Table overflow wrapper, TableLink.
    keyboard: [
      ["Tab", "Moves to each row's link and the controls in its cells; a wide table's scrolling wrapper is a stop of its own."],
      ["Left or Right", "Scroll a focused wrapper sideways."],
      ["Enter", "Follows a row's link."],
    ],
    aria: [
      ["scope", "col on every TableHeaderCell by default."],
      ["aria-sort", "Yours to set on a sortable column's heading, with a Button inside it."],
      ["role=\"region\", tabindex", "On the wrapper only while the table overflows, named from the table's aria-label or aria-labelledby."],
      ["aria-busy", "Yours to set while rows load, with Skeleton cells."],
    ],
  },

  "description-list": {
    // Spec: Job and boundaries.
    instead: [
      ["Records that share columns, to compare across rows", ["table"], "A description list describes one subject; a Table lines many up."],
      ["Properties a reader edits in place, with controls in each row", ["property-list"], "Description list shows values; Property list hosts the controls."],
      ["A subject's summary with a title and media, beside an article", ["infobox"], "Infobox adds a title, media and sections around its facts."],
    ],
    // Spec: Variants, Show more, Behavior and accessibility; source: DescriptionList.tsx JSDoc.
    practices: [
      ["Do", "Use columns for a page's properties, with terms in a fixed column, and justified for settings-style facts with the value at the row's end."],
      ["Do", "Keep terms short nouns (Status, Owner); the value can be text, a Badge, a person or a Link."],
      ["Do", "Set visibleCount on long lists so only the first rows show, with a Show more button after them."],
      ["Do", "Use divided and framed together when the list stands alone, as a settings card."],
      ["Don't", "Put an editable control in place of a value unless the value is a field; the list shows values, it is not a form."],
      ["Don't", "Give the term icon meaning of its own: it is decorative and hidden from assistive tech."],
    ],
    // Spec: Anatomy, Show more; source: DescriptionList.tsx.
    parts: {
      root: "A native dl: layout places terms in a column or at the row's start, divided rules the rows, framed draws Table's frame.",
      item: "One row: a div grouping a term with its value. Rows past visibleCount stay in the document, hidden, so order holds.",
      term: "The dt, in the muted ink; it wraps inside its column.",
      icon: "A 16 decorative icon before the term; the Show more button puts its chevron here, so its label lines up with the term names.",
      value: "The dd, in the default ink; any content, wrapping when long.",
      more: "The Show more button after the list, outside the dl and below any frame.",
      "more-label": "The button's text: \"Show 3 more\" while rows are hidden, \"Show less\" once every row shows.",
    },
    // Source: DescriptionList.tsx (native button).
    keyboard: [
      ["Tab", "Moves to the Show more button and to links or buttons in the values."],
      ["Enter or Space", "On Show more, reveals or hides the extra rows; focus stays on the button."],
    ],
    aria: [
      ["aria-expanded, aria-controls", "On the Show more button: whether every row shows, and the list it controls."],
      ["hidden", "On rows past visibleCount while the list is collapsed."],
      ["aria-hidden", "On the term icon and the button's chevron."],
    ],
  },

  timeline: {
    // Spec: Job and boundaries.
    instead: [
      ["A process the user moves through, step by step", ["stepper", "step"], "Timeline records what happened; a Stepper drives what happens next."],
      ["A conversation between people or with an assistant", ["message"], "Messages carry turns and replies, not dated events on a line."],
      ["Events a reader picks from, such as versions to restore", ["list-box", "nav"], "Timeline shows events and selects none; selection belongs to a list."],
      ["Events compared across the same columns", ["table"], "A Table lines up fields; a Timeline tells them in order."],
    ],
    // Spec: Variants, Behavior and accessibility, Feedback log; source: Timeline.tsx JSDoc.
    practices: [
      ["Do", "Use the dot for plain events, a 16 icon when the kind of event matters, and an Avatar in media when who did it matters."],
      ["Do", "Mark the current or latest event with current; it paints the Selection role and is announced as current."],
      ["Do", "Pass dateTime with time so the date is machine-readable."],
      ["Do", "Make an event clickable with a Link in its title."],
      ["Don't", "Rely on the icon to say what happened: the mark is hidden from assistive tech, so the title carries the meaning."],
      ["Don't", "Add a hover plate or selection to events; Timeline is static."],
      ["Don't", "Repeat a person's name in an Avatar's alt when the title already names them; pass an empty alt."],
    ],
    // Spec: Anatomy (as revised in round 8); source: Timeline.tsx.
    parts: {
      root: "One event: an li with a marker column and its content; the line runs from its mark to the next, stopping short of both.",
      marker: "The 24 column the mark sits in; hidden from assistive tech unless it holds media.",
      dot: "The default mark, a small dot on the line.",
      icon: "A bare 16 icon as the mark, with no plate behind it.",
      media: "An element that fills the marker, such as a 24 Avatar.",
      content: "Everything after the marker: the event's line and its details, the first line centred on the mark.",
      line: "The event's single text line: the title, then meta and time, each after a dot.",
      title: "What happened, in the default ink.",
      sep: "The dot between the title, meta and time; hidden from assistive tech.",
      meta: "Who or where, and the time, muted at the title's size; the time comes last.",
      body: "Details under the line: text, a quote or a card.",
    },
    aria: [
      ["role=\"list\"", "Always on the ol, so list semantics survive the unstyled list."],
      ["aria-current", "\"true\" on the current event."],
      ["aria-hidden", "On the marker unless it holds media, and on each separator dot."],
      ["datetime", "On the time element rendered when you pass dateTime."],
    ],
  },

  board: {
    // Spec: Job and boundaries.
    instead: [
      ["Items compared across the same fields", ["table"], "A board groups items by one value; a Table shows every field in columns."],
      ["One standalone item with media and actions", ["card"], "A board card is a row in its group; Card is a surface of its own."],
      ["Steps someone moves through in order", ["stepper"], "Board columns are groups of items, not a sequence to follow."],
    ],
    // Spec: Job and boundaries, Round 8, Behavior and accessibility; source: Board.tsx JSDoc.
    practices: [
      ["Do", "Group items by one value, such as status or owner, with one column per value."],
      ["Do", "Keep columns neutral unless the value has a colour; color tints the column, its count, its cards' edge and its add row together."],
      ["Do", "Give every card a title and an href: the title is the link that opens the item, and its hit area covers the card."],
      ["Do", "Pass count when the group holds more items than it shows."],
      ["Do", "Name each icon-only Button you put in a column's actions or a card's actions."],
      ["Don't", "Expect dragging between columns: the board draws the result, and moving cards belongs to your app."],
      ["Don't", "Put a Tag in the column title; the title is the group's name in plain text."],
    ],
    // Spec: Anatomy, Round 8, Review note round 31; source: Board.tsx.
    parts: {
      root: "One column: a section named by its title, tinted in its colour, with a header over its cards and an optional footer.",
      header: "The column's top row: the title, the count and the actions.",
      title: "The group's name in plain text; it names the section.",
      count: "A small soft Badge with the number of items; in a coloured column it takes the colour.",
      actions: "Buttons at the header's end, such as add and more.",
      cards: "The list of BoardCards; each card's title links to its item and its own actions appear on hover or focus.",
      footer: "The row under the cards: the Add new row when you pass onAdd, or your own footer in its place.",
      add: "The Add new button: full width, start-aligned, a card's size, muted in neutral and in the colour's ink otherwise.",
      "add-icon": "The add glyph before the Add new label, hidden from assistive tech.",
    },
    // Spec: Behavior and accessibility; source: native anchors and buttons.
    keyboard: [
      ["Tab", "Moves through each column's header actions, each card's link and actions, then the Add new button."],
      ["Enter", "Opens the focused card's item."],
      ["Enter or Space", "Activates Add new."],
    ],
    aria: [
      ["aria-labelledby", "On each column's section, pointing at its title unless you pass your own."],
      ["aria-hidden", "On the card's icon and the add glyph."],
    ],
  },

  accordion: {
    // Spec: Job and boundaries.
    instead: [
      ["Hierarchical rows the reader selects", ["tree-view"], "Tree view selects nested rows; an Accordion only shows or hides content."],
      ["Expandable groups in a navigation list", ["nav"], "Nav owns its own expandable groups."],
      ["Inspector rows under a collapsible heading", ["panel"], "Panel has its own collapsible section heading."],
      ["Content that floats over the page", ["popover", "menu"], "An Accordion pushes what follows down in the flow."],
    ],
    // Spec: Variants, Behavior and accessibility, Settled questions; source: Accordion.tsx JSDoc.
    practices: [
      ["Do", "Use plain for a document toggle with the chevron before the title, and divided for a stacked FAQ or settings list."],
      ["Do", "Use md for document toggles and sm in dense UI."],
      ["Do", "Stack items in an Accordion to keep one open at a time; set multiple when readers compare several."],
      ["Do", "Set headingLevel so the titles fit the page outline; an Accordion uses 3 unless you set it."],
      ["Do", "Give each item a value when you control which items are open."],
      ["Don't", "Put links or buttons in the title: the whole title row is one button."],
      ["Don't", "Hide content a reader needs to finish the task; keep collapsed content optional."],
      ["Don't", "Wrap items in a card per item; compose a Card around the Accordion if you need a surface."],
    ],
    // Spec: Anatomy, States; source: Accordion.tsx.
    parts: {
      root: "One collapsible item: its trigger row over its content; size sets the title's text role, divided adds a rule after it.",
      heading: "The h2 to h6 wrapping the trigger when a heading level is set.",
      trigger: "The native button that is the whole title row; it opens and closes the content.",
      chevron: "The muted chevron: before the title in plain, at the row's end in divided; it turns as the item opens.",
      label: "The title text, which names the trigger.",
      content: "What the item shows when open, on the title's column; closed content stays findable by find-in-page.",
    },
    // Spec: States.
    states: {
      open: "The content shows and the chevron turns; the body opens and closes with a quiet height fade unless motion is reduced.",
      disabled: "Dims and ignores clicks; the trigger is natively disabled.",
    },
    // Spec: Behavior and accessibility; source: native button trigger.
    keyboard: [
      ["Tab", "Moves to each item's trigger in turn."],
      ["Enter or Space", "Opens or closes the focused item; in an Accordion without multiple, opening it closes the others."],
    ],
    aria: [
      ["aria-expanded, aria-controls", "On the trigger: whether the item is open, and the content it controls."],
      ["role=\"region\", aria-labelledby", "On the content inside an Accordion, named by its trigger."],
      ["hidden", "until-found on closed content, so a find-in-page match opens the item."],
      ["aria-hidden", "On the chevron."],
    ],
  },

  "asset-card": {
    // Spec: Job and boundaries.
    instead: [
      ["A file in a file browser's icon view", ["file-tile"], "File tile draws a file's figure over its name, as Finder does."],
      ["An asset in a list, one per row", ["asset-row"], "Asset row is the list form of the same asset."],
      ["Content with its own text and actions inside the surface", ["card"], "Card holds a title, body and footer; Asset card frames only the asset."],
      ["A framed preview of a page or screen", ["preview-frame"], "Preview frame shows a page at its own size inside a frame."],
    ],
    // Spec: Variants, Behavior and accessibility, Feedback log; source: AssetCard.tsx JSDoc.
    practices: [
      ["Do", "Use one card per asset, anything that stands alone: an image, a component, a colour, a type style, an icon, a setting's option or a group of them."],
      ["Do", "Pick the kind by what you pass: an image URL covers the frame; color paints it; group fills a 2×2 mosaic; any other element sits centred on the frame's surface at its own size."],
      ["Do", "Keep the head to the name and its controls: Copy for what is used (a component's code, a colour's value, a type role, an icon), More for what is managed (an image, a group)."],
      ["Do", "Give a setting's option its own scope on the whole card (data-area-theme=\"dark\"), so the card and its frame change together."],
      ["Do", "Pass components and designs to a group as elements: each cell shows a scaled-down image of it, inert."],
      ["Do", "Put a small ghost More or Copy button in actions; it ends on the frame's side. Give each its own label."],
      ["Do", "Lay cards out in an AssetGrid to browse, choose and open them, and pass onOpen for Enter and double click."],
      ["Do", "Pick the aspect for the grid: square by default, landscape (5:4) where cards are narrow and their assets wide, hug for a waterfall."],
      ["Do", "Set one look for a whole grid: caption above, below or overlay, container framed, basic or containerless, fill recessed or raised, an edge or borderless."],
      ["Do", "Use caption overlay where the asset says what it is (an image library): the asset fills the card and the name appears on it on hover and focus."],
      ["Do", "Set mediaAlt only when the image says more than the name; it is empty by default."],
      ["Don't", "Scope the frame alone (frameProps with data-area-theme or a ground): a dark frame on a light card breaks the pair."],
      ["Don't", "Put text at the head's end: a detail goes in the asset itself (a type sample's line) or behind Copy."],
      ["Don't", "Pad or frame the asset yourself: the frame already sits 4 in with a corner concentric with the card's."],
      ["Don't", "Set interactive on a card inside an AssetGrid: the grid already makes each card an option."],
      ["Don't", "Set interactive without making the card a control: give it a role, a tab stop and aria-pressed or aria-selected yourself."],
      ["Don't", "Put actions on an interactive card: a button inside a button. Use an AssetGrid, or leave the card plain."],
    ],
    // Spec: Anatomy, Measurements (round 55's designs); source: AssetCard.tsx.
    parts: {
      root: "The card: its head over a square frame (an image in its own ratio), Card's corner (16 at the default), the card edge, the recessed fill; it lifts on hover when interactive or in a grid, and its edge shows selection.",
      head: "The top row, a small control plus 4 above and below: the name at the start, the controls at the end, nothing else.",
      name: "The asset's name in the UI text, regular; one line, then an ellipsis. Its cap sits centred, as far in as the head is tall less its cap.",
      actions: "Controls at the head's end, centred on it, their side on the frame's side and their corner the frame's, concentric with the card.",
      frame: "The asset's place, 4 in on three sides, its corner the card's less the edge and the inset (11 at the default); the surface with a divider edge that stays at every Stroke width, or the colour itself with the swatch ring.",
      media: "The asset: an image covering the frame, cropped, or any element centred at its own size.",
      mosaic: "A group's 2×2 grid of its first four assets, 4 apart, filling the frame's place; hidden from assistive tech.",
      cell: "One asset in the mosaic, cropped to its cell at the frame's corner; fewer than four leave cells as the card's ground.",
      thumb: "An element in a cell, laid out at about its own card's frame and scaled to the cell: a thumbnail, inert.",
    },
    // Spec: States; source: AssetCardProps.selected.
    states: {
      selected: "The card's edge turns the selection colour; an AssetGrid sets it from its value.",
    },
    // Source: AssetGrid key handler and ListBox grid.
    keyboard: [
      ["Tab", "Moves into the AssetGrid at its selected or first card: one stop for the whole grid."],
      ["Up or Down or Left or Right", "Moves between cards in two dimensions, by row and by column."],
      ["Home or End", "Moves to the first or last card."],
      ["Space", "Selects the focused card."],
      ["Enter", "Opens the focused card with onOpen; without onOpen, selects it."],
    ],
    aria: [
      ["role=\"option\", aria-selected", "On each AssetGridItem, inside the grid's listbox; its name is the card's name."],
      ["alt", "On an image asset from mediaAlt, empty by default; the media is hidden from assistive tech unless it has one."],
      ["aria-hidden", "On a group's mosaic."],
      ["aria-pressed, aria-selected", "Yours to set on an interactive card outside a grid; either shows as the selected edge."],
    ],
  },

  folder: {
    // Spec: Job and boundaries.
    instead: [
      ["A folder in a row, a menu or the Sidebar", ["tree-view", "nav", "menu"], "Use the 16 folder icon there; Folder is artwork for icon views at 48 and up."],
      ["A folder a reader can select and open", ["file-tile"], "File tile owns the name, selection, focus and opening; Folder is only its figure."],
      ["A file rather than a container", ["file-page"], "File page draws a document with its type glyph and extension."],
    ],
    // Spec: Variants, Owner decisions, Accessibility; source: Folder.tsx JSDoc.
    practices: [
      ["Do", "Use count for how many items a folder holds, and badge for the apps or people it is shared with."],
      ["Do", "Set open while something is dragged over the folder, so it reads as a drop target."],
      ["Do", "Leave it decorative inside a tile whose name says what it is; pass aria-label only when the figure stands alone (label is a deprecated alias)."],
      ["Don't", "Use Folder as a control: it has no focus, selection or click of its own."],
      ["Don't", "Pass variant, tone or contents: the solid folder, its tones and its sheet are archived, and they are ignored."],
    ],
    // Spec: Anatomy; source: Folder.tsx.
    parts: {
      root: "The square icon box, sm 48, md 64 or lg 96, or the host's --area-folder-size when unset.",
      figure: "The folder's drawing inside the box, flat in the control fill with one thin whole-pixel edge.",
      back: "The back panel with its tab, behind everything else.",
      rim: "The outline folder's back edge, drawn only where the back shows above the pocket, so no line doubles.",
      paper: "The one straight sheet, tucked behind the pocket until the folder opens.",
      front: "The front pocket over the sheet, its edge drawn once where it meets the back.",
      badge: "Small marks at the pocket's foot, at the start.",
      count: "A number at the pocket's foot, at the end, in the same type as File page's label.",
    },
    // Spec: Owner decisions 2026-10-19, Coherence pass.
    states: {
      open: "The pocket tips toward the reader and a sheet rises out of the folder, easing in and out a step faster; reduced motion skips the movement.",
    },
    aria: [
      ["aria-hidden", "By default: the figure is decorative and the tile's name says what it is."],
      ["role=\"img\", aria-label", "When you pass aria-label (or the deprecated label)."],
    ],
  },

  "file-page": {
    // Spec: Job and boundaries.
    instead: [
      ["A file's icon in a row or a menu", ["tree-view", "menu", "list-box"], "Use the 16 file glyphs there; File page is for icon views at 48 and up."],
      ["A container of files", ["folder"], "Folder draws the container; File page draws one file."],
      ["A file a reader can select and open", ["file-tile"], "File tile owns the name, selection and opening, with File page as its figure."],
      ["A real image of the asset, framed with its name", ["asset-card"], "Asset card frames any asset at its own shape."],
    ],
    // Spec: Variants, Owner decisions; source: FilePage.tsx JSDoc.
    practices: [
      ["Do", "Leave the page blank for documents (the tile's name says which); add a content mark only where the page alone would not say what the file is: a table, slides, audio, code or an archive."],
      ["Do", "Use File image for an image or a photo, not a page with an image glyph."],
      ["Do", "Pass preview to fill the page with a thumbnail of the file instead of the glyph."],
      ["Do", "Keep it decorative inside a tile; pass aria-label only when the figure stands alone (name is a deprecated alias)."],
      ["Don't", "Scale a 16 file glyph up in its place: its line grows too thick and it sits off the grid."],
      ["Don't", "Pass a file-* icon (a page with letters) or the extension as label: it draws a page inside the page, or text the tile's name already shows. label is deprecated."],
    ],
    // Spec: Measurements; source: FilePage.tsx.
    parts: {
      root: "The square icon box, sm 48, md 64 or lg 96, or the host's --area-folder-size when unset; Folder's sizes.",
      figure: "The page's drawing inside the box, flat as Folder's.",
      sheet: "The page with its top corner cut by the fold, in the component fill.",
      edge: "The outline page's edge, open at the fold, one whole-pixel weight.",
      fold: "The folded flap in the top corner, sharing the page's one diagonal.",
      crease: "The flap's two inner edges, drawn on the outline page only.",
      diagonal: "The fold's diagonal, drawn after the flap at the edge's weight on the outline page.",
      content: "The glyph and the label in one centred column, a little below the fold; hidden when a preview fills the page.",
      icon: "The content mark, 32% of the box on the page's centre, its line at the outline's edge weight at every size.",
      label: "Deprecated: the extension under the glyph, in Folder's count type; the figure is glyph-only.",
    },
    aria: [
      ["aria-hidden", "By default: the figure is decorative and the tile's name says what it is."],
      ["role=\"img\", aria-label", "When you pass aria-label (or the deprecated name)."],
    ],
  },

  "file-image": {
    // Spec: Job and boundaries.
    instead: [
      ["A document, a spreadsheet or any other file", ["file-page"], "File page draws a page; File image is for pictures."],
      ["A container of files", ["folder"], "Folder draws the container."],
      ["A real image framed with its name, at its own shape", ["asset-card"], "Asset card frames any asset in a card with its name."],
      ["An image file in a row or a menu", ["tree-view", "menu", "list-box"], "Use the 16 image glyph there; File image is for icon views at 48 and up."],
    ],
    // Spec: Variants; source: FileImage.tsx JSDoc.
    practices: [
      ["Do", "Pass src with a thumbnail when you have one: the picture covers the frame."],
      ["Do", "Keep it decorative inside a tile; pass aria-label only when the figure stands alone."],
      ["Don't", "Lay an image glyph over the frame: without a picture the frame draws its own landscape."],
    ],
    // Spec: Measurements; source: FileImage.tsx.
    parts: {
      root: "The square icon box, sm 48, md 64 or lg 96, or the host's --area-folder-size when unset; Folder's sizes.",
      figure: "The landscape frame, 4:3 and 92% of the box, at the page's corner, in the control fill with a whole-pixel edge.",
      scene: "The drawn landscape when there is no picture: two hills and a sun at the outline's edge weight, in File page's quiet ink.",
      picture: "The thumbnail covering the frame, cropped, the image ring over its edge.",
    },
    aria: [
      ["aria-hidden", "By default: the figure is decorative and the tile's name says what it is."],
      ["role=\"img\", aria-label", "When you pass aria-label."],
    ],
  },

  "file-tile": {
    // Spec: Job and boundaries.
    instead: [
      ["Files in a list or details view", ["table"], "Use a flush, interactive Table: one row per file with its columns."],
      ["Folders and files as a hierarchy", ["tree-view"], "Tree view nests items; File tile lays one level out as icons."],
      ["The path to the current folder", ["breadcrumb"], "Breadcrumb shows where the view is."],
      ["An asset framed in a container, such as a logo or a screen", ["asset-card"], "Asset card frames a composition; File tile sets a figure on the surface."],
    ],
    // Spec: Job and boundaries, Keyboard and ARIA, Coherence pass; source: FileTile.tsx JSDoc.
    practices: [
      ["Do", "Put tiles in a FileGrid, which makes them one listbox with one Tab stop, and pass onOpen for Enter and double click."],
      ["Do", "Use a Folder for folders and a File page for files as the figure, or an image URL for a picture."],
      ["Do", "Write a short detail line in meta: an item count, a type and size, or when it was edited."],
      ["Do", "Set size on the FileGrid so every tile shares one figure size."],
      ["Do", "Set dropTarget on a FileGridItem while something is dragged over it; its Folder tips open."],
      ["Don't", "Expect multi-select or rename: the grid selects one tile at a time."],
      ["Don't", "Set figureAlt when the name already says what the image is; the image is decorative by default."],
    ],
    // Spec: Anatomy, Coherence pass; source: FileTile.tsx.
    parts: {
      root: "One item: the figure over its text in a centred column; in a FileGrid it sits on the row plates of its option.",
      figure: "The square that holds a Folder, a File page, a glyph or a contained image; sm 48, md 64 or lg 96.",
      text: "The name over the detail line, 8 under the figure.",
      name: "The item's name in the app's strong UI text; up to two lines, then an ellipsis.",
      meta: "A muted detail line in tabular figures; one line.",
    },
    // Spec: Keyboard and ARIA; source: FileGrid key handler and ListBox grid.
    keyboard: [
      ["Tab", "Moves into the FileGrid at its selected or first tile: one stop for the whole grid."],
      ["Up or Down or Left or Right", "Moves between tiles by their position on screen."],
      ["Home or End", "Moves to the first or last tile."],
      ["Space", "Selects the focused tile."],
      ["Enter", "Opens the focused tile with onOpen; without onOpen, selects it."],
    ],
    aria: [
      ["role=\"option\", aria-selected", "On each FileGridItem, inside the grid's listbox; typeahead matches its name."],
      ["alt", "On an image figure from figureAlt, empty by default; the figure is hidden from assistive tech unless it has one."],
      ["aria-disabled", "On a disabled FileGridItem, which typeahead and the arrows skip."],
    ],
  },

  "video-player": {
    // Spec: Job and boundaries.
    instead: [
      ["An image or other media with a caption", ["figure"], "Figure frames any media with a caption, and can hold a Video player."],
      ["A framed preview of a page or screen", ["preview-frame"], "Preview frame shows a live page, not a video."],
      ["A video among other assets to browse", ["asset-card"], "Asset card shows the asset with its name; open it to play."],
    ],
    // Spec: Round 40 (layouts), Round 42 and 47, Behavior and accessibility; source: VideoPlayer.tsx JSDoc.
    practices: [
      ["Do", "Give every player a label, the video's title: it names the player's group."],
      ["Do", "Use bar by default (the track across the foot, buttons in glass pills under it), floating for QuickTime's centred panel, and minimal for an ambient loop with one round play button."],
      ["Do", "Pass caption tracks as track children; without one the captions button shows disabled."],
      ["Do", "Set a poster so the frame shows a picture before the first play."],
      ["Do", "Give a Figure around the player a width: each sizes to the other, so neither can set it alone."],
      ["Don't", "Set controls=\"always\" over video a reader watches; let the controls hide while it plays."],
      ["Don't", "Add the native controls attribute: the player draws its own."],
    ],
    // Spec: Round 40 to 47; source: VideoPlayer.tsx, video-player.css.
    parts: {
      root: "The group holding the video and its controls, and a tab stop of its own; layout picks bar, floating or minimal.",
      media: "The native video, letterboxed on black; a click plays or pauses, a double click toggles full screen except in minimal.",
      start: "The round play button shown before the first play; in minimal it stays as the only control.",
      controls: "The controls, shown after the first play: the bar's track over its row of pills, or the floating panel's two rows.",
      transport: "A row of buttons: the bar's pills (play, volume and the time at the start, the rest at the end), or the floating panel's top row (sound, back · play · forward, the rest).",
      group: "One of the transport's clusters: start and end in the bar, start, center and end in the floating panel.",
      timeline: "The floating panel's second row: the elapsed time, the track and the time remaining.",
      clock: "The time in muted tabular figures: elapsed at the start, remaining at the end.",
      range: "A track: seek or volume, a thin rail filled to a solid round thumb.",
      duration: "The bar layout's total time after the elapsed time; dropped when the player is very narrow.",
      volume: "Mute with its volume slider, which slides out on hover or focus.",
      skip: "The back 10 and forward 10 seconds buttons, the same 10 seconds as J and L; the narrow floating panel drops them.",
      optional: "Captions and picture in picture, dropped when the player is narrow.",
      surface: "The dark glass under the controls: each of the bar's pills, the floating panel and the round play, dark in every theme so white glyphs read on any frame.",
    },
    // Source: VideoPlayer.tsx onKeyDown (a focused range keeps its own arrows; Space on a button presses it).
    keyboard: [
      ["Tab", "Moves to the player, then to each control; before the first play only the round play button."],
      ["Space or K", "Plays or pauses."],
      ["Left or Right", "Seeks back or forward 5 seconds."],
      ["J or L", "Seeks back or forward 10 seconds."],
      ["Up or Down", "Turns the volume up or down by 5%."],
      ["M", "Mutes or unmutes."],
      ["F", "Enters or leaves full screen."],
      ["C", "Turns captions on or off."],
      ["I", "Enters or leaves picture in picture, where the browser supports it."],
      ["Home or End", "Jumps to the start or the end."],
      ["0 or 5", "A digit key from 0 to 9 jumps to that tenth of the video: 0 is the start, 5 the middle."],
    ],
    aria: [
      ["role=\"group\", aria-label", "On the player, named by label."],
      ["aria-label", "On every button, naming its action (Play or Pause, Mute or Unmute, Full screen), and on the Seek and Volume ranges."],
      ["aria-valuetext", "On the ranges: \"1 minute 12 seconds of 4 minutes 3 seconds\", \"60% volume\", or \"Muted, 60% volume\"."],
      ["aria-pressed", "On the captions button while captions are on."],
    ],
  },

  figure: {
    // Spec: Job and boundaries, Round 37 and 38.
    instead: [
      ["A video the reader plays", ["video-player"], "Video player draws Area's own controls; put it inside a Figure to caption it."],
      ["Media with a title, text and actions on one surface", ["card"], "Card presents a piece of content; Figure only captions media."],
      ["An asset to browse among others, with its name", ["asset-card"], "Asset card frames the asset with its name and controls."],
      ["A framed preview of a page or screen", ["preview-frame"], "Preview frame shows a page at its own size inside a frame."],
    ],
    // Spec: Round 34 to 38, Feedback log; source: Figure.tsx JSDoc.
    practices: [
      ["Do", "Give an img its alt text; the caption adds to the image, it does not replace the alt."],
      ["Do", "Keep the caption short: what the media shows, with any credit in the same line."],
      ["Do", "Leave out the caption when the surrounding text already explains the media."],
      ["Do", "Give the Figure a width when it holds a Video player, since each sizes to the other."],
      ["Don't", "Crop or frame the media through Figure: it keeps the media's own shape and draws no frame."],
      ["Don't", "Use Figure for a gallery or a lightbox; it holds one piece of media."],
    ],
    // Spec: Round 35, Feedback log; source: Figure.tsx.
    parts: {
      root: "A native figure: the media and its optional caption, as wide as the media.",
      media: "The image, svg or embed in its own shape; a standalone image takes the container corner.",
      caption: "A figcaption in the muted UI text, 8 under the media, start-aligned and wrapped to the media's width.",
    },
    aria: [
      ["alt", "Required on an img inside: Figure does not name the media for you."],
    ],
  },

  infobox: {
    // Spec: Job and boundaries, Round 34.
    instead: [
      ["Editing a subject's properties in place", ["property-list"], "Infobox shows facts; Property list hosts controls."],
      ["Labelled values with no title or media", ["description-list"], "A Description list is the plain list of terms and values."],
      ["An image with its caption", ["figure"], "A caption belongs to a Figure, not to Infobox's media."],
      ["One piece of content as a linked surface", ["card"], "Card presents and links an item; Infobox summarises a subject beside its article."],
    ],
    // Spec: Round 34 to 36; source: Infobox.tsx JSDoc.
    practices: [
      ["Do", "Put it beside or above the article it sums up, with the subject's name as title and a short role or description as subtitle."],
      ["Do", "Group facts into InfoboxSections with short headings; use InfoboxRows for a run without one."],
      ["Do", "Use stacked when the column is narrow, so each label sits above its value."],
      ["Do", "Set framed when the box stands on its own; unframed, it fills its column."],
      ["Do", "Keep action to one ghost sm icon Button, such as Edit, and give it a label."],
      ["Don't", "Put a caption under the media; use a Figure for that."],
      ["Don't", "Use it as a form: values are shown, not edited."],
    ],
    // Spec: Round 35; source: Infobox.tsx.
    parts: {
      root: "An aside named by its title: the header, then sections of rows; framed puts it in Card's frame.",
      header: "The media above the title row.",
      media: "An image or an Avatar above the title, 8 above it; give an img its alt.",
      "title-row": "The heading group with the action at its end.",
      "heading-group": "The title over its subtitle.",
      title: "The subject's name in the strong surface title, as a Card's or Dialog's.",
      subtitle: "A muted line under the title: a role or a short description.",
      action: "One control at the end of the title row.",
      section: "A run of rows, 12 from the next with a divider between.",
      heading: "The section's title in strong UI text, 6 above its rows.",
      rows: "The dl holding a section's rows, 4 apart.",
      row: "One label and its value: side by side, the label column as wide as the longest label, or stacked.",
      label: "What the value is, in the muted UI text.",
      value: "The fact, in the default UI text.",
    },
    aria: [
      ["aria-label", "On the aside, from title when it is text, unless you pass your own."],
      ["alt", "Required on an img in media."],
    ],
  },

  "inline-list": {
    // Spec: Job and boundaries.
    instead: [
      ["The path to the current page", ["breadcrumb"], "Breadcrumb is a path with its own navigation semantics."],
      ["Short labels or statuses in a row", ["badge-group", "tag"], "Those are chips with their own fills; Inline list runs plain items."],
      ["Columns of related links at the foot of a page", ["link-groups"], "Link groups sorts links under headings."],
    ],
    // Spec: Rethink round 34, Round 35; source: InlineList.tsx JSDoc.
    practices: [
      ["Do", "Use the dot for a byline or a metadata row, the rule where items need a firmer break, and none when each item starts with an icon."],
      ["Do", "Keep items short: a date, a count, a name, a link."],
      ["Do", "Put links in as standalone Links: they underline on hover, not at rest, and can take any of Link's inks."],
      ["Do", "Let the row wrap; no line starts with a separator."],
      ["Don't", "Type separators or commas between items yourself: the list draws them."],
      ["Don't", "Use it for a sentence; write commas in the text instead."],
    ],
    // Spec: Round 35; source: InlineList.tsx.
    parts: {
      root: "A ul in a wrapping row; separator sets the mark between items: a muted dot, a 1px rule, or space alone.",
      item: "One li per child, in the context's type and ink; the separator after it is drawn by the item before the next.",
    },
    aria: [
      ["role=\"list\"", "Always on the ul, so list semantics survive the unstyled list."],
    ],
  },

  abbreviation: {
    // Spec: Job and boundaries.
    instead: [
      ["A label on an icon-only control", ["tooltip"], "Tooltip names or describes a control; Abbreviation expands a short form in text."],
      ["A longer note behind a small button", ["toggletip"], "Toggletip pins open on press and can hold a link."],
      ["Help text for a field", ["field"], "Field shows its description under the control, always visible."],
    ],
    // Spec: Decisions; source: Abbreviation.tsx JSDoc.
    practices: [
      ["Do", "Mark an abbreviation the first time it appears in an article, and pass what it stands for as title."],
      ["Do", "Write the full expansion in title, such as \"Bachelor of Science\", not a definition."],
      ["Do", "Keep it in running text: it is phrasing content and fits inside a paragraph."],
      ["Don't", "Rely on the expansion for something the reader must know; spell it out in the text instead."],
      ["Don't", "Wrap it in your own abbr title or a native tooltip: it shows the expansion in an Area Tooltip, never the browser's."],
    ],
    // Spec: Decisions.
    parts: {
      root: "A native abbr with a dotted underline at Link's offset; it is focusable and shows the focus ring.",
    },
    // Spec: Decisions; source: AnchoredTooltip, useHoverIntent.
    keyboard: [
      ["Tab", "Moves to the abbreviation and shows its expansion at once."],
      ["Escape", "Hides the expansion."],
    ],
    aria: [
      ["aria-describedby", "On the abbr, pointing at the tooltip that holds the expansion."],
      ["role=\"tooltip\"", "On the expansion's surface."],
      ["tabindex", "0 by default, so keyboard users reach the expansion."],
    ],
  },

  hatnote: {
    // Spec: Job and boundaries.
    instead: [
      ["A status, a warning or something that went wrong", ["alert"], "Alert carries a tone; a hatnote only points elsewhere."],
      ["Links to the sections of this page", ["table-of-contents"], "Table of contents lists the page's own sections."],
      ["Related pages at the foot of the page", ["link-groups"], "Link groups gathers related links under headings at the end."],
    ],
    // Spec: Job and boundaries, Decisions.
    practices: [
      ["Do", "Put it first, at the top of the article or section, before the text it disambiguates."],
      ["Do", "Write one short line naming the other meaning and linking to its page: \"For other uses, see …\"."],
      ["Do", "Stack a second hatnote under the first when there are two separate pointers."],
      ["Don't", "Use it for anything with a status or an action; that is an Alert."],
      ["Don't", "Bury it inside the text, where readers who landed on the wrong page won't see it first."],
    ],
    // Spec: Decisions.
    parts: {
      root: "A muted, indented line at the top of an article or section, 8 above the text; a second one sits close under the first.",
    },
    aria: [
      ["role=\"note\"", "Always: it is a note beside the main content."],
    ],
  },

  "link-groups": {
    // Spec: Job and boundaries, Rethink round 34.
    instead: [
      ["The app's or site's own navigation", ["nav"], "Nav moves through the product; Link groups points to related pages at the foot of one."],
      ["Data in rows and columns", ["table"], "Link groups sorts links, not records."],
      ["A few short links in one line", ["inline-list"], "An Inline list runs them along a line with separators."],
      ["Links to the sections of this page", ["table-of-contents"], "Table of contents follows the page as it scrolls."],
    ],
    // Spec: Rethink round 34, Round 35; source: LinkGroups.tsx JSDoc.
    practices: [
      ["Do", "Place it at the foot of an article or page, and set divided where it closes the article."],
      ["Do", "Give it a title naming the topic the links share; without one, give the nav an aria-label."],
      ["Do", "Label each LinkGroup with a short heading and put one standalone Link per row under it."],
      ["Do", "Set level so the title fits the page outline; it is h2 unless you set it."],
      ["Don't", "Frame it or collapse it: the groups stay open in columns; fold a long block with an Accordion if you must."],
      ["Don't", "Mix actions in with the links; every row goes somewhere."],
    ],
    // Spec: Round 35; source: LinkGroups.tsx.
    parts: {
      root: "A nav named by its title: the title over columns of groups; divided adds a rule above.",
      title: "The topic the links share, a heading in the surface title role, 12 above the groups.",
      groups: "The columns, each at least 10em wide and 24 apart, wrapping to fit.",
      group: "One group: its heading over its links.",
      label: "The group's heading in strong UI text, 8 above its links; it names the list.",
      list: "The group's links, one per row, 4 apart, in the muted ink.",
    },
    aria: [
      ["aria-labelledby", "On the nav, pointing at the title when there is one; on each group's list, pointing at its label."],
      ["aria-label", "Yours to set on LinkGroups when there is no title."],
      ["role=\"list\"", "On each group's list, so list semantics survive the unstyled list."],
    ],
  },

  "reference-list": {
    // Spec: Job and boundaries.
    instead: [
      ["The marker in the text that points to a note", ["citation"], "Citation is the footnote or source chip; Reference list is what it points at."],
      ["Labelled facts, a term beside each value", ["description-list"], "A reference list has no labels, only sources."],
      ["Related pages grouped under headings", ["link-groups"], "Link groups lists further reading, not a text's sources."],
    ],
    // Spec: Round 35 to 38; source: ReferenceList.tsx JSDoc.
    practices: [
      ["Do", "Number the list when footnotes point at it, and give each item the id its footnotes link to."],
      ["Do", "Use bullet for a plain list of sources under an answer, with no footnotes."],
      ["Do", "Write each source as its publisher, the work's title with its href, and what it covers; the list sets them apart with dashes."],
      ["Do", "Pass backlinks with the ids of the footnotes citing a note, so a reader can jump back."],
      ["Do", "Give the list a title such as \"Sources\"; without one, give it an aria-label."],
      ["Don't", "Type the separators or the open-in-new-tab mark: the item draws the dashes, and the title is an external Link."],
      ["Don't", "Set highlighted by hand to show the current note unless you route without URL fragments; the target note is marked for you."],
    ],
    // Spec: Round 35 to 38; source: ReferenceList.tsx.
    parts: {
      root: "A section named by its title, holding the numbered or bulleted list.",
      title: "The heading over the list, such as \"Sources\", in strong UI text, 8 above it.",
      list: "An ol when numbered, a ul when bulleted; markers sit in one shared column flush with the title, the text 6 after them.",
      item: "One source; the note a footnote led to is marked with the selection rail.",
      text: "The item's content: source, linked title and description, then its backlinks.",
      dash: "The spaced em dash between a source's parts.",
      backlinks: "The links back to where the note is cited, 4 after the text.",
      backlink: "One link back, a small muted return arrow, named \"Back to citation\".",
      count: "The number on the second and later backlinks; hidden from assistive tech, since the link's name says it.",
    },
    keyboard: [
      ["Tab", "Moves through each source's title link, then its backlinks."],
      ["Enter", "Follows the focused link; a backlink returns to its footnote."],
    ],
    aria: [
      ["aria-labelledby", "On the section, pointing at the title when there is one."],
      ["aria-label", "On the section when there is no title (yours to pass), and on each backlink from backlinkLabel."],
      ["role=\"heading\", aria-level", "On the title, level 3."],
    ],
  },

  "table-of-contents": {
    // Spec: Job and boundaries.
    instead: [
      ["The app's or site's navigation between pages", ["nav"], "Table of contents lists one page's sections; Nav moves between pages."],
      ["A hierarchy of files or objects", ["tree-view"], "Tree view selects and expands nested items."],
      ["Related pages at the foot of an article", ["link-groups"], "Link groups points away from the page; the outline stays on it."],
    ],
    // Spec: Rethink round 34, Decisions (following); source: TableOfContents.tsx JSDoc.
    practices: [
      ["Do", "Give every section heading an id and pass the same ids as items, nesting subsections as children."],
      ["Do", "Show two levels, sections and their subsections; pass levels={1} for a short page."],
      ["Do", "Pass offset when a sticky header covers the top of the scroller, so a heading counts as reached below it."],
      ["Do", "Add top for a first row that goes back to the start of the page."],
      ["Don't", "Control value unless your app tracks the reading position itself; by default it follows the scroll."],
      ["Don't", "List more than two levels: the outline shows sections and subsections only."],
    ],
    // Spec: Round 35; source: TableOfContents.tsx.
    parts: {
      root: "A nav of Nav's marker rows, named \"On this page\" or by its title; the section being read takes the default ink and the selection rail.",
      title: "The visible label, \"On this page\" by default, in strong UI text with its text on the rows' edge; hidden from assistive tech, which hears the nav's name.",
    },
    keyboard: [
      ["Tab", "Moves through the section links in order."],
      ["Enter", "Jumps to the section and marks it as the one being read."],
    ],
    aria: [
      ["aria-label", "On the nav, from title when it is text, else \"On this page\", unless you pass your own."],
      ["aria-current", "\"location\" on the row of the section being read."],
      ["aria-hidden", "On the visible title, since the nav's name already says it."],
    ],
  },

  titlebar: {
    // Spec: Job and boundaries.
    instead: [
      ["A row of controls acting on a selection or document", ["toolbar"], "Toolbar has roving focus and overflow; Titlebar is the window's bar."],
      ["A bar heading a side panel or inspector", ["panel"], "Panel draws its own bar with a title; Titlebar spans the window."],
      ["Moving between the app's views", ["nav", "tabs"], "Put a horizontal Nav or Tabs inside the Titlebar; the bar itself does not navigate."],
    ],
    // Spec: Job and boundaries, Review notes 2026-10-16; source: AppShell.tsx JSDoc.
    practices: [
      ["Do", "Use it as the top bar of a desktop window, with tabs or a title at the start and search, panel toggles and the theme in end."],
      ["Do", "Set windowControls=\"macos\" in a frameless macOS window, so the start clears the traffic lights."],
      ["Do", "Keep the default ruled bar beside Panels, so its rule lines up with theirs; use plain for a bare bar and floating for a raised plate."],
      ["Do", "Use small controls in the bar: every control sits at one height with even space around it."],
      ["Don't", "Use it as a toolbar for page actions: it has no roving focus or overflow menu."],
      ["Don't", "Make the whole bar a button; in a frameless window it is the drag region, and only its controls take clicks."],
    ],
    // Spec: Decisions, Even control insets; source: AppShell.tsx.
    parts: {
      root: "A header at Panel's bar height, the drag region of a frameless window; variant draws a rule under it, no rule, or a floating plate.",
      end: "The group pushed to the bar's end, its controls as far from the side as from the top.",
    },
  },

  "section-heading": {
    // Spec: Job and boundaries.
    instead: [
      ["A collapsible group of rows in an inspector", ["panel"], "Panel's section heading folds its rows."],
      ["Collapsible content under a title", ["accordion"], "Accordion's title opens and closes what follows."],
      ["A titled block of related links at the foot of a page", ["link-groups"], "Link groups brings its own title and columns."],
    ],
    // Spec: Job and boundaries, Decisions; source: AppShell.tsx JSDoc.
    practices: [
      ["Do", "Title each group on a page with one, and add a lede only when the group needs a line of context."],
      ["Do", "Set level so the heading fits the page outline; it is h2 unless you set it."],
      ["Do", "Pass titleId and point the section's aria-labelledby at it, so the section takes the heading's name."],
      ["Do", "Follow the title with a count in the muted ink when the group lists items."],
      ["Don't", "Use it for a document's headings; use the Typography title roles there."],
      ["Don't", "Write a lede longer than a sentence or two; it is a muted line, not body text."],
    ],
    // Spec: Decisions; source: AppShell.tsx.
    parts: {
      root: "The title and its optional lede, trimmed so the block sits on its cap and baseline.",
      title: "The heading element, at the strong weight.",
      lede: "A muted paragraph 8 under the title, up to 64 characters wide.",
    },
    aria: [
      ["id", "On the heading from titleId, for the section's aria-labelledby."],
    ],
  },
};
