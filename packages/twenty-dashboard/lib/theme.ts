// Dashboard design tokens. Inline-style components reference these
// constants directly — Tailwind isn't pulled in here to keep the
// dashboard package's footprint small. Brand colors aligned with the
// Geraci LLP CRM look so the dashboard feels like the same product.

export const theme = {
  // Brand colors — neutral with a subtle blue accent. Tweak `brand.primary`
  // to re-skin the dashboard.
  brand: {
    primary: '#1d4ed8', // blue-700
    primaryHover: '#1e40af', // blue-800
    primaryFaint: '#eff6ff', // blue-50
  },
  // Slate-based neutrals — same family as the CRM.
  bg: {
    page: '#f8fafc', // slate-50
    surface: '#ffffff',
    surfaceMuted: '#f1f5f9', // slate-100
    surfaceHover: '#f8fafc',
  },
  border: {
    default: '#e2e8f0', // slate-200
    strong: '#cbd5e1', // slate-300
    focus: '#1d4ed8',
  },
  text: {
    primary: '#0f172a', // slate-900
    secondary: '#475569', // slate-600
    muted: '#94a3b8', // slate-400
    inverse: '#ffffff',
  },
  state: {
    success: '#16a34a', // green-600
    successBg: '#f0fdf4', // green-50
    warning: '#d97706', // amber-600
    warningBg: '#fffbeb', // amber-50
    danger: '#dc2626', // red-600
    dangerBg: '#fef2f2', // red-50
  },
  shadow: {
    sm: '0 1px 2px rgba(15, 23, 42, 0.04)',
    md: '0 4px 12px rgba(15, 23, 42, 0.06)',
    lg: '0 12px 32px rgba(15, 23, 42, 0.10)',
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  font: {
    family: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    sizeXs: 11,
    sizeSm: 13,
    sizeMd: 14,
    sizeLg: 16,
    sizeXl: 20,
    size2xl: 28,
    weightRegular: 400,
    weightMedium: 500,
    weightSemibold: 600,
    weightBold: 700,
  },
} as const;
