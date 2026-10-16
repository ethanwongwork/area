#!/usr/bin/env python3
"""Inventory every literal Unverified marker, retaining wrapped text and actionable checks."""
from pathlib import Path
import collections,json,re,subprocess
ROOT=Path(__file__).resolve().parents[4]; OUT=Path(__file__).resolve().parent
SHA='4c1854202a8e109479d5b83ef24a8325231da056'
def read(path):return subprocess.check_output(['git','-C',str(ROOT),'show',SHA+':'+path],text=True)
def cite(path,a=1,b=None):return f'[{path}:{a}](https://github.com/ethanwongwork/area/blob/{SHA}/{path}#L{a}'+(f'-L{b}' if b and b!=a else '')+')'
# Exact specimen actions are research instructions, not assertions that checks ran.
actions={
 'toolbar':'Tab into the toolbar, arrow across enabled controls, toggle a command, then move into its Segmented control and back out.',
 'split-button':'Tab to both halves, open the arrow menu with the keyboard, move through items, Escape, and verify focus returns to the opener.',
 'segmented':'Tab into the group, use each arrow direction and Home/End, select a different item, then Tab out.',
 'nav':'Open a navigation list with current, disabled, icon and trailing-action rows; hover each enabled row and Tab through its interactive parts.',
 'menu':'Open a menu and submenu fixture; use arrows, Home/End, typeahead, Enter and Escape; inspect the focused item and return focus.',
 'tree-view':'Expand and collapse a parent with arrow keys, navigate children, reach each row action, and compare child indents and labels.',
 'toast':'Trigger a toast with an action and dismiss control; Tab to each and activate dismiss; repeat with a second live announcement.',
 'count':'Render zero, an ordinary count and a capped count; repeat with the label override and inspect the owner’s accessible name.',
 'alert':'Use single-line and multiline alerts with dismiss; hover and Tab to dismiss, then activate it.',
 'avatar':'Use initials and image avatars, active and inactive, beside a focusable control carrying an avatar; focus that control.',
 'indicator':'Use dot, count and presence specimens on round and rectangular owners; exercise processing and capped counts, then inspect owner labels.',
 'badge':'Use labeled, icon-bearing and dismissible badges at every size; focus/hover dismiss and compare baseline alignment in surrounding text.',
 'spinner':'Show standalone spinners and loading Buttons at every size and on contrasting backgrounds; confirm motion-none stops animation.',
 'skeleton':'Show text, circle and Card media skeleton specimens; compare media corners against the card at radius 0, 8 and pill.',
 'calendar':'Use single, range and multiple modes; navigate days by arrows, week by Home/End, month by PageUp/PageDown, year by Shift+Page; select with Enter/Space and inspect disabled/outside/today states.',
 'popover':'Open a triggered popover near every viewport edge, resize until it flips or shifts, inspect the arrow, Escape and verify return focus.',
 'panel':'Open the Figma inspector recipe; expand/collapse sections, Tab through controls and inspect label columns and separators.',
 'number-field':'Type and commit a value, clear it, show mixed state, scrub the handle and use steppers; repeat with a unit and a long number.',
 'box-field':'Toggle linked and per-side/per-corner editing, change each field locally and verify physical left/right labels remain attached to the intended side.',
 'property-list':'Reorder first/middle/last rows by pointer and by ArrowUp/Down/Home/End; verify focus follows the moved row and an announcement describes its position.',
 'color-field':'Edit hex and opacity, reach the swatch and any nested action with Tab, and compare field/swatch corners at the same zoom.',
 'color-swatch':'Render white, transparent, saturated and selected swatches; inspect edge visibility and checker/colour separation.',
 'color-swatch-picker':'Choose swatches with arrows and Space, including a light swatch; inspect the selected ring and palette/grid/row layouts.',
 'color-picker':'Drag and keyboard-adjust the area, hue and opacity tracks; change value model; select/add a swatch and inspect the EyeDropper availability path.',
 'alignment-picker':'Move through all nine physical positions with arrows, hover every cell, focus a cell and compare selected versus preview marks.',
 'button':'Inspect solid/soft/outline/ghost at sm/md/lg, then disabled/loading/selected specimens with real pointer hover and keyboard focus.',
 'button-group':'Focus every joined button at each size; inspect the focused outline where it meets the divider, including a selected neighbor.',
 'kbd':'Inspect standalone keys, chords, sequences, menu shortcuts and on-color keys; listen to the enclosing control’s label.',
 'input':'Focus empty/filled/invalid/disabled fields, hover optional actions, type locally and inspect the label, affixes and focus edge.',
 'input-group':'Compare all-enabled, all-disabled and mixed enabled/disabled child groups; focus each enabled child and inspect shared disabled paint.',
 'textarea':'Type enough lines to wrap and grow, focus/blur, resize where enabled and inspect placeholder/invalid/disabled variants.',
 'select':'Open the real native/customized picker, navigate options and select one, then Escape; inspect checked/disabled/hover states on screen.',
 'combobox':'Type to filter, arrow through results, choose/create an item, clear, and Escape; use a real IME to confirm composition does not select early.',
 'custom-select':'Open by Enter/Space/ArrowDown, use arrows/Home/End/typeahead, choose with Enter, and Escape; repeat descriptions, groups and ghost trigger.',
 'tag':'Focus and activate the remove button on each tone; repeat disabled and both sizes, inspecting the concentric remove plate.',
 'tag-picker':'Filter and add a tag, create a new one in the local demo, remove by Backspace and by its remove button, then inspect the checked list row.',
 'date-picker':'Tab to the date trigger and open it with Enter/Space; type 2026-10-20 then Enter, reopen and type invalid text, Tab to Calendar, navigate with arrows, select a day, reopen, clear with the clear action and Escape; verify focus returns to the trigger and compare formatted date/week order in LTR and RTL.',
 'field':'Use stacked and horizontal labeled controls with help/error text; focus the input and inspect label/description associations.',
 'checkbox':'Toggle checked/mixed/unchecked; focus normal and card/tile variants, including disabled and invalid.',
 'radio':'Arrow among radios and focus row/tile cards; verify one selected option and the group’s label.',
 'switch':'Toggle short/long tracks at every size, focus by keyboard and inspect off/on/disabled/read-only/loading states.',
 'badge-group':'Open the overflow trigger by keyboard, inspect its focus ring, then compare wrapping and overlay tag gaps.',
 'card':'Use linked, horizontal, immersive and carousel cards; Tab through links/actions and resize across container breakpoints.',
 'table':'Hover rows with a real pointer; select a row and hover it again; inspect header/rules and nested interactive cells.',
 'dialog':'Open by trigger, Tab and Shift+Tab through the modal, Escape and inspect return focus; repeat at a narrow phone-like viewport.',
 'confirm-dialog':'Open the harmless local confirm demo, verify initial Cancel focus, test Cancel/Escape, and inspect its neutral/danger/compact specimens.',
 'drawer':'Open start/end/bottom, modal and non-modal drawers; Tab, Escape and inspect return focus; repeat stacked actions and close-transition fallback.',
 'tooltip':'Focus and hover the trigger, move between two tooltip triggers and Escape; measure opening/closing delays separately from owner timing approval.',
 'hover-card':'Hover and keyboard-focus the trigger; move into/out of the card, dismiss and confirm expected non-announcement rather than inventing a live region.',
 'context-menu':'Right-click and use Shift+F10/Menu key on the local target; navigate and dismiss; separately try a genuine touch long-press.',
 'command-palette':'Open, type/filter, arrow through groups, activate a harmless action, and Escape; repeat with a real IME composition.',
 'message':'Show user/assistant turns and streaming; reach message actions and inspect bubble anchoring and reading order.',
 'composer':'Type a multiline local draft, inspect auto-growth, hover/focus tool/send controls and verify the text remains readable.',
 'prompt-suggestions':'Hover each row and dismiss action, Tab through suggestions and dismiss one in the local demo.',
 'tabs':'Arrow through tabs, activate and Tab into the panel; inspect selected/hover/focus contrast.',
 'breadcrumb':'Hover/focus each link and overflow control; inspect current-page treatment and separators.',
 'code':'Render inline code in small and body text on ordinary and colored surfaces; inspect border/fill and text floor.',
 'code-block':'Hover header actions and line links; navigate to a line fragment to activate :target and inspect the linked-line rail.',
 'separator':'Inspect horizontal and vertical rules inside surfaces and on the page background.',
 'disclosure':'Collapse a section containing a unique text string, use the browser’s real Find command for that string, then verify the section opens; also toggle plain/divided and grouped sections.',
 'inspector':'Open the Figma inspector recipe and Tab through each group and trailing action; record actual order against visual order.',
 'overlay':'Open nested popovers in the interaction lab, resize near edges, Escape one level at a time and check return focus and dismissal boundaries.',
 'resizable-panel':'Drag each resizable edge, then focus the splitter and use arrows/Home/End to its limits; inspect focus and value announcements.'}
