import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './Layout';

vi.mock('../Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Mock Header</div>,
}));

vi.mock('../../context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-theme-provider">{children}</div>
  ),
}));

const renderWithBrowserRouter = (
  ui: React.ReactElement,
  { route = '/' } = {}
) => {
  window.history.pushState({}, 'Test page', route);
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
    cleanup();
  });

  describe('Basic rendering', () => {
    it('should have div container with correct classes', () => {
      renderWithBrowserRouter(<Layout />);

      const container = document.querySelector(
        '.bg-gray-100.dark\\:bg-purple-900'
      );
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('transition-all');
      expect(container).toHaveClass('duration-300');
    });
  });

  describe('Outlet rendering', () => {
    it('should render Outlet content', () => {
      render(
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={<div data-testid="outlet-content">Outlet Content</div>}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      );

      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    });

    it('should render different outlet content based on route', () => {
      render(
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<div>Home Page</div>} />
              <Route path="about" element={<div>About Page</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      );

      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.queryByText('About Page')).not.toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should have correct background classes', () => {
      renderWithBrowserRouter(<Layout />);

      const container = document.querySelector(
        '.bg-gray-100.dark\\:bg-purple-900'
      );
      expect(container).toHaveClass('bg-gray-100');
      expect(container).toHaveClass('dark:bg-purple-900');
    });

    it('should have transition classes', () => {
      renderWithBrowserRouter(<Layout />);

      const container = document.querySelector('.transition-all.duration-300');
      expect(container).toHaveClass('transition-all');
      expect(container).toHaveClass('duration-300');
    });
  });

  describe('Dark mode', () => {
    it('should have dark mode class on container', () => {
      renderWithBrowserRouter(<Layout />);

      const container = document.querySelector('.dark\\:bg-purple-900');
      expect(container).toBeInTheDocument();
    });
  });
});
