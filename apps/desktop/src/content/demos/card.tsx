import { useEffect, useRef, useState } from "react";
import { Avatar, Badge, BadgeGroup, Button, Card, CardCarousel, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardList, CardMedia, CardOverlay, CardTitle, CardValue, Separator, Slider, Stack, Toolbar, ToolbarItem } from "@area/react";
import { AddIcon, ArrowRightIcon, ArrowUpRightIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, MoreHorizontalIcon, PauseFilledIcon, SkipBackFilledIcon, SkipForwardFilledIcon, SparkleIcon, SunIcon, TrendingUpIcon, FlagIcon } from "@area/icons";

/*
 * Every card here is the default size (md) unless its tile shows a size, with inset media
 * (16:9 in a vertical card) unless its tile shows bleed. Widths are demo framing: 300 for a
 * vertical card, 600 for a horizontal one, 180 square for a widget (Apple's small widget, 170, plus the card's wider space).
 */
const vertical = { inlineSize: 300 };
const horizontal = { inlineSize: 600 };
const widget = { inlineSize: 180, blockSize: 180 };

/* --- Layout ---------------------------------------------------------------- */

export const CardVertical = () => (
  <Card style={vertical}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardHorizontal = () => (
  <Card layout="horizontal" style={horizontal}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardHorizontalEnd = () => (
  <Card layout="horizontal" style={horizontal}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
    <CardMedia aria-hidden="true" />
  </Card>
);

export const CardThumbnail = () => (
  <Card layout="thumbnail" style={vertical}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardImmersive = () => (
  <Card layout="immersive" style={{ inlineSize: 300, blockSize: 300 }}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

/* Bleed is the one media option that meets the card's edge. */
export const CardBleed = () => (
  <Card style={vertical}>
    <CardMedia bleed aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

/* --- Size: corner and inset; type is the same at every size. ------------------ */

export const CardSmall = () => (
  <Card size="sm" style={vertical}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);
export const CardLarge = () => (
  <Card size="lg" style={vertical}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

/* --- Content --------------------------------------------------------------- */

export const CardHeaderAction = () => (
  <Card style={vertical}>
    <CardContent>
      <CardHeader action={<Badge variant="outline" tone="info">Label</Badge>}>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
    </CardContent>
  </Card>
);

export const CardMediaOverlay = () => (
  <Card style={vertical}>
    <CardMedia aria-hidden="true">
      <CardOverlay><Badge variant="solid" tone="inverse">Label</Badge></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardCornerAction = () => (
  <Card layout="immersive" style={{ inlineSize: 300, blockSize: 300 }}>
    <CardMedia aria-hidden="true" />
    <CardOverlay placement="bottom-end"><Button iconOnly aria-label="Open" icon={<ArrowRightIcon />} /></CardOverlay>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

/* A card in a well is one size down. */
const wellRow = (title: string) => (
  <Card key={title} size="sm">
    <CardContent>
      <CardHeader action={<Button size="sm" variant="soft" iconOnly aria-label={`Open ${title}`} icon={<ArrowUpRightIcon />} />}>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </CardContent>
  </Card>
);

export const CardWell = () => (
  <Card style={vertical}>
    <CardMedia well>{wellRow("Item one")}</CardMedia>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardWithList = () => (
  <Card style={vertical}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardList>
        <li><CheckIcon />Item one</li>
        <li><CheckIcon />Item two</li>
        <li><CheckIcon />Item three</li>
      </CardList>
    </CardContent>
  </Card>
);

export const CardTags = () => (
  <Card style={vertical}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <BadgeGroup><Badge>Label</Badge><Badge>Label</Badge></BadgeGroup>
    </CardContent>
  </Card>
);

/* The row scrolls natively (scroll snap, arrow keys on the focused row); the header's
   Buttons page it and turn off at either end. */
export const GalleryCardCarousel = () => {
  const row = useRef<HTMLUListElement | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = () => {
    const element = row.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    setEdges({ start: element.scrollLeft <= 1, end: element.scrollLeft >= max - 1 });
  };
  useEffect(update, []);
  // Smooth unless motion is 0 or reduced, as ScrollToLatest.
  const page = (direction: 1 | -1) => {
    const element = row.current;
    if (!element) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches || element.closest("[data-area-motion]")?.getAttribute("data-area-motion") === "0";
    element.scrollBy({ left: direction * element.clientWidth * 0.75, behavior: still ? "auto" : "smooth" });
  };
  return <Card role="region" aria-label="Title" aria-roledescription="carousel" style={horizontal}>
    <CardContent>
      <CardHeader action={<>
        <Button size="sm" variant="ghost" iconOnly aria-label="Previous items" icon={<ChevronLeftIcon />} disabled={edges.start} onClick={() => page(-1)} />
        <Button size="sm" variant="ghost" iconOnly aria-label="Next items" icon={<ChevronRightIcon />} disabled={edges.end} onClick={() => page(1)} />
      </>}>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardCarousel ref={row} aria-label="Items" onScroll={update}>
        {["one", "two", "three", "four", "five", "six"].map((item) => (
          <li key={item}>
            <CardMedia aria-hidden="true" />
            <CardContent><CardTitle>Item {item}</CardTitle><CardDescription>Description</CardDescription></CardContent>
          </li>
        ))}
      </CardCarousel>
    </CardContent>
  </Card>;
};

/* --- Behavior ------------------------------------------------------------- */

export const CardLinked = () => (
  <Card style={vertical}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardLinkedActions = () => (
  <Card style={vertical}>
    <CardMedia aria-hidden="true">
      <CardOverlay reveal><Button variant="soft" size="sm" iconOnly aria-label="More" icon={<MoreHorizontalIcon />} /></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

/*
 * --- Templates ---------------------------------------------------------------
 * Compositions of the slots above and other components, not variants. Each is the default size and follows one order:
 * media, header (title with description, an action on the right), value, body blocks, footer. The slots go straight in
 * the Card: every one sits on the card's space and section gap, so no template sets a padding or a gap of its own
 * (owner, 2026-10-30: "consistent, generic, simple, and modular layouts").
 */

export const CardTemplateVideo = () => (
  <Card style={vertical}>
    <CardMedia aria-hidden="true">
      <CardOverlay placement="bottom-end"><Badge variant="solid" tone="inverse">12:04</Badge></CardOverlay>
    </CardMedia>
    <CardHeader action={<Button variant="ghost" iconOnly aria-label="More" icon={<MoreHorizontalIcon />} />}>
      <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
      <CardDescription>Description, 2 days ago</CardDescription>
    </CardHeader>
  </Card>
);

export const CardTemplateMusic = () => (
  <Card style={vertical}>
    <CardMedia aria-hidden="true" />
    <CardHeader action={<Button variant="ghost" iconOnly aria-label="Like" icon={<HeartIcon />} />}>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <Slider size="sm" aria-label="Position" defaultValue={40} buffered={65} />
    <CardFooter>
      <Toolbar aria-label="Playback">
        <ToolbarItem><Button variant="ghost" iconOnly aria-label="Previous" icon={<SkipBackFilledIcon />} /></ToolbarItem>
        <ToolbarItem><Button pill iconOnly aria-label="Pause" icon={<PauseFilledIcon />} /></ToolbarItem>
        <ToolbarItem><Button variant="ghost" iconOnly aria-label="Next" icon={<SkipForwardFilledIcon />} /></ToolbarItem>
      </Toolbar>
    </CardFooter>
  </Card>
);

/* A task (the owner's reference, 2026-10-30): a header with a status Badge, tags, a rule, then who and how far. */
export const CardTemplateTask = () => (
  <Card style={vertical}>
    <CardHeader action={<Badge variant="soft" tone="warning" icon={<FlagIcon />}>Label</Badge>}>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <BadgeGroup><Badge variant="outline">Label</Badge><Badge variant="outline">Label</Badge></BadgeGroup>
    <Separator />
    <CardFooter spread>
      <Stack orientation="horizontal" gap="related"><Avatar size="sm" src="images/david-tee.jpg" fallback="DT" alt="" />David Tee</Stack>
      <CardDescription>Value</CardDescription>
    </CardFooter>
  </Card>
);

export const CardTemplateWeather = () => (
  <Card style={widget}>
    <CardHeader action={<SunIcon />}>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardValue>21°</CardValue>
    <CardDescription>Description</CardDescription>
  </Card>
);

export const CardTemplateStat = () => (
  <Card style={widget}>
    <CardHeader action={<TrendingUpIcon />}>
      <CardTitle>Label</CardTitle>
    </CardHeader>
    <CardValue>309.5</CardValue>
    <CardDescription>+1.9%, Description</CardDescription>
  </Card>
);

/* A prompt or shortcut (the owner's reference, 2026-10-30): a title at the top, a label and a mark at the foot. */
export const CardTemplatePrompt = () => (
  <Card style={{ inlineSize: 300, blockSize: 180 }}>
    <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
    <CardFooter spread>
      <span>Label</span>
      <SparkleIcon />
    </CardFooter>
  </Card>
);

export const CardTemplatePlan = () => (
  <Card style={vertical}>
    <CardHeader action={<Badge variant="outline" tone="info">Label</Badge>}>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardValue>$20</CardValue>
    <CardDescription>Description</CardDescription>
    <CardList>
      <li><CheckIcon />Item one</li>
      <li><CheckIcon />Item two</li>
    </CardList>
    <CardFooter><Button fullWidth>Action</Button></CardFooter>
  </Card>
);

/* Beside media the text needs CardContent to make one column; the rest of the card's slots are the same. */
export const CardTemplateFeature = () => (
  <Card layout="horizontal" style={horizontal}>
    <CardMedia well>{["Item one", "Item two"].map(wellRow)}</CardMedia>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button variant="outline" icon={<AddIcon />}>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

/* Selected: the chosen card of a set takes the selection stroke, 2 wide, inside its edge; the others stay at rest. */
export const CardSelected = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--area-space-12)", inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" }}>
    {["Option one", "Option two", "Option three"].map((option) => (
      <Card key={option} selected={option === "Option two"}>
        <CardContent><CardHeader><CardTitle>{option}</CardTitle><CardDescription>Description</CardDescription></CardHeader></CardContent>
      </Card>
    ))}
  </div>
);
