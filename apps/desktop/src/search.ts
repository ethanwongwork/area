/** Titlebar search: every word of the query must start a word of one of the fields (or appear in it). */
export function matches(query: string, ...fields: Array<string | undefined>) {
  const words = query.toLowerCase().split(/[\s,/]+/).filter(Boolean);
  if (!words.length) return true;
  const text = fields.filter(Boolean).join(" ").toLowerCase();
  const parts = text.split(/[\s&/_-]+/);
  return words.every(word => parts.some(part => part.startsWith(word)) || text.includes(word));
}