patterns={
 'Dark theme':r'\bdark\b', 'Forced colours':r'forced[- ]colou?rs?', 'RTL':r'\bRTL\b',
 'Screen reader':r'screen[- ]readers?', 'Firefox/Safari':r'Firefox|Safari|cross-engine|without `text-box`|without `transition-behavior`',
 'Touch':r'\btouch\b', 'Product capture':r'Figma|Notion|ChatGPT|products?|references|Claude in Chrome|side.by.side|hover and focus captures',
 'Other local/source/owner checks':r'hover|focus|compact|media corners|arrow alignment|disabled group|two children disabled|IME|phone.width|find.in.page|nested popovers|Primer|timing|stand.ins|sm with icons'}
records=[]
for path in subprocess.check_output(['git','-C',str(ROOT),'ls-tree','-r','--name-only',SHA,'docs/specs'],text=True).splitlines():
 if not path.endswith('.md'):continue
 lines=read(path).splitlines(); slug=Path(path).stem
 for i,line in enumerate(lines):
  m=re.search(r'Unverified\s*:',line,re.I)
  if not m:continue
  end=i+1
  while end<len(lines) and lines[end].strip() and not re.match(r'^\s*(?:#{1,6} |[-*] |\d+\. |\|)',lines[end]):end+=1
  quote='\n'.join(lines[i:end]); item=(line[m.end():]+' '+' '.join(lines[i+1:end])).strip()
  kinds=[k for k,p in patterns.items() if re.search(p,item,re.I)]
  if slug=='prompt-suggestions':kinds=['Dark theme'] # following sentence records a completed ChatGPT hover capture
  if not kinds:kinds=['Other local/source/owner checks']
  assert slug in actions,slug
  records.append(dict(id=f'U{len(records)+1:03}',spec=path,slug=slug,line=i+1,end=end,quote=quote,item=item,kinds=kinds,action=actions[slug]))
