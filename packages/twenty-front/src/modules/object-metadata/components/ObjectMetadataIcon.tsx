import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getObjectColorWithFallback } from '@/object-metadata/utils/getObjectColorWithFallback';
import { TintedIconTile } from '@/ui/display/components/TintedIconTile';
import { useIcons } from 'twenty-ui/display';

export type ObjectMetadataIconProps = {
  objectMetadataItem:
    | Pick<
        EnrichedObjectMetadataItem,
        'icon' | 'nameSingular' | 'color' | 'isSystem'
      >
    | null
    | undefined;
};

export const ObjectMetadataIcon = ({
  objectMetadataItem,
}: ObjectMetadataIconProps) => {
  const { getIcon } = useIcons();
  const Icon = getIcon(objectMetadataItem?.icon);

  return (
    <TintedIconTile
      Icon={Icon}
      color={getObjectColorWithFallback(objectMetadataItem)}
    />
  );
};
