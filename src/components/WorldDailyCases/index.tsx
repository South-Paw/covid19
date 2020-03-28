import * as React from 'react';
import { useGetDailyCases } from '../../api';
import { ErrorHandler } from '../ui/ErrorHandler';
import { Loading } from '../ui/Loading';
import { DailyCasesChart } from './Chart';

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
