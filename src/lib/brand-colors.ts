// Previously these were stale (LUT=#E62129, LA_LOUNGE=#FF1493, YOUR_BIRTHDAY=#8B5CF6)
// which didn't match the canonical brand colors in globals.css. Admin badges
// and any JS-side color usage (e.g. Three.js backgrounds) were rendering with
// the wrong colors.
//
// The values below MUST match the `--primary` values in globals.css:
//   :root[data-brand="lut"]       { --primary: #8B6B3D; }
//   :root[data-brand="lalounge"]  { --primary: #E6007E; }
//   :root[data-brand="birthday"]  { --primary: #F5B914; }
//
// WCAG AA (Task 2b): LUT gold was #D4A574 which yields only ~2.2:1 contrast
// on white (fails AA's 4.5:1 minimum for body text). Darkened to #8B6B3D
// which yields ~4.92:1 on white — passes AA. LUT_LIGHT correspondingly
// darkened from #E8C887 → #B8915A to remain a lighter variant of the new
// LUT base while still being usable for 3D gradients and glows.
export const BRAND_COLORS = {
  LUT: '#8B6B3D',
  LA_LOUNGE: '#E6007E',
  YOUR_BIRTHDAY: '#F5B914',
  LUT_LIGHT: '#B8915A',
  LA_LOUNGE_LIGHT: '#FF6B9D',
  YOUR_BIRTHDAY_LIGHT: '#FFD147',
} as const

export type Brand = keyof typeof BRAND_COLORS

export function getBrandColor(brand: string): string {
  return BRAND_COLORS[brand as Brand] || BRAND_COLORS.LUT
}
