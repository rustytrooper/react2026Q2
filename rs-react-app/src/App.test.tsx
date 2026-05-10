import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import App from './App';
import { saveSearchValue } from './helpers/localStorage';
import type { DisneyApiResponse } from './types/charachterType';
import { server } from './mocks/node';

const mockFilteredCharacters: DisneyApiResponse = {
  info: { count: 1, totalPages: 1, previousPage: null, nextPage: null},
  data: [
    {
      _id: 1,
      films: ['a', 'b'],
      shortFilms: ['a', 'b'],
      tvShows: ['a', 'b'],
      videoGames: ['a', 'b'],
      parkAttractions: ['a', 'b'],
      allies: ['a', 'b'],
      enemies: ['a', 'b'],
      name: 'Ariel',
      imageUrl: 'ariel.png',
      url: 'example.com',
    },
  ],
};

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('App Component – Integration Tests', () => {
  test('makes initial API call on component mount', async () => {
    render(<App />);

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('loader')).not.toBeInTheDocument();
    });
    expect(screen.getByText('ResultContainer')).toBeInTheDocument();
  });

  test('handles search term from localStorage on initial load', async () => {
    const savedTerm = 'Mickey';
    saveSearchValue(savedTerm);

    server.use(
      http.get('/api/disney/filtered', () => {
        return HttpResponse.json(mockFilteredCharacters);
      })
    );

    render(<App />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue(savedTerm);

    await waitFor(() => {
      expect(screen.getByText('ResultContainer filtered')).toBeInTheDocument();
    });
  });

  test('manages loading states during API calls', async () => {
    render(<App />);

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByRole('searchbox');
    const searchButton = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchInput, { target: { value: 'Goofy' } });
    fireEvent.click(searchButton);
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });
});

describe('App Component  API Integration Tests', () => {
  test('calls API with correct parameters', async () => {
    let capturedParam = '';
    const savedTerm = 'Donald';

    server.use(
      http.get('/api/disney/filtered', ({ request }) => {
        const url = new URL(request.url);
        capturedParam = url.searchParams.get('name') || '';
        return HttpResponse.json(mockFilteredCharacters);
      })
    );

    render(<App />);

    const searchInput = screen.getByRole('searchbox');
    const searchButton = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchInput, { target: { value: savedTerm } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(capturedParam).toBe('Donald');
    });
  });

  test('handles successful API responses correctly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('ResultContainer')).toBeInTheDocument();
    });

    expect(screen.getByText('Mickey Mouse')).toBeInTheDocument();
  });

  test('handles API error responses', async () => {
    server.use(
      http.get('/api/disney/all', () => {
        return HttpResponse.json({ error: 'Failed to fetch' }, { status: 500 });
      })
    );

    render(<App />);
    const errorFallback = await screen.findByText(/Something went wrong/i);
    expect(errorFallback).toBeInTheDocument();
  });
});

describe('App Component State Management Tests', () => {
  test('updates component state based on API responses', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('ResultContainer')).toBeInTheDocument();
    });

    const cardName = await screen.findByText('Mickey Mouse');
    expect(cardName).toBeInTheDocument();
  });

  test('manages search term state correctly', async () => {
    render(<App />);

    const searchInput = screen.getByRole('searchbox');
    const searchButton = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchInput, { target: { value: '  Donald Duck  ' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(searchInput).toHaveValue('Donald Duck');
    });
    expect(localStorage.getItem('searchTerm')).toBe('Donald Duck');
  });

  test('handles empty search term correctly', async () => {
    render(<App />);

    const searchInput = screen.getByRole('searchbox');
    const searchButton = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(searchInput, { target: { value: '   ' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });

    expect(localStorage.getItem('searchTerm')).toBe('');
  });
});
