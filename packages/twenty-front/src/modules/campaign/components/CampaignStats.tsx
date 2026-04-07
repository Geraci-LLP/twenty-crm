import { styled } from '@linaria/react';

import { type CampaignStatsData } from '@/campaign/types/CampaignTypes';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledCardsGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(3, 1fr);
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledCardLabel = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  text-transform: uppercase;
`;

const StyledCardValue = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xxl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledRatesRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledRateCard = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledRateValue = styled.span`
  color: ${themeCssVariables.color.blue};
  font-size: ${themeCssVariables.font.size.xxl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const computeRate = (numerator: number, denominator: number): string => {
  if (denominator === 0) {
    return '0.0';
  }

  return ((numerator / denominator) * 100).toFixed(1);
};

type CampaignStatsProps = {
  stats: CampaignStatsData;
};

export const CampaignStats = ({ stats }: CampaignStatsProps) => {
  const openRate = computeRate(stats.opened, stats.delivered);
  const clickRate = computeRate(stats.clicked, stats.delivered);

  const metricCards: { label: string; value: number }[] = [
    { label: 'Sent', value: stats.sent },
    { label: 'Delivered', value: stats.delivered },
    { label: 'Opened', value: stats.opened },
    { label: 'Clicked', value: stats.clicked },
    { label: 'Bounced', value: stats.bounced },
    { label: 'Unsubscribed', value: stats.unsubscribed },
  ];

  return (
    <StyledContainer>
      <StyledTitle>Campaign Performance</StyledTitle>

      <StyledCardsGrid>
        {metricCards.map((metric) => (
          <StyledCard key={metric.label}>
            <StyledCardLabel>{metric.label}</StyledCardLabel>
            <StyledCardValue>
              {metric.value.toLocaleString()}
            </StyledCardValue>
          </StyledCard>
        ))}
      </StyledCardsGrid>

      <StyledRatesRow>
        <StyledRateCard>
          <StyledCardLabel>Open Rate</StyledCardLabel>
          <StyledRateValue>{openRate}%</StyledRateValue>
        </StyledRateCard>
        <StyledRateCard>
          <StyledCardLabel>Click Rate</StyledCardLabel>
          <StyledRateValue>{clickRate}%</StyledRateValue>
        </StyledRateCard>
      </StyledRatesRow>
    </StyledContainer>
  );
};
