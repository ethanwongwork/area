import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { promptSuggestionsVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Kbd } from "./primitives.tsx";
/** The empty collection, one reference so effects keyed on it stay still. */
const NO_ITEMS: never[] = [];

export interface PromptSuggestion {
  id: string;
  /** The prompt, shown on one line (truncated) and used as the button's name. */
  label: string;
  icon?: ReactNode;
  /** The keys that choose it, shown as a keycap after the label (Cursor's "Plan New Idea ⇧Tab"): `["Shift", "Tab"]`. */
  shortcut?: string[];
}

export interface PromptSuggestionsProps extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect"> {
  /** The suggestions. Collections are `items` everywhere (audit H-14). */
  items?: PromptSuggestion[];
  /** @deprecated Use `items`. */
  suggestions?: PromptSuggestion[];
  /** Fill the composer with it, or send it; the host decides. */
  onSelect?: (suggestion: PromptSuggestion) => void;
  /** Shows a dismiss button on each row of the list layout; chips have none (ChatGPT's chips are not dismissible). */
  onDismiss?: (suggestion: PromptSuggestion) => void;
  /** Names the list ("Suggestions"). */
  label?: string;
  /** Full-width rows under the composer (ChatGPT), or wrapping outline Buttons. */
  layout?: VariantProps<typeof MANIFESTS.promptSuggestions>["layout"];
}

/** Starter prompts under an empty composer, one row each (ChatGPT's home). */
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
