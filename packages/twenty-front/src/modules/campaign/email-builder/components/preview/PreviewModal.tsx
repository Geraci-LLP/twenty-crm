import { styled } from '@linaria/react';
import { useEffect } from 'react';

import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledOverlay = styled.div`
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1000;
`;

const StyledTopBar = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  height: 48px;
  justify-content: space-between;
  padding: 0 ${themeCssVariables.spacing[4]};
`;

const StyledTabBar = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledTab = styled.button<{ active?: boolean }>`
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${(p) => (p.active ? themeCssVariables.color.blue : 'transparent')};
  color: ${(p) =>
    p.active
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${(p) =>
    p.active
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledCloseButton = styled.button`
  background: transparent;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
  &:hover { background: ${themeCssVariables.background.tertiary}; }
`;

const StyledStage = styled.div`
  align-items: flex-start;
  background: ${themeCssVariables.background.tertiary};
  display: flex;
  flex: 1;
  gap: ${themeCssVariables.spacing[6]};
  justify-content: center;
  overflow: auto;
  padding: ${themeCssVariables.spacing[6]};
`;

const StyledDesktopWrap = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  width: 720px;
`;

const StyledDesktopChrome = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  border-top-left-radius: ${themeCssVariables.border.radius.sm};
  border-top-right-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: center;
`;

const StyledDesktopFrame = styled.iframe`
  background: ${themeCssVariables.background.primary};
  border: none;
  height: 740px;
  width: 100%;
`;

const StyledMobileWrap = styled.div`
  background: #1a1a18;
  border-radius: 36px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
  padding: 12px;
  width: 400px;
`;

const StyledMobileNotch = styled.div`
  background: #1a1a18;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  height: 18px;
  margin: 0 auto 6px auto;
  width: 110px;
`;

const StyledMobileFrame = styled.iframe`
  background: ${themeCssVariables.background.primary};
  border: none;
  border-radius: 24px;
  height: 720px;
  width: 100%;
`;

type PreviewModalProps = {
  html: string;
  onClose: () => void;
};

export const PreviewModal = ({ html, onClose }: PreviewModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <StyledOverlay
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Close on backdrop click; ignore if click is inside the stage.
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <StyledTopBar>
        <StyledTabBar>
          <StyledTab active>Preview</StyledTab>
        </StyledTabBar>
        <StyledCloseButton onClick={onClose}>Back to editing</StyledCloseButton>
      </StyledTopBar>
      <StyledStage>
        <StyledDesktopWrap>
          <StyledDesktopChrome>Desktop · 720px</StyledDesktopChrome>
          <StyledDesktopFrame
            title="Preview (desktop)"
            srcDoc={html}
            sandbox="allow-same-origin"
          />
        </StyledDesktopWrap>
        <StyledMobileWrap>
          <StyledMobileNotch />
          <StyledMobileFrame
            title="Preview (mobile)"
            srcDoc={html}
            sandbox="allow-same-origin"
          />
        </StyledMobileWrap>
      </StyledStage>
    </StyledOverlay>
  );
};
