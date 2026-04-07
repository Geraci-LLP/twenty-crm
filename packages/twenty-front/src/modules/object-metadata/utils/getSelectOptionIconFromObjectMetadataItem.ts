import { createElement } from 'react';

import {
  ObjectMetadataIcon,
  type ObjectMetadataIconProps,
} from '@/object-metadata/components/ObjectMetadataIcon';
import { type IconComponent } from 'twenty-ui/display';

export const getSelectOptionIconFromObjectMetadataItem = (
  objectMetadataItem: NonNullable<
    ObjectMetadataIconProps['objectMetadataItem']
  >,
): IconComponent => {
  const SelectOptionObjectIcon: IconComponent = () =>
    createElement(ObjectMetadataIcon, { objectMetadataItem });

  return SelectOptionObjectIcon;
};
