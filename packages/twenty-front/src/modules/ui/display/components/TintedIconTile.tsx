import { StyledTintedIconTileContainer } from '@/ui/display/components/StyledTintedIconTileContainer';
import { getTintedIconTileStyleFromColor } from '@/ui/display/utils/getTintedIconTileStyleFromColor';
import { useContext } from 'react';
import { isDefined } from 'twenty-shared/utils';
import type { IconComponent } from 'twenty-ui/display';
import { ThemeContext } from 'twenty-ui/theme-constants';

export type TintedIconTileProps = {
  Icon: IconComponent;
  color?: string | null;
  size?: number;
  stroke?: number;
};

export const TintedIconTile = ({
  Icon,
  color,
  size: sizeFromProps,
  stroke: strokeFromProps,
}: TintedIconTileProps) => {
  const { theme } = useContext(ThemeContext);
  const style = getTintedIconTileStyleFromColor(color);
  const iconSize = sizeFromProps ?? theme.icon.size.md;
  const iconStroke = strokeFromProps ?? theme.icon.stroke.md;
  const tileDimension = isDefined(sizeFromProps)
    ? `${sizeFromProps}px`
    : undefined;

  return (
    <StyledTintedIconTileContainer
      $backgroundColor={style.backgroundColor}
      $borderColor={style.borderColor}
      $dimension={tileDimension}
    >
      <Icon size={iconSize} stroke={iconStroke} color={style.iconColor} />
    </StyledTintedIconTileContainer>
  );
};