assert len(records)==68
# Qualifiers after the marker only: verified dark/compact context before it must not become a new obligation.
assert next(r for r in records if r['slug']=='tag-picker')['kinds']==['RTL','Screen reader']
counts=collections.Counter(k for r in records for k in r['kinds'])
proto={
 'Dark theme':('Split scope: Area paint is local-browser-checkable; live target-product dark parity needs the referenced signed-in session. Generic “dark theme” notes do not identify which half was omitted.', 'Set the local theme to dark before loading the specimen; also use compact and default density. Reload after theme changes so stale light paint is not mistaken for dark verification.', 'Capture painted color/background/border/shadow and a screenshot for every exercised state. For product-dark wording, compare a matching product state at the same zoom; use an already-dark session or ask the owner before changing its theme. Do not close the product part on an Area-only screenshot.'),
 'Forced colours':('Local browser emulation can check CSS fallback paint; actual Windows forced-colour rendering additionally needs that OS/browser. No signed-in product or screen reader is required for paint alone.', 'In Chromium DevTools Rendering, emulate forced-colors: active; repeat the same specimen with the native system high-contrast setting when available.', 'Check that text, boundaries, selected/focused states and icons remain distinguishable using painted system colors. Record emulated and native execution separately; contrast unit tests alone do not finish this item.'),
 'RTL':('Repository plus a local browser is sufficient for visual/keyboard RTL; assistive-technology reading order is a separate screen-reader check.', 'Set dir="rtl" on the local specimen’s enclosing theme scope before mount, reload, and repeat its LTR interactions without editing its data.', 'Inspect start/end anchoring, clipped text, arrows, divider and resize/drag direction. Keep BoxField physical left/right labels physical. For overlays, repeat near both viewport edges. Save LTR/RTL screenshots and key outcomes.'),
 'Screen reader':('Requires assistive technology: use VoiceOver+Safari or NVDA+Firefox/Chrome. DOM roles or the browser accessibility tree alone cannot verify announcements.', 'For VoiceOver+Safari, enable VoiceOver with Command-F5, move with VO+Right/Left (VO is Control+Option), and interact with VO+Shift+Down; use Tab and the component keys for controls. For NVDA+Firefox/Chrome, start NVDA, Tab into the control and use focus mode for its keys. Execute the family action below. Record browser/AT versions and spoken output.', 'Verify accessible name, role, value, state, description, focus return and relevant live-region timing. For HoverCard verify the documented non-announcement; for Count record its label; for reorder/tag changes record each live message. Do not infer this pass from ARIA attributes.'),
 'Firefox/Safari':('Repository and installed local Firefox/Safari are sufficient; behavior on a physical phone requires a separate device check. No sign-in or AT is needed for this engine-only pass.', 'Open the same built snapshot in current Firefox and Safari, recording versions and CSS.supports results for text-box, field-sizing, cap units, container queries, :has() and transition-behavior as applicable.', 'Execute the action below; compare alignment, fallback sizing, clipping, focus and dismissal against Chromium. For ColorPicker, confirm EyeDropper hides cleanly when unsupported. For Drawer test exit with and without transition-behavior support; record absent features as fallback paths, not successful feature tests.'),
 'Touch':('A real touch device is needed for device drag/long-press/gesture claims; desktop pointer emulation is preliminary only. No product account is needed for Area checks.', 'Serve the same local build on a device-reachable preview and open it on an actual touch device. Record OS/browser; tap, drag and long-press with a finger while watching scroll conflicts.', 'Exercise hit targets, cancellation, scrolling and focus. For ContextMenu record that long-press is explicitly not implemented; verifying that limitation does not justify marking the feature supported. For PropertyList and resizable Panel, compare finger drag with the keyboard path.'),
 'Product capture':('Usually needs a signed-in Figma/Notion/ChatGPT state; a public shadcn rendering or Primer source lookup needs only public network access. Existing committed captures permit offline comparison but cannot prove missing live states.', 'Read the family Sources/Visual pass and inspect existing captures first. Open only the named reference state in an already-authorized session, at the same zoom as Area; execute only read-only UI navigation.', 'Use apps/docs/public/area-capture.js on the named shell/slots and save a redacted state capture plus side-by-side evidence. Do not create multi-select data, summon multiplayer collaborators, type a product draft, change product theme/settings or perform deletion to manufacture a reference; if the needed state is absent, record the missing state for the owner.'),
 'Other local/source/owner checks':('Local interaction/layout checks use the repository and a local browser. Public source pinning needs network; owner timing approval and missing icon design decisions require the owner. Real IME checks need an installed input method.', 'Keep the local browser foreground; perform the family action below with real pointer/Tab/keyboard events. For compact wording, set data-area-ui="compact" before mount; for IME use an actual composition session.', 'Record the specific remaining assertion in the source quote: hover/focus paint, mixed-disabled group, viewport fit, nested dismissal, media corners or Find reveal. For a pinned-source request, record an upstream SHA and lines. For owner-reviewed timing or undrawn stand-ins, preserve the decision gap after measuring; no local test grants approval.')}
