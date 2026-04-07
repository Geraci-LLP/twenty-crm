import { StyledTintedIconTileContainer } from '@/ui/display/components/StyledTintedIconTileContainer';
import { getTintedIconTileStyleFromColor } from '@/ui/display/utils/getTintedIconTileStyleFromColor';
import { useContext } from 'react';
import type { IconComponent } from 'twenty-ui/display';
import { ThemeContext } from 'twenty-ui/theme-constants';

export type TintedIconTileProps = {
  Icon: IconComponent;
  color?: string | null;
};

export const TintedIconTile = ({ Icon, color }: TintedIconTileProps) => {
  const { theme } = useContext(ThemeContext);
  const style = getTintedIconTileStyleFromColor(color);
  return (
    <StyledTintedIconTileContainer
      $backgroundColor={style.backgroundColor}
      $borderColor={style.borderColor}
    >
      <Icon
        size={theme.icon.size.md}
        stroke={theme.icon.stroke.md}
        color={style.iconColor}
      />
    </StyledTintedIconTileContainer>
  );
};
