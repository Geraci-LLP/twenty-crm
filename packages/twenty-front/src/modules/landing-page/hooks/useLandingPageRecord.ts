import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { useCallback } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';

// sectionsConfig was originally typed as a flat array of legacy
// sections. The new builder stores a LandingPageDesign object instead
// (see `migrateLandingPageDesign` for the migration path). To keep the
// hook compatible with both shapes, the property is typed as
// `unknown` here — callers normalize via migrateLandingPageDesign.
type LandingPageRecord = ObjectRecord & {
  title: string | null;
  slug: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sectionsConfig: unknown;
  metaTitle: string | null;
  metaDescription: string | null;
  headerConfig: Record<string, unknown> | null;
  footerConfig: Record<string, unknown> | null;
  viewCount: number;
};

export const useLandingPageRecord = ({
  landingPageId,
}: {
  landingPageId: string;
}) => {
  const { record, loading } = useFindOneRecord<LandingPageRecord>({
    objectNameSingular: CoreObjectNameSingular.LandingPage,
    objectRecordId: landingPageId,
    recordGqlFields: {
      id: true,
      title: true,
      slug: true,
      status: true,
      sectionsConfig: true,
      metaTitle: true,
      metaDescription: true,
      headerConfig: true,
      footerConfig: true,
      viewCount: true,
    },
  });

  const { updateOneRecord } = useUpdateOneRecord();

  const updateLandingPage = useCallback(
    async (input: Partial<Omit<LandingPageRecord, 'id'>>) => {
      await updateOneRecord({
        objectNameSingular: CoreObjectNameSingular.LandingPage,
        idToUpdate: landingPageId,
        updateOneRecordInput: input,
      });
    },
    [landingPageId, updateOneRecord],
  );

  // Accepts any JSON-serializable shape — the design migrator lives in
  // the builder layer, so the hook stays shape-agnostic.
  const updateSectionsConfig = useCallback(
    async (sections: unknown) => {
      await updateLandingPage({ sectionsConfig: sections });
    },
    [updateLandingPage],
  );

  return {
    landingPageRecord: record as LandingPageRecord | undefined,
    loading,
    updateLandingPage,
    updateSectionsConfig,
  };
};
