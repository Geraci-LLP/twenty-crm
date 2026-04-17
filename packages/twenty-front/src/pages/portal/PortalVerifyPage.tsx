import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

type VerifyState = 'verifying' | 'error';

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
  text-align: center;
  width: 100%;
`;

const StyledMessage = styled.p`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  margin: 0;
`;

const StyledErrorTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[2]} 0;
`;

// Default flow: call the verify endpoint from JS and let it set the HTTP-only
// cookie, then navigate into the portal. The server also supports a "redirect
// on success" mode — if the fetch returns a redirect we follow it via
// `window.location`.
export const PortalVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isDefined(token) || token.length === 0) {
      setErrorMessage('Missing verification token.');
      setState('error');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_SERVER_BASE_URL}/portal-auth/verify?token=${encodeURIComponent(token)}`,
          {
            method: 'GET',
            credentials: 'include',
            redirect: 'follow',
          },
        );

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        // Cookie is now set HTTP-only. Land the user on the portal home.
        navigate(AppPath.Portal);
      } catch {
        setErrorMessage(
          'This login link is invalid or has expired. Request a new one.',
        );
        setState('error');
      }
    };

    verify();
  }, [token, navigate]);

  if (state === 'error') {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledErrorTitle>Verification failed</StyledErrorTitle>
          <StyledMessage>
            {errorMessage ?? 'Your login link is invalid or has expired.'}
          </StyledMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  return (
    <StyledPageContainer>
      <StyledCard>
        <StyledMessage>Verifying your login link...</StyledMessage>
      </StyledCard>
    </StyledPageContainer>
  );
};
