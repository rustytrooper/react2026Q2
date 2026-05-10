import { describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import Card from './Card';

const defaultProps = {
  imageUrl: 'https://example.com/avatar.jpg',
  name: 'John Doe',
  films: ['The Matrix', 'Inception'],
  tvShows: ['Stranger Things', 'The Office'],
};

describe('Card Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });
  test('displays item name and films/tvShows correctly', () => {
    render(<Card {...defaultProps} />);

    const nameElement = screen.getByText(defaultProps.name);
    expect(nameElement).toBeInTheDocument();

    const filmsText = screen.getByText('Films:');
    expect(filmsText).toBeInTheDocument();

    const filmsValue = screen.getByText(defaultProps.films.join(', '));
    expect(filmsValue).toBeInTheDocument();

    const tvShowsText = screen.getByText('TV shows:');
    expect(tvShowsText).toBeInTheDocument();

    const tvShowsValue = screen.getByText(defaultProps.tvShows.join(', '));
    expect(tvShowsValue).toBeInTheDocument();
  });

  test('handles missing or empty props gracefully', () => {
    const incompleteProps = {
      imageUrl: '',
      name: 'Anonymous',
      films: [],
      tvShows: [],
    };

    render(<Card {...incompleteProps} />);
    const nameElement = screen.getByText(incompleteProps.name);
    expect(nameElement).toBeInTheDocument();
    const filmsText = screen.getByText('Films:');
    expect(filmsText).toBeInTheDocument();

    const tvShowsText = screen.getByText('TV shows:');
    expect(tvShowsText).toBeInTheDocument();
    const filmsContainer = filmsText.parentElement;
    expect(filmsContainer?.textContent).toBe('Films: ');

    const tvShowsContainer = tvShowsText.parentElement;
    expect(tvShowsContainer?.textContent).toBe('TV shows: ');
    expect(filmsContainer?.textContent).not.toContain(',');
    expect(tvShowsContainer?.textContent).not.toContain(',');
  });

  test('renders without crashing with minimal required props', () => {
    const minimalProps = {
      imageUrl: '',
      name: '',
      films: [],
      tvShows: [],
    };

    expect(() => {
      render(<Card {...minimalProps} />);
    }).not.toThrow();
    expect(screen.getByText('Films:')).toBeInTheDocument();
    expect(screen.getByText('TV shows:')).toBeInTheDocument();
  });
});
