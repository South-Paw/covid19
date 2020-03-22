import * as React from 'react';

export interface ErrorHandlerProps {
  message: string;
  error?: any;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, message }) => {
  console.error(error);

  return <div>{message}</div>;
};
