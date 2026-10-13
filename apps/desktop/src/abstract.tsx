/**
 * Language illustrations: one family of abstract, simplified UI (owner, 2026-10-11, after the
 * Frames X kit thumbnails: grey bars for text, white cards, a pill for a button, a dot, a check,
 * a toggle). Every piece is drawn from the same few parts at the same sizes (src/studio.css,
 * .abs-*), and every part reads Area's live tokens, so a setting's tile changes the drawing the
 * way that setting changes the product: the theme its ground and ink, the neutral its greys, the
 * accent, action and selection their fills, the type size its lines, the density its rows, the
 * radius its corners, the surface its edges and lift, the motion its timing.
 *
 * The parts:
 *   Card    a surface: the container corner, the card edge and shadow, one padding
 *   Bar     a line of text: one height, a width; strong for a title
 *   Pill    a button: action, accent or outline
 *   Dot, Check, Toggle, Field   the small controls
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { CheckIcon } from "@area/icons";

const Bar = ({ w, strong, tone }: { w: number; strong?: boolean; tone?: "accent" | "on-action" | "on-accent" }) => (
  <span className="abs-bar" data-strong={strong ? "" : undefined} data-tone={tone} style={{ "--_w": `${w}%` } as CSSProperties} />
);
const Pill = ({ kind = "action" }: { kind?: "action" | "accent" | "outline" }) => (
  <span className="abs-pill" data-kind={kind}><Bar w={56} tone={kind === "outline" ? undefined : kind === "accent" ? "on-accent" : "on-action"} /></span>
);
const Dot = ({ kind }: { kind?: "window" }) => <span className="abs-dot" data-kind={kind} />;
// The tick is Area's own check icon at 12, drawn on whole pixels, not a rotated CSS corner.
const Check = ({ on }: { on?: boolean }) => <span className="abs-check" data-on={on ? "" : undefined}>{on ? <CheckIcon size={12} aria-hidden="true" /> : null}</span>;
const Toggle = ({ on }: { on?: boolean }) => <span className="abs-toggle" data-on={on ? "" : undefined} />;
const Field = () => <span className="abs-field"><Bar w={40} /></span>;
/* A line of text for the type size: its stroke and its line follow the live text tokens. */
const Line = ({ w, title }: { w: number; title?: boolean }) => (
  <span className="abs-line" data-title={title ? "" : undefined}><Bar w={w} strong={title} /></span>
);
const Card = ({ children, kind }: { children: ReactNode; kind?: "float" | "back" }) => <span className="abs-card" data-kind={kind}>{children}</span>;
const Row = ({ children, end, plate }: { children: ReactNode; end?: boolean; plate?: boolean }) => (
  <span className="abs-row" data-end={end ? "" : undefined} data-plate={plate ? "" : undefined}>{children}</span>
);

/** A toggle that flips every 1.5s, so each motion preset shows its own duration and easing. */
function LoopingToggle() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const timer = setInterval(() => setOn(value => !value), 1500);
    return () => clearInterval(timer);
  }, []);
  return <Toggle on={on} />;
}

/** The illustration for one setting; every preset of that setting draws the same one. */
export function Abstract({ axis }: { axis: string }) {
  switch (axis) {
    // A window: its chrome, a title, text and an action, in each theme.
    case "theme":
      return (
        <Card>
          <Row><Dot kind="window" /><Dot kind="window" /><Dot kind="window" /></Row>
          <Bar w={52} strong />
          <Bar w={86} />
          <Bar w={64} />
          <Row end><Pill /></Row>
        </Card>
      );
    // The greys: a sidebar's rows, the current one on its plate.
    case "neutral":
      return (
        <Card>
          <Bar w={36} />
          <Row plate><Dot /><Bar w={56} strong /></Row>
          <Row><Dot /><Bar w={44} /></Row>
          <Row><Dot /><Bar w={62} /></Row>
        </Card>
      );
    // The hue: a primary action, an on toggle and a link.
    case "accent":
      return (
        <Card>
          <Bar w={52} strong />
          <Bar w={80} />
          <Row><Pill kind="accent" /><Toggle on /><Bar w={22} tone="accent" /></Row>
        </Card>
      );
    // What you press to commit: a dialog's two buttons.
    case "action":
      return (
        <Card>
          <Bar w={56} strong />
          <Bar w={84} />
          <Bar w={60} />
          <Row end><Pill kind="outline" /><Pill /></Row>
        </Card>
      );
    // The colour of state: checked rows and an on toggle.
    case "selection":
      return (
        <Card>
          <Row><Check on /><Bar w={58} /></Row>
          <Row><Check /><Bar w={44} /></Row>
          <Row><Check on /><Bar w={66} /></Row>
          <Row><Toggle on /><Bar w={36} /></Row>
        </Card>
      );
    // Type size: a title and lines of text, each at the size's own stroke and line.
    case "type":
      return (
        <Card>
          <Line w={52} title />
          <Line w={88} />
          <Line w={74} />
          <Line w={64} />
        </Card>
      );
    // Density: a field and rows at the setting's own row height.
    case "density":
      return (
        <Card>
          <Field />
          <Row><Dot /><Bar w={60} /></Row>
          <Row><Dot /><Bar w={46} /></Row>
          <Row><Dot /><Bar w={70} /></Row>
        </Card>
      );
    // Corners: the card, a field and a button, each at its own radius.
    case "radius":
      return (
        <Card>
          <Bar w={48} strong />
          <Field />
          <Row end><Pill /></Row>
        </Card>
      );
    // Edges and lift: a floating card over a resting one.
    case "surface":
      return (
        <span className="abs-stack">
          <Card kind="back"><Bar w={44} strong /><Bar w={80} /><Bar w={62} /></Card>
          <Card kind="float"><Bar w={60} strong /><Bar w={84} /><Row end><Pill /></Row></Card>
        </span>
      );
    // Timing: a toggle flipping on a loop.
    case "motion":
      return (
        <Card>
          <Bar w={50} strong />
          <Bar w={78} />
          <Row><LoopingToggle /><Bar w={40} /></Row>
        </Card>
      );
    default:
      return <Card><Bar w={60} strong /><Bar w={80} /></Card>;
  }
}
