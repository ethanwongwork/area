import type { TokenMap } from '../axes/schema.ts';

/** Keep color polarity unresolved until a real CSS color consumes it in its own scope. */
export function colorPairs(light: TokenMap, dark?: TokenMap): TokenMap {
  if (!dark) return light;
  const lightKeys = Object.keys(light);
  if (lightKeys.length !== Object.keys(dark).length || lightKeys.some(key => !(key in dark))) {
    throw new Error('Color pairs require identical light and dark keys.');
  }
  return Object.fromEntries(lightKeys.map(key => {
    const a = light[key]!, b = dark[key]!;
    return [key, a === b ? a : `light-dark(${a}, ${b})`];
  }));
}
