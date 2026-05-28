import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router';
import { Header } from './Header';
import { ThemeProvider } from '../../context/ThemeContext';

vi.mock('../../ui-kit/ButtonToggleTheme', () => ({
  default: () => <button data-testid="theme-toggle-btn">Toggle Theme</button>,
}));

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

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{ui}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    setupMatchMediaMock(false);
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
    cleanup();
  });

  describe('Basic rendering', () => {
    it('should render header element', () => {
      renderWithProviders(<Header />);

      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      renderWithProviders(<Header />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should have correct nav classes', () => {
      renderWithProviders(<Header />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('container');
      expect(nav).toHaveClass('justify-center');
      expect(nav).toHaveClass('mx-auto');
      expect(nav).toHaveClass('flex');
      expect(nav).toHaveClass('gap-50');
    });
  });

  describe('Navigation links', () => {
    it('should have correct href attributes', () => {
      renderWithProviders(<Header />);

      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');

      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
      expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    });

    it('should have correct base classes on links', () => {
      renderWithProviders(<Header />);

      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');

      expect(homeLink).toHaveClass('hover:text-purple-200');
      expect(homeLink).toHaveClass('transition');
      expect(aboutLink).toHaveClass('hover:text-purple-200');
      expect(aboutLink).toHaveClass('transition');
    });
  });

  describe('Responsive layout', () => {
    it('should have responsive container classes', () => {
      renderWithProviders(<Header />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('container');
      expect(nav).toHaveClass('mx-auto');
    });

    it('should have gap between nav items and theme button', () => {
      renderWithProviders(<Header />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('gap-50');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic header element', () => {
      renderWithProviders(<Header />);

      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have semantic nav element', () => {
      renderWithProviders(<Header />);

      const nav = document.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should have proper link texts', () => {
      renderWithProviders(<Header />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });
});

describe('Header active link styling', () => {
  const renderWithMemoryRouter = (
    ui: React.ReactNode,
    initialEntries: string[] = ['/']
  ) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider>{ui}</ThemeProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    setupMatchMediaMock(false);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
  });

  it('should apply active styles to Home link when on home page', () => {
    renderWithMemoryRouter(<Header />, ['/']);

    const homeLink = screen.getByText('Home');
    const aboutLink = screen.getByText('About');

    expect(homeLink).toHaveClass('font-bold');
    expect(homeLink).toHaveClass('underline');
    expect(aboutLink).not.toHaveClass('font-bold');
    expect(aboutLink).not.toHaveClass('underline');
  });

  it('should apply active styles to About link when on about page', () => {
    renderWithMemoryRouter(<Header />, ['/about']);

    const homeLink = screen.getByText('Home');
    const aboutLink = screen.getByText('About');

    expect(aboutLink).toHaveClass('font-bold');
    expect(aboutLink).toHaveClass('underline');
    expect(homeLink).not.toHaveClass('font-bold');
    expect(homeLink).not.toHaveClass('underline');
  });

  it('should not have active styles on Home when not on home page', () => {
    renderWithMemoryRouter(<Header />, ['/about']);

    const homeLink = screen.getByText('Home');
    expect(homeLink).not.toHaveClass('font-bold');
    expect(homeLink).not.toHaveClass('underline');
  });

  it('should not have active styles on About when not on about page', () => {
    renderWithMemoryRouter(<Header />, ['/']);

    const aboutLink = screen.getByText('About');
    expect(aboutLink).not.toHaveClass('font-bold');
    expect(aboutLink).not.toHaveClass('underline');
  });
});
