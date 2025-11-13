import React from 'react';
import { Result, Button, Typography } from 'antd';

type Props = {
  title?: string;
  description?: React.ReactNode;
  error?: Error | null;
  onRetry?: () => void;
  compact?: boolean;
};

const ErrorState: React.FC<Props> = ({
  title = 'Something went wrong',
  description = undefined,
  error = null,
  onRetry = undefined,
  compact = false,
}) => {
  const message = error?.message ?? error?.toString?.();

  return (
    <Result
      status="error"
      title={title}
      subTitle={description ?? message}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry} data-testid="error-retry-btn">
            Retry
          </Button>
        ) : undefined
      }
    >
      {!compact && message && (
        <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
          {message}
        </Typography.Paragraph>
      )}
    </Result>
  );
};

ErrorState.defaultProps = {
  title: 'Something went wrong',
  description: undefined,
  error: null,
  onRetry: undefined,
  compact: false,
};

export default ErrorState;
