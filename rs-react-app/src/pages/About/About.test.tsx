import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { About } from './About';

const renderWithBrowserRouter = (
  ui: React.ReactElement,
  { route = '/' } = {}
) => {
  window.history.pushState({}, 'Test page', route);
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('About', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('should render the about text', () => {
      renderWithBrowserRouter(<About />);

      const text = screen.getByText(
        /This is a project, that is developing by Diana Solovey/
      );
      expect(text).toBeInTheDocument();
    });

    it('should render the RS School link', () => {
      renderWithBrowserRouter(<About />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://rs.school/courses');
    });

    it('should render the RSS image', () => {
      renderWithBrowserRouter(<About />);

      const image = screen.getByAltText('rss courses');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', './src/assets/i.png');
    });
  });

  describe('CSS classes', () => {
    it('should have correct image container classes', () => {
      renderWithBrowserRouter(<About />);

      const imageContainer = document.querySelector(
        '.mt-auto.flex.justify-center'
      );
      expect(imageContainer).toHaveClass('mt-auto');
      expect(imageContainer).toHaveClass('flex');
      expect(imageContainer).toHaveClass('justify-center');
    });

    it('should have correct image classes', () => {
      renderWithBrowserRouter(<About />);

      const image = screen.getByAltText('rss courses');
      expect(image).toHaveClass('w-50');
      expect(image).toHaveClass('h-25');
      expect(image).toHaveClass('object-cover');
      expect(image).toHaveClass('mt-auto');
    });
  });

  describe('Link behavior', () => {
    it('should have correct RS School URL', () => {
      renderWithBrowserRouter(<About />);

      const link = screen.getByRole('link');
      expect(link.getAttribute('href')).toBe('https://rs.school/courses');
    });
  });

  describe('Text content', () => {
    it('should mention Diana Solovey as developer', () => {
      renderWithBrowserRouter(<About />);

      expect(screen.getByText(/Diana Solovey/)).toBeInTheDocument();
    });

    it('should mention Aleksander Tsurkan as mentor', () => {
      renderWithBrowserRouter(<About />);

      expect(screen.getByText(/Aleksander Tsurkan/)).toBeInTheDocument();
    });

    it('should mention RS React course', () => {
      renderWithBrowserRouter(<About />);

      expect(screen.getByText(/RS React course/)).toBeInTheDocument();
    });

    it('should contain full text content', () => {
      renderWithBrowserRouter(<About />);

      const fullText = screen.getByText((content) => {
        return (
          content.includes('This is a project') &&
          content.includes('RS React course') &&
          content.includes('Diana Solovey')
        );
      });
      expect(fullText).toBeInTheDocument();
    });
  });

  describe('Layout structure', () => {
    it('should have text above the image', () => {
      renderWithBrowserRouter(<About />);

      const container = document.querySelector('.flex.flex-col');
      const textContainer = document.querySelector('.flex-grow');
      const imageContainer = document.querySelector('.mt-auto');

      expect(container?.children[0]).toBe(textContainer);
      expect(container?.children[1]).toBe(imageContainer);
    });

    it('should center the image', () => {
      renderWithBrowserRouter(<About />);

      const imageContainer = document.querySelector('.mt-auto');
      expect(imageContainer).toHaveClass('justify-center');
    });
  });

  describe('Accessibility', () => {
    it('should have alt attribute for image', () => {
      renderWithBrowserRouter(<About />);

      const image = screen.getByAltText('rss courses');
      expect(image).toHaveAttribute('alt', 'rss courses');
    });

    it('should have link with correct text', () => {
      renderWithBrowserRouter(<About />);
      const image = screen.getByAltText('rss courses');
      expect(image.closest('a')).toBeInTheDocument();
    });
  });
});
