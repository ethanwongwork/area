import { Button, Card, CardContent, CardDescription, CardFooter, CardMedia, CardTitle } from "@area/react";

export const CardText = () => (
  <Card style={{ inlineSize: 300, minBlockSize: 300 }}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Body copy goes here.</CardDescription>
      <CardFooter><Button variant="outline">Secondary</Button><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardPortrait = () => (
  <Card style={{ inlineSize: 300, minBlockSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Body copy goes here.</CardDescription>
      <CardFooter><Button variant="outline">Secondary</Button><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardLandscape = () => (
  <Card layout="horizontal" style={{ inlineSize: 600, minBlockSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Body copy goes here.</CardDescription>
      <CardFooter><Button variant="outline">Secondary</Button><Button>Action</Button></CardFooter>
    </CardContent>
  </Card>
);

export const CardImmersive = () => (
  <Card layout="immersive" style={{ inlineSize: 300, minBlockSize: 300 }}>
    <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Body copy goes here.</CardDescription>
    </CardContent>
  </Card>
);

export const CardThumbnail = () => (
  <Card layout="thumbnail" style={{ inlineSize: 300, minBlockSize: 100 }}>
    <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Body copy.</CardDescription>
    </CardContent>
  </Card>
);

export const CardList = () => (
  <Card style={{ inlineSize: 300, minBlockSize: 300 }}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <ul className="area-card__list">
        {[1, 2, 3].map((item) => (
          <li className="area-card__list-item" key={item}>
            <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
            <CardContent><CardTitle>Item title</CardTitle><CardDescription>Body copy.</CardDescription></CardContent>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export const CardCarousel = () => (
  <Card role="region" aria-label="Collection" aria-roledescription="carousel" style={{ inlineSize: 600, minBlockSize: 300 }}>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <ul className="area-card__list area-card__carousel" tabIndex={0} aria-label="Items; scroll horizontally for more">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <li className="area-card__list-item" key={item}>
            <CardMedia aria-hidden="true" style={{ background: "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))" }} />
            <CardContent><CardTitle>Item {item}</CardTitle><CardDescription>Metadata</CardDescription></CardContent>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
