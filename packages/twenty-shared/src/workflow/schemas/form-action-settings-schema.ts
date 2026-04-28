import { z } from 'zod';
import { FieldMetadataType } from '../../types/FieldMetadataType';
import { baseWorkflowActionSettingsSchema } from './base-workflow-action-settings-schema';

export const workflowFormActionSettingsSchema =
  baseWorkflowActionSettingsSchema.extend({
    input: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        label: z.string(),
        type: z.union([
          z.literal(FieldMetadataType.TEXT),
          z.literal(FieldMetadataType.NUMBER),
          z.literal(FieldMetadataType.DATE),
          z.literal(FieldMetadataType.DATE_TIME),
          z.literal(FieldMetadataType.SELECT),
          z.literal(FieldMetadataType.MULTI_SELECT),
          z.literal(FieldMetadataType.BOOLEAN),
          z.literal(FieldMetadataType.EMAILS),
          z.literal(FieldMetadataType.PHONES),
          z.literal(FieldMetadataType.LINKS),
          z.literal(FieldMetadataType.ADDRESS),
          z.literal(FieldMetadataType.FULL_NAME),
          z.literal(FieldMetadataType.FILES),
          z.literal(FieldMetadataType.RATING),
          z.literal(FieldMetadataType.RICH_TEXT),
          z.literal('RECORD'),
        ]),
        placeholder: z.string().optional(),
        settings: z.record(z.string(), z.any()).optional(),
        value: z.any().optional(),
      }),
    ),
  });
