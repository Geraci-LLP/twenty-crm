import { SequenceCadenceEditor } from '@/sequence/components/SequenceCadenceEditor';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';

// Page-layout widget wrapper around SequenceCadenceEditor. The widget
// reads the current Sequence record id from the layout's target-record
// context, same pattern CampaignEditorWidget uses for the campaign id.
//
// Surfacing: the WidgetType.SEQUENCE_CADENCE enum value lands in the
// generated frontend types after the next codegen run (server enum
// updated in PR 32). Until then the widget is registered via a string
// fallback in WidgetContentRenderer.
export const SequenceCadenceWidget = () => {
  const targetRecord = useTargetRecord();
  return <SequenceCadenceEditor sequenceId={targetRecord.id} />;
};
