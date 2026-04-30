import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { coerceRecordNameToString } from '@/object-metadata/utils/generateDefaultRecordChipData';
import { getRelationObjectMetadataNameSingular } from '@/object-metadata/utils/formatFieldMetadataItemsAsFilterDefinitions';
import { getFieldMetadataItemByIdOrThrow } from '@/object-metadata/utils/getFieldMetadataItemByIdOrThrow';
import { MAX_RECORDS_TO_DISPLAY } from '@/object-record/object-filter-dropdown/components/ObjectFilterDropdownRecordSelect';
import { type RecordFilter } from '@/object-record/record-filter/types/RecordFilter';
import { useRecordsForSelect } from '@/object-record/select/hooks/useRecordsForSelect';
import { useGetRecordFilterChipLabelValue } from '@/views/hooks/useGetRecordFilterChipLabelValue';

import { t } from '@lingui/core/macro';
import {
  arrayOfUuidOrVariableSchema,
  isDefined,
  jsonRelationFilterValueSchema,
} from 'twenty-shared/utils';
import { allowRequestsToTwentyIconsState } from '@/client-config/states/allowRequestsToTwentyIcons';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

type ObjectFilterDropdownRecordSelectProps = {
  recordFilter: RecordFilter;
};

// TODO: refactor this with new useGetRecordFilterDisplayValue
export const useComputeRecordRelationFilterLabelValue = ({
  recordFilter,
}: ObjectFilterDropdownRecordSelectProps) => {
  const allowRequestsToTwentyIcons = useAtomStateValue(
    allowRequestsToTwentyIconsState,
  );

  const { objectMetadataItems } = useObjectMetadataItems();

  const { getRecordFilterChipLabelValue } = useGetRecordFilterChipLabelValue();

  if (!isDefined(recordFilter.fieldMetadataId)) {
    throw new Error('fieldMetadataItemUsedInFilterDropdown is not defined');
  }

  const { fieldMetadataItem } = getFieldMetadataItemByIdOrThrow({
    fieldMetadataId: recordFilter.fieldMetadataId,
    objectMetadataItems,
  });

  const relationObjectMetadataNameSingular =
    getRelationObjectMetadataNameSingular({
      field: fieldMetadataItem,
    });

  if (!isDefined(relationObjectMetadataNameSingular)) {
    throw new Error('relationObjectMetadataNameSingular is not defined');
  }

  const relationObjectMetadataItem = objectMetadataItems.find(
    (objectMetadataItem) =>
      objectMetadataItem.nameSingular === relationObjectMetadataNameSingular,
  );

  if (!isDefined(relationObjectMetadataItem)) {
    throw new Error('relationObjectMetadataItem is not defined');
  }

  const relationObjectLabelPlural = relationObjectMetadataItem.labelPlural;

  const { isCurrentWorkspaceMemberSelected, selectedRecordIds } =
    jsonRelationFilterValueSchema
      .catch({
        isCurrentWorkspaceMemberSelected: false,
        selectedRecordIds: arrayOfUuidOrVariableSchema.parse(
          recordFilter.value,
        ),
      })
      .parse(recordFilter.value);

  const { selectedRecords, loading } = useRecordsForSelect({
    searchFilterText: '',
    selectedIds: selectedRecordIds,
    objectNameSingular: relationObjectMetadataNameSingular,
    limit: 10,
    allowRequestsToTwentyIcons,
  });

  if (loading) {
    return { labelValue: t`: Loading...` };
  }

  // For Person relation filters (or anything else with a FullName composite
  // name), record.name is `{firstName, lastName}` — joining objects with
  // `.join(', ')` yields "[object Object]" and rendering them as JSX child
  // crashes React with error #31. Coerce to a plain string up front.
  const labelValueItems = [
    ...(isCurrentWorkspaceMemberSelected ? [t`Me`] : []),
    ...selectedRecords.map((record) => coerceRecordNameToString(record.name)),
  ];

  const filterDisplayValue =
    labelValueItems.length > MAX_RECORDS_TO_DISPLAY
      ? `${labelValueItems.length} ${relationObjectLabelPlural.toLowerCase()}`
      : labelValueItems.join(', ');

  return {
    labelValue:
      labelValueItems.length > 0
        ? getRecordFilterChipLabelValue({
            recordFilter: {
              ...recordFilter,
              displayValue: filterDisplayValue,
            },
          })
        : getRecordFilterChipLabelValue({
            recordFilter,
          }),
  };
};
