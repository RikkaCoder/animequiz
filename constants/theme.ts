/**
 * Design tokens dell'app: palette, spaziature, tipografia.
 * Tema classico (rosso/giallo, stile retrò Game Boy).
 * Usare SEMPRE questi token, mai colori hardcoded nei componenti.
 */

export const Colors = {
  rosso: '#CC0000',
  rossoScuro: '#990000',
  giallo: '#FFCB05',
  bluNotte: '#1A1A2E',
  bianco: '#FFFFFF',
  grigioChiaro: '#F5F5F5',
  grigioMedio: '#AAAAAA',
  grigioScuro: '#333333',
  verde: '#4CAF50',
  verdeChiaro: '#EAF3DE',
  rossoErrore: '#E24B4A',
  rossoErroreChiaro: '#FCEBEB',
  trasparente: 'transparent',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
} as const;

export const Typography = {
  // Font display retrò - da caricare con expo-font
  display: 'PressStart2P',
  // Font corpo - leggibilità
  body: 'System',
  sizes: {
    h1: 24,
    h2: 18,
    h3: 14,
    body: 16,
    small: 13,
    tiny: 11,
  },
} as const;

