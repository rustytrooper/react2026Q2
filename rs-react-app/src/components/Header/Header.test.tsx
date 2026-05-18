import { describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router';
import { Header } from './Header';

describe('Header', () => {
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
    it('should render header element', () => {
      renderWithRouter(<Header />);

      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      renderWithRouter(<Header />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should have correct header classes', () => {
      renderWithRouter(<Header />);

      const header = document.querySelector('header');
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('justify-center');
      expect(header).toHaveClass('items-center');
      expect(header).toHaveClass('bg-purple-400');
      expect(header).toHaveClass('text-white');
      expect(header).toHaveClass('p-4');
    });

    it('should have correct nav classes', () => {
      renderWithRouter(<Header />);

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
      renderWithRouter(<Header />);

      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');

      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
      expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    });

    it('should have NavLink components with correct base classes', () => {
      renderWithRouter(<Header />);

      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');

      expect(homeLink).toHaveClass('hover:text-purple-200');
      expect(homeLink).toHaveClass('transition');
      expect(aboutLink).toHaveClass('hover:text-purple-200');
      expect(aboutLink).toHaveClass('transition');
    });
  });

  describe('Active link styling', () => {
    it('should apply active styles to Home link when on home page', () => {
      renderWithRouter(<Header />, ['/']);

      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');

      expect(homeLink).toHaveClass('font-bold');
      expect(homeLink).toHaveClass('underline');
      expect(aboutLink).not.toHaveClass('font-bold');
      expect(aboutLink).not.toHaveClass('underline');
    });

    it('should apply active styles to About link when on about page', () => {
      renderWithRouter(<Header />, ['/about']);

      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');

      expect(aboutLink).toHaveClass('font-bold');
      expect(aboutLink).toHaveClass('underline');
      expect(homeLink).not.toHaveClass('font-bold');
      expect(homeLink).not.toHaveClass('underline');
    });

    it('should not have active styles on Home when not on home page', () => {
      renderWithRouter(<Header />, ['/about']);

      const homeLink = screen.getByText('Home');
      expect(homeLink).not.toHaveClass('font-bold');
      expect(homeLink).not.toHaveClass('underline');
    });

    it('should not have active styles on About when not on about page', () => {
      renderWithRouter(<Header />, ['/']);

      const aboutLink = screen.getByText('About');
      expect(aboutLink).not.toHaveClass('font-bold');
      expect(aboutLink).not.toHaveClass('underline');
    });
  });

  describe('Link hover styles', () => {
    it('should have hover classes on Home link', () => {
      renderWithRouter(<Header />);

      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveClass('hover:text-purple-200');
    });

    it('should have hover classes on About link', () => {
      renderWithRouter(<Header />);

      const aboutLink = screen.getByText('About');
      expect(aboutLink).toHaveClass('hover:text-purple-200');
    });
  });

  describe('CSS transitions', () => {
    it('should have transition class on both links', () => {
      renderWithRouter(<Header />);

      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');

      expect(homeLink).toHaveClass('transition');
      expect(aboutLink).toHaveClass('transition');
    });
  });

  describe('Responsive layout', () => {
    it('should have responsive container classes', () => {
      renderWithRouter(<Header />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('container');
      expect(nav).toHaveClass('mx-auto');
    });

    it('should have gap between nav items', () => {
      renderWithRouter(<Header />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('gap-50');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic header element', () => {
      renderWithRouter(<Header />);

      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have semantic nav element', () => {
      renderWithRouter(<Header />);

      const nav = document.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should have proper link texts', () => {
      renderWithRouter(<Header />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });

  describe('BrowserRouter compatibility', () => {
    it('should work with BrowserRouter', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });
});
