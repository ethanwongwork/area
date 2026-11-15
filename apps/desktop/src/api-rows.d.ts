/** Each family's API rows, generated at build time (scripts/api-rows.mjs): slug -> [prop, type, default, description]. */
declare module "virtual:api-rows" {
  const rows: Record<string, [prop: string, type: string, fallback: string, description: string][]>;
  export default rows;
}