lines=['# Unverified inventory','','**Question:** What does every `Unverified:` item in the specs ask us to check, which environment does it require, and how can it be checked?','','**Answer:**','- Found **68 marker paragraphs** across **63 specs**, preserving every wrapped continuation and historical note. These are recorded obligations, not 68 confirmed defects.','- Grouped into the seven requested kinds, with an extra section for focus, IME, compact layout, source pinning and owner decisions so nothing falls out of scope.','- Area paint/RTL/engine checks are local; product parity needs the corresponding reference state, spoken-output checks need assistive technology, and physical touch claims need a device.','- No checks were executed and no spec or approval status was changed. Generic dark-theme wording is split into local paint versus product parity rather than silently treated as one or the other.','',f'**Snapshot:** `origin/main` `{SHA}`, checked 2026-10-07 (America/Los_Angeles). All `docs/specs/*.md` files were scanned case-insensitively. Each item links its exact source lines.','','## Reading this inventory','','Each U-ID represents one literal marker paragraph. It may appear in several categories because a paragraph often contains several checks. Counts overlap and must not be added. Text before the marker is retained for provenance but does not create new obligations: e.g. Tag picker already says dark/compact checked before its remaining screen-reader/RTL note. Historical notes remain quoted, even where later captures or feedback appear to supersede them.','','Exact check steps below are proposed procedures inferred from each note and its family contract, not measured results. The item-specific action plus the numbered category steps form the complete procedure. Family actions always run on the local Area specimen; in products, inspect only the corresponding existing reference state. Completed evidence sentences retained in quotes do not create new obligations.','','## Local setup and evidence','','1. Use the pinned Area checkout and its documented dependency/build setup. Run `npm run dev`; use the printed local URL (default http://localhost:4321). Build failures block execution and should be recorded, not bypassed as a pass. '+cite('docs/DEVELOPMENT.md',23,43),
'2. Open the family in the gallery; use `lab.html` for interactive overlays. Inspector and resizable-panel use Panel specimens. For a missing named state, create a disposable local harness outside product data from the documented component props; record its source with the result. '+cite('docs/DEVELOPMENT.md',68,73),
'3. Set local theme/density/dir before rendering. Theme changes can retain stale painted colors; measure actual painted properties after a reload/restyle, not only unresolved custom-property strings. '+cite('docs/THEMING.md',75,99),
'4. Save snapshot, browser/version, viewport/zoom, theme/density/radius, steps, expected/actual result and redacted screenshots/captures. A source read proves declared behavior; a test proves only the exercised behavior. '+cite('docs/DEVELOPMENT.md',104,114),'']
for kind in patterns:
 subset=[r for r in records if kind in r['kinds']]
 access,setup,check=proto[kind]
 lines += [f'## {kind}', '',f'{len(subset)} source paragraphs include this kind. **Access:** {access}','','For each item in this section:','',f'1. {setup}','2. Perform the item’s family action below on the local Area specimen; compare only existing product states for product-capture checks.',f'3. {check}','4. Attach the result to the U-ID and source clause; leave other clauses unresolved until separately checked.','']
 for r in subset:
  lines += [f'### {r["id"]} — {r["slug"]}', '',cite(r['spec'],r['line'],r['end']), '',*['> '+l for l in r['quote'].splitlines()],'',f'**Steps for this family:** {r["action"]}','']
  if kind=='Product capture':
   exceptions=[]
   if r['slug']=='disclosure':exceptions.append('Check the collapsed Notion toggle and ChatGPT dark separately from the public rendered shadcn accordion; the latter does not require sign-in.')
   if r['slug']=='composer':exceptions.append('The requested ChatGPT multiline reference requires an existing multiline draft or explicit owner permission to type; do not send a message.')
   if r['slug']=='indicator':exceptions.append('Use existing inbox/presence/multiplayer/rectangular-owner states only; if none is present, record the unavailable reference rather than creating activity.')
   if r['slug']=='badge-group':exceptions.append('Use an existing multi-select cell; do not convert a property or add values just to obtain a capture.')
   if r['slug']=='box-field':exceptions.append('Locate an existing selected object with independent padding/corner controls; expanding an already-authorized inspector is navigation, editing its values is outside this research task.')
   lines += [*exceptions,''] if exceptions else []
