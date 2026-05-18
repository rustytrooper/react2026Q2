import { describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { Layout } from './Layout';

vi.mock('../Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Mock Header</div>,
}));

describe('Layout', () => {
  beforeAll(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  afterAll(() => {
    cleanup();
  });
  const renderWithRouter = (
    component: React.ReactNode,
    initialEntries = ['/']
  ) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
    );
  };

  describe('Basic rendering', () => {
    it('should have a div container', () => {
      renderWithRouter(<Layout />);

      const container = document.querySelector('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Outlet rendering', () => {
    it('should render Outlet content', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={<div data-testid="outlet-content">Outlet Content</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    });

    it('should render different outlet content based on route', () => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<div>Home Page</div>} />
              <Route path="about" element={<div>About Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('About Page')).toBeInTheDocument();
      expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
    });

    it('should render nested routes correctly', () => {
      render(
        <MemoryRouter initialEntries={['/user/profile']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="user">
                <Route path="profile" element={<div>User Profile</div>} />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
  });

  describe('Integration with real Header', () => {
    it('should work with real Header component', () => {
      vi.unmock('../Header/Header');

      render(
        <MemoryRouter initialEntries={['/']}>
          <Layout />
        </MemoryRouter>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });
});
