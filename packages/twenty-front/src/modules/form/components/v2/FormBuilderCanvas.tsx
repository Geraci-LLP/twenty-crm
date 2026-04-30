import { styled } from '@linaria/react';
import { useCallback, useEffect, useState } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { FormAddPanel } from '@/form/components/v2/FormAddPanel';
import { FormBlockEditor } from '@/form/components/v2/FormBlockEditor';
import { FormBlockOnCanvas } from '@/form/components/v2/FormBlockOnCanvas';
import { FormContentsTree } from '@/form/components/v2/FormContentsTree';
import {
  buildBlock,
  buildField,
  buildEmptyStep,
} from '@/form/components/v2/defaults';
import {
  type FormBlock,
  type FormContents,
  type FormFieldKind,
} from '@/form/components/v2/types';

// HubSpot-shaped form builder. Single canvas with the live form
// rendered in the middle, sliding left rail with two modes
// (Add to form | Form contents), right rail editor for the
// selected block.

type FormBuilderCanvasProps = {
  contents: FormContents;
  onChange: (next: FormContents) => void;
};

type LeftRailMode = 'add' | 'contents' | null;

// The builder is mounted inside a page-layout widget whose width is
// dictated by Twenty's record-show grid — often as narrow as 600px.
// We can't get a 4-column flex layout to fit there, so the panels
// (Add / Contents tree / Block editor) overlay the canvas like
// Photoshop tool palettes instead of occupying permanent columns.
// The canvas always takes all available width minus the 48px icon
// rail; panels slide in over the top with a slight backdrop.
// Two layout modes: embedded (inside Twenty's record-show widget)
// and fullscreen (fixed-position takeover of the viewport).
// HubSpot's form/page builder is its own full-screen surface; the
// fullscreen toggle gives the user the same option here.
const StyledRoot = styled.div<{ isFullscreen?: boolean }>`
  background: ${themeCssVariables.background.tertiary};
  display: flex;
  flex-direction: row;
  height: ${(p) => (p.isFullscreen === true ? '100vh' : '100%')};
  inset: ${(p) => (p.isFullscreen === true ? '0' : 'auto')};
  min-height: 600px;
  overflow: hidden;
  position: ${(p) => (p.isFullscreen === true ? 'fixed' : 'relative')};
  width: ${(p) => (p.isFullscreen === true ? '100vw' : '100%')};
  z-index: ${(p) => (p.isFullscreen === true ? '9999' : 'auto')};
`;

const StyledFullscreenToggle = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  font-weight: 500;
  gap: 4px;
  padding: 5px 10px;
  position: absolute;
  right: 12px;
  top: 8px;
  z-index: 10;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
    border-color: ${themeCssVariables.color.orange};
    color: ${themeCssVariables.color.orange};
  }
`;

// Vertical icon strip — always visible. Two icons: + (Add) and the
// tree (Form contents). Click toggles the corresponding panel.
const StyledIconRail = styled.div`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 2px;
  padding: 12px 8px;
  width: 48px;
  z-index: 2;
`;

const StyledIconButton = styled.button<{ active?: boolean }>`
  align-items: center;
  background: ${(p) =>
    p.active === true
      ? themeCssVariables.background.transparent.medium
      : 'transparent'};
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${(p) =>
    p.active === true
      ? themeCssVariables.color.orange
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: 18px;
  height: 32px;
  justify-content: center;
  width: 32px;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
    color: ${themeCssVariables.font.color.primary};
  }
`;

// Slide-over panel overlaying the canvas. Sits between the icon
// rail and the right edge; sits OVER the canvas so the canvas never
// loses width when a panel opens. Backdrop click dismisses.
/* oxlint-disable twenty/no-hardcoded-colors -- panel drop shadows
   use a low-opacity black, which doesn't have a theme equivalent. */
const StyledLeftPanel = styled.div`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  bottom: 0;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  left: 48px;
  overflow-y: auto;
  position: absolute;
  top: 0;
  width: 320px;
  z-index: 3;
`;

// Right-rail editor — overlays from the right edge.
const StyledRightPanel = styled.aside`
  background: ${themeCssVariables.background.primary};
  border-left: 1px solid ${themeCssVariables.border.color.light};
  bottom: 0;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 320px;
  z-index: 3;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledCanvas = styled.div`
  background: ${themeCssVariables.background.tertiary};
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  overflow: auto;
  padding: 32px 24px;
`;

// Always stack steps vertically — the builder is mounted inside
// Twenty's record-show widget area, never the full viewport, so
// even when @media says "wide" the actual container is narrow.
// Vertical stacking always fits and keeps Step 1 + On Submit both
// fully visible inside whatever column we're given.
const StyledCanvasFlow = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0 auto;
  max-width: 720px;
  position: relative;
  width: 100%;
