import { describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  beforeAll(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  afterAll(() => {
    cleanup();
  });
  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render the "Page not found" heading', () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('should render the image with correct attributes', () => {
    renderWithRouter(<NotFound />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', './src/assets/mermaid1.png');
    expect(image).toHaveClass('[clip-path:circle(20%_at_50%_50%)]');
    expect(image).toHaveClass('w-150');
    expect(image).toHaveClass('h-90');
    expect(image).toHaveClass('mx-auto');
    expect(image).toHaveClass('object-cover');
  });

  it('should render a link back to home', () => {
    renderWithRouter(<NotFound />);

    const link = screen.getByRole('link', { name: 'Back home' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have correct CSS classes on container', () => {
    renderWithRouter(<NotFound />);

    const container = document.querySelector('.bg-gray-100');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('bg-gray-100');
    expect(container).toHaveClass('min-h-screen');
  });

  it('should have heading as h1 element', () => {
    renderWithRouter(<NotFound />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Page not found');
  });

  it('should render image with correct alt attribute', () => {
    renderWithRouter(<NotFound />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
  });

  it('should have working navigation link', () => {
    renderWithRouter(<NotFound />);

    const link = screen.getByText('Back home');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });
});
