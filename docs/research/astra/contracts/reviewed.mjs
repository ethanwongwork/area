/** Human-reviewed behavior facts. Each row ends in a pinned source file and exact search anchor. */
const C='packages/react/src/components/';
export const keyboardRules={};
export const nameRules={
 button:[['root','Icon-only buttons require an accessible name via aria-label.',C+'Button.tsx','Square button with no label. Requires `aria-label`.']],
 avatar:[['image','Provide alt text describing the person or entity when an image source is set.',C+'primitives.tsx','Describes the person or entity. Required when `src` is set.']],
 checkboxGroup:[['legend','A visible group label is required and rendered as the native fieldset legend.',C+'forms.tsx','Visible group label, rendered as the native fieldset legend.']],
 radioGroup:[['legend','A visible group label is required and rendered as the native fieldset legend.',C+'forms.tsx','Visible group label. Renders the native fieldset legend.']]
};
export const compositionRules={};
const add=(family,part,entries,file)=>{keyboardRules[family]??=[];for(const [key,action,condition,anchor]of entries)keyboardRules[family].push([key,part,action,condition,file,anchor]);};
const P=C+'primitives.tsx';
add('tabs','tab',[
 ['ArrowLeft / ArrowRight','Move focus among enabled tabs with wrap; reverse horizontal direction in RTL. Select the focused tab in automatic mode.','Horizontal orientation; automatic or manual activation.','const keys = orientation === "vertical"'],
 ['ArrowUp / ArrowDown','Move focus among enabled tabs with wrap. Select the focused tab in automatic mode.','Vertical orientation.','const keys = orientation === "vertical"'],
 ['Home / End','Focus the first or last enabled tab; select it in automatic mode.','Tab has focus.','const next = enabled[event.key === "Home"'],
 ['Tab','Enter through the selected tab; other tabs are excluded from sequential navigation.','Selected enabled tab.','Only the selected tab is in the tab order']
],P);
add('segmented','item',[
 ['ArrowLeft / ArrowRight / ArrowUp / ArrowDown','Focus and select the adjacent enabled option, wrapping; reverse horizontal direction in RTL.','Outside a Toolbar.','if (inToolbar) return;'],
 ['Home / End','Focus and select the first or last enabled option.','Outside a Toolbar.','if (inToolbar) return;'],
 ['Space / Enter','Select the focused option; toolbar arrow navigation moves focus without selecting.','Inside a Toolbar.','In a toolbar every option is a roving item:']
],P);
add('alignmentPicker','root',[
 ['ArrowLeft / ArrowRight','Select and focus the previous or next physical column, wrapping within the row.','Enabled picker; positions remain LTR.','case "ArrowLeft": next = row * 3'],
 ['ArrowUp / ArrowDown','Select and focus the previous or next row, wrapping within the column.','Enabled picker.','case "ArrowUp": next = ((row + 2)'],
 ['Home / End','Select and focus the top-left or bottom-right position.','Enabled picker.','case "Home": next = 0;']
],C+'AlignmentPicker.tsx');
add('calendar','day',[
 ['ArrowLeft / ArrowRight','Move focus by one day; reverse in RTL.','Clamp to min/max and reveal the focused month or week.','ArrowLeft: () => addDays'],
 ['ArrowUp / ArrowDown','Move focus by seven days.','Clamp to min/max and reveal the focused month or week.','ArrowUp: () => addDays'],
 ['Home / End','Move focus to the start or end of the week.','Uses firstDayOfWeek; clamps to min/max.','Home: () => addDays'],
 ['PageUp / PageDown','Move focus by one month, or one year with Shift.','Clamp to min/max; cross visible months as needed.','PageUp: () => addMonths'],
 ['Escape','Cancel the pending range anchor and hover preview.','A range start is pending.','if (event.key === "Escape" && pendingStart)']
],C+'Calendar.tsx');
add('calendar','day',[['Enter / Space','Select the focused date.','Enabled day; selection follows the configured selection mode.','clamps to min/max. Enter/Space selects;']], 'docs/specs/calendar.md');
add('colorSwatchPicker','root',[
 ['ArrowLeft / ArrowRight','Move and select the adjacent enabled swatch; reverse in RTL.','Picker has focus.','Arrow keys move and select'],
 ['ArrowUp / ArrowDown','Move and select by column in grid and palette layouts.','Grid or palette layout.','Arrow keys move and select'],
 ['Home / End','Select the first or last enabled swatch.','Picker has focus.','Home/End reach the first']
],'docs/specs/color-swatch-picker.md');
add('numberField','control',[
 ['ArrowUp / ArrowDown','Increment or decrement by step; Shift multiplies by 10 and Alt by 0.1.','Enabled and editable; caller has not prevented the event.','const multiplier = event.shiftKey'],
 ['Home / End','Commit the minimum or maximum.','The corresponding bound is defined.','event.key === "Home" && min !== undefined'],
 ['Enter','Parse and commit the current draft.','Enabled and editable.','event.key === "Enter"'],
 ['Escape','Discard the draft and clear its error; otherwise allow Escape to reach the surrounding overlay.','A draft or error is present.','Only an edit in progress claims Escape']
],C+'NumberField.tsx');
add('composer','input',[
 ['Enter','Submit trimmed nonempty text; clear an uncontrolled value.','submitOnEnter enabled; not busy, disabled, composing, prevented, or Shift-modified.','if (event.key !== "Enter"'],
 ['Control+Enter / Meta+Enter','Submit trimmed nonempty text.','Also works when submitOnEnter is off; the same submission guards apply.','if (!submitOnEnter && !event.metaKey && !event.ctrlKey)'],
 ['Shift+Enter','Allow the native textarea to insert a line break.','No submission.','if (event.key !== "Enter"']
],C+'Composer.tsx');
add('combobox','not found',[
 ['ArrowDown','Open on the selected option, or advance the active row. Alt opens without highlighting and does not advance an open list.','Input has focus; event not prevented.','case "ArrowDown":'],
 ['ArrowUp','Open at the last option or move to the previous row.','Input has focus.','case "ArrowUp":'],
 ['Enter','Commit the active row; if no row is active, settle the current text.','List is open.','case "Enter":'],
 ['Escape','Close an open list; when already closed, clear text and selection.','Input has focus.','case "Escape":'],
 ['Tab','Commit the highlighted option and allow normal focus navigation.','Open list with an active option row; create rows are not committed by Tab.','case "Tab":']
],C+'Combobox.tsx');
add('treeView','unclassed-div-127',[
 ['ArrowUp / ArrowDown','Focus the previous or next enabled visible row, clamped at the edges.','Tree item has focus.','case "ArrowDown": next = enabled'],
 ['Home / End','Focus the first or last enabled visible row.','Tree item has focus.','case "Home": next = enabled'],
 ['ArrowRight','Expand a closed branch, or focus its first enabled child when already open.','Tree item has focus.','case "ArrowRight":'],
 ['ArrowLeft','Collapse an open branch, otherwise focus its parent.','Tree item has focus.','case "ArrowLeft":'],
 ['Enter / Space','Activate the focused row using the configured selection mode.','Enabled row.','case "Enter": case " ": activate'],
 ['Printable character','Focus a matching enabled visible row using buffered typeahead.','No Control, Alt or Meta modifier.','if (event.key.length === 1']
],C+'TreeView.tsx');
add('toolbar','root',[
 ['ArrowLeft / ArrowRight / ArrowUp / ArrowDown','Move focus among enabled marked items, wrapping; use the orientation and reverse horizontal direction in RTL.','Does not activate items.','if (event.key === forward)'],
 ['Home / End','Focus the first or last enabled marked item.','Toolbar key handler.','else if (event.key === "Home")']
],C+'Toolbar.tsx');
add('toolbar','overflow',[['Escape','Close the overflow and return focus to its summary.','Overflow details are open.','if (event.key === "Escape" && event.currentTarget.open)']],C+'Toolbar.tsx');
add('propertyList','handle',[
 ['ArrowUp / ArrowDown','Move the item one position; announce the move and preserve handle focus.','Reordering enabled; valid destination.','keyMove: (index, itemLabel, event)'],
 ['Home / End','Move the item to the first or last position.','Reordering enabled; valid destination.','keyMove: (index, itemLabel, event)'],
 ['Escape','Cancel the active drag.','A pointer drag is in progress.','event.key === "Escape" && drag.current']
],C+'PropertyList.tsx');
add('commandPalette','input',[
 ['ArrowDown / ArrowUp','Move the active result among enabled rows.','Input has focus.','if (event.key === "ArrowDown")'],
 ['Control+Home / Control+End','Jump to the first or last enabled result.','Input has focus.','event.key === "Home" && event.ctrlKey'],
 ['Enter','Run the highlighted result; close unless it requests keepOpen.','Input has focus.','event.key === "Enter"'],
 ['Escape','Clear the query first, then close the modal.','Non-inline palette.','event.key === "Escape" && !inline']
],C+'CommandPalette.tsx');
add('commandPalette','modal',[['Configured shortcut (default Meta/Control+K)','Toggle the palette.','Global listener; disabled when inline or hotkey is false; uses configured shortcut.','if (modifier && event.key.toLowerCase() === key)']],C+'CommandPalette.tsx');
add('contextMenu','root',[['Shift+F10 / ContextMenu','Open the menu beneath the focused target.','Enabled and closed; event not prevented; target is outside the menu.','if (!((event.key === "F10"']],C+'ContextMenu.tsx');
add('contextMenu','menu',[['Escape / Tab','Close the menu, prevent default, and restore focus to the invoking element.','Menu is open.','onKeyDown={event => { if (event.key === "Escape")']],C+'ContextMenu.tsx');
add('splitButton','trigger',[
 ['Enter / Space / ArrowDown','Open the menu and focus its first item.','Trigger has focus.','Keyboard: Enter/Space or ArrowDown'],
 ['ArrowUp','Open the menu and focus its last item.','Trigger has focus.','ArrowUp opens it on the last.']
],'docs/specs/split-button.md');
add('splitButton','menu',[
 ['ArrowUp / ArrowDown','Focus adjacent enabled menu items, wrapping.','Menu open.','ArrowUp opens it on the last.'],
 ['Home / End','Focus the first or last enabled menu item.','Menu open.','ArrowUp opens it on the last.'],
 ['Tab','Close the menu.','Menu open.','ArrowUp opens it on the last.'],
 ['Escape','Dismiss the native popover and return focus.','Menu open.','Escape, light dismiss and focus return']
],'docs/specs/split-button.md');
add('menu','root',[
 ['ArrowUp / ArrowDown / Home / End','Move focus within enabled items: adjacent with wrap, or first/last.','Anchored menu; inline menu has its own equivalent handler.','if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))'],
 ['Printable character','Focus the next item matching the buffered text prefix.','No modifier; excludes Space; buffer expires after the configured delay.','if (event.key.length === 1 && !event.ctrlKey'],
 ['Tab','Close the anchored menu and allow sequential focus navigation.','Anchored menu.','if (event.key === "Tab") { setOpen(false);']
],C+'Overlays.tsx');
add('menu','not found',[
 ['Enter / Space / ArrowDown','Open the anchored menu with entry focus on the first enabled item.','Trigger element; resolved by AnchoredMenu.','if (["Enter", " ", "ArrowDown"].includes(event.key))'],
 ['ArrowUp','Open the anchored menu with entry focus on the last enabled item.','Trigger element; resolved by AnchoredMenu.','if (event.key === "ArrowUp") { entry.current']
],C+'Overlays.tsx');
add('popover','root',[['Escape','Close the native popover and return focus to its trigger.','When supplied a trigger and shown as a native popover.','focusable element (or the surface); Escape']], 'docs/specs/popover.md');
add('dialog','modal',[
 ['Escape','Close the native modal dialog; the platform restores focus.','Rendered with trigger and opened with showModal().','calls `showModal()`. The platform supplies'],
 ['Tab / Shift+Tab','Keep sequential focus within the native modal.','Native showModal() path, not the standalone surface.','calls `showModal()`. The platform supplies']
],'docs/specs/dialog.md');
add('tooltip','root',[['Escape','Hide the tooltip.','Tooltip is shown.','it shows on hover after 500ms']], 'docs/specs/tooltip.md');
add('hoverCard','root',[['Escape','Close the hover card.','Hover card is shown.','Tab to the link opens it; Escape closes.']], 'docs/specs/hover-card.md');
add('panel','resize',[
 ['ArrowLeft / ArrowRight','Move the resize edge; direction follows edge position and writing direction. Shift uses 32px steps.','Resizable panel separator has focus; width clamps to limits.','stop; ←/→ move the edge'],
 ['Home / End','Resize to the minimum or maximum width.','Resizable panel separator has focus.','Home/End for the limits.'],
 ['Escape','Restore the starting width.','During an active pointer drag.','limits; Escape during the drag']
],'docs/specs/resizable-panel.md');
add('colorPicker','channel',[
 ['ArrowLeft / ArrowRight','Change saturation by one unit, or ten with Shift; reverse direction in RTL.','Spectrum channel has focus.','const delta: Record<string, [number, number]>'],
 ['ArrowUp / ArrowDown','Increase or decrease brightness by one unit, or ten with Shift.','Spectrum channel has focus.','const delta: Record<string, [number, number]>'],
 ['PageUp / PageDown','Increase or decrease brightness by ten units.','Spectrum channel has focus.','const delta: Record<string, [number, number]>']
],C+'ColorPicker.tsx');
add('colorPicker','text-field',[
 ['Enter','Commit the text draft.','Text channel field.','if (event.key === "Enter") { commit();'],
 ['Escape','Discard the text draft.','Text channel field.','if (event.key === "Escape") { setDraft(null);']
],C+'ColorPicker.tsx');
add('colorField','root',[
 ['Enter','Commit the draft color.','Color text field.','It commits on Enter or blur, Escape restores'],
 ['Escape','Restore the previous color.','Color text field.','It commits on Enter or blur, Escape restores']
],'docs/specs/color-field.md');
add('codeBlock','tab',[
 ['ArrowLeft / ArrowRight / Home / End','Focus and select a language tab, wrapping and reversing horizontal direction in RTL.','Language tabs enabled.','Language tabs are a `tablist` named "Language"']
],'docs/specs/code-block.md');
add('boxField','fields',[['Tab','Navigate the first row of fields, the split/join toggle, then the second row.','The toggle and fields are rendered.','Tab order follows the grid: row 1']], 'docs/specs/box-field.md');
add('buttonGroup','root',[['Tab','Visit each child button as a separate focus stop.','Each action has its own name.','button with its own name and Tab stop.']], 'docs/specs/button-group.md');
add('badgeGroup','overflow-content',[['Escape','Dismiss the native overflow popover and restore focus.','Overflow popover is open.','Native auto-popover supplies Escape']],C+'BadgeGroup.tsx');
nameRules.badge=[
 ['root','Icon-only and dot-only badges require aria-label or aria-labelledby, or aria-hidden when decorative.',C+'Badge.tsx','Badge: iconOnly and dotOnly require'],
 ['dismiss','A dismissible badge requires a dismissLabel for the button.',C+'Badge.tsx','Badge: dismissLabel is required']
];
nameRules.count=[['label','Supply words the owning control name lacks after the number, such as unread.',C+'Count.tsx','Words a screen reader hears after the number']];
nameRules.inputGroup=[['text','Include the affix or segment caption meaning in the neighboring control accessible name.',C+'InputGroup.tsx','Passive affix or segment caption.']];
nameRules.field=[['label','Associate the label with the direct control; the child must forward native id, ARIA, required and disabled props.',C+'Field.tsx','The direct child must forward native']];
nameRules.colorSwatchPicker=[['root','Name the group with label or aria-label; each native radio is named by its option label.','docs/specs/color-swatch-picker.md',"Native radios named by each option's"]];
nameRules.alignmentPicker=[['root','Name the radiogroup with label; the nine radios have physical-position names.','docs/specs/alignment-picker.md','`role="radiogroup"` with `label`;']];
nameRules.calendar=[['root','Provide a group name; month grids use month headings and days have full-date names.','docs/specs/calendar.md','- `role="group"` with a name;']];
compositionRules.field=[['allowedChildren',['One direct control that forwards native id, aria-*, required and disabled props.'],C+'Field.tsx','The direct child must forward native']];
compositionRules.tooltip=[['allowedChildren',['Supplemental noninteractive content; no interactive controls.'],'docs/specs/tooltip.md','It holds no interactive content']];
compositionRules.buttonGroup=[['allowedChildren',['Related independently named Button actions; each keeps its own Tab stop.'],'docs/specs/button-group.md','Joins related, independent Button actions']];
compositionRules.badge=[['allowedChildren',['Dismiss action only on a labeled non-link badge; icon-only and dot-only badges cannot be dismissible.'],C+'Badge.tsx','Badge: dismiss requires a labeled non-link badge.']];
add('modelPicker','menu',[['Escape','Close the model menu and return focus to the trigger.','Menu is open; prevent the default key action.','onKeyDown={event => { if (event.key === "Escape")']],C+'ModelPicker.tsx');
compositionRules.radio=[['allowedParents',['RadioGroup (documented group composition; other contexts are not specified).'],'docs/specs/radio.md','inside RadioGroup (a native']];
