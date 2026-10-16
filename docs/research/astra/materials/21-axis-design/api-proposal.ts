/** Proposal only. Constructors validate finite numbers and controls.json bounds at runtime. */
export type MaterialPreset = 'none' | 'glass' | 'tactile' | 'soft';
export type Role = 'page' | 'container' | 'floating-surface' | 'raised-control'
 | 'recessed-field-track' | 'thumb-knob' | 'indicator-fill' | 'divider' | 'edge'
 | 'glyph' | 'text' | 'scrim' | 'row-plate';
export type ColorSource = 'neutral' | 'accent' | 'info' | 'success' | 'warning'
 | 'caution' | 'danger' | 'discovery';
declare const checked: unique symbol;
export type Bounded<K extends string> = number & {readonly [checked]: K};
export interface PaintControls {
 lightAngle: Bounded<'lightAngle'>; // degrees; 0 top, clockwise; 360 normalized to 0
 lightHeight: Bounded<'lightHeight'>; // degrees above surface
 opticalDepth: Bounded<'opticalDepth'>; // CSS px; no layout transform
 shadowSoftness: Bounded<'shadowSoftness'>; // CSS px blur
 shadowSpread: Bounded<'shadowSpread'>; // signed CSS px
 shadowStrength: Bounded<'shadowStrength'>; // alpha multiplier
 glowStrength: Bounded<'glowStrength'>;
 gradientAngle: Bounded<'gradientAngle'>;
 strokeOpacity: Bounded<'strokeOpacity'>;
 fillOpacity: Bounded<'fillOpacity'>; // increasing value means LESS transparent
 grain: Bounded<'grain'>;
 gloss: Bounded<'gloss'>;
}
export interface GlassControls {
 lightIntensity: Bounded<'glass.lightIntensity'>;
 radius: Bounded<'glass.radius'>; // label Frost; API name radius
 // D8: only 0 accepted for refraction/dispersion in the first release; depth reserved.
 refraction: Bounded<'glass.refraction'>;
 depth: Bounded<'glass.depth'>;
 dispersion: Bounded<'glass.dispersion'>;
}
export interface GradientStop {
 offset: Bounded<'stopOffset'>; source: ColorSource; alpha: Bounded<'stopAlpha'>;
}
export interface MaterialControls extends Partial<PaintControls> {
 /** Required version guard: mismatch with the effective preset discards this patch + warns in dev. */
 for: MaterialPreset;
 glass?: Partial<GlassControls>;
 colorSource?: ColorSource;
 glowColorSource?: ColorSource;
 strokeMode?: 'none' | 'solid' | 'gradient' | 'top' | 'double';
 gradientStops?: readonly GradientStop[]; // runtime: 2–8, sorted nondecreasing offsets
 roleStrength?: Partial<Record<Role, Bounded<'roleStrength'>>>;
}
export type NumericControl = keyof PaintControls | `glass.${keyof GlassControls}`
 | 'stopOffset' | 'stopAlpha' | 'roleStrength';
export declare function materialNumber<K extends NumericControl>(name: K, value: number): Bounded<K>;
export interface ThemeMaterialExtension {
 /** Adds material to the existing Theme.value AxisInput; no second preset prop. */
 value?: {material?: MaterialPreset}; // illustrative intersection with existing AxisInput
 materialControls?: MaterialControls | 'preset';
 surfaceControls?: SurfaceControls | 'preset';
}
export type MaterialTextEffect = 'none' | 'engraved' | 'embossed' | 'glow';
/** Proposed ONLY on display Text and Button label slots. No Theme-wide automatic text effect. */
export interface MaterialTextEffectOptIn {materialEffect?: MaterialTextEffect}

export type SurfacePreset = 'flat' | 'outlined' | 'raised' | 'elevated';
export type ShadowConsumer = '1' | '2' | '3' | '4' | 'card' | 'float' | 'tooltip' | 'toolbar';
export interface SurfaceLobePatch {
 lobe: 1 | 2 | 3 | 4; // validate against the selected consumer's real topology
 x?: Bounded<'surfaceOffset'>; y?: Bounded<'surfaceOffset'>;
 blur?: Bounded<'surfaceBlur'>; spread?: Bounded<'surfaceSpread'>;
 alphaMultiplier?: Bounded<'surfaceAlphaMultiplier'>;
}
export interface SurfaceControls {
 for: SurfacePreset;
 shadows?: Partial<Record<ShadowConsumer, readonly SurfaceLobePatch[]>>;
}
// Surface runtime validation must keep required rings' width/alpha independent of decoration.
export declare function surfaceNumber<K extends 'surfaceOffset' | 'surfaceBlur' | 'surfaceSpread' | 'surfaceAlphaMultiplier'>(name: K, value: number): Bounded<K>;
