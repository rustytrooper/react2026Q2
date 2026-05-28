import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-value">{theme}</div>
      <button data-testid="toggle-button" onClick={toggleTheme}>
        Toggle
      </button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  describe('useTheme', () => {
    it('should throw error when used outside ThemeProvider', () => {
      expect(() => render(<TestComponent />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      );
    });
  });

  describe('Theme initialization', () => {
    it('should initialize with saved theme from localStorage', () => {
      localStorage.setItem('app-theme', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    });

    it('should initialize with light theme when nothing is saved and no prefers-dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    });

    it('should initialize with dark theme when prefers-color-scheme: dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    });

    it('should ignore invalid saved theme and use prefers-color-scheme', () => {
      localStorage.setItem('app-theme', 'invalid' as string);

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    });
  });

  describe('Theme toggling', () => {
    it('should toggle theme from dark to light', async () => {
      localStorage.setItem('app-theme', 'dark');
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');

      const toggleButton = screen.getByTestId('toggle-button');
      await user.click(toggleButton);

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    });
  });

  describe('localStorage synchronization', () => {
    it('should save theme to localStorage when theme changes', async () => {
      const user = userEvent.setup();
      localStorage.setItem('app-theme', 'light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle-button');
      await user.click(toggleButton);

      expect(localStorage.getItem('app-theme')).toBe('dark');
    });
  });

  describe('Document class synchronization', () => {
    it('should remove dark class from documentElement when theme is light', async () => {
      localStorage.setItem('app-theme', 'dark');
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      const setLightButton = screen.getByTestId('set-light');
      await user.click(setLightButton);

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
