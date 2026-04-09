import { msg } from '@lingui/core/macro';
import { DateDisplayFormat, FieldMetadataType } from 'twenty-shared/types';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import {
  type CreateStandardFieldArgs,
  createStandardFieldFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { getTsVectorColumnExpressionFromFields } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { SEARCH_FIELDS_FOR_CAMPAIGN_TEMPLATE } from 'src/modules/campaign/standard-objects/campaign-template.workspace-entity';

export const buildCampaignTemplateStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'campaignTemplate', FieldMetadataType>,
  'context'
>): Record<
  AllStandardObjectFieldName<'campaignTemplate'>,
  FlatFieldMetadata
> => ({
  // Base fields
  id: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'id',
      type: FieldMetadataType.UUID,
      label: i18nLabel(msg`Id`),
      description: i18nLabel(msg`Id`),
      icon: 'Icon123',
      isSystem: true,
      isNullable: false,
      isUIReadOnly: true,
      defaultValue: 'uuid',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  createdAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(msg`Creation date`),
      description: i18nLabel(msg`Creation date`),
      icon: 'IconCalendar',
      isSystem: true,
      isNullable: false,
      isUIReadOnly: true,
      defaultValue: 'now',
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  updatedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(msg`Last update`),
      description: i18nLabel(msg`Last time the record was changed`),
      icon: 'IconCalendarClock',
      isSystem: true,
      isNullable: false,
      isUIReadOnly: true,
      defaultValue: 'now',
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  deletedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'deletedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(msg`Deleted at`),
      description: i18nLabel(msg`Date when the record was deleted`),
      icon: 'IconCalendarMinus',
      isSystem: true,
      isNullable: true,
      isUIReadOnly: true,
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  // CampaignTemplate-specific fields
  name: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'name',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg`Name`),
      description: i18nLabel(msg`Template name`),
      icon: 'IconTemplate',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  subject: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'subject',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg`Subject`),
      description: i18nLabel(msg`Email subject line template`),
      icon: 'IconTextCaption',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  bodyHtml: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'bodyHtml',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg`Body HTML`),
      description: i18nLabel(msg`Email body content template in HTML`),
      icon: 'IconCode',
      isNullable: true,
      isSystem: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  category: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'category',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg`Category`),
      description: i18nLabel(msg`Template category`),
      icon: 'IconCategory',
      isNullable: true,
      defaultValue: "'CUSTOM'",
      options: [
        {
          id: '035a0001-0001-0001-0001-000000000001',
          value: 'NEWSLETTER',
          label: i18nLabel(msg`Newsletter`),
          position: 0,
          color: 'blue',
        },
        {
          id: '035a0001-0001-0001-0001-000000000002',
          value: 'FOLLOW_UP',
          label: i18nLabel(msg`Follow Up`),
          position: 1,
          color: 'green',
        },
        {
          id: '035a0001-0001-0001-0001-000000000003',
          value: 'CONFERENCE',
          label: i18nLabel(msg`Conference`),
          position: 2,
          color: 'purple',
        },
        {
          id: '035a0001-0001-0001-0001-000000000004',
          value: 'ANNOUNCEMENT',
          label: i18nLabel(msg`Announcement`),
          position: 3,
          color: 'orange',
        },
        {
          id: '035a0001-0001-0001-0001-000000000005',
          value: 'CUSTOM',
          label: i18nLabel(msg`Custom`),
          position: 4,
          color: 'gray',
        },
      ],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  thumbnailUrl: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'thumbnailUrl',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg`Thumbnail`),
      description: i18nLabel(msg`Template preview thumbnail URL`),
      icon: 'IconPhoto',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  searchVector: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'searchVector',
      type: FieldMetadataType.TS_VECTOR,
      label: i18nLabel(msg`Search vector`),
      description: i18nLabel(msg`Field used for full-text search`),
      icon: 'IconUser',
      isSystem: true,
      isNullable: true,
      settings: {
        generatedType: 'STORED',
        asExpression: getTsVectorColumnExpressionFromFields(
          SEARCH_FIELDS_FOR_CAMPAIGN_TEMPLATE,
        ),
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});
