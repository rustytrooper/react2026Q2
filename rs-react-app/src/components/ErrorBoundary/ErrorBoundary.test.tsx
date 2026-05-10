import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ErrorBoundary } from './ErrorBoundary';

const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Component error!');
  return <div>Child content</div>;
};

const ErrorButton = () => {
  const throwError = () => {
    throw new Error('Error from button click');
  };
  return (
    <button onClick={throwError} data-testid="error-button">
      Throw Error
    </button>
  );
};

describe('ErrorBoundary', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
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

  test('throws error when test button is clicked', async () => {
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    const button = screen.getByTestId('error-button');
    fireEvent.click(button);

    const heading = await screen.findByText(/Something went wrong/i);
    expect(heading).toBeInTheDocument();
  });

  test('triggers error boundary fallback UI when button error is thrown', async () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
        <ErrorButton />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();

    const button = screen.getByTestId('error-button');
    fireEvent.click(button);

    const heading = await screen.findByText(/Something went wrong/i);
    expect(heading).toBeInTheDocument();
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

  test('resets error state after 3 seconds', async () => {
    vi.useFakeTimers();
    const originalSetState = ErrorBoundary.prototype.setState;
    const setStateSpy = vi
      .spyOn(ErrorBoundary.prototype, 'setState')
      .mockImplementation(function (updater, callback) {
        const state =
          typeof updater === 'function'
            ? updater(this.state, this.props)
            : updater;
        return originalSetState.call(this, state, callback);
      });

    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const heading = screen.getByText(/Something went wrong/i);
    expect(heading).toBeInTheDocument();

    vi.advanceTimersByTime(3000);

    expect(setStateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ hasError: false }),
      expect.any(Function)
    );

    setStateSpy.mockRestore();
    vi.useRealTimers();
  });
});
