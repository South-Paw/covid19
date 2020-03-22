import { readableColor } from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import { getSummaryWorldWide, SummaryWorldWide } from '../../api';
import { ErrorHandler } from '../ui/ErrorHandler';
import { Loading } from '../ui/Loading';
import { useGetDailyCases } from '../WorldDailyCases';

const StyledStat = styled('div')`
  margin: 0 12px;
  flex: 1 1 25%;
  display: flex;
  flex-flow: nowrap column;
`;

const Label = styled('div')`
  font-weight: 400;
  line-height: 1.25;
  text-transform: uppercase;
`;

const Number = styled('div')<{ color?: string }>`
  font-size: ${p => p.theme.fontSizes['3xl']}px;
  font-weight: 500;
  color: ${p => p.color || 'transparent'};
`;

const Other = styled('div')<{ color?: string }>`
  padding: ${p => p.theme.space.xs}px ${p => p.theme.space.sm}px;
  display: flex;
  align-items: center;
  background-color: ${p => p.color || 'transparent'};
  color: ${p => (p.color ? readableColor(p.color, p.theme.colors.text.base, p.theme.colors.text.inverse) : 'inherit')};
`;

export interface StatProps {
  color?: string;
  label: React.ReactNode;
  number: React.ReactNode;
  other?: React.ReactNode;
}

const Stat: React.FC<StatProps> = ({ color, label, number, other }) => (
  <StyledStat>
    <Label>{label}</Label>
    <Number color={color}>{number}</Number>
    {other && <Other color={color}>{other}</Other>}
  </StyledStat>
);

const RenderDelta: React.FC<{ value: number }> = ({ value }) => {
  let indicator = '';

  if (value > 0) {
    indicator = '+';
  }

  if (value < 0) {
    indicator = '-';
  }

  if (value === 0) {
    return <>No change today</>;
  }

  return (
    <>
      {indicator}
      {value} today
    </>
  );
};

const Row = styled('div')`
  display: flex;
  flex-flow: nowrap row;
`;

const useGetSummaryWorldWide = () => {
  const [called, setIsCalled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(undefined);
  const [data, setData] = React.useState<SummaryWorldWide | undefined>(undefined);

  React.useEffect(() => {
    if (!called) {
      getSummaryWorldWide()
        .then(summary => setData(summary))
        .catch(err => setError(err))
        .finally(() => {
          setIsCalled(true);
          setIsLoading(false);
        });
    }
  }, [called]);

  return { isLoading, error, data };
};

const useWorldSummary = () => {
  const { isLoading: isSummaryLoading, error: summaryError, data: summaryData } = useGetSummaryWorldWide();
  const { isLoading: isDailyLoading, error: dailyError, data: dailyData } = useGetDailyCases();

  return {
    isLoading: isSummaryLoading || isDailyLoading,
    error: summaryError || dailyError,
    data: {
      summary: summaryData,
      today: dailyData ? dailyData[dailyData.length - 1] : undefined,
    },
  };
};

export const WorldSummary = () => {
  const { isLoading, error, data } = useWorldSummary();

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return <ErrorHandler message="Unable to fetch summary data" error={error} />;
  }

  return (
    <Row>
      {data.summary && data.today && (
        <>
          <Stat
            color="#1E1C1D"
            label="Confirmed"
            number={data.summary.confirmed.toLocaleString()}
            other={<RenderDelta value={data.today.confirmedDelta} />}
          />
          <Stat
            color="#F4B81F"
            label="Active"
            number={data.summary.active.toLocaleString()}
            other={<RenderDelta value={data.today.activeDelta} />}
          />
          <Stat
            color="#0F9D58"
            label="Recovered"
            number={data.summary.recovered.toLocaleString()}
            other={<RenderDelta value={data.today.recoveredDelta} />}
          />
          <Stat
            color="#DA2C38"
            label="Deaths"
            number={data.summary.deaths.toLocaleString()}
            other={
              <span title="Indicative only; the true mortality rate for a pandemic can only be calculated at the end and not while it is ongoing.">
                {data.summary.mortalityRate}% mortality rate*
              </span>
            }
          />
        </>
      )}
    </Row>
  );
};
