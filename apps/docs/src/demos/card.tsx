import { Badge, BadgeGroup, Button, Card, CardCarousel, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardList, CardMedia, CardOverlay, CardTitle, CardValue, Slider, Toolbar, ToolbarItem } from "@area/react";
import {
  ArrowIcon,
  CheckIcon,
  FluentArrowTrendingIcon,
  FluentArrowUpRightIcon,
  FluentHeartIcon,
  FluentNextFilledIcon,
  FluentPauseFilledIcon,
  FluentPreviousFilledIcon,
  FluentWeatherSunnyIcon,
  MoreIcon,
  PlusIcon,
} from "../icons.tsx";

const square = { inlineSize: 300, minBlockSize: 300 };

/* --- Layout ---------------------------------------------------------------- */

export const CardVertical = () => (
  <Card style={{ inlineSize: 300, minBlockSize: 300 }}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardHorizontal = () => (
  <Card layout="horizontal" style={{ inlineSize: 600 }}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button variant="outline">Secondary</Button><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardHorizontalEnd = () => (
  <Card layout="horizontal" style={{ inlineSize: 600 }}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
    <CardMedia aria-hidden="true" />
  </Card>
);

/* Below 480px of card, a horizontal card stacks. */
export const CardHorizontalStacked = () => (
  <Card layout="horizontal" style={{ inlineSize: 300 }}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardBleed = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardMedia bleed aria-hidden="true" style={{ aspectRatio: "16 / 9" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardHorizontalBleed = () => (
  <Card layout="horizontal" style={{ inlineSize: 600 }}>
    <CardMedia bleed aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button variant="outline">Secondary</Button><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardImmersive = () => (
  <Card layout="immersive" style={square}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardCompact = () => (
  <Card layout="compact" style={{ inlineSize: 300, minBlockSize: 100 }}>
    <CardMedia aria-hidden="true" />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardWithCarousel = () => (
  <Card role="region" aria-label="Collection" aria-roledescription="carousel" style={{ inlineSize: 600, minBlockSize: 300 }}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardCarousel aria-label="Items; scroll horizontally for more">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <li key={item}>
            <CardMedia aria-hidden="true" />
            <CardContent><CardTitle>Item {item}</CardTitle><CardDescription>Description</CardDescription></CardContent>
          </li>
        ))}
      </CardCarousel>
    </CardContent>
  </Card>
);

/* --- Size ------------------------------------------------------------------ */

export const CardSmall = () => (
  <Card size="sm" style={{ inlineSize: 240 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button size="sm">Action</Button></CardFooter>
    </CardContent>
  </Card>
);
export const CardMedium = () => (
  <Card size="md" style={{ inlineSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button size="md">Action</Button></CardFooter>
    </CardContent>
  </Card>
);
export const CardLarge = () => (
  <Card size="lg" style={{ inlineSize: 364 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button size="lg">Action</Button></CardFooter>
    </CardContent>
  </Card>
);

/* --- Content --------------------------------------------------------------- */

export const CardHeaderAction = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardContent>
      <CardHeader action={<Badge variant="outline" tone="info">Label</Badge>}>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
    </CardContent>
  </Card>
);

export const CardMediaOverlay = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9" }}>
      <CardOverlay><Badge variant="solid" tone="inverted">Label</Badge></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardWell = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardMedia well>
      <Card size="sm">
        <CardContent><CardHeader action={<Badge>Label</Badge>}><CardTitle>Title</CardTitle></CardHeader></CardContent>
      </Card>
    </CardMedia>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardWithList = () => (
  <Card style={{ inlineSize: 300 }}>
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
  <Card style={{ inlineSize: 300 }}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><BadgeGroup><Badge tone="accent">Label</Badge><Badge tone="accent">Label</Badge></BadgeGroup></CardFooter>
    </CardContent>
  </Card>
);

export const CardCornerAction = () => (
  <Card layout="immersive" style={square}>
    <CardMedia aria-hidden="true" />
    <CardOverlay placement="bottom-end"><Button iconOnly aria-label="Open" icon={<ArrowIcon />} /></CardOverlay>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

/* --- Behavior ------------------------------------------------------------- */

export const CardLinked = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9" }} />
    <CardContent>
      <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardLinkedActions = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9" }}>
      <CardOverlay reveal><Button variant="soft" size="sm" iconOnly aria-label="More" icon={<MoreIcon />} /></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><BadgeGroup><Badge>Label</Badge><Badge>Label</Badge></BadgeGroup></CardFooter>
    </CardContent>
  </Card>
);

/* --- Templates: compositions of the slots above and other components. ---------- */

/* Apple's small widget is 170pt square and the medium 364 × 170 (HIG, iOS dimensions). */
const widget = { inlineSize: 170, blockSize: 170 };

export const CardTemplateVideo = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9" }}>
      <CardOverlay placement="bottom-end"><Badge variant="solid" tone="inverted">12:04</Badge></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardHeader action={<Button variant="ghost" size="sm" iconOnly aria-label="More" icon={<MoreIcon />} />}>
        <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
        <CardDescription>Channel · 2 days ago</CardDescription>
      </CardHeader>
    </CardContent>
  </Card>
);

export const CardTemplateMusic = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "2 / 1" }} />
    <CardContent>
      <CardHeader action={<Button variant="ghost" size="sm" iconOnly aria-label="Like" icon={<FluentHeartIcon />} />}>
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
  <Card size="sm" style={widget}>
    <CardContent>
      <CardHeader action={<FluentWeatherSunnyIcon />}>
        <CardTitle>City</CardTitle>
      </CardHeader>
      <CardValue>21°</CardValue>
      <CardFooter><CardDescription>Sunny · H 24° L 16°</CardDescription></CardFooter>
    </CardContent>
  </Card>
);

export const CardTemplateStat = () => (
  <Card size="sm" style={widget}>
    <CardContent>
      <CardHeader action={<FluentArrowTrendingIcon />}>
        <CardTitle>Label</CardTitle>
      </CardHeader>
      <CardFooter>
        <CardValue>309.5</CardValue>
        <Badge tone="success">+1.9%</Badge>
      </CardFooter>
    </CardContent>
  </Card>
);

export const CardTemplateNews = () => (
  <Card size="lg" style={{ inlineSize: 364 }}>
    <CardMedia bleed aria-hidden="true" style={{ aspectRatio: "16 / 9" }}>
      <CardOverlay placement="top-start"><Badge variant="solid" tone="inverted">Category</Badge></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
      <CardDescription>Description of the story, long enough to wrap onto a second line.</CardDescription>
      <CardFooter><CardDescription>5 min read</CardDescription></CardFooter>
    </CardContent>
  </Card>
);

export const CardTemplateTool = () => (
  <Card style={{ inlineSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9" }}>
      <CardOverlay><Badge>Label</Badge></CardOverlay>
    </CardMedia>
    <CardContent>
      <CardTitle><CardLink href="#gallery-section-card">Title</CardLink></CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><BadgeGroup><Badge tone="accent">Label</Badge><Badge tone="accent">Label</Badge></BadgeGroup></CardFooter>
    </CardContent>
  </Card>
);

export const CardTemplatePlan = () => (
  <Card size="lg" style={{ inlineSize: 364 }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "2 / 1" }} />
    <CardContent>
      <CardHeader action={<Badge variant="outline" tone="info">Free</Badge>}>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardList>
        <li><CheckIcon />Item one</li>
        <li><CheckIcon />Item two</li>
      </CardList>
      <CardFooter><Button fullWidth>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardTemplateFeature = () => (
  <Card layout="horizontal" size="lg" style={{ inlineSize: 600 }}>
    <CardMedia well>
      {["Item one", "Item two"].map((item) => (
        <Card key={item} size="sm">
          <CardContent>
            <CardHeader action={<Button variant="soft" size="sm" iconOnly aria-label="Open" icon={<FluentArrowUpRightIcon />} />}>
              <CardTitle>{item}</CardTitle>
            </CardHeader>
          </CardContent>
        </Card>
      ))}
    </CardMedia>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button variant="outline" pill icon={<PlusIcon />}>Action</Button></CardFooter>
    </CardContent>
  </Card>
);
