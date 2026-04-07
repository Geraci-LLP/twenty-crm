import { TINTED_ICON_TILE_COLOR_SHADES } from '@/ui/display/constants/tintedIconTileColorShades.constant';
import { getColorFromTheme } from '@/ui/display/utils/getColorFromTheme';
import { parseThemeColor } from '@/ui/display/utils/parseThemeColor';

type TintedIconTileStyle = {
  backgroundColor: string;
  iconColor: string;
  borderColor: string;
};

export const getTintedIconTileStyleFromColor = (
  color: string | null | undefined,
): TintedIconTileStyle => {
  const themeColor = parseThemeColor(color);
  return {
    backgroundColor: getColorFromTheme(
      themeColor,
      TINTED_ICON_TILE_COLOR_SHADES.background,
    ),
    iconColor: getColorFromTheme(
      themeColor,
      TINTED_ICON_TILE_COLOR_SHADES.icon,
    ),
    borderColor: getColorFromTheme(
      themeColor,
      TINTED_ICON_TILE_COLOR_SHADES.border,
    ),
  };
};
