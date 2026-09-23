import { Button, Card, CardDescription, CardTitle, Theme } from '@area/react';

export const ThemeNested = () => (
  <Theme value={{ theme: 'dark', neutral: 'warm', accent: 'green' }}>
    <Card>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <Button tone="accent" variant="outline">Action</Button>
      <Theme value={{ theme: 'light' }}>
        <Card>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <Button tone="accent" variant="outline">Action</Button>
        </Card>
      </Theme>
    </Card>
  </Theme>
);
