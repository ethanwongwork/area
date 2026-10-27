/** The derivations a brand restates, embedded by build.ts (emit/brand-derived.ts). */
declare module "area:brand-derived" {
  const derived: Readonly<Record<string, string>>;
  export default derived;
}
