import { styled } from '@linaria/react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

type LoginState = 'idle' | 'submitting' | 'sent' | 'error';

const StyledPageContainer = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.noisy};
  display: flex;
  justify-content: center;
  min-height: 100dvh;
  padding: ${themeCssVariables.spacing[8]} ${themeCssVariables.spacing[4]};
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.light};
  max-width: 420px;
  padding: ${themeCssVariables.spacing[8]};
  width: 100%;
`;

const StyledBrand = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[2]} 0;
  text-align: center;
`;

const StyledSubtitle = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0 0 ${themeCssVariables.spacing[6]} 0;
  text-align: center;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin-bottom: ${themeCssVariables.spacing[4]};
`;

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-sizing: border-box;
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  outline: none;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: border-color 150ms ease;
  width: 100%;

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
`;

const StyledSubmitButton = styled.button`
  background: ${themeCssVariables.color.blue};
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  transition: opacity 150ms ease;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledSuccessMessage = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  text-align: center;
`;

const StyledErrorMessage = styled.p`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
`;

// Read the workspace id from either:
//   - the `?workspace=<id>` query parameter, or
//   - the REACT_APP_DEFAULT_WORKSPACE_ID env var
// Subdomain-based discovery is intentionally out of scope for MVP.
const resolveWorkspaceId = (queryWorkspaceId: string | null): string | null => {
  if (isDefined(queryWorkspaceId) && queryWorkspaceId.length > 0) {
    return queryWorkspaceId;
  }

  const envDefault =
    (
      window as unknown as {
        _env_?: { REACT_APP_DEFAULT_WORKSPACE_ID?: string };
      }
    )._env_?.REACT_APP_DEFAULT_WORKSPACE_ID ??
    process.env.REACT_APP_DEFAULT_WORKSPACE_ID;

  if (isDefined(envDefault) && envDefault.length > 0) {
    return envDefault;
  }

  return null;
};

export const PortalLoginPage = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = useMemo(
    () => resolveWorkspaceId(searchParams.get('workspace')),
    [searchParams],
  );

  const [email, setEmail] = useState('');
  const [state, setState] = useState<LoginState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const trimmedEmail = email.trim();

    if (trimmedEmail.length === 0) {
      setErrorMessage('Please enter your email.');
      return;
    }

    if (!isDefined(workspaceId)) {
      setErrorMessage(
        'No workspace selected. Please use the link provided by your account manager.',
      );
      return;
    }

    setState('submitting');
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${REACT_APP_SERVER_BASE_URL}/portal-auth/request-link`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, workspaceId }),
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setState('sent');
    } catch {
      // Intentionally generic to avoid email enumeration.
      setState('error');
      setErrorMessage('Could not send magic link. Try again.');
    }
  }, [email, workspaceId]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  if (state === 'sent') {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledBrand>Geraci LLP Client Portal</StyledBrand>
          <StyledSuccessMessage>
            Check your email for a login link. It expires in 15 minutes.
          </StyledSuccessMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  return (
    <StyledPageContainer>
      <StyledCard>
        <StyledBrand>Geraci LLP Client Portal</StyledBrand>
        <StyledSubtitle>
          Enter your email and we&apos;ll send you a secure login link.
        </StyledSubtitle>

        <StyledFormGroup>
          <StyledLabel htmlFor="portal-login-email">Email</StyledLabel>
          <StyledInput
            id="portal-login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </StyledFormGroup>

        {isDefined(errorMessage) && (
          <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
        )}

        <StyledSubmitButton
          onClick={handleSubmit}
          disabled={state === 'submitting'}
        >
          {state === 'submitting' ? 'Sending...' : 'Send magic link'}
        </StyledSubmitButton>
      </StyledCard>
    </StyledPageContainer>
  );
};
