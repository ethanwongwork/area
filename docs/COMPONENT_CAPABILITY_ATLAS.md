# Component capability atlas

Updated 2026-09-17. This is Area's expansion index: a living inventory of public
component jobs, cross-system aliases, and the behaviour that makes similarly shaped
elements different components. It supports breadth-first planning; it is not an
authorization to add every row as a CSS modifier.

## How to use it

Before a component audit, search its category and its neighbouring categories. Record every
relevant row in the audit's candidate ledger, including aliases. Classify it as Core,
Optional, Separate, Defer, or Reject. A credible product workflow can add a row; no catalog
is a complete enumeration of every domain component.

Keep these axes separate: **variant** (persistent treatment), **tone**, **size/density**,
**state**, **layout**, **composition**, and **behaviour**. Behaviourally distinct rows do
not become a single overloaded component because they share a closed-box appearance.

## Inventory

| Category | Component families and common aliases |
| --- | --- |
| Actions | Button/CTA; IconButton/toolbar button; Link/Anchor; Button group/Action group; Split button/Menu button; Floating action button/FAB |
| Form foundations | Field/Form field/Input group; Input/Text field/Text box; Textarea/Multiline field; Number input/Stepper; Search/Search field; Inline edit/Editable text |
| Form choice | Select/Native picker; Combobox/Autocomplete/Typeahead; Multi-select/Multi-combobox; Checkbox; Radio group/Option group; Switch/Toggle; Slider/Range; Rating/Star rating; Transfer list/Dual listbox |
| Form specialisation | Date picker/Calendar picker; Time picker; Date-time picker; File upload/Uploader/Dropzone; Color picker/Color well; Rich-text editor/Composer |
| Compact selection and labels | Chip/Filter chip/Choice chip; Segmented control/Content switcher; Toggle button/Press toggle; Badge/Count badge; Tag/Label/Lozenge; Token/Design token; Kbd/Keyboard hint |
| Navigation | Tabs/Tab bar; Nav/Sidebar/Rail/Top nav; Breadcrumbs/Breadcrumb trail; Pagination/Pager; Stepper/Progress steps; Tree/Outline; Command menu/Command palette/Quick switcher; Bottom navigation; Menubar; Speed dial |
| Overlays | Menu/Dropdown menu/Context menu; Popover/Popup/Flyout/Inline dialog; Tooltip/Hint; Dialog/Modal/Alert dialog; Drawer/Sheet/Side panel; Banner/Global message; Spotlight/Coach mark |
| Feedback | Alert/Inline message/Section message; Toast/Snackbar/Flag; Progress/Progress bar; Progress indicator/Tracker; Spinner/Activity indicator; Skeleton/Content placeholder; Empty state/Blank slate/Zero state; Error state |
| Data and content | Table; Data grid/Advanced table; List/Collection/Contained list; Tree table; Card/Tile; Description list/Key-value list; Stat/KPI/Metric; Timeline/Activity feed; Avatar/Persona; Avatar group; Image; Icon; Code/Inline code; Code block/Code snippet |
| Structure and layout | Accordion/Disclosure; Panel/Surface/Well; Separator/Divider/Rule; App bar/Toolbar; Page header; Container; Box; Stack; Inline; Flex; Grid; Bleed; Portal; Focusable/Pressable primitives |

## Boundaries that must remain explicit

- **Select / Combobox / Multi-select:** native one-value selection, editable/filterable
  selection, and multiple-value selection each have different values, keyboard models,
  popup behaviour and screen-reader announcements.
- **Badge / Tag / Chip / Token:** a count/status attachment, object classification, compact
  selectable/removable value, and static technical reference are separate jobs.
- **Menu / Popover / Tooltip / Dialog:** action list, contextual interactive content,
  noninteractive description, and focus-interrupting decision layer are separate jobs.
- **Table / Data grid / List / Tree:** structured comparison, high-density data operations,
  linear collection, and hierarchy need different navigation and virtualization contracts.
- **Field / Input / Textarea:** Field owns relationships; editable controls own input
  mechanics and geometry. Number, password, search and file upload need their own
  documented recipes or components.

## Evidence set

Use Area's seven required benchmarks plus the current published catalogues from
[Material Design](https://m3.material.io/components),
[IBM Carbon](https://carbondesignsystem.com/components/overview/components/),
[Atlassian Design](https://atlassian.design/components),
[Apple HIG](https://developer.apple.com/design/human-interface-guidelines/components), and
[MUI](https://mui.com/components/). Tailwind CSS is a utility framework rather than a
canonical component API; Tailwind Plus patterns may inspire a candidate but do not establish
one. Record access date, source level, and the exact source for every decision.

The interactive, searchable companion is the Component Capability Atlas canvas in the Area
workspace. This repository page remains the portable source for audit work and review.
