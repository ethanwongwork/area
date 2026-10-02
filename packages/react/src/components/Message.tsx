import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { messageVariants, type VariantProps, MANIFESTS } from "../variants.ts";

export interface MessageProps extends Omit<HTMLAttributes<HTMLElement>, "role"> {
  /** Who wrote it: the person (a bubble at the end) or the assistant (prose across the column, default). */
  author?: VariantProps<typeof MANIFESTS.message>["author"];
  /** Names the author for assistive tech ("You", "ChatGPT"). */
  authorName?: string;
  /** A MessageActions row under the message. */
  actions?: ReactNode;
  /** The answer is still arriving: a dot follows the last word. */
  streaming?: boolean;
}

/** One turn in a conversation. */
export const Message = forwardRef<HTMLElement, MessageProps>(function Message(
  { author = "assistant", authorName, actions, streaming, className, children, ...rest }, ref,
) {
  const name = authorName ?? (author === "user" ? "You" : "Assistant");
  const cursor = streaming ? <span className="area-message__cursor" aria-hidden="true" /> : null;
  const inline = typeof children === "string" || typeof children === "number";
  return <article ref={ref} aria-label={`${name} said`} aria-busy={streaming || undefined}
    className={messageVariants({ author }, className)} data-streaming={streaming ? "" : undefined} {...rest}>
    {author === "user"
      ? <div className="area-message__bubble">{children}{cursor}</div>
      : <div className="area-message__content">{inline ? <p>{children}{cursor}</p> : <>{children}{cursor}</>}</div>}
    {actions}
  </article>;
});

export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Names the group ("Message actions"). */
  label?: string;
}

/** Copy, rate, read aloud, regenerate: ghost icon Buttons with no gap, muted. */
export const MessageActions = forwardRef<HTMLDivElement, MessageActionsProps>(function MessageActions(
  { label = "Message actions", className, ...rest }, ref,
) {
  return <div ref={ref} role="group" aria-label={label} className={["area-message__actions", className].filter(Boolean).join(" ")} {...rest} />;
});
