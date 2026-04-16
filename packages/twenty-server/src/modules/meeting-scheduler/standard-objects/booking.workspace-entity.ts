import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type MeetingTypeWorkspaceEntity } from 'src/modules/meeting-scheduler/standard-objects/meeting-type.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export const SEARCH_FIELDS_FOR_BOOKING: FieldTypeAndNameMetadata[] = [];

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class BookingWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  guestName: string;
  guestEmail: string;
  guestNotes: string | null;
  startsAt: Date;
  endsAt: Date;
  status: string;
  meetingType: EntityRelation<MeetingTypeWorkspaceEntity>;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  searchVector: string;
}
