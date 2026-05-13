import { describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import { ErrorBoundary } from './ErrorBoundary';

const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Component error!');
  return <div>Child content</div>;
};

describe('ErrorBoundary', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test('catches and handles JavaScript errors in child components', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const heading = screen.getByText(/Something went wrong/i);
    expect(heading).toBeInTheDocument();
  });

  test('displays fallback UI when error occurs', () => {
    const errorMessage = 'Component error!';

    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const heading = screen.getByText(/Something went wrong/i);
    const errorMsg = screen.getByText(errorMessage);
    expect(heading).toBeInTheDocument();
    expect(errorMsg).toBeInTheDocument();
  });

  test('logs error to console when error occurs', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    const child = screen.getByText('Child content');
    expect(child).toBeInTheDocument();
  });
});
