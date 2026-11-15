/** Design card gallery specimens: one kind per tile. docs/specs/design-card.md. Each design is drawn at its true size and
 * the card places it (a tenth's margin, never past 100%, held at 50% and cropped below). Example people are David Tee. */
import { Button, Card, CardContent, CardDescription, CardTitle, CopyButton, DesignCard } from "@area/react";
import { SparkleIcon } from "@area/icons";

const card = { inlineSize: 240 } as const;
const wide = { inlineSize: 320 } as const;

/* A tall card in a small container: in a 160 card it would fall under 50%, so it holds 50% and is cropped below its top. It
   is 240 wide, so at 50% it is 120 and fits the ground across (a 520 card held at 50% ran 50 past both sides: F3.3). */
const large = (
  <Card style={{ inlineSize: 240 }}>
    <CardContent>
      <CardTitle>Title</CardTitle><CardDescription>Description</CardDescription>
      {["Item one", "Item two", "Item three", "Item four", "Item five", "Item six"].map(item => <CardDescription key={item}>{item}</CardDescription>)}
      <Button variant="solid">Continue</Button>
    </CardContent>
  </Card>
);
/* A window: a plain box at a screen's true 1920 × 1080, its own edge and corner, a title bar and a row of content. */
const screen = (
  <div style={{ boxSizing: "border-box", inlineSize: 1920, blockSize: 1080, display: "grid", gridTemplateRows: "56px 1fr", border: "1px solid var(--area-border-default)", borderRadius: "var(--area-radius-container)", background: "var(--area-bg-surface)", overflow: "clip" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingInline: 24, borderBlockEnd: "1px solid var(--area-border-default)" }}>
      <span>David Tee</span>
    </div>
    <div style={{ display: "grid", placeItems: "center" }}><Button variant="solid">Continue</Button></div>
  </div>
);
/* A phone: 390 × 844, its own corner. */
const phone = (
  <div style={{ boxSizing: "border-box", inlineSize: 390, blockSize: 844, display: "grid", alignContent: "start", gap: 16, padding: 24, border: "1px solid var(--area-border-default)", borderRadius: 48, background: "var(--area-bg-surface)" }}>
    <strong>David Tee</strong><Button variant="solid">Continue</Button>
  </div>
);

/* Part: a control at 100%, centred, a tenth's margin round it; its name and true size under the card. */
export const GalleryDesignCard = () => <DesignCard style={card} name="Button" actions={<CopyButton value="<Button>Continue</Button>" label="Copy Button" />}><Button>Continue</Button></DesignCard>;
/* Part, held: a card that would fall under 50% holds 50% and is cropped on its top. */
export const GalleryDesignCardHeld = () => <DesignCard style={{ inlineSize: 160 }} name="Card" focus="top">{large}</DesignCard>;
/* Screen: a 1920 × 1080 window whole, in a 16:9 card with a twentieth's margin. */
export const GalleryDesignCardScreen = () => <DesignCard style={wide} kind="screen" name="Workspace" designWidth={1920} designHeight={1080}>{screen}</DesignCard>;
/* Phone: stands from the top margin at 60% of the width and runs off the bottom. */
export const GalleryDesignCardPhone = () => <DesignCard style={card} kind="phone" name="Profile">{phone}</DesignCard>;
/* Icon: at a whole multiple of its size, here 2× in a 240 card. */
export const GalleryDesignCardIcon = () => <DesignCard style={card} kind="icon" name="Sparkle"><SparkleIcon size={24} /></DesignCard>;
/* Color: the colour paints the card; its value is the detail. */
export const GalleryDesignCardColor = () => <DesignCard style={card} kind="color" color="var(--area-accent-500)" name="Accent 500" detail="accent-500" />;
/* Selected: the card's edge in the selection colour. */
export const GalleryDesignCardSelected = () => <DesignCard style={card} name="Button" selected><Button>Continue</Button></DesignCard>;
/* Interactive: a button to the keyboard that opens the design; hover lifts the card. */
export const GalleryDesignCardInteractive = () => (
  <DesignCard style={card} name="Button" interactive role="button" tabIndex={0} aria-label="Open Button"><Button tabIndex={-1}>Continue</Button></DesignCard>
);
