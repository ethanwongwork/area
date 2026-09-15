import { Button, Card, CardDescription, CardTitle, Theme } from '@area/react';

export const ThemeNested = () => (
  <Theme value={{ theme: 'dark', neutral: 'warm', accent: 'green' }}>
    <Card>
      <CardTitle>Dark workspace</CardTitle>
      <CardDescription>Warm neutral and green accent.</CardDescription>
      <Button tone="accent" variant="outline">Workspace action</Button>
      <Theme value={{ theme: 'light' }}>
        <Card>
          <CardTitle>Light preview</CardTitle>
          <CardDescription>Inherits the same neutral and accent.</CardDescription>
          <Button tone="accent" variant="outline">Preview action</Button>
        </Card>
      </Theme>
    </Card>
  </Theme>
);
