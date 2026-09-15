/** Read and migrate this store only. Safe with blocked, corrupt or older local storage. */
export function restoreAxisPreferences(storage, presets) {
  const key = 'area-docs-axes';
  let parsed;
  try { parsed = JSON.parse(storage.getItem(key) || '{}'); } catch { return {}; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const next = { ...parsed };
  if (!Object.hasOwn(next, 'accent') && Object.hasOwn(next, 'brand')) next.accent = next.brand;
  delete next.brand;
  const result = Object.fromEntries(Object.entries(next).filter(([axis,value]) =>
    Object.hasOwn(presets,axis) && presets[axis].includes(value)));
  if (JSON.stringify(result) !== JSON.stringify(parsed)) {
    try { storage.setItem(key,JSON.stringify(result)); } catch { /* The current page still migrates. */ }
  }
  return result;
}
