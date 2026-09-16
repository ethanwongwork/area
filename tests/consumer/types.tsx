import { Button, Badge, Select, Checkbox, Switch, Panel, Slider, Chip, Theme, CodeBlock, Nav } from '@area/react';
import { buttonVariants, selectVariants, checkboxVariants, classesFor, stateAttributes, MANIFESTS } from '@area/react/variants';
import { mergeAxes, type AxisSelection } from '@area/tokens';
import type { AreaToken } from '@area/tokens/types';
const selection: Partial<AxisSelection> = {accent:'green',density:'compact'};
const token: AreaToken = '--area-accent-solid';
export const valid = <Theme value={mergeAxes(undefined,selection)}><Button tone="accent" size="xl"/><Badge tone="neutral"/><Select size="xl"/><Panel size="xs"/><Slider size="xl"/><Chip size="lg"/><Checkbox size="xs"/><Switch size="xl"/><Nav tone="accent"/><CodeBlock layout="wrap" code={token}/></Theme>;
buttonVariants({tone:'neutral',fullWidth:true}); selectVariants({size:'xl'});
classesFor(MANIFESTS.button,{variant:'outline'});stateAttributes(MANIFESTS.button,{disabled:true});
// @ts-expect-error retired vocabulary
buttonVariants({tone:'primary'});
// @ts-expect-error builders reject typo keys
buttonVariants({fulWidth:true});
// @ts-expect-error boolean API is camelCase
buttonVariants({'full-width':true});
checkboxVariants({size:'xs'});
// @ts-expect-error no choice control has an xxl tier
export const invalidSwitch = <Switch size="xxl"/>;
// @ts-expect-error Panel has no xl tier
export const invalidPanel = <Panel size="xl"/>;
// @ts-expect-error brand is retired
export const invalidTone = <Button tone="brand"/>;
// @ts-expect-error unknown axis
mergeAxes(undefined,{brand:'green'});
// @ts-expect-error unknown state
stateAttributes(MANIFESTS.button,{invalid:true});
// @ts-expect-error unknown element
buttonVariants.element('mystery');
// @ts-expect-error removed unsupported toolbar prop
export const invalidCode = <CodeBlock title="old toolbar"/>;

// @ts-expect-error generic helpers retain the exact manifest contract
classesFor(MANIFESTS.button,{tone:"invalid"});
