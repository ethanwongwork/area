import { Button, Card, CardContent, CardDescription, CardFooter, CardMedia, CardTitle } from "@area/react";

export const CardVertical = () => (
  <Card style={{ inlineSize: 300, minBlockSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardHorizontal = () => (
  <Card layout="horizontal" style={{ inlineSize: 600, minBlockSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <CardFooter><Button variant="outline">Secondary</Button><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardImmersive = () => (
  <Card layout="immersive" style={{ inlineSize: 300, minBlockSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardCompact = () => (
  <Card layout="compact" style={{ inlineSize: 300, minBlockSize: 100 }}>
    <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

export const CardCarousel = () => (
  <Card role="region" aria-label="Collection" aria-roledescription="carousel" style={{ inlineSize: 600, minBlockSize: 300 }}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <ul className="area-card__carousel" tabIndex={0} aria-label="Items; scroll horizontally for more">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <li key={item}>
            <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
            <CardContent><CardTitle>Item {item}</CardTitle><CardDescription>Description</CardDescription></CardContent>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
