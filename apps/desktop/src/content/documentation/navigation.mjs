/** Documentation entries: navigation, menus and overlays. Format and rules: ../documentation.mjs and the area-component-docs skill. */
export default {
  nav: {
    // Spec: Job and boundaries.
    instead: [
      ["Running a command on the page or on an item", ["menu", "button"], "Nav lists destinations; its items are links, not actions."],
      ["A hierarchy people expand and collapse, such as files or pages", ["tree-view"], "Tree view owns expansion, selection and arrow-key movement; Nav is flat or one level deep."],
      ["Switching between views inside one page", ["tabs", "segmented"], "Tabs and Segmented swap a view in place; Nav moves to another page."],
    ],
    // Spec: Variants, Behavior and accessibility, Review notes; pages.mjs practices; source: Nav.tsx JSDoc.
    practices: [
      ["Do", "Mark the current page with current. It sets aria-current=\"page\", which also draws the plate, so an item can't look current without being announced as current."],
      ["Do", "Give each Nav an aria-label. A sidebar and a top bar are two navigation landmarks that sound the same without one."],
      ["Do", "Use vertical with labelled NavGroups for a sidebar, and horizontal for a few top-level routes; a horizontal Nav scrolls rather than wraps."],
      ["Do", "Put row commands in actions, beside the link; set revealActions to show them only on hover or focus, without moving the text."],
      ["Do", "Use selection=\"marker\" for a quiet outline, where a filled plate on the current row would be too heavy."],
      ["Do", "Use NavGroup nested for an expandable item's children: they step in one icon column, so under a parent with an icon they start on its name; a nested group inside another steps in a column more."],
      ["Do", "Let a long sidebar's sections fold: give a labelled NavGroup open and onOpenChange, and keep what is open when people come back. Put a section's New in the group's actions, so it stays reachable while folded."],
      ["Do", "For open documents (an editor's or a browser's tabs), use a horizontal Nav whose rows carry a close in actions with revealActions: it shows on hover, focus and the current tab, over the name's end, which fades."],
      ["Do", "Give a fixed first destination (a Home tab) an icon with no label and an aria-label: the item becomes a square plate, the icon centred."],
      ["Do", "Use picture instead of icon where rows share a kind and differ by how they look, and the difference survives 20 × 14, such as photographs."],
      ["Do", "Set sticky on a group whose name should stay in view while a long run scrolls under it, such as the open project in a sidebar."],
      ["Do", "Give a folding group defaultOpen when it holds its own state; open and onOpenChange when the page keeps it."],
      ["Don't", "Group a horizontal Nav: a group label needs a line of its own."],
      ["Don't", "Picture a screen or a document in a row: at 20 × 14 it is a pale plate with a few bars, and two variations look alike. Mark its kind with an icon and let the name tell them apart."],
      ["Don't", "Nest a button inside a NavItem's link. Row actions are siblings of the link, in actions."],
      ["Don't", "Disable a place the person can reach once something changes (a plan, a permission); make it inactive and say why in inactiveText."],
    ],
    // Spec: Anatomy, Decisions; source: Nav.tsx.
    parts: {
      root: "The nav landmark: a sidebar column (inside a Panel it takes the panel's width), or, horizontal, a row that scrolls instead of wrapping, its items muted at rest and full strength when current.",
      group: "A run of items. With a label it is a group named by that label; nested, its rows step in one icon column (on a parent's name) and keep full-width plates.",
      label: "A group's heading: a row-height title in the muted ink, quieter than the items. It is interactive only when the group folds, may end in actions, and with sticky stays at the top of the scroll on the fill under the Nav.",
      toggle: "A folding group's heading as a button: the whole row toggles the run, its ink fixed under the pointer.",
      chevron: "The toggle's 12 chevron, 4 after the name: shown on hover, on focus and while the run is folded, pointing along the line when folded.",
      items: "A folding group's run, hidden while folded.",
      item: "The link row: owns the row height, the hover, pressed and current plates, the focus ring and the disabled dimming.",
      icon: "The leading icon box, sized by the slot and hidden from assistive tech. An item with an icon and no label is the icon alone in a square plate, named by its aria-label.",
      picture: "A 20 × 14 picture in the icon's place, on the icon column, hidden from assistive tech: a screen's or an image's thumbnail, cropped from the top.",
      text: "The item's label, one line: in a sidebar a long label fades out over its last 24 before the trailing part; a tab's fades under its close.",
      trailing: "End-of-row annotation: a count, a shortcut or a status dot, in the muted ink even on the current row.",
      separator: "A rule between runs of items; a vertical hairline in a horizontal Nav.",
      row: "Wraps an item and its actions so both share one plate; the actions sit beside the link, never inside it.",
      actions: "The row's own buttons, 4 in from its plate on every side; under the pointer only their ink darkens. With revealActions they show on hover or focus, always on touch; a horizontal row's also while current, over its text.",
    },
    states: {
      inactive: "Drawn as disabled, with no hover or press plate, but it keeps its Tab stop at a full-strength ring; following it does nothing, and inactiveText shows as a Tooltip beside it that describes it.",
    },
    // Native links; source: Nav.tsx (disabled items leave the Tab order).
    keyboard: [
      ["Tab", "Moves through the items and any row actions in order. A disabled item is skipped; an inactive one is reached and shows its reason."],
      ["Enter", "Follows the focused item's link."],
      ["Enter or Space", "On a folding group's heading, opens or folds its run."],
    ],
    aria: [
      ["aria-label", "On the Nav, from you: names the landmark."],
      ["aria-current", "\"page\" on the current item, from current."],
      ["role=\"group\", aria-labelledby", "On a NavGroup with a label, pointing at the label (the heading's button when it folds)."],
      ["aria-expanded, aria-controls", "On a folding group's heading button, from open, pointing at its run."],
      ["aria-disabled, role=\"link\"", "On a disabled item, which drops its href and leaves the Tab order; on an inactive one, which drops its href and keeps its Tab stop."],
      ["aria-describedby", "On an inactive item with inactiveText: points at the Tooltip that says why."],
      ["role=\"separator\"", "On NavSeparator."],
    ],
  },

  tabs: {
    // Spec: Job and boundaries.
    instead: [
      ["Picking a value or a mode, such as a filter or a view setting", ["segmented"], "Segmented picks a value on a filled track; Tabs switch the view below them and mark it with an underline or a plate, with no track."],
      ["Moving to another page or route", ["nav"], "Nav moves between pages; Tabs switch views of one page."],
      ["Showing progress through an ordered flow", ["stepper"], "Stepper records what is done and what is left; Tabs are views in no order."],
    ],
    // Spec: Variants, Job and boundaries, Behavior and accessibility; source: primitives.tsx Tabs.
    practices: [
      ["Do", "Use Tabs to switch between views of one thing. Each tab owns one panel, and the labels line up with the panel's content edge."],
      ["Do", "Name the tab list with aria-label when the default \"Views\" doesn't say what the tabs switch."],
      ["Do", "Use vertical orientation for a settings view with many sections; the arrow keys follow the orientation."],
      ["Do", "Set activationMode=\"manual\" when a panel is slow to show, so the arrows move focus and Enter or Space selects."],
      ["Do", "Turn on track to draw a divider under the list where the tabs need a baseline."],
      ["Do", "Key each item by value, as Segmented's items; id is the deprecated key."],
      ["Do", "Give a document tab its change with status (added, modified, deleted, untracked, renamed): its label takes the change's ink and the word is read out. Set unseen for one changed since it was last looked at."],
      ["Do", "Use selection=\"plate\" for a panel's or an inspector's views, where an underline would compete with the panel's own rules: the selected tab sits on a soft plate and the others are plain muted labels."],
      ["Don't", "Recolor a tab to say it is unseen; unseen is its own dot, and the status keeps its ink."],
      ["Don't", "Put plate tabs on a filled track or give them a raised plate. A track with a raised option is Segmented, which picks a value; a row of closable plates for open documents is a horizontal Nav."],
      ["Don't", "Restyle Tabs as filled pills. That treatment is Segmented, or a horizontal Nav for routes."],
      ["Don't", "Use Tabs to move between pages; the URL doesn't change. Use Nav."],
    ],
    // Spec: Anatomy, Decisions.
    parts: {
      root: "Holds the tab list and the panels: a column, or a row when vertical.",
      list: "The tablist: the row (or column) of tabs, with the optional track divider under it. It draws the selected indicator, the underline or the plate, which slides to the tab you choose; the underline lies on the track.",
      tab: "A button with no inline padding, so its label sits on the panel's edge; its indicator spans the whole tab, icon and count included. A plate tab takes a control's inset and corner instead.",
      panel: "The tabpanel for the selected tab; the others are hidden. It is focusable, so Tab reaches a panel with no controls, and shows a ring with room around its content when focused, as a focused tab rings its label.",
      label: "The tab's text: muted at 400 until selected, then default ink at 500. A hidden strong copy holds the selected width, so the row never moves.",
      icon: "An optional leading icon, hidden from assistive tech.",
      unseen: "A small dot after the label in the accent's indicator color, for a tab changed since it was last looked at; read as \"Unseen\".",
    },
    // Spec: States.
    states: {
      selected: "The default ink at 500 and the indicator in the Selection role, or with selection=\"plate\" the active fill behind the tab; hover and press take their fills, the ink fixed. The selected tab is the list's only Tab stop.",
      disabled: "Dims, ignores input and is skipped by the arrow keys; native disabled.",
    },
    // Source: primitives.tsx Tabs onKeyDown.
    keyboard: [
      ["Tab", "Moves to the selected tab, then into its panel."],
      ["Left or Right", "Moves to the previous or next enabled tab, wrapping; reversed in right-to-left text. In automatic mode it also selects."],
      ["Up or Down", "The same, in a vertical list."],
      ["Home or End", "Moves to the first or last enabled tab."],
      ["Enter or Space", "Selects the focused tab, for manual activation."],
    ],
    aria: [
      ["role=\"tablist\", aria-orientation", "On the list, with its orientation."],
      ["aria-label", "Names the list: \"Views\" unless you pass one."],
      ["role=\"tab\", aria-selected, aria-controls", "On each tab, pointing at its panel. A tab's change word (\"Modified\") and \"Unseen\" follow its label as hidden text, so neither is color alone."],
      ["role=\"tabpanel\", aria-labelledby, hidden", "On each panel, named by its tab; hidden unless its tab is selected."],
    ],
  },

  breadcrumb: {
    // Spec: Job and boundaries; pagination.md Job and boundaries.
    instead: [
      ["Switching between sibling views of one thing", ["tabs"], "Breadcrumb shows where a page sits; Tabs switch views at the same level."],
      ["A list of actions", ["menu"], "Breadcrumb items are links to ancestors, not commands."],
      ["Paging through a long result set", ["pagination"], "Pagination moves between pages of one list; Breadcrumb moves up a hierarchy."],
    ],
    // Spec: Variants, Behavior and accessibility; source: Breadcrumb.tsx.
    practices: [
      ["Do", "Link every ancestor with BreadcrumbLink and end with BreadcrumbPage, the current page, which is not a link."],
      ["Do", "Collapse a long path with BreadcrumbEllipsis and pass the hidden pages as items, so the ellipsis opens a Menu of them."],
      ["Do", "Put a BreadcrumbSeparator between items; it is hidden from assistive tech and mirrors in right-to-left text."],
      ["Do", "Set nowrap where the trail must stay on one line, as in a bar of one fixed height; the current page is cut with an ellipsis first."],
      ["Do", "Keep the default name \"Breadcrumb\", or pass aria-label in your product's language."],
      ["Don't", "Make the current page a link. It is announced with aria-current and has no hover plate."],
      ["Don't", "Leave out items when the hidden pages matter: without them the ellipsis is only a decorative mark."],
      ["Don't", "Type separators as text in the links; screen readers would read every one."],
    ],
    // Spec: Anatomy, Decisions; breadcrumb.css.
    parts: {
      root: "The nav landmark, in the muted ink.",
      list: "The ordered list of items; it wraps between items on a narrow screen, or stays on one line with nowrap.",
      item: "One list item: a link, the current page, or the ellipsis.",
      link: "An ancestor's anchor. Its hover plate and focus ring are painted outside its box, so the trail stays flush with the content it labels.",
      page: "The current page, in the default ink; plain text, not a link.",
      separator: "The chevron between items, in its own list item, in a lighter ink; hidden from assistive tech and mirrored in right-to-left text.",
      chevron: "A CSS-drawn chevron for plain-HTML markup that doesn't render the React glyph. BreadcrumbSeparator doesn't use it.",
      ellipsis: "The collapsed marker. With items it is a button with the link's plate and ring that opens a Menu; without them, a decorative mark.",
    },
    // Native links; the ellipsis is a Menu trigger (Overlays.tsx AnchoredMenu).
    keyboard: [
      ["Tab", "Moves through the ancestor links and the ellipsis button; the current page is not a stop."],
      ["Enter", "Follows the focused link."],
      ["Enter or Space", "On the ellipsis button, opens the Menu of hidden pages on its first row; Menu's keys then apply."],
    ],
    aria: [
      ["aria-label", "On the nav: \"Breadcrumb\" unless you pass one."],
      ["aria-current", "\"page\" on BreadcrumbPage, always."],
      ["role=\"presentation\", aria-hidden", "On every BreadcrumbSeparator."],
      ["aria-haspopup, aria-expanded", "On the ellipsis button when it has items; it is named \"More pages\"."],
      ["role=\"img\", aria-label", "On the decorative ellipsis without items, named \"More pages\"."],
      ["role=\"menuitem\"", "On each link in the ellipsis Menu, so a hidden page opens like any other crumb."],
    ],
  },

  pagination: {
    // Spec: Job and boundaries.
    instead: [
      ["Switching between sibling views of one thing", ["tabs"], "Tabs switch views; Pagination replaces one page of a long list with the next."],
      ["Showing where a page sits in a hierarchy", ["breadcrumb"], "Breadcrumb moves up a hierarchy; Pagination moves along one list."],
      ["Adding more results to the same list", ["button"], "A Load more Button appends results; Pagination replaces them."],
    ],
    // Spec: Variants, Behavior and accessibility; pages.mjs notes; source: Pagination.tsx JSDoc.
    practices: [
      ["Do", "Use the pages layout under a table or result list, and compact (\"Page 2 of 10\") in a narrow column."],
      ["Do", "Pass getHref when pages have addresses: every item becomes a link that opens in a new tab and works without script."],
      ["Do", "Match size to the controls beside it; sm, md and lg are Button's heights."],
      ["Do", "Turn stepLabels off in a dense table footer; the chevrons stay, and Previous and Next stay for assistive tech."],
      ["Do", "Pass labels to translate the landmark, the steps, each page's name and the compact status."],
      ["Don't", "Disable or hide Previous and Next at the ends. They announce themselves unavailable, and a button step keeps focus."],
      ["Don't", "Build a rows-per-page select into the pager; compose a Select beside it."],
    ],
    // Spec: Anatomy, States; source: Pagination.tsx.
    parts: {
      root: "The nav landmark around the pager.",
      list: "The row of items: Previous, the pages or the compact status, then Next.",
      item: "One list item holding a step, a page, an ellipsis or the status.",
      page: "A page number, a button (or a link with getHref) named \"Page n\". The current page takes the selected plate and ignores hover.",
      ellipsis: "Marks a skipped run of pages; hidden from assistive tech. The row keeps the same number of items as the page moves.",
      status: "The compact layout's \"Page 2 of 10\", announced politely when it changes.",
      value: "A number in the compact status, emphasised.",
      step: "Previous or Next: a ghost Button with a chevron that mirrors in right-to-left text. At an end it dims and is announced unavailable.",
    },
    // Spec: Behavior and accessibility (no arrow-key roving); native buttons and links.
    keyboard: [
      ["Tab", "Moves along the row in order: Previous, each page, Next. There is no arrow-key movement."],
      ["Enter or Space", "Goes to the focused page or step (Enter alone when items are links)."],
    ],
    aria: [
      ["aria-label", "On the nav (\"Pagination\") and on each page (\"Page 3\"), from labels."],
      ["aria-current", "\"page\" on the current page."],
      ["aria-disabled", "On Previous or Next at an end, in place of native disabled."],
      ["aria-live", "\"polite\" on the compact status, since focus stays on a step while the page changes."],
      ["rel", "\"prev\" and \"next\" on the steps when they are links."],
      ["aria-hidden", "On each ellipsis."],
    ],
  },

  stepper: {
    // Spec: Job and boundaries.
    instead: [
      ["Switching views that aren't steps in a flow", ["tabs"], "Tabs switch views; Stepper shows progress through an ordered flow."],
      ["A pager, \"1 of 3\" with arrows", ["pagination"], "Pagination's compact layout pages through items; Stepper shows what is done and what is left."],
      ["Listing events that already happened", ["timeline"], "Timeline records history; Stepper shares its markers and line but tracks a flow."],
    ],
    // Spec: Variants, Behavior and accessibility; source: Stepper.tsx JSDoc.
    practices: [
      ["Do", "Name the list with aria-label, such as \"Setup steps\"; Stepper is an ordered list with no name of its own."],
      ["Do", "Set current to the step the person is on; steps before it show as done, with a check."],
      ["Do", "Pass onStepSelect so people can go back to done steps. Add nonLinear only when steps can be done in any order."],
      ["Do", "Set status=\"error\" on a step with a problem; it is read as \"has a problem\" after its title."],
      ["Do", "Use vertical in a side column, where the steps stack with the line through their markers."],
      ["Do", "Put the open step's sub-steps or settings in its children, under its title; leave the other steps closed."],
      ["Don't", "Use Stepper for a checklist of independent tasks: it says the steps come in order."],
      ["Don't", "Make upcoming steps clickable in a flow that must be done in order; leave nonLinear off."],
    ],
    // Manifest: no elements; spec: Anatomy.
    parts: {
      root: "The ordered list of steps: each a numbered marker (a check once done), a title and an optional description, joined by Timeline's line.",
    },
    // Spec: Behavior and accessibility; source: Stepper.tsx (steps are native buttons).
    keyboard: [
      ["Tab", "Moves to each step that is a button: done steps with onStepSelect, or every step but the current one with nonLinear."],
      ["Enter or Space", "Goes to the focused step."],
    ],
    aria: [
      ["aria-label", "On the list, from you."],
      ["aria-current", "\"step\" on the current step, an invalid one included."],
      ["aria-hidden", "On each marker. The status is read as a hidden word after the title (\"completed\", \"current step\"); statusLabels changes the words."],
    ],
  },

  "tree-view": {
    // Spec: Job and boundaries.
    instead: [
      ["Flat or two-level site navigation", ["nav"], "Nav lists destinations; Tree view handles deep hierarchies with expansion state."],
      ["A list of commands", ["menu"], "Tree view navigates or selects items; Menu runs actions."],
    ],
    // Spec: Variants, Behavior and accessibility; source: TreeView.tsx JSDoc.
    practices: [
      ["Do", "Use navigation mode to open one item, and checkbox mode to filter by several."],
      ["Do", "Pass currentId for the item that is open, so the tree shows and announces it as current."],
      ["Do", "Expect a selected row to step back to the hover plate while focus is elsewhere, so the tree you're in reads as active; the current row keeps its plate."],
      ["Do", "Give the tree an aria-label that says what the hierarchy is; it is a single Tab stop."],
      ["Do", "Give each row control tabIndex={-1} and a keyboard equivalent elsewhere; set data-pinned on one that must stay visible, such as a lock."],
      ["Do", "Keep labels as plain text: typeahead matches the start of each label."],
      ["Do", "Use size sm for a file tree or a list of changes in a panel, guides when the levels run deep, and status for how each item changed: added, modified, deleted, untracked or renamed."],
      ["Do", "Set unseen on a row changed since it was last looked at; it draws a dot and leaves the status alone."],
      ["Do", "Set stickyBranches on a long, deep tree in a scrolling panel, so the folders you're inside stay in view; set --area-tree-view-sticky-top when something else is pinned above it."],
      ["Don't", "Write removed for a deleted file; it still works for one release and shows as Deleted."],
      ["Don't", "Put anything in a row that must be reached with Tab; only the active row is in the Tab order."],
      ["Don't", "Expect a parent's check to show a partial state; checkbox mode has no indeterminate parents."],
    ],
    // Spec: Anatomy, Variants; source: TreeView.tsx.
    parts: {
      root: "The tree: one Tab stop over a flat list of rows, each stepped in by its level, with the shared row plates. Size sm is the file tree's density; guides draws a line under each open branch while the tree is hovered or focused.",
      chevron: "The expand toggle on a branch row. Its pointer target is larger than its plate; collapsed, it points along the reading direction.",
      check: "The checkbox mark in checkbox mode, in the icon column; it shows the row's checked state.",
      icon: "An optional type glyph per row, hidden from assistive tech.",
      label: "The row's text, and what typeahead matches.",
      trailing: "End-of-row text such as a count or a value.",
      unseen: "A small dot before the status in the accent's indicator color, for a row changed since it was last looked at; read as \"Unseen\".",
      status: "How the item changed: A (added), M (modified), D (deleted), U (untracked) or R (renamed), in its change color, read out as the word.",
      actions: "Row controls at the end (lock, visibility), shown on hover, focus and selection. A click on one doesn't activate the row.",
      pinned: "With stickyBranches, the box at the top of the scroll that holds the pinned branches; it takes no room and is hidden from assistive tech.",
      pin: "A pinned branch: a copy of its row on the panel's fill, the last one closing on a divider. A click scrolls back to the branch and focuses it.",
    },
    // Source: TreeView.tsx handleKeyDown.
    keyboard: [
      ["Tab", "Moves into the tree on the active row (the last focused, else the current one), and out again."],
      ["Up or Down", "Moves to the previous or next enabled row; it stops at the ends."],
      ["Home or End", "Moves to the first or last enabled row."],
      ["Right", "Expands a closed branch, or moves to its first child when open. Right and Left swap in right-to-left text."],
      ["Left", "Collapses an open branch, or moves to the row's parent."],
      ["Enter or Space", "Activates the row in navigation mode, or toggles its check in checkbox mode."],
      ["A or Z", "Any letter: typing one, or a few in quick succession, moves to the next row whose label starts with them."],
    ],
    aria: [
      ["role=\"tree\"", "On the root; name it with aria-label."],
      ["role=\"treeitem\", aria-level, aria-posinset, aria-setsize", "On each row."],
      ["aria-expanded", "On branch rows."],
      ["aria-selected, aria-checked", "aria-selected in navigation mode, aria-checked in checkbox mode."],
      ["aria-current", "\"page\" on the row named by currentId."],
      ["aria-disabled", "On a disabled row, which the arrow keys and typeahead skip."],
    ],
  },

  menu: {
    // Spec: Job and boundaries; overlay boundaries shared with Context menu and Command palette.
    instead: [
      ["Searching every command and place from a shortcut", ["command-palette"], "Command palette filters by typing; a Menu has no search."],
      ["Actions on a right-clicked row or object", ["context-menu"], "Context menu opens this same Menu at the pointer instead of from a button."],
      ["Choosing one value for a form field", ["select", "combobox"], "Select and Combobox hold a value; a Menu runs actions."],
      ["Mixed controls: a segmented choice, fields or buttons", ["popover"], "A Popover holds any controls; every row of a Menu is a menu item."],
    ],
    // Spec: Variants, Behavior and accessibility, Feedback log; source: primitives.tsx MenuItem and Menu JSDoc.
    practices: [
      ["Do", "Open a Menu from a Button with trigger. For an icon-only trigger use the tooltip prop: a Tooltip can't wrap a menu's trigger from outside."],
      ["Do", "Group rows with MenuLabel and MenuSeparator, and pass shortcuts as shortcut so they line up in one column."],
      ["Do", "Use checked for a setting that toggles in place (the menu stays open), and radio with checked for one choice of several (it closes)."],
      ["Do", "Set keepOpen on view options whose effect shows behind the menu, such as sort or group."],
      ["Do", "Use tone=\"danger\" for a destructive action, and MenuSub for a row that opens a nested menu."],
      ["Do", "Put a count or badge in trailing; it sits before the shortcut, muted, as Nav item's."],
      ["Do", "Use header for a heading or a line about the list, and footer for one action on the whole list (\"Manage teams\"); they stay put while the rows scroll."],
      ["Do", "Set loading while the rows are on their way, and name what's missing in emptyText (\"No teams yet\")."],
      ["Do", "Make a row inactive with inactiveText when it can't run now for a reason that passes or the person can change; its note says why and the arrows still reach it."],
      ["Don't", "Put fields, buttons or segmented choices in a Menu; use a Popover."],
      ["Don't", "Use MenuSearch for a searchable list. It is deprecated: use Combobox or Command palette."],
      ["Don't", "Use a Menu to move between pages; use Nav."],
    ],
    // Spec: Anatomy, Decisions, Review notes; surface.css.
    parts: {
      root: "The menu surface: rows in a floating, lifted frame that scrolls when it outgrows the room beside its trigger.",
      item: "A row: a native button that owns the height and the hover and pressed plate; danger turns its label red and, under Danger hover's default, its plates red too; sub marks a submenu row.",
      icon: "The leading icon box, hidden from assistive tech; labels line up in one column across rows.",
      text: "The row's label.",
      lines: "Stacks the label over a description, for a row with a note under it.",
      description: "A muted note under the label, such as a model's summary or a setting's effect.",
      label: "A non-interactive group heading in small muted type.",
      "label-text": "The heading's text: on the rows' text column, or on the icon column over rows with icons.",
      separator: "A rule between groups.",
      shortcut: "A trailing small keycap (a string becomes one); in a menu with check rows, every shortcut sits in one column.",
      check: "The trailing check of a checkable row; it keeps its column when unchecked, so labels don't move.",
      toggle: "A small switch at the row's end, for a checkable row with indicator=\"switch\".",
      "search-surface": "Deprecated: a floating search field over a menu. Use Combobox or Command palette.",
      "sub-chevron": "The trailing chevron on a MenuSub row, pointing along the reading direction.",
      trailing: "A count, badge or status at the row's end, before the shortcut, muted in the row's type.",
      header: "Fixed above the rows with a rule under it: a heading (a string is set as a label) or a line about the list.",
      footer: "Fixed below the rows with a rule over it: an action row for the whole list, or a hint.",
      list: "With a header or footer, the rows between them; on an anchored menu it is the Scroll area, so only the rows scroll.",
      empty: "The row shown when there are no rows, in the muted ink: emptyText, \"No items\" by default.",
      loading: "The row shown while the rows load: a small Spinner in the icon column and loadingText. It waits 300 ms first, keeping its place.",
      match: "The typed text inside a filtered row (Command palette, Combobox, Custom select's filter), in the strong weight and the row's own ink.",
    },
    // Manifest states; surface.css.
    states: {
      disabled: "Dims, ignores the pointer and is skipped by the arrow keys and typeahead; native disabled.",
      highlighted: "The row a field-driven list points at (Combobox, Command palette) while focus stays in the field; it takes the hover plate.",
      selected: "The chosen value in a value picker such as Combobox, on a firmer plate. Menus of commands show a check instead.",
      inactive: "Drawn as disabled, with no hover or press plate, but the arrows, typeahead and the pointer reach it; choosing it does nothing and leaves the menu open, and its note says why.",
    },
    // Source: Overlays.tsx AnchoredMenu, primitives.tsx Menu and MenuSub.
    keyboard: [
      ["Enter or Space or Down", "On the trigger, opens the menu on its checked choice when it holds one (a radio row), else on its first row; Up opens on the last."],
      ["Up", "On the trigger, opens the menu on its last row."],
      ["Up or Down", "Moves between rows, wrapping and skipping disabled ones; inactive rows are reached, so their reason can be read."],
      ["Home or End", "Moves to the first or last row."],
      ["A or Z", "Any letter: typing it moves to the next row that starts with it."],
      ["Enter or Space", "Chooses the focused row. An action or radio choice closes the menu and returns focus to the trigger; a checkbox row stays open."],
      ["Right", "On a MenuSub row, opens its submenu on the first row (Left in right-to-left text); Enter or Space also open it."],
      ["Left or Escape", "In a submenu, closes it and returns to its row."],
      ["Escape", "Closes the menu and returns focus to the trigger."],
      ["Tab", "Closes the menu and moves focus on."],
    ],
    aria: [
      ["role=\"menu\"", "On the surface, labelled by the trigger unless you pass aria-label or aria-labelledby."],
      ["aria-haspopup, aria-expanded, aria-controls", "On the trigger, and on a MenuSub row for its submenu."],
      ["role=\"menuitem\"", "On every action row and MenuSub row."],
      ["role=\"menuitemcheckbox\", role=\"menuitemradio\", aria-checked", "On a row with checked; radio makes it a menuitemradio."],
      ["role=\"separator\"", "On MenuSeparator."],
      ["aria-disabled, aria-describedby", "On an inactive row: unavailable, described by its reason (the note, hidden from the row's name so it is said once)."],
      ["aria-busy", "On the menu while loading."],
      ["popover", "\"auto\" on an anchored menu: top layer; an outside press closes it."],
    ],
  },

  "context-menu": {
    // Spec: Job and boundaries; overlay boundaries shared with Menu and Command palette.
    instead: [
      ["Actions opened from a visible button", ["menu"], "Menu opens from its trigger; Context menu opens the same rows at the pointer."],
      ["Searching every command and place from a shortcut", ["command-palette"], "Command palette filters by typing; a context menu has no search."],
      ["Content or controls rather than actions", ["popover"], "Context menu is a Menu of actions; a Popover holds content."],
    ],
    // Spec: Decisions, Review note, Open questions; source: ContextMenu.tsx JSDoc.
    practices: [
      ["Do", "Wrap the area that opens it (a list, a canvas) and pass the rows as menu: MenuItem, MenuLabel and MenuSeparator."],
      ["Do", "For a list, set itemSelector and make menu a function of the row, so one context menu serves every row and knows which one it acts on."],
      ["Do", "Name the menu with menuLabel, such as \"Page actions\"."],
      ["Do", "Mark the acted-on row with data-context-target, which it carries while the menu is open; Area paints nothing for it by default."],
      ["Do", "Open it from outside with open (it opens at the area's start, or its first item), and hear every open and close in onOpenChange."],
      ["Don't", "Put actions only in a context menu. Touch has no long press to open it, so give each action a visible way in too."],
      ["Don't", "Try to open it from state: it opens only from the pointer or the keyboard, and reports through onOpenChange."],
    ],
    // Spec: Decisions; source: ContextMenu.tsx.
    parts: {
      root: "The area that opens the menu; it adds no box of its own.",
      menu: "The Menu it opens in the top layer, at the pointer or under the focused element, flipped to stay on screen.",
    },
    // Source: ContextMenu.tsx openFromKeyboard and the menu's onKeyDown; Menu's hosted keys.
    keyboard: [
      ["Shift+F10 or Menu", "Opens the menu under the focused element, at its start edge, with the first row focused."],
      ["Up or Down", "Moves between rows, wrapping and skipping disabled ones."],
      ["Home or End", "Moves to the first or last row."],
      ["A or Z", "Any letter: typing it moves to the next row that starts with it."],
      ["Enter or Space", "Chooses the row. An action or radio choice closes the menu; a checkbox row stays open."],
      ["Escape or Tab", "Closes the menu and returns focus to where it was."],
    ],
    aria: [
      ["role=\"menu\", aria-label", "On the menu, from menuLabel: \"Context menu\" unless you pass one."],
      ["popover", "\"auto\" on the menu: top layer; an outside press closes it."],
      ["data-context-target", "On the element itemSelector matched, while the menu is open."],
    ],
  },

  "command-palette": {
    // Spec: Job and boundaries; overlay boundaries shared with Menu and Context menu.
    instead: [
      ["Actions opened from a button, with no search", ["menu"], "A Menu opens from its trigger; a palette opens from anywhere and searches."],
      ["Picking a value for a field by typing", ["combobox"], "Combobox fills a field with a value; a palette runs the row and closes."],
      ["Actions on a right-clicked item", ["context-menu"], "Context menu acts on the item under the pointer."],
    ],
    // Spec: Variants, Behavior and accessibility, Working footer; source: CommandPalette.tsx JSDoc.
    practices: [
      ["Do", "Set hotkey=\"mod+k\" so it opens from anywhere: Cmd on Apple platforms, Ctrl elsewhere."],
      ["Do", "Give items a group, an icon and a description (a page's parent, a setting's value) so results can be told apart."],
      ["Do", "Add keywords for words people search by that aren't in the label or description."],
      ["Do", "Set keepOpen on an item that should leave the palette open after it runs."],
      ["Do", "Use inline for a search embedded in a page or sidebar; it renders in place, as a search landmark."],
      ["Do", "Give a result that lives somewhere a path (\"Label / Item one\"): it follows the name in the muted ink and shortens first."],
      ["Do", "Give items a preview when seeing the result helps choose it, such as a page; the pane hides when the palette is narrow."],
      ["Do", "Give a command that needs more input items of its own and a label ending in an ellipsis: choosing it opens them as a step."],
      ["Don't", "Use it to pick a value for a form field; that is Combobox."],
      ["Don't", "Put controls in a custom footer that need Tab to reach. Focus stays in the field; the default hints are static text that names the keys."],
    ],
    // Spec: Anatomy, List pass, Footer inset; command-palette.css.
    parts: {
      root: "The palette surface: the search field, the list and the footer. Inline, it is a search landmark named by aria-label.",
      modal: "The native modal dialog it opens in, near the top of the page over Dialog's scrim; a click on the scrim closes it.",
      search: "The search row: the icon and the field.",
      "search-icon": "The leading search glyph, on the rows' icon column.",
      input: "The combobox field. Focus stays here while the arrow keys move the highlight in the list.",
      list: "The listbox of results; it scrolls inside itself and keeps the highlighted row in view.",
      group: "A run of rows under its group heading; groups keep the order they first appear in.",
      item: "A result row, built on Menu's row; the highlighted row takes the hover plate.",
      text: "The row's label; the typed text is marked in it in the strong weight.",
      description: "Muted text after the label, such as a setting's value; it truncates.",
      path: "Where the result lives, after its name in the muted ink; it gives up its room before the name does.",
      more: "A chevron at the end of a row that opens a step.",
      back: "Inside a step, the Back button in the search icon's place.",
      step: "Inside a step, the names of the steps taken, muted, before the typed text.",
      body: "The results and the preview pane side by side, while some row has a preview.",
      preview: "The active row's preview beside the results, a region named Preview; it hides when the palette is under 640 wide.",
      empty: "Shown when nothing matches: emptyText, \"No results\" by default.",
      footer: "Key hints under the list, with no rule above them, or your own footer; footer={false} removes it.",
      hint: "One static hint: a key and what it does (Move, Open, Close, or Back in a step); not a control.",
      keys: "The keycaps of one hint, 2 apart (↑ ↓).",
    },
    // Source: CommandPalette.tsx handleKeyDown, hotkey effect and onCancel.
    keyboard: [
      ["Cmd+K or Ctrl+K", "With hotkey=\"mod+k\", opens or closes the palette: Cmd on Apple platforms, Ctrl elsewhere."],
      ["Up or Down", "Moves the highlight, wrapping and skipping disabled rows."],
      ["Ctrl+Home or Ctrl+End", "Highlights the first or last enabled row."],
      ["Enter", "Runs the highlighted row and closes the palette, unless the item keeps it open."],
      ["Escape", "Clears the search, then leaves a step, then closes the palette."],
      ["Backspace", "In an empty field inside a step, goes back a step."],
    ],
    aria: [
      ["role=\"combobox\", aria-activedescendant", "On the field: always expanded, controlling the list and pointing at the highlighted row."],
      ["aria-label", "Names the field, the list and the modal: \"Command palette\" unless you pass one."],
      ["role=\"listbox\", role=\"option\", aria-selected", "On the list and its rows; the highlighted row is selected."],
      ["aria-disabled", "On a disabled row, which the arrows skip."],
      ["aria-describedby", "Inside a step, on the field: the step's names."],
      ["role=\"region\"", "On the preview pane, named Preview unless you pass previewLabel."],
      ["role=\"group\", aria-labelledby", "On a group with a heading."],
      ["aria-live", "Not on the component: the result count, or the empty text, is said through the page's shared announcer while a query is typed."],
    ],
  },

  popover: {
    // Spec: Job and boundaries; overlay boundaries shared with Tooltip, Toggletip and Hover card.
    instead: [
      ["A list of actions", ["menu"], "Menu's rows and keys are built for commands; a Popover holds any content."],
      ["Naming or hinting a control", ["tooltip", "toggletip"], "A Tooltip names a control; a Toggletip holds a short note. Neither holds a task."],
      ["Previewing what a link points to", ["hover-card"], "Hover card opens on hover and repeats what the link leads to; a Popover opens on a press."],
      ["Content that must be answered before the page goes on", ["dialog"], "Dialog is modal; a Popover leaves the page usable."],
    ],
    // Spec: Job and boundaries, Variants, Behavior and accessibility; source: primitives.tsx Popover JSDoc.
    practices: [
      ["Do", "Use a Popover for a short task beside its trigger: a field, a segmented choice, a few buttons."],
      ["Do", "Pass trigger so it anchors, flips and shifts to stay on screen, takes focus on open and returns it on close."],
      ["Do", "Give it a PopoverTitle, which names it, or pass aria-label when it has no visible title."],
      ["Do", "Put a PopoverClose in the header when the task can be finished or abandoned; it closes the Popover and returns focus to the trigger."],
      ["Do", "Pass anchor to place it against a field's shell when the input inside opens it."],
      ["Don't", "Put a list of commands in it; that is a Menu, with its keyboard."],
      ["Don't", "Use it for a choice that must be made: Escape and an outside press close it without one. Use Dialog."],
    ],
    // Spec: Anatomy, Decisions; source: primitives.tsx.
    parts: {
      root: "The floating surface at a reading width, capped at its container, with the shared lift; a Popover holding only a Calendar hugs it.",
      header: "The title and description, with an optional PopoverClose; the title centres on the close's line.",
      title: "PopoverTitle: a heading (h2 by default; level sets it) that also names the Popover. level={false} renders a plain block.",
      description: "Muted text under the title.",
      body: "The main content: fields, choices, text.",
      footer: "Actions or a step count at the bottom.",
      step: "A tour's progress at the start of the footer, \"1 of 3\", muted, with figures of one width.",
      media: "An image at the top, its corners following the surface's.",
      arrow: "The optional curved pointer toward the trigger, on whichever side the Popover lands; hidden from assistive tech.",
      "arrow-edge": "The arrow's outline, which joins the surface's border.",
    },
    // Source: Overlays.tsx AnchoredPopover (popovertarget trigger, focus on open), overlay.ts useNativePopover.
    keyboard: [
      ["Enter or Space", "On the trigger, opens or closes the Popover."],
      ["Tab", "Moves through the Popover's controls. Focus starts on its first control, or on the surface."],
      ["Escape", "Closes it and returns focus to the trigger."],
    ],
    aria: [
      ["aria-haspopup, aria-expanded, aria-controls", "On the trigger; aria-haspopup is \"dialog\"."],
      ["role=\"dialog\"", "On an anchored Popover: a non-modal dialog."],
      ["aria-labelledby", "Points at the PopoverTitle, unless you pass aria-label or aria-labelledby."],
      ["popover", "\"auto\" on an anchored Popover: top layer; Escape and an outside press close it."],
    ],
  },

  "hover-card": {
    // Spec: Job and boundaries, Content; overlay boundaries shared with Tooltip, Toggletip and Popover.
    instead: [
      ["Naming a control or giving its shortcut", ["tooltip"], "A Tooltip is a short label for a control; a Hover card previews a link's destination."],
      ["Content opened by a press, or holding fields and actions", ["popover"], "A Popover can hold a task; a Hover card holds only what the link leads to."],
      ["A short note about a label, behind an info button", ["toggletip"], "A Toggletip explains a setting and pins open on a press."],
      ["Showing the sources behind an answer", ["citation"], "Citation covers an answer with its sources; Hover card is for a plain link."],
    ],
    // Spec: Job and boundaries, Decisions (server rendering, semantics), Feedback log; source: HoverCard.tsx JSDoc.
    practices: [
      ["Do", "Put it on a link that works on its own (a person, a page, a web link), so nothing is lost on touch, where the card never opens."],
      ["Do", "Build it from Popover's parts, with PopoverTitle level={false} so previews don't add headings to the page outline."],
      ["Do", "Lead a person card with the identity row (avatar, then name over handle) and end it with the meta facts."],
      ["Do", "Turn openOnFocus off only where the same content is reached another way, such as a sheet the arrows sweep with an inspector beside it."],
      ["Don't", "Put actions or information in the card that the link's destination doesn't have; assistive tech doesn't announce the card."],
      ["Don't", "Place it inside a paragraph in server-rendered HTML: its blocks break the paragraph and hydration fails. Put it in a div."],
    ],
    // Spec: Decisions; hover-card.css.
    parts: {
      root: "Popover's surface, starting at the link's start edge; it opens on hover or keyboard focus.",
      identity: "The person row: an avatar, then the name over a muted handle.",
      meta: "A row of muted caption facts, such as team and local time; on a page card, the path above the title.",
    },
    // Source: overlay.ts useHoverIntent, HoverCard.tsx.
    keyboard: [
      ["Tab", "Focusing the link opens the card at once; moving focus away closes it."],
      ["Escape", "Closes the card without closing a Popover or Dialog it sits in."],
    ],
    aria: [
      ["popover", "\"manual\" on the card, in the top layer. It has no role and doesn't describe the link, since it only repeats what the link leads to."],
    ],
  },

  tooltip: {
    // Spec: Job and boundaries; overlay boundaries shared with Toggletip, Popover and Hover card.
    instead: [
      ["A note with a link, or one that touch must reach", ["toggletip"], "A Toggletip pins open on a press, so touch reaches it and a link inside can be followed."],
      ["Content people act on: fields, choices, buttons", ["popover"], "A Tooltip can't be focused and holds nothing interactive."],
      ["Previewing what a link points to", ["hover-card"], "Hover card previews a link's destination; a Tooltip names a control."],
      ["Reporting status after an action", ["toast"], "A Tooltip names a control; status belongs in a Toast."],
    ],
    // Spec: Job and boundaries, Owner decisions, Behavior and accessibility; source: primitives.tsx Tooltip JSDoc.
    practices: [
      ["Do", "Use a Tooltip to name an icon-only control, optionally with its keyboard shortcut in a Kbd."],
      ["Do", "Set describes={false} when the tooltip repeats the trigger's accessible name, so it isn't announced twice."],
      ["Do", "Keep the default delay, so sweeping across a toolbar doesn't flash tooltips; once one has shown, the next opens at once."],
      ["Do", "On a menu trigger, use Menu's tooltip prop: a Tooltip can't wrap a menu's trigger from outside."],
      ["Don't", "Put links, buttons or anything to act on in a Tooltip; it can't be focused."],
      ["Don't", "Hide information people need in a Tooltip: touch never opens it."],
    ],
    // Manifest: no elements; spec: Anatomy.
    parts: {
      root: "The label surface on the side given (top by default), flipped when that side lacks room; arrow adds a small pointer at the trigger.",
    },
    states: {
      instant: "Opened within a moment of another tooltip closing: it shows without the delay or the fade.",
    },
    // Source: overlay.ts useHoverIntent, Overlays.tsx AnchoredTooltip.
    keyboard: [
      ["Tab", "Keyboard focus on the trigger shows the tooltip at once; leaving the trigger hides it."],
      ["Escape", "Hides the tooltip without closing a Popover or Dialog it sits in."],
    ],
    aria: [
      ["role=\"tooltip\"", "On the surface."],
      ["aria-describedby", "On the trigger, added to any description it has, unless describes is false."],
      ["popover", "\"manual\" on an anchored tooltip, in the top layer."],
    ],
  },

  toggletip: {
    // Spec: Job and boundaries; overlay boundaries shared with Tooltip, Popover and Hover card.
    instead: [
      ["Naming a control or showing its shortcut", ["tooltip"], "A Tooltip names a control and is never interactive."],
      ["A task, or a note that needs a title or actions", ["popover"], "A Popover holds fields, choices and buttons."],
      ["Previewing what a link points to", ["hover-card"], "Hover card previews a link's destination; a Toggletip explains a label."],
      ["Text people must read to complete a field", ["field"], "Put it in the Field's description, which always shows."],
    ],
    // Spec: Variants, Job and boundaries; source: Toggletip.tsx JSDoc.
    practices: [
      ["Do", "Place it right after the label it explains: md beside regular labels, sm beside small captions."],
      ["Do", "Keep the note to a sentence or two; a Link inside it takes ink=\"inherit\"."],
      ["Do", "Use the info icon to explain and help to guide; only the mark changes."],
      ["Do", "Name the button after its subject with label when a view has several."],
      ["Don't", "Put a title, buttons or media in the note; that is a Popover or a Hover card."],
      ["Don't", "Hide something people need to finish a task behind it."],
    ],
    // Spec: Anatomy, States; source: Toggletip.tsx.
    parts: {
      root: "The small info or help button: the mark, a hover plate and, while pinned, a firmer one.",
      surface: "The note: a Tooltip surface that can sit inside a paragraph or a label, holding text and an optional link.",
    },
    states: {
      expanded: "Pinned open by a press: the button keeps a firmer plate and the note stays until a second press, Escape, a press outside, or focus leaves both.",
    },
    // Source: Overlays.tsx AnchoredToggletip, overlay.ts useHoverIntent; native button.
    keyboard: [
      ["Tab", "Focusing the button previews the note at once. Pinned, Tab moves on into a link in the note."],
      ["Enter or Space", "Pins the note open, or closes it when pinned."],
      ["Escape", "Closes the note without closing a Popover or Dialog it sits in."],
    ],
    aria: [
      ["aria-label", "Names the button: label, or \"More information\" (info) and \"Help\" (help)."],
      ["aria-describedby", "On the button, pointing at the note, so the note is read on focus."],
      ["aria-expanded, aria-controls", "On the button; aria-expanded is true while the note is pinned."],
    ],
  },

  dialog: {
    // Spec: Job and boundaries; overlay boundaries shared with Confirm dialog and Drawer.
    instead: [
      ["Confirming an action that can't be undone", ["confirm-dialog"], "Confirm dialog is the forced choice: Cancel focused first, no close control."],
      ["A longer task beside the page, such as editing a record or filters", ["drawer"], "A Drawer slides in from an edge and keeps the page in view."],
      ["Content beside its trigger that shouldn't block the page", ["popover"], "A Popover is non-modal and anchored to its trigger."],
      ["Telling someone something happened, with nothing to answer", ["toast"], "A Toast reports without interrupting."],
    ],
    // Spec: Variants, Behavior and accessibility; source: primitives.tsx Dialog JSDoc.
    practices: [
      ["Do", "Pass trigger to open it as a native modal: focus moves inside and stays there, and returns to the trigger on close."],
      ["Do", "Use open and onOpenChange to open it without a trigger, such as from a menu item."],
      ["Do", "Give it a title, which names it; without one, pass aria-label."],
      ["Do", "Put the actions in footer; they end-align and go full width on a narrow screen."],
      ["Do", "Let long content scroll in the body, between a fixed header and footer; a rule shows under the header once it has scrolled."],
      ["Do", "Pick the size by content: sm for a short form, md (the default) for most, lg for a table or two columns, xl for settings with their own sidebar."],
      ["Do", "Set fullHeight when the content changes as people work in it (tabs, a search, steps), so the dialog doesn't jump."],
      ["Don't", "Turn off the close control on an ordinary dialog. A forced choice without one is Confirm dialog."],
      ["Don't", "Size a Dialog with your own width; use size, which matches Drawer's widths."],
      ["Don't", "Use a Dialog for something that can wait: it blocks the page."],
    ],
    // Spec: Decisions; surface.css.
    parts: {
      root: "The surface: one inset around and one gap between sections, its corner concentric with the close; 384, 480, 720 or 880 wide by size, never wider than the screen less 32.",
      header: "Holds the heading and the close; the title centres on the close's line. Once the body has scrolled, a rule shows under it, edge to edge.",
      heading: "Groups the title and the description.",
      title: "The h2 that names the dialog.",
      description: "Muted text under the title that describes the dialog.",
      dismiss: "The corner close: a ghost icon Button named by dismissLabel (\"Close dialog\"). It calls onDismiss, then closes the dialog.",
      body: "Your content. It scrolls when the dialog runs out of room and leaves space for focus rings at its edges.",
      footer: "The actions, end-aligned with no divider; full width on a narrow screen.",
      modal: "The native dialog element around the surface, with the scrim behind it; a press that starts and ends on the scrim closes it.",
    },
    states: {
      scrolled: "The body has scrolled from its top: a rule in the separator's line shows under the header.",
    },
    // Native modal dialog (spec: Behavior and accessibility).
    keyboard: [
      ["Enter or Space", "On the trigger, opens the dialog."],
      ["Tab or Shift+Tab", "Moves through the dialog's controls; the page behind is inert while it is open."],
      ["Escape", "Closes the dialog and returns focus to the trigger."],
    ],
    aria: [
      ["aria-haspopup, aria-controls", "On the trigger: \"dialog\" and the modal's id."],
      ["aria-labelledby, aria-describedby", "From title and description, on the native dialog (or the surface inline); your aria-label or aria-labelledby wins."],
      ["role=\"dialog\", aria-modal", "On the surface when it renders inline, with no trigger or open."],
      ["role=\"alertdialog\"", "Passed through to the element with the dialog role, for a confirmation."],
    ],
  },

  "confirm-dialog": {
    // Spec: Job and boundaries; overlay boundaries shared with Dialog and Drawer.
    instead: [
      ["Open content, a form or a longer read", ["dialog"], "Dialog holds any content; Confirm dialog is a question and two buttons."],
      ["An action that can be undone", ["toast"], "Act at once and offer Undo in a Toast; it interrupts less than asking first."],
      ["Inline status or a warning in the page", ["alert"], "An Alert informs without asking for a choice."],
    ],
    // Spec: Job and boundaries, Decisions, Settled questions; source: ConfirmDialog.tsx JSDoc.
    practices: [
      ["Do", "Title it as a question that names the action (\"Delete chat?\"), and say in the description what happens and that it can't be undone."],
      ["Do", "Label the action with a verb phrase that repeats it (\"Delete chat\"), never OK or Yes."],
      ["Do", "Use tone=\"danger\" when the action destroys something; keep neutral otherwise."],
      ["Do", "Return a promise from onConfirm: the action shows loading and the dialog stays open until it settles, and stays open if it fails."],
      ["Do", "Open it from a menu item with open and onOpenChange, or from a button with trigger."],
      ["Don't", "Confirm an action that can be undone; act and offer Undo instead."],
      ["Don't", "Add a close control or an icon. Escape, Cancel and the scrim already cancel, and the action carries the tone."],
    ],
    // Manifest: no elements; spec: Decisions.
    parts: {
      root: "Dialog's surface as an alertdialog: the question, the description, any extra content (a checkbox, a name to type), then Cancel and the action.",
    },
    // Source: ConfirmDialog.tsx (focus on Cancel), Dialog's native modal.
    keyboard: [
      ["Tab or Shift+Tab", "Moves between Cancel, the action and any content. Focus starts on Cancel, the least destructive choice."],
      ["Enter or Space", "Presses the focused button."],
      ["Escape", "Cancels: closes without acting and calls onCancel."],
    ],
    aria: [
      ["role=\"alertdialog\"", "On the native modal."],
      ["aria-labelledby, aria-describedby", "From the title and the description."],
      ["aria-busy, aria-disabled", "On the action while a promise from onConfirm is pending; Cancel is disabled meanwhile."],
    ],
  },

  drawer: {
    // Spec: Job and boundaries; overlay boundaries shared with Dialog and Confirm dialog.
    instead: [
      ["Short content or a form that needs a response, centred", ["dialog"], "A Dialog is centred and short; a Drawer holds a longer task at the screen's edge."],
      ["A panel that is part of the layout and stays open", ["panel"], "A Panel is docked in the layout; a Drawer slides over the page."],
      ["Confirming an action that can't be undone", ["confirm-dialog"], "Confirm dialog is the forced choice before the action."],
    ],
    // Spec: Variants, Settled questions; source: Drawer.tsx JSDoc.
    practices: [
      ["Do", "Use a Drawer for a task beside the page: editing a record, settings, filters."],
      ["Do", "Use size md when the content needs Dialog's width, and side=\"bottom\" for a sheet from the bottom edge."],
      ["Do", "Use actions=\"stacked\" for full-width buttons, primary first; the default row ends them as Dialog does."],
      ["Do", "Set modal={false} for a side peek that leaves the page usable; Escape and the close control still close it."],
      ["Do", "Give it a title, which names it; without one, pass aria-label."],
      ["Do", "Use onDismiss for work the close control does before the drawer closes, as Dialog's; onOpenChange hears every close."],
      ["Don't", "Use a Drawer for a short question; use Dialog or Confirm dialog."],
      ["Don't", "Turn off the close control on a non-modal Drawer: with no scrim, it and Escape are the only ways out."],
    ],
    // Spec: Decisions; Dialog's anatomy.
    parts: {
      root: "The panel against the screen's edge, with a border on its inner edge; rounded only at the top when it comes from the bottom.",
      modal: "The native dialog it opens in, with the scrim behind it. Non-modal, it is a popover with no scrim.",
      header: "Dialog's header: the heading and the close.",
      heading: "Groups the title and the description.",
      title: "The h2 that names the drawer.",
      description: "Muted text under the title that describes the drawer.",
      dismiss: "The corner close: a ghost icon Button named by dismissLabel (\"Close\").",
      body: "Your content, in a Scroll area between the header and footer.",
      footer: "The actions: in a row at the end, or stacked full width with actions=\"stacked\"."
    },
    // Native modal dialog; source: Drawer.tsx (non-modal Escape and focus).
    keyboard: [
      ["Enter or Space", "On the trigger, opens the drawer."],
      ["Tab or Shift+Tab", "Moves through the drawer's controls; a modal Drawer makes the page behind inert."],
      ["Escape", "Closes it and returns focus to where it was. A non-modal Drawer closes when focus is inside it."],
    ],
    aria: [
      ["aria-haspopup, aria-controls", "On the trigger: \"dialog\" and the drawer's id."],
      ["aria-labelledby, aria-describedby", "On the native dialog, from title and description; your aria-label or aria-labelledby wins."],
      ["popover", "\"manual\" when modal is false: the top layer, without making the page inert."],
      ["role=\"dialog\"", "On the surface when it renders inline."],
    ],
  },
};
