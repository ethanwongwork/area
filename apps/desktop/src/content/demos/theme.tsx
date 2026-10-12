import { Button, Card, CardDescription, CardTitle, Theme } from '@area/react';

export const ThemeNested = () => (
  <Theme value={{ theme: 'dark', neutral: 'warm', accent: 'green', action: 'accent' }}>
    <Card>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
      <Button>Action</Button>
      <Theme value={{ theme: 'light' }}>
        <Card>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <Button>Action</Button>
        </Card>
      </Theme>
    </Card>
  </Theme>
);
