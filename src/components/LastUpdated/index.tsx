import * as React from 'react';
import { useGetLastUpdated } from '../../api';

export const LastUpdated = () => {
  const { isLoading, error, data } = useGetLastUpdated();

  if (isLoading) {
    return <>Updating...</>;
  }

  if (error || !data) {
    return <>Unable to retrieve last updated</>;
  }

  const date = new Date(data).toLocaleString();

  return <>Last updated {date}</>;
};
