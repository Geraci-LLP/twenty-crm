import { type RecordChipData } from '@/object-record/record-field/ui/types/RecordChipData';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

type GenerateDefaultRecordChipDataArgs = {
  record: ObjectRecord;
  objectNameSingular: string;
};

// `record.name` can be one of:
//   - a plain string (most objects, e.g. Company, Opportunity)
//   - a FullName composite { firstName, lastName } — Person uses this
//   - the GraphQL-shaped composite { __typename, firstName, lastName } where
//     either name part may be null (zod's strict-string guard rejects this,
//     causing the previous code to fall back to returning the raw object —
//     which then crashed React with error #31 when used as a chip label)
//
// This helper flattens whatever shape we get into a string, never returning
// the raw object. Renderers downstream can safely render it as JSX.
export const coerceRecordNameToString = (rawName: unknown): string => {
  if (rawName == null) {
    return '';
  }
  if (typeof rawName === 'string') {
    return rawName;
  }
  if (typeof rawName === 'object' && 'firstName' in rawName) {
    const fullName = rawName as {
      firstName?: string | null;
      lastName?: string | null;
    };
    return [fullName.firstName, fullName.lastName]
      .filter((part): part is string => typeof part === 'string' && part !== '')
      .join(' ');
  }
  return '';
};

export const generateDefaultRecordChipData = ({
  objectNameSingular,
  record,
}: GenerateDefaultRecordChipDataArgs): RecordChipData => {
  const name = coerceRecordNameToString(record.name);

  return {
    avatarType: 'rounded',
    avatarUrl: name,
    isLabelIdentifier: false,
    name,
    objectNameSingular,
    recordId: record.id,
  };
};
