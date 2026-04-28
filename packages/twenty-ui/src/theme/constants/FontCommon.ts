export const FONT_COMMON = {
  size: {
    xxs: '0.625rem',
    xs: '0.85rem',
    sm: '0.92rem',
    md: '1rem',
    lg: '1.23rem',
    xl: '1.54rem',
    xxl: '1.85rem',
  },
  weight: {
    regular: 400,
    medium: 500,
    semiBold: 600,
  },
  // Geist is the design-mock font; Inter remains as a fallback for contexts
  // where Geist hasn't loaded yet, plus the system stack as a last resort.
  family:
    '"Geist", "Inter", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
};
