import * as React from 'react';
import { DailyCase, getDaily, getLastUpdated, getSummary, Summary } from './mathdroid';

export const useGetLastUpdated = () => {
  const [called, setIsCalled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(undefined);
  const [data, setData] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!called) {
      getLastUpdated()
        .then(_data => setData(_data))
        .catch(err => setError(err))
        .finally(() => {
          setIsCalled(true);
          setIsLoading(false);
        });
    }
  }, [called]);

  return { isLoading, error, data };
};

export const useGetSummaryWorldWide = () => {
  const [called, setIsCalled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(undefined);
  const [data, setData] = React.useState<Summary | undefined>(undefined);

  React.useEffect(() => {
    if (!called) {
      getSummary()
        .then(_data => setData(_data))
        .catch(err => setError(err))
        .finally(() => {
          setIsCalled(true);
          setIsLoading(false);
        });
    }
  }, [called]);

  return { isLoading, error, data };
};

export const useGetDailyCases = () => {
  const [called, setIsCalled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(undefined);
  const [data, setData] = React.useState<DailyCase[] | undefined>(undefined);

  React.useEffect(() => {
    if (!called) {
      getDaily()
        .then(_data => setData(_data))
        .catch(err => setError(err))
        .finally(() => {
          setIsCalled(true);
          setIsLoading(false);
        });
    }
  }, [called]);

  return { isLoading, error, data };
};
