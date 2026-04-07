import { type ThemeColor } from 'twenty-ui/theme';
import { themeColorSchema } from 'twenty-ui/utilities';

import { DEFAULT_THEME_COLOR_FALLBACK } from '@/ui/display/constants/defaultThemeColorFallback.constant';

export const parseThemeColor = (
  color: string | null | undefined,
): ThemeColor => {
  const result = themeColorSchema.safeParse(color ?? '');
  return result.success ? result.data : DEFAULT_THEME_COLOR_FALLBACK;
};
