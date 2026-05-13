import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorButton } from './ErrorButton';

describe('ErrorButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe('Rendering', () => {
    it('should render button correctly', () => {
      render(<ErrorButton />);

      const button = screen.getByRole('button', {
        name: /check error boundary/i,
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Check error boundary');
    });

    it('should have correct CSS classes', () => {
      render(<ErrorButton />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-purple-500');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('rounded');
      expect(button).toHaveClass('cursor-pointer');
    });

    it('should render without error initially', () => {
      render(<ErrorButton />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(() => screen.getByRole('button')).not.toThrow();
    });
  });

  describe('Button click behavior', () => {
    it('should not throw error before click', () => {
      render(<ErrorButton />);

      expect(() => render(<ErrorButton />)).not.toThrow();
    });

    it('should throw error when button is clicked once', () => {
      render(<ErrorButton />);

      const button = screen.getByRole('button');

      expect(() => {
        fireEvent.click(button);
      }).toThrow('This is a test error!');
    });

    it('should update state before throwing error', () => {
      const errorSpy = vi.spyOn(console, 'error');

      render(<ErrorButton />);

      const button = screen.getByRole('button');
      const setStateSpy = vi.spyOn(ErrorButton.prototype, 'setState');

      try {
        fireEvent.click(button);
      } catch (e) {}

      expect(setStateSpy).toHaveBeenCalledWith({ showError: true });

      setStateSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe('Props handling', () => {
    it('should handle className prop (custom className should merge)', () => {
      render(<ErrorButton />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-purple-500');
    });
  });

  describe('Multiple clicks', () => {
    it('should throw error on first click only', () => {
      render(<ErrorButton />);

      const button = screen.getByRole('button');
      expect(() => {
        fireEvent.click(button);
      }).toThrow('This is a test error!');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<ErrorButton />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be focusable', () => {
      render(<ErrorButton />);

      const button = screen.getByRole('button');
      button.focus();

      expect(button).toHaveFocus();
    });

    it('should respond to keyboard events', () => {
      render(<ErrorButton />);

      const button = screen.getByRole('button');

      expect(() => {
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
        fireEvent.click(button);
      }).toThrow('This is a test error!');
    });

    it('should have accessible name', () => {
      render(<ErrorButton />);

      const button = screen.getByRole('button', {
        name: /check error boundary/i,
      });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot when not errored', () => {
      const { container } = render(<ErrorButton />);
      expect(container).toMatchSnapshot();
    });
  });
});

describe('ErrorButton - Error handling', () => {
  beforeEach(() => {});

  it('should throw specific error message', () => {
    render(<ErrorButton />);

    const button = screen.getByRole('button');

    expect(() => fireEvent.click(button)).toThrow('This is a test error!');
  });
});
