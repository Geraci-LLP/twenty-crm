import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardBookingViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'booking'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allBookings view fields
    allBookingsGuestName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'booking',
      context: {
        viewName: 'allBookings',
        viewFieldName: 'guestName',
        fieldName: 'guestName',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allBookingsGuestEmail: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'booking',
      context: {
        viewName: 'allBookings',
        viewFieldName: 'guestEmail',
        fieldName: 'guestEmail',
        position: 1,
        isVisible: true,
        size: 200,
      },
    }),
    allBookingsStartsAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'booking',
      context: {
        viewName: 'allBookings',
        viewFieldName: 'startsAt',
        fieldName: 'startsAt',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allBookingsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'booking',
      context: {
        viewName: 'allBookings',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    allBookingsMeetingType: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'booking',
      context: {
        viewName: 'allBookings',
        viewFieldName: 'meetingType',
        fieldName: 'meetingType',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
