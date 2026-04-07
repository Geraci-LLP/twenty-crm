import { type TimelineActivity } from '@/activities/timeline-activities/types/TimelineActivity';
import { NavigationMenuItemStyleIcon } from '@/navigation-menu-item/display/components/NavigationMenuItemStyleIcon';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getObjectColorWithFallback } from '@/object-metadata/utils/getObjectColorWithFallback';
import {
  IconCirclePlus,
  IconEditCircle,
  IconRestore,
  IconTrash,
  useIcons,
} from 'twenty-ui/display';

export const EventIconDynamicComponent = ({
  event,
  linkedObjectMetadataItem,
}: {
  event: TimelineActivity;
  linkedObjectMetadataItem: EnrichedObjectMetadataItem | null;
}) => {
  const { getIcon } = useIcons();
  const [, eventAction] = event.name.split('.');

  if (eventAction === 'created') {
    return <IconCirclePlus />;
  }
  if (eventAction === 'updated') {
    return <IconEditCircle />;
  }
  if (eventAction === 'deleted') {
    return <IconTrash />;
  }
  if (eventAction === 'restored') {
    return <IconRestore />;
  }

  const IconComponent = getIcon(linkedObjectMetadataItem?.icon);

  return (
    <NavigationMenuItemStyleIcon
      Icon={IconComponent}
      color={
        linkedObjectMetadataItem
          ? getObjectColorWithFallback(linkedObjectMetadataItem)
          : 'gray'
      }
    />
  );
};
