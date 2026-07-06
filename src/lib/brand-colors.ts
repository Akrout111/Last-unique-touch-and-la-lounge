export const BRAND_COLORS = {
  LUT: '#E62129',
  LA_LOUNGE: '#FF1493',
  YOUR_BIRTHDAY: '#8B5CF6',
} as const;

export function getBrandColor(brand: string): string {
  return BRAND_COLORS[brand as keyof typeof BRAND_COLORS] || BRAND_COLORS.LUT;
}
