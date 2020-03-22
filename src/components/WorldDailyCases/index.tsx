import * as React from 'react';
import { DailyCase, getDailyCases } from '../../api';
import { ErrorHandler } from '../ui/ErrorHandler';
import { Loading } from '../ui/Loading';
import { DailyCasesChart } from './Chart';

export const useGetDailyCases = () => {
  const [called, setIsCalled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(undefined);
  const [data, setData] = React.useState<DailyCase[] | undefined>(undefined);

  React.useEffect(() => {
    if (!called) {
      getDailyCases()
        .then(daily => setData(daily))
        .catch(err => setError(err))
        .finally(() => {
          setIsCalled(true);
          setIsLoading(false);
        });
    }
  }, [called]);

  return { isLoading, error, data };
};

export const WorldDailyCases = () => {
  const { isLoading, error, data } = useGetDailyCases();

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data || data.length === 0) {
    return <ErrorHandler message="Unable to fetch chart data" error={error} />;
  }

  return <DailyCasesChart data={data} />;
};