lines += ['## Proposals','','Recommended order: local paint/RTL/engine checks first, then assistive-technology and touch sessions, then reference captures grouped by product. Retain the exact U-ID and clause in each result so a local dark screenshot does not accidentally clear a product-dark gap.','','## Open questions','','- Generic “dark theme” markers often do not distinguish Area paint from reference parity. Which scope did the original author intend? Both are kept distinct here.','- Which older markers have already been resolved by later evidence? Reconcile dates before scheduling duplicate work; this collection does not delete historical notes.','- Missing product states, owner timing approval and undrawn glyph choices cannot be resolved by a browser test alone.','','## Reproduce','','Run `python3 docs/research/astra/unverified-inventory/generate.py`. The script resolves the repository relative to itself, reads the pinned Git snapshot, and writes only this topic. `items.json` retains exact paragraphs, source ranges, categories and the per-family procedure. It asserts the full 68-marker coverage and protects against misclassifying already-verified context.','']
# Derive the spec count rather than hard-code an inventory claim.
lines=[l.replace('across **63 specs**',f'across **{len(set(r["spec"] for r in records))} specs**') for l in lines]
(OUT/'README.md').write_text('\n'.join(lines));(OUT/'items.json').write_text(json.dumps({'snapshot':SHA,'counts':dict(counts),'items':records},ensure_ascii=False,indent=2)+'\n')
print('markers',len(records),'specs',len(set(r['spec'] for r in records)),dict(counts))
