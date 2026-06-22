import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeToggleButton from './ButtonSwitchTheme';

const setupMatchMediaMock = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

vi.mock('../assets/moon.png', () => ({ default: 'mocked-moon.png' }));
vi.mock('../assets/sun.png', () => ({ default: 'mocked-sun.png' }));

const renderWithTheme = (ui: React.ReactNode) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('ThemeToggleButton', () => {
  beforeEach(() => {
    setupMatchMediaMock(false);
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  describe('Basic rendering', () => {
    it('should render a button', () => {
      renderWithTheme(<ThemeToggleButton />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      renderWithTheme(<ThemeToggleButton />);

      const button = screen.getByLabelText('Toggle theme');
      expect(button).toBeInTheDocument();
    });

    it('should display sun icon when theme is light', () => {
      renderWithTheme(<ThemeToggleButton />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'mocked-sun.png');
    });
  });

  describe('Theme toggling', () => {
    it('should toggle theme from light to dark when clicked', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ThemeToggleButton />);

      const button = screen.getByRole('button');
      const initialImage = screen.getByRole('img');
      expect(initialImage).toHaveAttribute('src', 'mocked-sun.png');

      await user.click(button);

      const updatedImage = screen.getByRole('img');
      expect(updatedImage).toHaveAttribute('src', 'mocked-moon.png');
    });
  });

  describe('Theme synchronization with context', () => {
    it('should update theme in localStorage when toggled', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ThemeToggleButton />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(localStorage.getItem('app-theme')).toBe('dark');
    });

    it('should add dark class to document when dark theme is active', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ThemeToggleButton />);

      const button = screen.getByRole('button');
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      await user.click(button);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label for screen readers', () => {
      renderWithTheme(<ThemeToggleButton />);

      const button = screen.getByLabelText('Toggle theme');
      expect(button).toBeInTheDocument();
    });

    it('should be focusable', () => {
      renderWithTheme(<ThemeToggleButton />);

      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Image rendering', () => {
    it('should render an image', () => {
      renderWithTheme(<ThemeToggleButton />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
    });
  });
});
