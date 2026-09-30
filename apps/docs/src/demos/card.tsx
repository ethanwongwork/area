import { useEffect, useRef, useState } from "react";
import { Badge, BadgeGroup, Button, Card, CardCarousel, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardList, CardMedia, CardOverlay, CardTitle, CardValue, Slider, Toolbar, ToolbarItem } from "@area/react";
import {
  ArrowIcon,
  CheckIcon,
  FluentArrowTrendingIcon,
  FluentArrowUpRightIcon,
  FluentChevronLeftIcon,
  FluentChevronRightIcon,
  FluentHeartIcon,
  FluentNextFilledIcon,
  FluentPauseFilledIcon,
  FluentPreviousFilledIcon,
  FluentWeatherSunnyIcon,
  MoreIcon,
  PlusIcon,
} from "../icons.tsx";

/*
 * Every card here is the default size (md) unless its tile shows a size, with inset media
 * (16:9 in a vertical card) unless its tile shows bleed. Widths are demo framing: 300 for a
 * vertical card, 600 for a horizontal one, 170 square for a widget (Apple's small widget).
 */
const vertical = { inlineSize: 300 };
const horizontal = { inlineSize: 600 };
const widget = { inlineSize: 170, blockSize: 170 };

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

export const CardCompact = () => (
  <Card layout="compact" style={vertical}>
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
      <CardOverlay><Badge variant="solid" tone="inverted">Label</Badge></CardOverlay>
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
    <CardOverlay placement="bottom-end"><Button iconOnly aria-label="Open" icon={<ArrowIcon />} /></CardOverlay>
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
      <CardHeader action={<Button size="sm" variant="soft" iconOnly aria-label={`Open ${title}`} icon={<FluentArrowUpRightIcon />} />}>
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
  const page = (direction: 1 | -1) => row.current?.scrollBy({ left: direction * row.current.clientWidth * 0.75, behavior: "smooth" });
  return <Card role="region" aria-label="Collection" aria-roledescription="carousel" style={horizontal}>
    <CardContent>
      <CardHeader action={<>
        <Button size="sm" variant="ghost" iconOnly aria-label="Previous items" icon={<FluentChevronLeftIcon />} disabled={edges.start} onClick={() => page(-1)} />
        <Button size="sm" variant="ghost" iconOnly aria-label="Next items" icon={<FluentChevronRightIcon />} disabled={edges.end} onClick={() => page(1)} />
      </>}>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardCarousel ref={row} aria-label="Items" onScroll={update}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
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
      <CardOverlay reveal><Button variant="soft" size="sm" iconOnly aria-label="More" icon={<MoreIcon />} /></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

/*
 * --- Templates ---------------------------------------------------------------
 * Compositions of the slots above and other components, not variants. Each is the default
 * size and follows one order: media, header (title with description, an action on the right),
 * value, body blocks, footer controls.
 */

export const CardTemplateVideo = () => (
  <Card style={vertical}>
    <CardMedia aria-hidden="true">
      <CardOverlay placement="bottom-end"><Badge variant="solid" tone="inverted">12:04</Badge></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardHeader action={<Button variant="ghost" iconOnly aria-label="More" icon={<MoreIcon />} />}>
        <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
        <CardDescription>Channel · 2 days ago</CardDescription>
      </CardHeader>
    </CardContent>
  </Card>
);

export const CardTemplateMusic = () => (
  <Card style={vertical}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardHeader action={<Button variant="ghost" iconOnly aria-label="Like" icon={<FluentHeartIcon />} />}>
        <CardTitle>Title</CardTitle>
        <CardDescription>Artist</CardDescription>
      </CardHeader>
      <Slider size="sm" aria-label="Position" defaultValue={40} />
      <CardFooter>
        <Toolbar aria-label="Playback">
          <ToolbarItem><Button variant="ghost" iconOnly aria-label="Previous" icon={<FluentPreviousFilledIcon />} /></ToolbarItem>
          <ToolbarItem><Button pill iconOnly aria-label="Pause" icon={<FluentPauseFilledIcon />} /></ToolbarItem>
          <ToolbarItem><Button variant="ghost" iconOnly aria-label="Next" icon={<FluentNextFilledIcon />} /></ToolbarItem>
        </Toolbar>
      </CardFooter>
    </CardContent>
  </Card>
);

export const CardTemplateWeather = () => (
  <Card style={widget}>
    <CardContent>
      <CardHeader action={<FluentWeatherSunnyIcon />}>
        <CardTitle>City</CardTitle>
      </CardHeader>
      <CardValue>21°</CardValue>
      <CardDescription>Sunny · H 24° L 16°</CardDescription>
    </CardContent>
  </Card>
);

export const CardTemplateStat = () => (
  <Card style={widget}>
    <CardContent>
      <CardHeader action={<FluentArrowTrendingIcon />}>
        <CardTitle>Label</CardTitle>
      </CardHeader>
      <CardValue>309.5</CardValue>
      <CardDescription>+1.9% this week</CardDescription>
    </CardContent>
  </Card>
);

export const CardTemplatePlan = () => (
  <Card style={vertical}>
    <CardContent>
      <CardHeader action={<Badge variant="outline" tone="info">Popular</Badge>}>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardValue>$20</CardValue>
      <CardDescription>Description</CardDescription>
      <CardList>
        <li><CheckIcon />Item one</li>
        <li><CheckIcon />Item two</li>
      </CardList>
      <CardFooter><Button fullWidth>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardTemplateFeature = () => (
  <Card layout="horizontal" style={horizontal}>
    <CardMedia well>{["Item one", "Item two"].map(wellRow)}</CardMedia>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button variant="outline" icon={<PlusIcon />}>Action</Button></CardFooter>
    </CardContent>
  </Card>
);
