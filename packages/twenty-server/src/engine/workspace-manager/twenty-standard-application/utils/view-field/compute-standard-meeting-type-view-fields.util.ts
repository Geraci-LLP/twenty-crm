import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardMeetingTypeViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'meetingType'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allMeetingTypes view fields
    allMeetingTypesName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'meetingType',
      context: {
        viewName: 'allMeetingTypes',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allMeetingTypesStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'meetingType',
      context: {
        viewName: 'allMeetingTypes',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allMeetingTypesDurationMinutes: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'meetingType',
      context: {
        viewName: 'allMeetingTypes',
        viewFieldName: 'durationMinutes',
        fieldName: 'durationMinutes',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allMeetingTypesBookingCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'meetingType',
      context: {
        viewName: 'allMeetingTypes',
        viewFieldName: 'bookingCount',
        fieldName: 'bookingCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allMeetingTypesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'meetingType',
      context: {
        viewName: 'allMeetingTypes',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
