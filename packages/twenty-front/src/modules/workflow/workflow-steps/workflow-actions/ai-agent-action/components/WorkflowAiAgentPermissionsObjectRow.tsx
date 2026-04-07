import { NavigationMenuItemStyleIcon } from '@/navigation-menu-item/display/components/NavigationMenuItemStyleIcon';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getObjectColorWithFallback } from '@/object-metadata/utils/getObjectColorWithFallback';
import { useIcons } from 'twenty-ui/display';
import { MenuItem } from 'twenty-ui/navigation';

type WorkflowAiAgentPermissionsObjectRowProps = {
  objectMetadata: Pick<
    EnrichedObjectMetadataItem,
    'id' | 'icon' | 'labelPlural' | 'nameSingular' | 'color' | 'isSystem'
  >;
  onClick?: () => void;
  readonly: boolean;
};

export const WorkflowAiAgentPermissionsObjectRow = ({
  objectMetadata,
  onClick,
  readonly,
}: WorkflowAiAgentPermissionsObjectRowProps) => {
  const { getIcon } = useIcons();

  return (
    <MenuItem
      LeftComponent={
        <NavigationMenuItemStyleIcon
          Icon={getIcon(objectMetadata.icon)}
          color={getObjectColorWithFallback(objectMetadata)}
        />
      }
      text={objectMetadata.labelPlural}
      hasSubMenu={!readonly}
      onClick={!readonly ? onClick : undefined}
    />
  );
};
