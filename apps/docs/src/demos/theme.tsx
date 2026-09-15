import { Button, Card, CardDescription, CardTitle, Theme } from '@area/react';

export const ThemeNested = () => (
  <Theme value={{ theme: 'dark', neutral: 'warm', brand: 'green' }}>
    <Card>
      <CardTitle>Dark workspace</CardTitle>
      <CardDescription>Warm neutral and green accent.</CardDescription>
      <Button tone="brand" variant="outline">Workspace action</Button>
      <Theme value={{ theme: 'light' }}>
        <Card>
          <CardTitle>Light preview</CardTitle>
          <CardDescription>Inherits the same neutral and accent.</CardDescription>
          <Button tone="brand" variant="outline">Preview action</Button>
        </Card>
      </Theme>
    </Card>
  </Theme>
);
