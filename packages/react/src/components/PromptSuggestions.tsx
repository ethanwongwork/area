import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { promptSuggestionsVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";

export interface PromptSuggestion {
  id: string;
  /** The prompt, shown on one line (truncated) and used as the button's name. */
  label: string;
  icon?: ReactNode;
}

export interface PromptSuggestionsProps extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect"> {
  /** The suggestions, in order (audit S17 / H-14: a collection you act on is `items`). */
  items?: PromptSuggestion[];
  /** @deprecated Use `items`. */
  suggestions?: PromptSuggestion[];
  /** Fill the composer with it, or send it; the host decides. */
  onSelect?: (suggestion: PromptSuggestion) => void;
  /** Shows a dismiss button on each row of the `list` layout. Chips have none: a removable
   * suggestion chip is a Chip (`kind="input"`), not a Button (audit G-24). */
  onDismiss?: (suggestion: PromptSuggestion) => void;
  /** @deprecated Name it with `aria-label` (audit S17: `label` is visible text; names are `aria-label`). */
  label?: string;
  /** Full-width rows under the composer (ChatGPT), or wrapping outline Buttons. */
  layout?: VariantProps<typeof MANIFESTS.promptSuggestions>["layout"];
}

/** Starter prompts under an empty composer, one row each (ChatGPT's home). */
export const PromptSuggestions = forwardRef<HTMLUListElement, PromptSuggestionsProps>(function PromptSuggestions(
  { items, suggestions: suggestionsProp, onSelect, onDismiss, label, "aria-label": ariaLabel = label ?? "Suggestions", layout = "list", className, ...rest }, ref,
) {
  const suggestions = items ?? suggestionsProp ?? [];
  if (layout === "chips") {
    return <ul ref={ref} aria-label={ariaLabel} className={promptSuggestionsVariants({ layout }, className)} {...rest}>
      {suggestions.map(suggestion => <li key={suggestion.id} className="area-prompt-suggestions__row">
        <Button variant="outline" tone="neutral" icon={suggestion.icon} onClick={() => onSelect?.(suggestion)}>{suggestion.label}</Button>
      </li>)}
    </ul>;
  }
  return <ul ref={ref} aria-label={ariaLabel} className={promptSuggestionsVariants({ layout }, className)} {...rest}>
    {suggestions.map(suggestion => <li key={suggestion.id} className="area-prompt-suggestions__row">
      <button type="button" className="area-prompt-suggestions__item" onClick={() => onSelect?.(suggestion)}>
        {suggestion.icon ? <span className="area-prompt-suggestions__icon" aria-hidden="true">{suggestion.icon}</span> : null}
        <span className="area-prompt-suggestions__text">{suggestion.label}</span>
      </button>
      {onDismiss ? <span className="area-prompt-suggestions__dismiss">
        <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={`Dismiss “${suggestion.label}”`}
          icon={<Glyph name="dismiss" />} onClick={() => onDismiss(suggestion)} />
      </span> : null}
    </li>)}
  </ul>;
});
