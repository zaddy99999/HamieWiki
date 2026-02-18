'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-content">
            <div className="error-boundary-icon" aria-hidden="true">!</div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              We encountered an unexpected error. Please try again.
            </p>
            <div className="error-boundary-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="error-boundary-btn primary"
                onClick={() => this.setState({ hasError: false })}
                style={{ minHeight: '44px', padding: '12px 24px' }}
              >
                Try Again
              </button>
              <Link href="/" className="error-boundary-btn secondary" style={{ minHeight: '44px', padding: '12px 24px', display: 'inline-flex', alignItems: 'center' }}>
                Return Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error.',
  onRetry
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="error-fallback" role="alert">
      <div className="error-fallback-content">
        <div className="error-fallback-icon" aria-hidden="true">!</div>
        <h3 className="error-fallback-title">{title}</h3>
        <p className="error-fallback-message">{message}</p>
        {onRetry && (
          <button className="error-fallback-btn" onClick={onRetry} style={{ minHeight: '44px', padding: '12px 24px' }}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function NotFoundFallback({
  type = 'item',
  message
}: {
  type?: string;
  message?: string;
}) {
  return (
    <div className="not-found-fallback" role="alert">
      <div className="not-found-fallback-content">
        <div className="not-found-fallback-icon" aria-hidden="true">?</div>
        <h3 className="not-found-fallback-title">{type} Not Found</h3>
        <p className="not-found-fallback-message">
          {message || `The ${type.toLowerCase()} you're looking for doesn't exist in the Hamieverse.`}
        </p>
        <Link href="/" className="not-found-fallback-btn" style={{ minHeight: '44px', padding: '12px 24px', display: 'inline-flex', alignItems: 'center' }}>
          Return to Wiki Home
        </Link>
      </div>
    </div>
  );
}

export function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  message = 'Check back later for updates.',
  action
}: {
  icon?: string;
  title?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-content">
        <div className="empty-state-icon" aria-hidden="true">{icon}</div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
        {action && (
          <button className="empty-state-btn" onClick={action.onClick} style={{ minHeight: '44px', padding: '12px 24px' }}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
