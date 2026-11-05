/** Documentation entries: conversation and agent chat. Format and rules: ../documentation.mjs and the area-component-docs skill. */
export default {
  message: {
    // Spec: Job and boundaries; peers.
    instead: [
      ["Writing and sending the next message", ["composer"], "Message lays out a turn already sent; the Composer is where the next one is written."],
      ["Showing what an agent did, or how a turn ended", ["step", "turn-notice"], "Tool calls and endings are lines of their own in the turn, not prose."],
      ["Code, tables or sources inside a reply", ["code-block", "table", "citation"], "Message only lays out the turn; rich content inside the prose uses those components."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; source: Message.tsx JSDoc.
    practices: [
      ["Do", "Use author=\"user\" for the person's words, a bubble at the column's end, and the default assistant layout for replies, prose across the column."],
      ["Do", "Set authorName to the assistant's or product's name so the turn reads \"<name> said\"; the defaults are You and Assistant."],
      ["Do", "Put copy, rate, read aloud and regenerate in MessageActions as ghost icon Buttons, each with an aria-label."],
      ["Do", "Set streaming while the answer arrives: a dot follows the last word, the turn is marked busy and its actions wait until it is done."],
      ["Don't", "Give the person's bubble an accent fill or its own corner: it is the neutral component fill on the Composer's corner, where the words were typed."],
      ["Don't", "Recolour the actions: they take the ghost Button's quiet ink, as every icon action does."],
    ],
    // Spec: Decisions; manifest elements.
    parts: {
      root: "An article for one turn, named \"<name> said\"; it lays out the bubble or the prose, then the actions.",
      bubble: "The person's words: at most 70% of a wide column and nearly the whole of a narrow one (48 short of it), at its end, on the Composer's corner and the neutral component fill.",
      content: "The assistant's prose across the column, at the body size; paragraphs, lists, code and citations sit inside it.",
      actions: "MessageActions: a named group of ghost icon Buttons with no gap. On the person's turn it shows on hover and focus (always on touch).",
      cursor: "The dot after the last word while streaming; it breathes, and rests at full ink with Motion 0 or reduced motion.",
    },
    // Spec: Variants (state); message.css.
    states: {
      streaming: "The cursor follows the last word, the actions are hidden until the answer is done, and the article is aria-busy.",
    },
    // Spec: Behavior and accessibility; the actions are Buttons.
    keyboard: [
      ["Tab", "Moves through the turn's action Buttons; focusing one shows the person's actions at once."],
    ],
    aria: [
      ["aria-label", "Always, on the article: \"<authorName> said\" (\"You said\" or \"Assistant said\" by default)."],
      ["aria-busy", "While streaming."],
      ["role=\"group\", aria-label", "On MessageActions, named \"Message actions\" unless you pass label."],
    ],
  },

  composer: {
    // Spec: Job and boundaries; Chat additions.
    instead: [
      ["A multi-line field in a form, with a label", ["textarea"], "Composer has no label chrome and carries a send action; a form field is a Textarea."],
      ["Searching or filtering", ["search-field"], "Composer writes and sends a message, it doesn't filter."],
      ["The agent needs a yes or no before it acts", ["approval"], "Approval takes the composer's place until the person answers."],
    ],
    // Spec: Owner decisions, Decisions (loading), Behavior and accessibility, Chat additions; source: Composer.tsx JSDoc.
    practices: [
      ["Do", "Use inline for a one-row composer and stacked when the actions and mode need their own footer row under the field."],
      ["Do", "Set loading while a reply streams and pass onStop: the field stays editable, Enter doesn't send, and send becomes Stop."],
      ["Do", "Pass onQueue in an agent chat so Enter during a run queues the draft for a Queue instead of doing nothing."],
      ["Do", "Put context chips (Chip input) and Attachments in context, and a Composer menu in menu, so they share the composer's width."],
      ["Do", "Let the + open a Menu of modes and things to add (a mode's icon in its tone's ink, then files, the model, connectors)."],
      ["Do", "Pass a ModelPicker as mode and attach-style actions as leadingActions; disabled disables every nested action too."],
      ["Do", "Put where the message runs in header, and tools with a ComposerNote in footer; they share the composer's width and line up with its shell."],
      ["Do", "Pass onFiles so files dropped on the composer or pasted into it arrive as files, and pair it with a ComposerAttach for picking."],
      ["Do", "Give a ModelPicker efforts when the model has a reasoning level; the effort shows muted after the name."],
      ["Don't", "Build dictation as a plain Button: ComposerMic is a toggle, so it keeps one name and reports its state with aria-pressed."],
      ["Don't", "Turn off submitOnEnter just to allow new lines: Shift+Enter already adds one, and with it off only Cmd+Enter or Ctrl+Enter sends."],
      ["Don't", "Wrap it in a Field or give it a visible label: label names the field for assistive tech only."],
      ["Don't", "Disable the composer while a reply streams; use loading, so the next prompt can be drafted."],
    ],
    // Spec: Anatomy, Decisions, Chat additions; manifest elements.
    parts: {
      root: "The shell: Card's edge and Card's corner (its actions concentric inside it), the composer's width and its inset.",
      context: "A row inside the shell above the field for context chips and Attachments; it wraps on the composer's gap.",
      entry: "The row that holds the field, and in the inline layout the leading and trailing actions beside it.",
      input: "A native textarea at the body size; it grows with its text up to five rows, then scrolls.",
      actions: "A fieldset of action Buttons, leading or trailing; disabling the composer disables everything in it.",
      extras: "The inline layout's trailing slot for your own actions, between the mode and the send Button.",
      footer: "The stacked layout's row under the field: leading actions and mode at the start, trailing actions and send at the end.",
      submit: "The send Button: solid neutral, icon-only; unavailable while the field is empty, and Stop while loading.",
      mic: "ComposerMic: a ghost icon-only toggle Button, the mic at rest and the waveform on the selected plate while on.",
      attach: "ComposerAttach: the ghost + Button that opens the file picker.",
      file: "ComposerAttach's hidden file input; the chosen files go to its onFiles.",
    },
    // Spec: Decisions (disabled).
    states: {
      disabled: "Field paint at full opacity, the text and placeholder in the disabled ink; the field and every action are disabled.",
      dragging: "Files are dragged over a composer with onFiles: the selection edge on the row plate, File upload's drop paint, until they leave or drop.",
    },
    // Source: Composer.tsx keyDown, submit.
    keyboard: [
      ["Enter", "Sends the draft (not during IME composition). While loading it queues the draft with onQueue, or does nothing."],
      ["Shift+Enter", "Adds a line."],
      ["Cmd+Enter or Ctrl+Enter", "Sends, also when submitOnEnter is off."],
      ["Tab", "Moves from the field to the actions and the send Button."],
    ],
    aria: [
      ["aria-busy", "On the root while loading."],
      ["aria-pressed", "On ComposerMic: true while dictating; its name (label, \"Dictate\") stays the same."],
      ["aria-label", "On the send Button (submitLabel, \"Send message\") and on Stop (stopLabel, \"Stop\")."],
      ["for", "A visually hidden label, from label (\"Message\"), names the textarea; inputProps.id wins over the generated id."],
    ],
  },

  "composer-menu": {
    // Spec: Job and boundaries; peers.
    instead: [
      ["A ⌘K list of every command in the app", ["command-palette"], "The Composer menu only completes an @ or / typed in the composer."],
      ["Actions opened from a button", ["menu"], "A Menu takes focus from its trigger; the Composer menu leaves focus in the field."],
      ["Suggesting values for a form field", ["combobox"], "Combobox is the form control with its own field and list."],
    ],
    // Spec: Job and boundaries, Decisions; source: ComposerParts.tsx JSDoc; app wiring in chat.tsx.
    practices: [
      ["Do", "Pass it as the Composer's menu, open while an @ or / is being completed, and filter its rows by what follows."],
      ["Do", "Keep focus in the field and drive the menu from onInputKeyDown: Up and Down move activeId, Enter or Tab picks, Escape closes."],
      ["Do", "Make the field a combobox: aria-controls pointing at the menu's id and aria-activedescendant at the active row (`${id}-${item.id}`)."],
      ["Do", "Name the list with aria-label (\"Files\", \"Commands\"). label and groups still work for one release; use aria-label and items."],
      ["Do", "Give file rows their folder as path, and group rows with a label when a list mixes kinds."],
      ["Do", "Set emptyLabel to say what found nothing (\"No files found\", \"No matching commands\")."],
      ["Don't", "Move focus into the list: a pointer press on a row is kept from taking focus, so typing continues."],
      ["Don't", "Put what a pick does in the menu; onPick hands the row back, and the app inserts a chip or runs the command."],
    ],
    // Spec: Decisions; manifest elements.
    parts: {
      root: "A listbox above the composer at its width, on Menu's surface and rows; it scrolls past its maximum height.",
      path: "A file's folder at the row's end in the shortcut ink, cut from its start; it gives way before the name does.",
      empty: "One muted row a row tall at the text inset, as every list's empty row, shown when no group has items.",
    },
    aria: [
      ["role=\"listbox\", aria-label", "On the root, from aria-label (\"Files\", \"Commands\"); the deprecated label is the fallback."],
      ["role=\"option\", aria-selected", "On each row; aria-selected is true on the row matching activeId."],
      ["role=\"group\", aria-labelledby", "On each group with a label, named by its section label."],
    ],
  },

  attachment: {
    // Spec: Job and boundaries.
    instead: [
      ["A file that is not an image", ["chip"], "Non-image files are Chip input pills with a document icon."],
      ["Choosing files from a drop zone or a button", ["file-upload"], "File upload picks files; Attachment shows one image already attached."],
      ["An image in a sent message", ["message", "figure"], "Attachment is the image before sending, in the Composer's context row."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; source: ComposerParts.tsx JSDoc.
    practices: [
      ["Do", "Put Attachments in the Composer's context row, beside any context chips."],
      ["Do", "Set status=\"uploading\" with progress while it uploads; leave progress out while it is unknown and the ring turns."],
      ["Do", "Set status=\"error\" with error saying why it failed; it is the tile's tooltip and its spoken name."],
      ["Do", "Give every tile name, the file's name: it names the tile, its remove control and its upload."],
      ["Do", "Pass onDismiss to show the remove control, and dismissLabel to name it in your language (\"Remove <name>\" by default). onRemove still works for one release."],
      ["Don't", "Use it for documents or other files; they are Chip input pills."],
      ["Don't", "Use it outside the Composer's context row; how a sent message shows images belongs to Message."],
    ],
    // Spec: Decisions, Round 52; manifest elements.
    parts: {
      root: "A square tile on the Composer's button corner with a 1px card edge drawn over the picture; a failed tile takes the fields' invalid edge.",
      image: "The thumbnail, filling the tile; it has no alt text of its own, the tile is named by the file.",
      overlay: "Over the picture: a progress ring while uploading, or a danger mark when it failed.",
      remove: "A small square button inside the top-end corner, on the on-media paint; shown on hover and focus, always on touch.",
    },
    // Source: the remove control is a native button.
    keyboard: [
      ["Tab", "Moves to the remove control, which shows while it has focus."],
      ["Enter or Space", "Removes the attachment."],
    ],
    aria: [
      ["role=\"group\", aria-label", "Always: the tile is a group named by the file's name."],
      ["aria-busy", "While uploading; the ring is named \"Uploading <name>\", with the percentage once progress is known."],
      ["aria-label", "On the remove control, from dismissLabel (\"Remove <name>\" by default); on the failed mark (role=\"img\"), the reason."],
      ["title", "While status is error: the reason, as the tile's tooltip."],
    ],
  },

  queue: {
    // Spec: Job and boundaries; peers.
    instead: [
      ["The agent's own plan for the run", ["plan"], "Plan lists what the agent will do; Queue holds what the person sent while it works."],
      ["Suggesting prompts before anything is written", ["prompt-suggestions"], "Prompt suggestions are starters under an empty composer, not sent messages."],
    ],
    // Spec: Job and boundaries, Decisions; source: ComposerParts.tsx; app wiring in chat.tsx.
    practices: [
      ["Do", "Show it above the composer only while messages wait, fed by the Composer's onQueue, and send them in order when the run finishes."],
      ["Do", "Pass onSendNow to stop the run and send that message at once, and onDismiss so a message can be dropped (onRemove still works for one release)."],
      ["Do", "Mark a message sending while it goes, and failed with onRetry when it could not be sent."],
      ["Do", "Set title to say the queue is paused (\"2 queued, paused\") after the person stops a run, until the next send."],
      ["Don't", "Offer reordering or sending without stopping: neither is built."],
      ["Don't", "Mark a message failed without onRetry: the row then offers only Remove."],
    ],
    // Spec: Decisions, Round 51/52; manifest elements.
    parts: {
      root: "The agent card: a section with Code block's frame, at the card's text size, named by its head.",
      head: "A button a row tall that folds the list; the messages follow it with no rule between.",
      title: "\"N queued\" by default, in the muted ink; cut short on one line.",
      chevron: "Points down while open, turns when folded; Accordion's hover plate behind it.",
      items: "The ordered list (ol) of waiting messages, in the order they will send; hidden while folded.",
      item: "One message as a Menu row. Sending: dimmed, with a spinner. Failed: a mark, and Retry in place of Send now.",
      text: "The message on one line, cut short with an ellipsis.",
      status: "The spinner on a sending row, or the failed mark.",
      actions: "Send now (or Retry) and Remove over the row's end on hover and focus; always shown on a failed row and on touch.",
    },
    // Manifest state; source: data-open.
    states: {
      open: "The list shows under the head and the chevron points down; folded, only the head is left. Open by default.",
    },
    // Source: native buttons.
    keyboard: [
      ["Tab", "Moves to the head, then each row's Send now or Retry and Remove, which show while focused."],
      ["Enter or Space", "On the head, folds or opens the list; on an action, runs it."],
    ],
    aria: [
      ["aria-expanded, aria-controls", "On the head, from open, pointing at the list."],
      ["aria-labelledby", "On the section and the list, from the title."],
      ["aria-label", "On each Remove, \"Remove “<text>”\"; on a failed row's mark (role=\"img\"), \"Not sent\"."],
    ],
  },

  "prompt-suggestions": {
    // Spec: Job and boundaries.
    instead: [
      ["Filtering or choosing a value", ["chip"], "Chip is a selectable filter; a suggestion fills or sends a prompt."],
      ["Actions opened from a trigger", ["menu"], "Menu is a list of commands behind a button; suggestions are always shown under an empty composer."],
      ["Completing an @ or / while typing", ["composer-menu"], "The Composer menu completes what is being typed; suggestions start an empty conversation."],
    ],
    // Spec: Owner decisions, Decisions, Behavior and accessibility; source: PromptSuggestions.tsx JSDoc; pages.mjs note.
    practices: [
      ["Do", "Use the list layout under the composer, at its width; use chips in narrow or inline places such as a side panel or an empty state."],
      ["Do", "Decide in onSelect whether choosing fills the composer or sends the prompt."],
      ["Do", "Hide the list once there is a draft: it is for an empty composer."],
      ["Do", "Pass onDismiss to let people remove a suggestion they don't want (list layout only)."],
      ["Don't", "Expect a dismiss on chips: chips have none."],
      ["Don't", "Write long prompts: a row shows one line and cuts the rest."],
    ],
    // Spec: Decisions; manifest elements.
    parts: {
      root: "A list named \"Suggestions\" at the composer's width; rows stack 2 apart, or chips wrap.",
      row: "One list item, holding the suggestion and its dismiss.",
      item: "The suggestion button: the composer's height and corner, muted text, Menu's row plate on hover and press.",
      icon: "An optional icon centred under the composer's leading action.",
      text: "The prompt on one line, starting under the composer's placeholder, cut short with an ellipsis; it is the button's name.",
      shortcut: "The keys that choose it (items' shortcut), a keycap at the row's end, or after the label in a chip.",
      dismiss: "A small ghost icon Button at the row's end, shown on hover and focus (always on touch).",
    },
    // Source: native buttons.
    keyboard: [
      ["Tab", "Moves through the suggestions and their dismiss Buttons."],
      ["Enter or Space", "Chooses the suggestion, or dismisses it from its dismiss Button."],
    ],
    aria: [
      ["aria-label", "On the list, from label (\"Suggestions\"); on each dismiss, \"Dismiss “<prompt>”\"."],
    ],
  },

  "model-picker": {
    // Spec: Job and boundaries.
    instead: [
      ["Choosing a value in a form", ["select"], "Select is a form field; the Model picker sits in the composer."],
      ["Two or three options that should stay visible", ["segmented"], "Segmented shows every option at once."],
      ["Setting how hard a model thinks", ["slider"], "An effort setting is a separate Slider, not part of this menu."],
    ],
    // Spec: Decisions; source: ModelPicker.tsx JSDoc; pages.mjs note.
    practices: [
      ["Do", "Pass it as the Composer's mode, so it sits with the composer's actions."],
      ["Do", "Give a model a description for a short note under its name (\"Best for code\")."],
      ["Do", "Set label to what is being chosen (\"Model\", \"Mode\"); it names the menu and starts the trigger's name."],
      ["Do", "Pass props for the trigger Button through triggerProps; other props stay on the wrapper."],
      ["Don't", "Put other settings in its menu; it holds one choice of model."],
      ["Don't", "Give the trigger a fill or a pill shape: it is a ghost Button, quiet in the composer."],
    ],
    // Spec: Decisions; manifest elements.
    parts: {
      root: "A wrapper around the trigger and its Menu, which ends under the trigger and flips above near the page's end.",
      trigger: "A ghost neutral Button with the current model's name and a trailing chevron; it holds its pressed plate while open.",
      name: "With an effort, the model's name in the default ink.",
      effort: "How hard the model works, muted after its name (\"Option one Medium\"); chosen in its own Effort group under the models.",
    },
    // Source: Menu trigger path (Overlays.tsx AnchoredMenu) and ModelPicker.tsx JSDoc.
    keyboard: [
      ["Enter or Space or Down or Up", "On the trigger, opens the menu on the current model."],
      ["Up or Down or Home or End", "In the menu, moves between models; typing a letter jumps to the next name starting with it."],
      ["Enter or Space", "Chooses the focused model, closes the menu and returns focus to the trigger."],
      ["Escape or Tab", "Closes the menu without choosing."],
    ],
    aria: [
      ["aria-haspopup, aria-expanded, aria-controls", "On the trigger, from the Menu."],
      ["aria-label", "On the trigger, \"<label>: <current model>\"; on the menu, label."],
      ["role=\"menuitemradio\", aria-checked", "On each model row; the current model is checked."],
    ],
  },

  "scroll-to-latest": {
    // Spec: Job and boundaries; peers.
    instead: [
      ["Jumping to a section of a document", ["table-of-contents"], "Scroll to latest only returns a conversation to its newest message."],
      ["A scroll container with its own bars", ["scroll-area"], "Scroll area is the container; Scroll to latest is a button over it."],
    ],
    // Spec: Decisions; source: ScrollToLatest.tsx JSDoc; pages.mjs note.
    practices: [
      ["Do", "Pass the conversation's scroll container as scrollRef, and place it in the composer's positioned wrapper: it sits above the composer, centred."],
      ["Do", "Pass focusRef (the composer) so keyboard focus moves there after the jump; otherwise it goes to the conversation."],
      ["Do", "Pass Button props through buttonProps; its onClick runs first and can call preventDefault to skip the scroll."],
      ["Don't", "Show or hide it yourself: it appears past threshold (200px from the end by default) and hides at the end."],
      ["Don't", "Change the Button's look; it is an outline neutral icon pill so it reads over any message."],
    ],
    // Spec: Decisions; manifest (no elements).
    parts: {
      root: "A wrapper above the composer holding one outline neutral round Button with a down arrow, floating on the float shadow.",
    },
    // Manifest state; source: data-visible.
    states: {
      visible: "Fades in once the reader is past the threshold from the end; hidden, it is out of the Tab order and aria-hidden.",
    },
    keyboard: [
      ["Tab", "Reaches the Button only while it is visible."],
      ["Enter or Space", "Scrolls to the end (a jump under reduced motion or Motion 0) and moves focus to focusRef or the conversation."],
    ],
    aria: [
      ["aria-label", "On the Button, from label (\"Scroll to latest\")."],
      ["aria-hidden, tabindex", "While hidden: aria-hidden and tabindex=-1, so it cannot be reached."],
    ],
  },

  citation: {
    // Spec: Job and boundaries, Footnote variant; peers.
    instead: [
      ["A link in running text", ["link"], "Link is styled as text; a Citation marks a source beside the sentence it supports."],
      ["A label or status that does nothing", ["badge"], "Badge labels; a Citation opens its source."],
      ["A control or a filter in a pill", ["chip"], "Chip is a control; a Citation is a link to a source."],
      ["A list of every source", ["reference-list"], "Reference list gathers the sources; a Citation points at one from the text."],
    ],
    // Spec: Decisions, Behavior and accessibility, Footnote variant; source: Citation.tsx JSDoc.
    practices: [
      ["Do", "Use the pill after a sentence in a reply: the site's icon and short name, and more for \"+N\" sources behind it."],
      ["Do", "Use the footnote variant for a numbered reference in an article; set href to its note on the page."],
      ["Do", "Pass title, the page's title, so the link's name says what it opens."],
      ["Do", "Wrap it in a Hover card to preview the source on hover and keyboard focus."],
      ["Don't", "Write the full site name or URL in label: it is cut at 15 characters."],
      ["Don't", "Give a footnote an icon or more: both are pill only."],
    ],
    // Spec: Anatomy, Decisions, Footnote variant; manifest elements.
    parts: {
      root: "The link. Pill: a round mark-sized pill on the text's baseline, opening a new tab. Footnote: a raised bracketed number in a link ink.",
      icon: "The site's favicon or a small element, round, at the pill's start (pill only).",
      label: "The source's short name, cut at 15 characters with an ellipsis; the footnote's number.",
      count: "\"+N\" when more sources stand behind this one; hidden from assistive tech, which hears it in the name.",
      bracket: "The footnote's square brackets, in its ink; hidden from assistive tech.",
    },
    // Native link.
    keyboard: [
      ["Tab", "Moves to the citation, with Area's focus ring."],
      ["Enter", "Opens the source; a pill opens it in a new tab."],
    ],
    aria: [
      ["aria-label", "Pill: \"<label>: <title>, N more sources\"; footnote: \"Note <label>: <title>\". Your aria-label wins."],
      ["target, rel", "On a pill: _blank and noopener noreferrer unless you pass your own; a footnote sets neither."],
    ],
  },

  timestamp: {
    // Spec: Job and boundaries; peers.
    instead: [
      ["How a turn ended", ["turn-notice"], "Turn notice says a turn stopped, failed or was compacted; Timestamp says when one was sent."],
      ["Dated events with their times", ["timeline"], "Timeline lists events; Timestamp only marks a pause in a conversation."],
    ],
    // Spec: Job and boundaries; source: ComposerParts.tsx (formatTimestamp, TIMESTAMP_GAP).
    practices: [
      ["Do", "Show it before a person's message that comes over an hour (TIMESTAMP_GAP) after the last turn of either side, or before the first if it is over an hour old."],
      ["Do", "Word it with formatTimestamp: Today, Yesterday, the weekday within a week, the date within a year, then the time."],
      ["Do", "Pass the moment as dateTime, so the time element carries it machine-readably."],
      ["Don't", "Put a time on every message: it marks pauses only."],
      ["Don't", "Give it margins of its own; it takes the conversation's gap."],
    ],
    // Spec: Decisions; manifest (no elements).
    parts: {
      root: "One centred line in the small muted type, holding a time element; it has no space of its own.",
    },
    aria: [
      ["datetime", "Always, on the time element: dateTime as an ISO string."],
    ],
  },

  step: {
    // Spec: Job and boundaries; peers.
    instead: [
      ["Dated events with times and media", ["timeline"], "Timeline is a record of events; a Step is one thing an agent did in a turn."],
      ["A section of a document the reader opens", ["accordion"], "Accordion holds a reader's sections; a Step is an agent's action that opens to its input and output."],
      ["A process the person moves through", ["stepper"], "Stepper is the person's progress through steps they visit."],
      ["The agent's plan for the whole run", ["plan"], "Plan shows what is done, current and next; Steps record what was done."],
    ],
    // Spec: Variants, Decisions, Behavior and accessibility; source: Step.tsx JSDoc.
    practices: [
      ["Do", "Write the verb in its live form while running (\"Reading\") and past tense when done (\"Read\"), with what it acted on as detail."],
      ["Do", "Pass the step's input and output as children so the line opens to them; a step without them stays a plain line."],
      ["Do", "Fold a run of steps into a StepGroup with a summary line (\"Explored\", \"6 files\")."],
      ["Do", "Use Reasoning for the agent's thinking: \"Thinking\" while running, then \"Thought for Ns\" opening to its summary."],
      ["Don't", "Add a Spinner to a running step: the verb's shimmer and wording carry it."],
      ["Don't", "Show the raw reasoning chain in Reasoning; it opens to a summary."],
    ],
    // Spec: Anatomy, Decisions, Round 52; manifest elements.
    parts: {
      root: "One step: the line, then what it opens. StepGroup and Reasoning are the same line with their own body.",
      row: "The line at the reply's type, its parts 4 apart; a button when it opens, plain text when it does not.",
      icon: "An optional 16 glyph before the verb, muted.",
      verb: "What it did, in the default ink; it shimmers while running and takes the danger ink when failed.",
      detail: "What it acted on, muted, cut short on one line.",
      meta: "An optional duration or +N −N at the line's end, muted, with tabular numbers.",
      chevron: "Shown on hover, focus and while open (always on touch); it turns as the step opens.",
      body: "What the line opens: 4 under it on a 1px rail, its content 12 in. Hidden while closed.",
      items: "A StepGroup's steps, inside its body, 4 apart.",
    },
    // Spec: States; source: data-open, data-running, data-failed.
    states: {
      open: "The body shows under the line and the chevron points down.",
      running: "The verb shimmers (stopped at Motion 0 and under reduced motion) and the step is aria-busy.",
      failed: "The verb takes the danger ink, and \"Failed\" is read after the line.",
    },
    // Source: native button with aria-expanded.
    keyboard: [
      ["Tab", "Moves to a step that opens; a plain line is not a Tab stop."],
      ["Enter or Space", "Opens or closes the step."],
    ],
    aria: [
      ["aria-expanded, aria-controls", "On the line's button, when the step has something to open."],
      ["aria-busy", "While running."],
    ],
  },

  "edit-summary": {
    // Spec: Job and boundaries; peers.
    instead: [
      ["Showing code, or a one-sided change, in a reply", ["code-block"], "Code block's marks show changed lines; Diff adds paired numbers and folds, and Edit summary adds Keep and Undo."],
      ["One line for one edit in the transcript", ["step"], "A Step records the edit as it happens; Edit summary reviews the turn's files at its end."],
    ],
    // Spec: Job and boundaries, Decisions, Behavior and accessibility; source: EditSummary.tsx JSDoc.
    practices: [
      ["Do", "Show one Edit summary at the end of a turn that changed files, with the turn's totals and an EditSummaryFile per file."],
      ["Do", "Use variant plain in the transcript, among a turn's Steps, so its head and rows sit on the text edge; a file's Diff keeps its own frame."],
      ["Do", "Give each file an icon of its kind and its full path as name: the row shows the file's name first and its folder after it, muted."],
      ["Do", "Give each file a Diff so its name opens to the change; name the diff by its file with aria-label (\"Changes to button.css\"). Diff's label still works for one release."],
      ["Do", "Pass onKeepAll and onUndoAll while any file is pending, and leave them out once every file is settled."],
      ["Do", "Set a file's status to kept or undone once the person acts: its actions leave and the row says Kept or Undone. state still works for one release."],
      ["Do", "Control a file's diff with open and onOpenChange when the app must open it (a review that walks the files); defaultOpen otherwise."],
      ["Do", "Set title to the count (\"Edited 2 files\"); without it the head says \"Edited files\"."],
      ["Don't", "Use it as a review tool for staging or commits; it keeps or undoes one turn's edits."],
      ["Don't", "Signal a change by color alone: keep the +N −N and the diff's + and − markers."],
    ],
    // Spec: Anatomy, Cleanup pass, Round 52; manifest elements.
    parts: {
      root: "The agent card: a section with Code block's frame at the card's text size, named by its title.",
      head: "One row: the title, the turn's counts, and Undo all and Keep all at the end; the files follow it with no rule between.",
      title: "The count of files changed.",
      counts: "+N −N with tabular numbers; read as \"N added, N removed\".",
      added: "+N in the success ink.",
      removed: "−N in the danger ink.",
      actions: "Ghost sm Buttons, Undo and Keep; on a file row they show over its end on hover and focus, always on touch.",
      files: "The list of file rows.",
      file: "One file as a Menu row: its name button, then its actions or its status.",
      name: "A button with the file's name and counts that opens its diff; it presses like a Menu row, with the pressed fill.",
      chevron: "Shown when the file has a diff; it turns as the diff opens.",
      status: "\"Kept\" or \"Undone\" once the file is settled, in place of the actions.",
      diff: "The file's Diff, 4 under its row and as wide as the row plate; a wide one scrolls sideways.",
    },
    // Spec: States; source: data-open, data-kept, data-undone on the file.
    states: {
      open: "The file's diff shows under its row and the chevron points down.",
      kept: "The file is settled: its counts mute, the actions leave and the row says Kept.",
      undone: "The file is settled: its counts mute, its name is struck through, the actions leave and the row says Undone.",
    },
    // Source: native buttons; the Diff is a focusable region.
    keyboard: [
      ["Tab", "Moves to Undo all and Keep all, then each file's name, its Undo and Keep, and an open diff."],
      ["Enter or Space", "On a file's name, opens or closes its diff; on an action, runs it."],
    ],
    aria: [
      ["aria-labelledby", "On the section, from the title, unless you pass aria-label."],
      ["aria-expanded, aria-controls", "On a file's name, when it has a diff."],
      ["aria-label", "On a file's Undo and Keep (\"Undo <name>\"); on the Diff, from aria-label (\"Changes\" by default; the deprecated label reads \"Changes to <label>\")."],
      ["tabindex", "The Diff is a Tab stop, so a wide diff can be scrolled from the keyboard."],
    ],
  },

  approval: {
    // Spec: Job and boundaries.
    instead: [
      ["A decision that must block the whole app", ["confirm-dialog"], "Approval doesn't block the app; it waits in the composer's place."],
      ["A list of commands", ["menu"], "Approval is one decision with numbered answers, not a menu of actions."],
      ["Writing the next message", ["composer"], "The Composer returns once the approval is answered."],
    ],
    // Spec: Variants, Behavior and accessibility, Keys pressed as it appears; source: Approval.tsx JSDoc.
    practices: [
      ["Do", "Show it in the composer's place until it is answered, and set autoFocus there so the keys answer at once."],
      ["Do", "Give 2 to 4 items: yes, yes with a wider scope (for this session, always), then no. options still works for one release."],
      ["Do", "Put the thing itself in children: the command in a Code block sm, or the edit as a Diff."],
      ["Do", "Pass onInstead so the person can say what to do instead; it becomes the last numbered choice."],
      ["Do", "Pass onDismiss when Escape should do something other than choose the last option, and dismissLabel to say what it does (\"skip\")."],
      ["Do", "Ask a question with it, as Claude Code does: give each item a description, mark an answer already given with value, and preview the item under the pointer or focus with onActiveChange."],
      ["Do", "Among several questions, put a compact Pagination sm in actions and the way on (Skip, Continue) in footer."],
      ["Do", "Answer in words, a list. Use layout=\"grid\" only for pictures: each visual a simple premade drawing of UI, never a screenshot; show the real thing in a frame above only where the answer changes something visible."],
      ["Do", "Mark the answer the asker would pick with a muted word after its label (\"Recommended\"), and list it first; a setting's own value says \"Default\" the same way. One note an answer."],
      ["Do", "Put an answer that isn't one press (a bar, swatches, chips) in children with no items, and Continue in footer."],
      ["Do", "List several questions in one card with variant=\"plain\": the host card draws the edge and the 6 mat, each question keeps its own answers, Something else and Skip, and one Continue waits until each is answered or skipped."],
      ["Don't", "Use a grid for answers in words; a list reads them better and keeps every number on the question's edge."],
      ["Don't", "Mark a recommended answer with a Badge: a plated mark beside a word in a row of words doubles the row's weight."],
      ["Don't", "Set autoFocus where several approvals share a page; it is off by default so a page doesn't move focus."],
      ["Don't", "Give more than nine items: only 1 to 9 have keys."],
    ],
    // Spec: Anatomy, Cleanup pass, Rounds 51–54; manifest elements.
    parts: {
      root: "A section in the Composer's shell: its edge, corner, fill and inset; named by its title.",
      head: "The heading and the actions on one row, its first line set in a row like the choices.",
      heading: "The title and description as one block.",
      actions: "Optional, at the head's end on the title's row: where it is among several questions, a close.",
      title: "What it wants to do, in the strong weight.",
      description: "Why, in the small muted type.",
      detail: "The thing itself: a command in a Code block sm, or a Diff.",
      options: "The choices, a named group of rows with Menu's break between them.",
      option: "One choice as a plain Menu row: its number, then its label, unpainted at rest; the row plate on hover, focus, press and when chosen, hanging one row inset outside the question's edge; 4 apart.",
      key: "The choice's number, a plain muted digit on the question's text edge, on the label's line.",
      tile: "A pictured choice: its picture beside its button, never inside it; the button covers the tile and the tile takes the row plate on hover, focus and when chosen.",
      visual: "Optional: the choice drawn, on a recessed frame with the cards' edge; over the key and label in a grid, before them in a list. Inert and hidden from assistive tech.",
      lines: "The label with its description under it, when the choice has one.",
      label: "The choice's words; it is the button's whole name.",
      "option-description": "What the choice comes to, in the small muted type under the label; it describes the button.",
      check: "With value: the chosen row's check in the Selection ink; the other rows keep its column.",
      instead: "The last numbered row, holding the field.",
      field: "A text field as the row's text, unfilled; Enter sends what is written.",
      foot: "The last row: the hint, then the footer at its end.",
      hint: "Esc as a keycap, then \"to cancel\" (dismissLabel), muted.",
      footer: "Optional, at the end of the last row: the way on when the answer isn't one of the choices (Back, Skip, Continue).",
    },
    states: {
      selected: "With value: the answer already given takes Menu's selected row fill and its check, at once; it is the current answer, not a pressed button.",
    },
    // Source: Approval.tsx keys().
    keyboard: [
      ["Up or Down", "Moves between the choices and the field, wrapping. In a grid, to the nearest choice in the row above or below."],
      ["Left or Right", "In a grid, moves to the previous or next choice, wrapping."],
      ["1 or 2 or 3", "Chooses that numbered option (up to 9); the number after the last focuses the field."],
      ["Enter or Space", "Chooses the focused option. In the field, Enter sends what to do instead."],
      ["Escape", "Calls onDismiss, or chooses the last item when there is none."],
      ["Tab", "Moves between the choices and the field, then any control in the detail and the footer."],
    ],
    aria: [
      ["aria-labelledby", "On the section and on the options group, from the title."],
      ["role=\"group\"", "On the options."],
      ["aria-keyshortcuts", "On each option and the field: its number. The number is hidden from the name, which stays the label."],
      ["aria-label", "On the field, from insteadPlaceholder."],
      ["aria-describedby", "On a choice with a description, pointing at it."],
      ["aria-current", "On the answer already given (value): \"true\"."],
    ],
  },

  plan: {
    // Spec: Job and boundaries; peers.
    instead: [
      ["Steps the person moves between", ["stepper"], "Stepper's markers take the person to a step; a Plan reports how far a plan has got, whoever sets its states."],
      ["A checklist the person ticks", ["checkbox"], "Plan items are not controls; the agent marks them."],
      ["What the agent already did", ["step"], "Steps record actions in the transcript; Plan shows what is done, now and next."],
      ["Messages waiting to be sent", ["queue"], "Queue holds the person's messages; Plan holds the agent's tasks."],
    ],
    // Spec: Variants, Cleanup pass; source: Plan.tsx JSDoc; pages.mjs note.
    practices: [
      ["Do", "Show it above the composer while the agent runs, and update each item's status as it works."],
      ["Do", "Keep one item current at a time: it is the one with the Spinner, in the default ink."],
      ["Do", "Mark an item cancelled when the agent drops it, rather than removing it."],
      ["Do", "Let it fold to its head when space is short: the count keeps the progress on one line."],
      ["Do", "Add a bar when the plan is long or folds most of the time: single for a list of tasks, segmented when the items are phases with their own counts."],
      ["Do", "Give an item meta for its own count (\"2 of 4\") and a current item progress, so its segment and its ring fill together."],
      ["Do", "Pass count when the items are phases of a larger count (\"9 of 14\" questions in 8 chapters)."],
      ["Do", "Use rail when items carry detail or steps of their own, so the whole tracker reads as one timeline in one container."],
      ["Do", "Use variant plain inside a turn's transcript, among Steps and the reply, so it reads as the turn's own lines; keep the frame (surface) in a tray or panel of its own."],
      ["Don't", "Nest steps more than one level: an item's steps take no steps of their own."],
      ["Don't", "Make items clickable: the plan reports the agent's progress, it isn't a checklist."],
      ["Don't", "Leave it in the transcript after the run; it rides above the composer while the agent works."],
    ],
    // Spec: Anatomy, Cleanup pass, Round 52; manifest elements.
    parts: {
      root: "The agent card: a section with Code block's frame at the card's text size, named by its title.",
      head: "A button a row tall: the title, the chevron beside it, and the count at the end over the items' meta; the items follow it with no rule between.",
      icon: "With icon: a 16 glyph before the title in the muted ink.",
      title: "\"Plan\" by default.",
      count: "\"N of M\": the done items of all items, or the count given.",
      chevron: "Points down while open, turns when folded; Accordion's hover plate behind it.",
      bar: "With bar: Progress sm's track 12 under the title's line and 16 above the bottom when folded and 8 above the items when open, staying when folded. A plan with a bar or a rail sits 16 in from its edge (the plain tray 12).",
      segment: "One Progress per item when segmented (one in all when single), 2 apart, filled by the item's share.",
      items: "An ordered list of the plan's items; hidden while folded.",
      item: "A Menu row: done and cancelled are struck and muted (with meta, a phase, muted but not struck), current in the default ink, pending muted.",
      mark: "A 16 slot holding one ring: alone when pending, with a tick when done, with a cross when cancelled; a current item shows a Spinner, or with progress the ring filling as a pie in the bar's fill.",
      text: "The item's words, followed by its status for assistive tech.",
      meta: "An item's trailing value, muted and tabular at the row's end: its own count, a date.",
      detail: "Values after the item's words on its line, usually Badges, 8 after the words and 4 apart; they wrap under the words when narrow.",
      steps: "An item's own steps in a recessed box under its words, from its text column to the row's edge: denser rows, muted unless current, their values on the plan's meta column. Only an open item has one.",
    },
    // Manifest state; source: data-open.
    states: {
      open: "The items show under the head and the chevron points down; folded, only the head, the count and any bar are left. Open by default.",
    },
    keyboard: [
      ["Tab", "Moves to the head."],
      ["Enter or Space", "Folds or opens the list."],
    ],
    aria: [
      ["aria-expanded, aria-controls", "On the head, from open, pointing at the list."],
      ["aria-labelledby", "On the section and the list, from the title."],
      ["role=\"progressbar\"", "On the bar, named by the title, valued 0 to 100 by the whole plan, with the count as its text; the segments are hidden from assistive tech."],
    ],
  },

  "turn-notice": {
    // Spec: Job and boundaries.
    instead: [
      ["A callout that needs attention on a page", ["alert"], "Alert is heavier and asks to be read; a Turn notice is one quiet line in a turn."],
      ["A passing confirmation", ["toast"], "Toast is transient; a Turn notice stays in the transcript."],
      ["When a turn was sent", ["timestamp"], "Timestamp marks a pause; a Turn notice says how a turn ended."],
    ],
    // Spec: Variants, Decisions, Cleanup pass; source: TurnNotice.tsx JSDoc.
    practices: [
      ["Do", "Set status to stopped when the person stopped the turn, error when it failed, compacted when earlier context was summarised."],
      ["Do", "Pass a ghost sm Retry Button as action on an error, so the person can try again from the line."],
      ["Do", "Place it at the end of the turn it describes, in the turn's column."],
      ["Don't", "Use it for a turn that finished normally: it marks endings other than finishing."],
      ["Don't", "Add your own icon or color to the text: status sets the glyph and the error ink. kind still works for one release."],
    ],
    // Spec: Decisions, Cleanup pass; manifest elements.
    parts: {
      root: "One line at the reply's type, its parts 4 apart, as a Step's line.",
      icon: "A 16 glyph: stop for stopped, info for error and compacted; in the danger ink for an error.",
      text: "What happened, muted; in the default ink for an error.",
      action: "An optional Button after the text, such as Retry.",
    },
    aria: [
      ["role=\"status\"", "For stopped and compacted, so the ending is announced once, politely."],
      ["role=\"alert\"", "For error."],
    ],
  },
};
