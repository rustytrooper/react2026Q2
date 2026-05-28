import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
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
    it('should render ThemeProvider', () => {
      renderWithBrowserRouter(<Layout />);

      expect(screen.getByTestId('mock-theme-provider')).toBeInTheDocument();
    });

    it('should render Header component', () => {
      renderWithBrowserRouter(<Layout />);

      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByText('Mock Header')).toBeInTheDocument();
    });

    it('should render children inside ThemeProvider', () => {
      renderWithBrowserRouter(<Layout />);

      const provider = screen.getByTestId('mock-theme-provider');
      const header = screen.getByTestId('mock-header');

      expect(provider).toContainElement(header);
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

  describe('Layout structure', () => {
    it('should wrap everything in ThemeProvider', () => {
      render(
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<div data-testid="outlet-content" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      );

      const provider = screen.getByTestId('mock-theme-provider');
      const header = screen.getByTestId('mock-header');
      const outlet = screen.getByTestId('outlet-content');

      expect(provider).toContainElement(header);
      expect(provider).toContainElement(outlet);
    });
  });
});
