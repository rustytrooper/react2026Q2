import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import App from './App';
import {
  mockCharactersResponse,
  mockAchilles,
  mockAuntGertie,
} from './mocks/mockData';
import { initializeSearchValue, saveSearchValue } from './helpers/localStorage';
import type { SearchFormProps } from './components/SearchForm/SearchForm';
import type { Character, DisneyApiResponse } from './types/charachterType';

vi.mock('./helpers/localStorage', () => ({
  initializeSearchValue: vi.fn(),
  saveSearchValue: vi.fn(),
  trimValue: vi.fn((val: string) => val.trim()),
}));

vi.mock('./components/SearchForm/SearchForm', () => ({
  default: ({ onSubmit, initialValue, onSearch }: SearchFormProps) => (
    <form
      data-testid="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        const input = document.querySelector(
          '[data-testid="search-input"]'
        ) as HTMLInputElement;
        onSubmit(input?.value || initialValue || '');
      }}
    >
      <input
        data-testid="search-input"
        defaultValue={initialValue || ''}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <button data-testid="search-button" type="submit">
        Search
      </button>
    </form>
  ),
}));

vi.mock('./components/ResultCotainer/ResultContainer', () => ({
  default: ({ characters }: { characters: DisneyApiResponse }) => (
    <div data-testid="result-container">
      {characters?.data?.length === 0 && <div>No results found</div>}
      {characters?.data?.map((card: Character) => (
        <div key={card._id} data-testid={`card-${card.name}`}>
          {card.name}
        </div>
      ))}
      {!characters && <div>No data</div>}
    </div>
  ),
}));

vi.mock('./components/Loader/Loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('./components/ErrorBoundary/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./components/ErrorBoundary/ErrorButton', () => ({
  ErrorButton: () => <button data-testid="error-button">Throw Error</button>,
}));

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  localStorage.clear();
});

const mockInitializeSearchValue = vi.mocked(initializeSearchValue);
const mockSaveSearchValue = vi.mocked(saveSearchValue);

describe('App Component - Integration Tests', () => {
  describe('Handles search term from localStorage on initial load', () => {
    it('should load and display saved search term from localStorage', async () => {
      const savedTerm = 'Aunt Gertie';
      mockInitializeSearchValue.mockReturnValue(savedTerm);

      server.use(
        http.get('https://api.disneyapi.dev/character', ({ request }) => {
          const url = new URL(request.url);
          const name = url.searchParams.get('name');

          if (name === savedTerm.toLowerCase()) {
            return HttpResponse.json(mockAuntGertie);
          }
          return HttpResponse.json(mockCharactersResponse);
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toHaveValue(savedTerm);
      });
    });
  });

  describe('Manages loading states during API calls', () => {
    it('should show and hide loader during initial data fetch', async () => {
      server.use(
        http.get('https://api.disneyapi.dev/character', async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json(mockCharactersResponse);
        })
      );

      render(<App />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });
    });

    it('should show loader during search submission', async () => {
      const user = userEvent.setup();
      mockInitializeSearchValue.mockReturnValue(undefined);

      server.use(
        http.get('https://api.disneyapi.dev/character', () => {
          return HttpResponse.json(mockCharactersResponse);
        }),
        http.get('https://api.disneyapi.dev/character', async ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get('name')) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return HttpResponse.json(mockAchilles);
          }
          return HttpResponse.json(mockCharactersResponse);
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.clear(searchInput);
      await user.type(searchInput, 'achilles');
      await user.click(searchButton);

      expect(screen.getByTestId('loader')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });
    });
  });
});

describe('App Component - API Integration Tests', () => {
  beforeEach(() => {
    mockInitializeSearchValue.mockReturnValue(undefined);
  });

  describe('Handles API error responses', () => {
    it('should handle 404 error from API', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      server.use(
        http.get('https://api.disneyapi.dev/character', () => {
          return HttpResponse.json(null, { status: 404 });
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('result-container')).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('should handle network error gracefully', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      server.use(
        http.get('https://api.disneyapi.dev/character', () => {
          return HttpResponse.error();
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('result-container')).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });
});

describe('App Component - State Management Tests', () => {
  beforeEach(() => {
    mockInitializeSearchValue.mockReturnValue(undefined);
  });
  describe('Manages search term state correctly', () => {
    it('should update searchTerm state when user types', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('https://api.disneyapi.dev/character', () => {
          return HttpResponse.json(mockCharactersResponse);
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');

      await user.clear(searchInput);
      await user.type(searchInput, 'test search');

      expect(searchInput).toHaveValue('test search');
    });

    it('should save search term to localStorage on submit', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('https://api.disneyapi.dev/character', () => {
          return HttpResponse.json(mockCharactersResponse);
        }),
        http.get('https://api.disneyapi.dev/character', ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get('name')) {
            return HttpResponse.json(mockAchilles);
          }
          return HttpResponse.json(mockCharactersResponse);
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.clear(searchInput);
      await user.type(searchInput, 'achilles');
      await user.click(searchButton);

      await waitFor(() => {
        expect(mockSaveSearchValue).toHaveBeenCalledWith('achilles');
      });
    });
  });
});

describe('App Component - Performance and Edge Cases', () => {
  it('should handle rapid consecutive searches without breaking', async () => {
    const user = userEvent.setup();
    mockInitializeSearchValue.mockReturnValue(undefined);

    server.use(
      http.get('https://api.disneyapi.dev/character', () => {
        return HttpResponse.json(mockCharactersResponse);
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const searchButton = screen.getByTestId('search-button');

    await user.click(searchButton);
    await user.click(searchButton);
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('result-container')).toBeInTheDocument();
    });
  });

  it('should handle very long search terms', async () => {
    const user = userEvent.setup();
    const longTerm = 'a'.repeat(500);

    server.use(
      http.get('https://api.disneyapi.dev/character', () => {
        return HttpResponse.json(mockCharactersResponse);
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    const searchButton = screen.getByTestId('search-button');

    await user.clear(searchInput);
    await user.type(searchInput, longTerm);
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('result-container')).toBeInTheDocument();
    });
  });
});
