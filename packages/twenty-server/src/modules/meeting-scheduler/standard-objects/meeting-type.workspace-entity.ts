import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type BookingWorkspaceEntity } from 'src/modules/meeting-scheduler/standard-objects/booking.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_MEETING_TYPE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum MeetingTypeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class MeetingTypeWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  name: string;
  slug: string;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  status: string;
  availabilityConfig: object | null;
  timezone: string | null;
  location: string | null;
  confirmationMessage: string | null;
  notifyOnBooking: boolean;
  notificationEmail: string | null;
  color: string | null;
  bookingCount: number;
  bookings: EntityRelation<BookingWorkspaceEntity[]>;
  searchVector: string;
}
