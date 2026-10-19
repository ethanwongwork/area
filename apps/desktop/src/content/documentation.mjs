/**
 * A family's Documentation tab, where its spec and source do not already say it as a table (owner, 2026-10-18: "make
 * sure one of the tabs is documentation"; "make sure the info is organized into tables"). Everything here restates
 * the family's spec (docs/specs/<slug>.md, the section named on each entry) or its source, in a reader's words; the
 * tab derives the rest (purpose, anatomy classes, state attributes, related families) from the manifest and spec.
 *
 *   instead      [situation, family slugs, why]: what to reach for instead of this family
 *   practices    [Do | Don't, guidance]
 *   parts        part (as the manifest names it, or "root") -> what it is
 *   states       state -> what changes
 *   keyboard     [keys, what happens]
 *   aria         [attribute, when it is set]
 */
export const DOCUMENTATION = {
  button: {
    // Spec: Job and boundaries.
    instead: [
      ["Going to a place (a page, a section, a URL)", ["link", "nav", "breadcrumb"], "A Button triggers an action; navigation is a link."],
      ["Choosing one mode among siblings", ["segmented"], "A row of selected Buttons doesn't say only one can be on."],
      ["A selectable filter", ["chip"], "Chip is the selectable pill; Button is an action."],
      ["Laying out several Buttons", ["button-group", "toolbar"], "They arrange Buttons and add no Button paint of their own."],
    ],
    // Spec: Variants (justification column), Behavior and accessibility, States; source: Button.tsx JSDoc.
    practices: [
      ["Do", "Use solid for the strongest action in a view, and soft or outline for secondary actions."],
      ["Do", "Use ghost for quiet actions in toolbars, headers and message actions."],
      ["Do", "Give an icon-only Button an aria-label: it is its only name."],
      ["Do", "Set loading while an action is pending: the Button keeps focus and ignores clicks, so a submit isn't sent twice."],
      ["Do", "Put a shortcut in the label with Kbd; the Button carries it as aria-keyshortcuts."],
      ["Don't", "Use a Button to go somewhere. Use Link, Nav or Breadcrumb."],
      ["Don't", "Set disabled with loading to show progress: loading and disabled together is plainly disabled."],
      ["Don't", "Rely on HTML's submit default. Button is type=\"button\" unless you ask for submit."],
    ],
    // Spec: Anatomy (the area rows).
    parts: {
      root: "The native button: owns the height, the 1px border (transparent unless outline or soft), the corner and the fill.",
      icon: "The icon box, 16 at md (12 / 16 / 20 by size). A Spinner takes it while loading.",
      label: "The text, cap-trimmed so it centres on the cap height; a long label ends in an ellipsis.",
    },
    // Spec: States.
    states: {
      disabled: "Dims and ignores input; native disabled.",
      loading: "A Spinner replaces the leading icon at full ink; clicks are dropped and the cursor shows progress.",
      selected: "A toggle that is on: the selected plate holds under hover and press (solid takes its hover fill).",
    },
    // Spec: Behavior and accessibility; native button keys.
    keyboard: [
      ["Tab", "Moves focus to the Button. A loading Button stays in the Tab order."],
      ["Enter or Space", "Activates it. A toggle flips selected."],
    ],
    aria: [
      ["aria-pressed", "From selected, on a toggle."],
      ["aria-disabled, aria-busy", "While loading (not native disabled, so focus stays)."],
      ["aria-label", "Required with iconOnly."],
      ["aria-keyshortcuts", "When a Kbd sits in the label; the Kbd's spoken chord is hidden so the name stays the label."],
    ],
  },
};
