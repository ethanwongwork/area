/**
 * A family's Documentation tab, where its spec and source do not already say it as a table (owner, 2026-10-18: "make
 * sure one of the tabs is documentation"; "make sure the info is organized into tables"). Everything here restates
 * the family's spec (docs/specs/<slug>.md) or its source, in a reader's words; the tab derives the rest (purpose,
 * anatomy classes, state attributes, related families) from the manifest and spec. How to write an entry: the
 * area-component-docs skill. Check every entry: npm run check:docs -w @area/desktop.
 *
 *   instead      [situation, family slugs, why]: what to reach for instead of this family
 *   practices    [Do | Don't, guidance]
 *   parts        part (as the manifest names it, or "root") -> what it is
 *   states       state (as the manifest names it) -> what changes
 *   keyboard     [keys, what happens]: key names as Kbd takes them ("Tab", "Enter or Space", "Shift+Tab", "Up or Down")
 *   aria         [attribute, when it is set]
 *
 * Entries are grouped by kind of component, one file each, so several people can write at once.
 */
import actions from "./documentation/actions.mjs";
import fields from "./documentation/fields.mjs";
import pickers from "./documentation/pickers.mjs";
import navigation from "./documentation/navigation.mjs";
import status from "./documentation/status.mjs";
import content from "./documentation/content.mjs";
import conversation from "./documentation/conversation.mjs";

const GROUPS = { actions, fields, pickers, navigation, status, content, conversation };

/** Every family's entry, by slug. A slug in two groups is an error, caught by check:docs. */
export const DOCUMENTATION = Object.assign({}, ...Object.values(GROUPS));
export const DOCUMENTATION_GROUPS = GROUPS;
