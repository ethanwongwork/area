import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { promptSuggestionsVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Kbd } from "./Kbd.tsx";
/** The empty collection, one reference so effects keyed on it stay still. */
const NO_ITEMS: never[] = [];

export interface PromptSuggestion {
  id: string;
  /** The prompt, shown on one line (truncated) and used as the button's name. */
  label: string;
  icon?: ReactNode;
  /** The keys that choose it, shown as a keycap after the label ("Plan New Idea ⇧Tab"): `["Shift", "Tab"]`. */
  shortcut?: string[];
}

export interface PromptSuggestionsProps extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect"> {
  /** The suggestions. */
  items?: PromptSuggestion[];
  /** @deprecated Use `items`. */
  suggestions?: PromptSuggestion[];
  /** Fill the composer with it, or send it; the host decides. */
  onSelect?: (suggestion: PromptSuggestion) => void;
  /** Shows a dismiss button on each row of the list layout; called with that suggestion. Chips have none. */
  onDismiss?: (suggestion: PromptSuggestion) => void;
  /** Names the list ("Suggestions"). */
  label?: string;
  /** `list` (default): full-width rows under the composer. `chips`: wrapping outline Buttons. */
  layout?: VariantProps<typeof MANIFESTS.promptSuggestions>["layout"];
}

/** Starter prompts under an empty composer, one row each, or as chips. */
export const PromptSuggestions = forwardRef<HTMLUListElement, PromptSuggestionsProps>(function PromptSuggestions(
  { items, suggestions: legacySuggestions, onSelect, onDismiss, label = "Suggestions", layout = "list", className, ...rest }, ref,
) {
  const suggestions = items ?? legacySuggestions ?? NO_ITEMS;
  if (layout === "chips") {
    return <ul ref={ref} aria-label={label} className={promptSuggestionsVariants({ layout }, className)} {...rest}>
      {suggestions.map(suggestion => <li key={suggestion.id} className="area-prompt-suggestions__row">
        <Button variant="outline" tone="neutral" icon={suggestion.icon} onClick={() => onSelect?.(suggestion)}>{suggestion.label}{suggestion.shortcut ? <Kbd keys={suggestion.shortcut} /> : null}</Button>
      </li>)}
    </ul>;
  }
  return <ul ref={ref} aria-label={label} className={promptSuggestionsVariants({ layout }, className)} {...rest}>
    {suggestions.map(suggestion => <li key={suggestion.id} className="area-prompt-suggestions__row">
      <button type="button" className="area-prompt-suggestions__item" onClick={() => onSelect?.(suggestion)}>
        {suggestion.icon ? <span className="area-prompt-suggestions__icon" aria-hidden="true">{suggestion.icon}</span> : null}
        <span className="area-prompt-suggestions__text">{suggestion.label}</span>
        {suggestion.shortcut ? <Kbd className="area-prompt-suggestions__shortcut" keys={suggestion.shortcut} /> : null}
      </button>
      {onDismiss ? <span className="area-prompt-suggestions__dismiss">
        <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={`Dismiss “${suggestion.label}”`}
          icon={<Glyph name="dismiss" />} onClick={() => onDismiss(suggestion)} />
      </span> : null}
    </li>)}
  </ul>;
});
