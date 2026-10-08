# Families without dedicated outside evidence

These 13 families have no dedicated implementation evidence in the reviewed 15-system corpus. Analogues and platform guidance do not establish their range. The complete dated lookup records remain in index-3.json; detailed proposals are deferred. Code editor remains separate because its JSON-editor analogue has a concrete integration boundary.

<a id="easing-curve-editor"></a>
- **EasingCurveEditor** — Edit the timing function used by an animation. Defer a native curve editor until a reference contract and engine are selected.

<a id="shortcut-recorder"></a>
- **ShortcutRecorder** — Capture a keyboard chord and explain conflicts. Reuse Kbd for display but design capture, cancellation and conflict validation as a new behavior.

<a id="thinking-disclosure"></a>
- **ThinkingDisclosure** — Reveal progress or reasoning-related content in a conversation. Compose Disclosure, Message and Spinner; keep elapsed-time logic outside the visual primitive.

<a id="source-chip"></a>
- **SourceChip / citation pill** — Identify a citation and optionally preview its destination. Compose Chip/Link and HoverCard; keep citation numbering and provenance in product data.

<a id="voice-input"></a>
- **VoiceInput** — Record spoken input while making progress and cancellation clear. Defer recording to a media adapter; reuse Composer and Button for the surrounding UI.

<a id="database-card"></a>
- **DatabaseCard** — Show a record as a card with typed properties and optional media. Compose Card and PropertyValue; defer board-specific drag and editing to a collection adapter.

<a id="property-value"></a>
- **PropertyValue** — Render and optionally edit a typed record property. Use a renderer registry that maps existing Area controls to property types; avoid a universal untyped cell.

<a id="zoom-control"></a>
- **ZoomControl** — Set a viewport magnification and invoke fit/reset commands. Compose NumberField, Menu and Button; the canvas or viewer owns the transform.

<a id="layer-row-badges"></a>
- **LayerRow badges** — Identify a layer's role or state inside a tree row. Use TreeView trailing slots and Badge; do not add a second tree renderer.

<a id="constraints-picker"></a>
- **ConstraintsPicker** — Select independent edge constraints rather than one alignment point. Compose CheckboxGroup in a spatial recipe; keep it distinct from AlignmentPicker's exclusive selection.

<a id="font-picker"></a>
- **FontPicker** — Find a font family and optionally choose a weight or style. Compose Combobox and Select; font loading, preview content and variable axes belong to an adapter.

<a id="variable-chip"></a>
- **VariableChip** — Show that a field is bound to a design variable and allow detachment. Compose Code/Chip/Tooltip with explicit binding state; the token resolver owns lookup and validity.

<a id="keyboard-shortcuts"></a>
- **KeyboardShortcut overlay** — Show discoverable keyboard commands grouped by task. Compose Dialog/Sheet and Kbd groups; command search is an optional recipe after CommandPalette.

