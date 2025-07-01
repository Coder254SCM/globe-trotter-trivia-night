
import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class UnifiedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for monitoring
    console.error('[UnifiedErrorBoundary] Caught error:', error);
    console.error('[UnifiedErrorBoundary] Error info:', errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Report to monitoring system
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: React.ErrorInfo) {
    // In a real app, you'd send this to your monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.error('[ErrorReport]', errorReport);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: ''
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-red-800">Something went wrong</h3>
                    <p className="text-sm text-red-700 mt-1">
                      {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={this.handleRetry}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Try Again
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      size="sm"
                    >
                      Go Home
                    </Button>
                  </div>
                  
                  <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer">Error Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {this.state.error?.stack}
                    </pre>
                  </details>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle async errors
export const useAsyncError = () => {
  const [, setError] = React.useState();
  
  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, [setError]);
};
