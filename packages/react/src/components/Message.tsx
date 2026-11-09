import { Children, forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { messageVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { useAnnouncement } from "./announce.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { useLoadingDelay } from "./primitives.tsx";

export type MessageStatus = NonNullable<VariantProps<typeof MANIFESTS.message>["status"]>;

export interface MessageProps extends Omit<HTMLAttributes<HTMLElement>, "role"> {
  /** Who wrote it: the person (a bubble at the end) or the assistant (prose across the column, default). */
  author?: VariantProps<typeof MANIFESTS.message>["author"];
  /** Names the author for assistive tech ("You", "ChatGPT"). */
  authorName?: string;
  /** A MessageActions row under the message. */
  actions?: ReactNode;
  /** The answer is still arriving: a dot follows the last word. */
  streaming?: boolean;
  /**
   * The person's message on its way: `sending` (Queue's word for the activity; after a second the bubble dims and
   * "Sending…" shows under it) or `error` (it was not sent: a mark, "Not sent" and Retry under it, said through the
   * shared announcer). Unset once it is sent. An assistant turn that fails is a Turn notice, not this.
   */
  status?: MessageStatus;
  /** The status line's words: "Sending…" and "Not sent" by default. */
  statusText?: string;
  /** Shows Retry on the line of a message that was not sent; called when it is pressed. */
  onRetry?: () => void;
  /** Each child is a bubble of its own, stacked 2 apart with tighter corners where they meet: one message in parts. */
  split?: boolean;
}

/** One turn in a conversation. */
export const Message = forwardRef<HTMLElement, MessageProps>(function Message(
  { author = "assistant", authorName, actions, streaming, status, statusText, onRetry, split, className, children, ...rest }, ref,
) {
  const name = authorName ?? (author === "user" ? "You" : "Assistant");
  const cursor = streaming ? <span className="area-message__cursor" aria-hidden="true" /> : null;
  const inline = typeof children === "string" || typeof children === "number";
  // A send is usually quick, so its line keeps its place but shows only after the long wait (WRITING.md, "Loading shows
  // by how long it takes"; Spinner's `delay="long"`); a failure shows at once.
  const shown = useLoadingDelay(status === "sending" ? "long" : undefined);
  const words = statusText ?? (status === "error" ? "Not sent" : "Sending…");
  useAnnouncement(status === "error" ? `Message: ${words}` : null);
  const parts = split ? Children.toArray(children) : null;
  const bubbles = parts && parts.length > 1
    ? <div className="area-message__stack">{parts.map((part, index) => <div key={index} className="area-message__bubble">{part}{index === parts.length - 1 ? cursor : null}</div>)}</div>
    : <div className="area-message__bubble">{children}{cursor}</div>;
  const line = status ? (
    <p className="area-message__status">
      {status === "error" ? <Glyph name="dismiss-circle" /> : null}
      <span className="area-message__status-text">{words}</span>
      {status === "error" && onRetry ? <Button variant="ghost" tone="neutral" size="sm" icon={<Glyph name="reset" />} onClick={onRetry}>Retry</Button> : null}
    </p>
  ) : null;
  return <article ref={ref} aria-label={`${name} said`} aria-busy={streaming || status === "sending" || undefined}
    className={messageVariants({ author, status }, className)} data-streaming={streaming ? "" : undefined}
    data-waiting={status === "sending" && !shown ? "" : undefined} {...rest}>
    {author === "user"
      ? bubbles
      : <div className="area-message__content">{inline ? <p>{children}{cursor}</p> : <>{children}{cursor}</>}</div>}
    {line}
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

export type MessageGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * The person's consecutive messages, stacked 2 apart with tighter corners where their bubbles meet (a split message
 * uses the same stack inside one turn). The turns keep their own names; the group only sets the stack.
 */
export const MessageGroup = forwardRef<HTMLDivElement, MessageGroupProps>(function MessageGroup({ className, ...rest }, ref) {
  return <div ref={ref} className={["area-message__stack", className].filter(Boolean).join(" ")} {...rest} />;
});
