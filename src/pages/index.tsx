import * as React from 'react';
import { getLastUpdated } from '../api';
import { Container } from '../components/ui/Container';
import { CSSReset, Theme } from '../components/ui/Theme';
import { WorldDailyCases } from '../components/WorldDailyCases';
import { WorldSummary } from '../components/WorldSummary';

export const useGetLastUpdated = () => {
  const [called, setIsCalled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(undefined);
  const [data, setData] = React.useState<any | undefined>(undefined);

  React.useEffect(() => {
    if (!called) {
      getLastUpdated()
        .then(lastUpdated => setData(lastUpdated))
        .catch(err => setError(err))
        .finally(() => {
          setIsCalled(true);
          setIsLoading(false);
        });
    }
  }, [called]);

  return { isLoading, error, data };
};

const IndexPage = () => {
  const { data } = useGetLastUpdated();

  return (
    <Theme>
      <CSSReset />
      <Container>
        <div style={{ margin: '24px 0' }}>
          <WorldDailyCases />
        </div>
        <div style={{ margin: '24px 0' }}>
          <WorldSummary />
        </div>
        <p>
          {data ? `Last updated ${data}` : 'Unable to retrieve last updated'}
          <br />
          Contribute and suggest features on{' '}
          <a href="https://github.com/South-Paw/covid-19" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          <br />
          Data sourced from <a href="https://github.com/CSSEGISandData/COVID-19">JHU CSSE</a>
        </p>
      </Container>
    </Theme>
  );
};

export default IndexPage;