`;

const StyledStepPanel = styled.div<{ selected?: boolean }>`
  background: ${themeCssVariables.background.primary};
  border: 1px solid
    ${(p) =>
      p.selected === true
        ? themeCssVariables.color.orange
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 14px;
  padding: 28px 32px;
`;

const StyledStepConnector = styled.div`
  align-items: center;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 56px;
`;

const StyledConnectorLine = styled.div`
  background: ${themeCssVariables.border.color.medium};
  flex: 1;
  width: 1px;
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledConnectorPlus = styled.button`
  align-items: center;
  background: #ffffff;
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: 50%;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  height: 24px;
  justify-content: center;
  margin: 4px 0;
  width: 24px;
  &:hover {
    border-color: ${themeCssVariables.color.orange};
    color: ${themeCssVariables.color.orange};
  }
`;
/* oxlint-enable twenty/no-hardcoded-colors */

export const FormBuilderCanvas = ({
  contents,
  onChange,
}: FormBuilderCanvasProps) => {
  // Default both panels closed so the canvas is visible on first
  // open. User opens panels via the icon rail; they overlay the
  // canvas and a × in the panel header dismisses.
  const [leftMode, setLeftMode] = useState<LeftRailMode>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  // ─── Mutation helpers ──────────────────────────────────────────

  const updateStep = useCallback(
    (
      stepId: string,
      mutate: (blocks: FormBlock[]) => FormBlock[],
      target: 'step' | 'onSubmit' = 'step',
    ) => {
      if (target === 'onSubmit') {
        onChange({
          ...contents,
          onSubmit: {
            ...contents.onSubmit,
            blocks: mutate(contents.onSubmit.blocks),
          },
        });
        return;
      }
      onChange({
        ...contents,
        steps: contents.steps.map((s) =>
          s.id === stepId ? { ...s, blocks: mutate(s.blocks) } : s,
        ),
      });
    },
    [contents, onChange],
  );

  const addBlockToStep = useCallback(
    (
      stepId: string,
      block: FormBlock,
      target: 'step' | 'onSubmit' = 'step',
    ) => {
      updateStep(
        stepId,
        (blocks) => {
          // Insert before the trailing Submit block if one exists,
          // otherwise append. Keeps the submit button at the bottom.
          const submitIdx = blocks.findIndex((b) => b.kind === 'submit');
          if (submitIdx === -1 || target === 'onSubmit') {
            return [...blocks, block];
          }
          return [
            ...blocks.slice(0, submitIdx),
            block,
            ...blocks.slice(submitIdx),
          ];
        },
        target,
      );
      setSelectedBlockId(block.id);
    },
    [updateStep],
  );

  const updateBlock = useCallback(
    (blockId: string, mutate: (b: FormBlock) => FormBlock) => {
      // Walk every container until we find the block, mutate, replace.
      const stepIdx = contents.steps.findIndex((s) =>
        s.blocks.some((b) => b.id === blockId),
      );
      if (stepIdx !== -1) {
        const step = contents.steps[stepIdx];
        const nextBlocks = step.blocks.map((b) =>
          b.id === blockId ? mutate(b) : b,
        );
        onChange({
          ...contents,
          steps: contents.steps.map((s, i) =>
            i === stepIdx ? { ...s, blocks: nextBlocks } : s,
          ),
        });
        return;
      }
      if (contents.onSubmit.blocks.some((b) => b.id === blockId)) {
        onChange({
          ...contents,
          onSubmit: {
            ...contents.onSubmit,
            blocks: contents.onSubmit.blocks.map((b) =>
              b.id === blockId ? mutate(b) : b,
            ),
          },
        });
      }
    },
    [contents, onChange],
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      onChange({
        ...contents,
        steps: contents.steps.map((s) => ({
          ...s,
          blocks: s.blocks.filter((b) => b.id !== blockId),
        })),
        onSubmit: {
          ...contents.onSubmit,
          blocks: contents.onSubmit.blocks.filter((b) => b.id !== blockId),
        },
      });
      if (selectedBlockId === blockId) setSelectedBlockId(null);
    },
    [contents, onChange, selectedBlockId],
  );

  const duplicateBlock = useCallback(
    (blockId: string) => {
      const all = [
        ...contents.steps.flatMap((s) =>
          s.blocks.map((b) => ({
            block: b,
            stepId: s.id,
            target: 'step' as const,
          })),
        ),
        ...contents.onSubmit.blocks.map((b) => ({
          block: b,
          stepId: contents.onSubmit.id,
          target: 'onSubmit' as const,
        })),
      ];
      const found = all.find((x) => x.block.id === blockId);
      if (found === undefined) return;
      const copy = { ...found.block, id: crypto.randomUUID() };
      addBlockToStep(found.stepId, copy, found.target);
    },
    [addBlockToStep, contents],
  );

  const moveBlock = useCallback(
    (blockId: string, direction: -1 | 1) => {
      // Search both step blocks and onSubmit blocks; reorder within
      // the same container.
      const tryReorder = (blocks: FormBlock[]): FormBlock[] | null => {
        const idx = blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return null;
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= blocks.length) return blocks;
        const next = [...blocks];
        [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
        return next;
      };
      const newSteps = contents.steps.map((s) => {
        const reordered = tryReorder(s.blocks);
        return reordered === null ? s : { ...s, blocks: reordered };
      });
      const onSubmitReordered = tryReorder(contents.onSubmit.blocks);
      onChange({
        ...contents,
        steps: newSteps,
        onSubmit:
          onSubmitReordered === null
            ? contents.onSubmit
            : { ...contents.onSubmit, blocks: onSubmitReordered },
      });
    },
    [contents, onChange],
  );

  const addStep = useCallback(() => {
    const next = buildEmptyStep(`Step ${contents.steps.length + 1}`);
    onChange({ ...contents, steps: [...contents.steps, next] });
  }, [contents, onChange]);

  const handleAddFromLibrary = useCallback(
    (kind: FormBlock['kind'] | FormFieldKind) => {
      const block: FormBlock =
        kind === 'submit' ||
        kind === 'heading' ||
        kind === 'paragraph' ||
        kind === 'image' ||
        kind === 'recaptcha' ||
        kind === 'dataPrivacy' ||
        kind === 'field'
          ? buildBlock(kind)
          : buildField(kind);
      // Default insertion target: the first step (most common case).
      const targetStepId = contents.steps[0]?.id;
      if (targetStepId !== undefined) {
        addBlockToStep(targetStepId, block);
      }
    },
    [addBlockToStep, contents.steps],
  );

  const selectedBlock: FormBlock | null = (() => {
    if (selectedBlockId === null) return null;
    for (const s of contents.steps) {
      const f = s.blocks.find((b) => b.id === selectedBlockId);
      if (f !== undefined) return f;
    }
    return (
      contents.onSubmit.blocks.find((b) => b.id === selectedBlockId) ?? null
    );
  })();

  return (
    <StyledRoot isFullscreen={isFullscreen}>
      <StyledFullscreenToggle
        type="button"
        onClick={() => setIsFullscreen((v) => !v)}
        title={
          isFullscreen
            ? 'Exit fullscreen (Esc)'
            : 'Open in fullscreen — recommended for editing'
        }
      >
        {isFullscreen ? '⤡ Exit fullscreen' : '⤢ Fullscreen'}
      </StyledFullscreenToggle>
      <StyledIconRail>
        <StyledIconButton
          active={leftMode === 'add'}
          onClick={() => setLeftMode(leftMode === 'add' ? null : 'add')}
          title="Add to form"
        >
          +
        </StyledIconButton>
        <StyledIconButton
          active={leftMode === 'contents'}
          onClick={() =>
            setLeftMode(leftMode === 'contents' ? null : 'contents')
          }
          title="Form contents"
        >
          ☰
        </StyledIconButton>
      </StyledIconRail>

      <StyledCanvas>
        <StyledCanvasFlow>
          {contents.steps.map((step, idx) => (
            <>
              {idx > 0 && (
                <StyledStepConnector>
                  <StyledConnectorLine />
                  <StyledConnectorPlus title="Add a step" onClick={addStep}>
                    +
                  </StyledConnectorPlus>
                  <StyledConnectorLine />
                </StyledStepConnector>
              )}
              <StyledStepPanel key={step.id}>
                {step.blocks.map((block) => (
                  <FormBlockOnCanvas
                    key={block.id}
                    block={block}
                    selected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onMoveUp={() => moveBlock(block.id, -1)}
                    onMoveDown={() => moveBlock(block.id, 1)}
                    onDuplicate={() => duplicateBlock(block.id)}
                    onRemove={() => removeBlock(block.id)}
                  />
                ))}
              </StyledStepPanel>
            </>
          ))}
          {/* Connector between last step and On submit panel */}
          <StyledStepConnector>
            <StyledConnectorLine />
            <StyledConnectorPlus title="Add a step" onClick={addStep}>
              +
            </StyledConnectorPlus>
            <StyledConnectorLine />
          </StyledStepConnector>
          <StyledStepPanel>
            {contents.onSubmit.blocks.map((block) => (
              <FormBlockOnCanvas
                key={block.id}
                block={block}
                selected={selectedBlockId === block.id}
                onSelect={() => setSelectedBlockId(block.id)}
                onMoveUp={() => moveBlock(block.id, -1)}
                onMoveDown={() => moveBlock(block.id, 1)}
                onDuplicate={() => duplicateBlock(block.id)}
                onRemove={() => removeBlock(block.id)}
              />
            ))}
          </StyledStepPanel>
        </StyledCanvasFlow>
      </StyledCanvas>

      {leftMode === 'add' && (
        <StyledLeftPanel>
          <FormAddPanel
            onAdd={handleAddFromLibrary}
            onClose={() => setLeftMode(null)}
          />
        </StyledLeftPanel>
      )}
      {leftMode === 'contents' && (
        <StyledLeftPanel>
          <FormContentsTree
            contents={contents}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onAddStep={addStep}
            onClose={() => setLeftMode(null)}
          />
        </StyledLeftPanel>
      )}

      {selectedBlock !== null && (
        <StyledRightPanel>
          <FormBlockEditor
            block={selectedBlock}
            onChange={(next) => updateBlock(selectedBlock.id, () => next)}
            onClose={() => setSelectedBlockId(null)}
          />
        </StyledRightPanel>
      )}
    </StyledRoot>
  );
};
