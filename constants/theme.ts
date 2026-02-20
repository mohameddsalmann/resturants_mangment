import { ThemeColors } from '@/types';

// ── Color Utilities ────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
}

function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// ── Theme Generator ────────────────────────────────────
export function generateThemeFromColors(primary: string, accent: string): ThemeColors {
  const textOnPrimary = luminance(primary) > 0.5 ? '#000000' : '#FFFFFF';
  return {
    primary,
    primaryLight: lighten(primary, 0.3),
    primaryDark: darken(primary, 0.2),
    accent,
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#888888',
    textOnPrimary,
    success: '#51CF66',
    warning: '#FFB84D',
    error: '#FF6B6B',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    glassBackground: 'rgba(255, 255, 255, 0.8)',
  };
}

// ── Default Theme (used for auth screens & fallback) ───
export const DEFAULT_THEME: ThemeColors = generateThemeFromColors('#FF4B3A', '#2D2D2D');

// ── Convenience aliases (backward compat) ──────────────
export const COLORS = DEFAULT_THEME;

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
};

// ── Order Status Colors ────────────────────────────────
export const STATUS_COLORS = {
  new: '#FF6B6B',
  accepted: '#FF9F43',
  preparing: '#FFB84D',
  ready: '#51CF66',
  served: '#868E96',
  paid: '#339AF0',
  available: '#51CF66',
  occupied: '#FF6B6B',
  reserved: '#FFB84D',
};
