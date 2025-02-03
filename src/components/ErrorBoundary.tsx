import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  feature?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.feature || 'component'}:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[200px] items-center justify-center rounded-lg border border-red-100 bg-red-50 p-6"
        >
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {this.props.feature 
                ? `Error in ${this.props.feature}`
                : 'Something went wrong'
              }
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              {this.state.error?.message || 'Please try again'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Feature-specific error boundary
export const FeatureErrorBoundary: React.FC<Props> = ({ 
  children,
  feature,
  ...props 
}) => {
  return (
    <ErrorBoundary feature={feature} {...props}>
      {children}
    </ErrorBoundary>
  );
}; 