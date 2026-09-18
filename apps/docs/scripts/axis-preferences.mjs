/** Read and migrate this store only. Safe with blocked, corrupt or older local storage. */
export function restoreAxisPreferences(storage, presets) {
  const key = 'area-docs-axes';
  let parsed;
  try { parsed = JSON.parse(storage.getItem(key) || '{}'); } catch { return {}; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const next = { ...parsed };
  if (!Object.hasOwn(next, 'accent') && Object.hasOwn(next, 'brand')) next.accent = next.brand;
  delete next.brand;
  // Before UI scale, docs stored independently selectable typography and density presets.
  // Preserve the denser intent when either old control was compact; every other legacy pair
  // maps to the curated default package because large/system are no longer product switches.
  if (!Object.hasOwn(next, 'ui') && (Object.hasOwn(next, 'density') || Object.hasOwn(next, 'type'))) {
    next.ui = next.density === 'compact' || next.type === 'geist-compact' ? 'compact' : 'default';
  }
  delete next.density;
  delete next.type;
  // Radius families used component-size labels until 2026-09-17. Preserve the closest
  // visual intent for stored docs preferences, including the older numeric ramp.
  const radiusMigration = { '0': 'sharp', '2': 'subtle', '4': 'subtle', '6': 'soft', '8': 'standard', '10': 'round', '12': 'rotund', xs: 'subtle', sm: 'soft', md: 'standard', lg: 'round', xl: 'rotund' };
  if (typeof next.radius === 'string' && radiusMigration[next.radius]) next.radius = radiusMigration[next.radius];
  const result = Object.fromEntries(Object.entries(next).filter(([axis,value]) =>
    Object.hasOwn(presets,axis) && presets[axis].includes(value)));
  if (JSON.stringify(result) !== JSON.stringify(parsed)) {
    try { storage.setItem(key,JSON.stringify(result)); } catch { /* The current page still migrates. */ }
  }
  return result;
}
