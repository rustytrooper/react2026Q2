import { Component, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.setState({ hasError: true, error });
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 3000);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 rounded-lg my-auto">
          <h1 className="mb-7">Something went wrong.</h1>
          {this.state.error && <p>{this.state.error.message}</p>}
        </div>
      );
    }
    return this.props.children;
  }
}
