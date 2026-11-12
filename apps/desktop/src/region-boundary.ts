/**
 * One way to fail (the smoothness pass, docs/research/desktop-app-analysis-2026-11-10, V3; PRODUCT_UI.md rule 27): a
 * region whose content throws while it draws (the Canvas, the Sidebar's list, an Inspector view, the Chat) says so in
 * its own place, with Try again, and the rest of the app keeps working. Before, one page's error blanked the window.
 * Moving to another place clears it (`reset`); the error is written to the console for whoever fixes it. Written
 * without JSX, so the region test can import it.
 */
import { Component, createElement as h, type ReactNode } from "react";
import { Button, EmptyState } from "@area/react";

interface Props {
  /** What the region is, for its words ("This view", "The chat"). */
  name: string;
  /** A change here (the place shown) clears a failure. */
  reset?: string;
  children: ReactNode;
}
interface State { error: Error | null; reset?: string }

export class RegionBoundary extends Component<Props, State> {
  override state: State = { error: null, reset: this.props.reset };
  static getDerivedStateFromError(error: Error): Partial<State> { return { error }; }
  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    return props.reset !== state.reset ? { error: null, reset: props.reset } : null;
  }
  override componentDidCatch(error: Error) { console.error(`[${this.props.name}] ${error.stack ?? error.message}`); }
  override render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return h("div", { className: "studio-region-error", role: "alert" },
      h(EmptyState, {
        size: "sm", title: `${this.props.name} couldn't be drawn`,
        description: `Try again, or open another place. What went wrong: ${error.message.split("\n")[0]!.slice(0, 160)}`,
        actions: h(Button, { size: "sm", variant: "soft", tone: "neutral", onClick: () => this.setState({ error: null }) }, "Try again"),
      }));
  }
}
