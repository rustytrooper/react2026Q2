import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import App from './App';

vi.mock('./components/SearchForm/SearchForm', () => ({
  default: ({
    onSubmit,
    initialValue,
  }: {
    onSubmit: (query: string) => void;
    initialValue: string;
  }) => (
    <form
      data-testid="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit('test query');
      }}
    >
      <input
        data-testid="search-input"
        defaultValue={initialValue}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  ),
}));

vi.mock('./components/ResultCotainer/ResultContainer', () => ({
  default: ({
    characters,
  }: {
    characters: { data: Array<{ _id: number; name: string }> } | null;
  }) => (
    <div data-testid="result-container">
      {characters?.data?.map((char) => (
        <div key={char._id} data-testid={`character-${char._id}`}>
          {char.name}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('./components/Pagination/Pagination', () => ({
  Pagination: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  ),
}));

vi.mock('./components/Loader/Loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('./components/ErrorBoundary/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('./components/FlyOut/FlyOut', () => ({
  default: () => <div data-testid="selection-flyout">Selection Flyout</div>,
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  };
});

let mockHandleSubmit = vi.fn();
let mockHandlePageChange = vi.fn();

vi.mock('./hooks/useFetchCharacters/useFetchCharacters', () => ({
  useDisneyData: () => ({
    data: {
      info: { count: 3, totalPages: 10, previousPage: null, nextPage: null },
      data: [
        {
          _id: 1,
          name: 'Mickey Mouse',
          films: [],
          tvShows: [],
          imageUrl: '',
          url: '',
        },
        {
          _id: 2,
          name: 'Donald Duck',
          films: [],
          tvShows: [],
          imageUrl: '',
          url: '',
        },
        {
          _id: 3,
          name: 'Goofy',
          films: [],
          tvShows: [],
          imageUrl: '',
          url: '',
        },
      ],
    },
    loading: false,
    currentPage: 1,
    totalPages: 10,
    searchQueryFromURL: '',
    handleSubmit: mockHandleSubmit,
    handlePageChange: mockHandlePageChange,
  }),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHandleSubmit = vi.fn();
    mockHandlePageChange = vi.fn();
    vi.mock('./hooks/useFetchCharacters/useFetchCharacters', () => ({
      useDisneyData: () => ({
        data: {
          info: {
            count: 3,
            totalPages: 10,
            previousPage: null,
            nextPage: null,
          },
          data: [
            {
              _id: 1,
              name: 'Mickey Mouse',
              films: [],
              tvShows: [],
              imageUrl: '',
              url: '',
            },
            {
              _id: 2,
              name: 'Donald Duck',
              films: [],
              tvShows: [],
              imageUrl: '',
              url: '',
            },
            {
              _id: 3,
              name: 'Goofy',
              films: [],
              tvShows: [],
              imageUrl: '',
              url: '',
            },
          ],
        },
        loading: false,
        currentPage: 1,
        totalPages: 10,
        searchQueryFromURL: '',
        handleSubmit: mockHandleSubmit,
        handlePageChange: mockHandlePageChange,
      }),
    }));
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
    cleanup();
  });

  const renderWithBrowserRouter = (ui: React.ReactNode) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  describe('Main components rendering', () => {
    it('should render error boundary', () => {
      renderWithBrowserRouter(<App />);

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should render search form', () => {
      renderWithBrowserRouter(<App />);

      expect(screen.getByTestId('search-form')).toBeInTheDocument();
    });

    it('should render result container', () => {
      renderWithBrowserRouter(<App />);

      expect(screen.getByTestId('result-container')).toBeInTheDocument();
    });

    it('should render pagination', () => {
      renderWithBrowserRouter(<App />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should render outlet', () => {
      renderWithBrowserRouter(<App />);

      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('should render SelectionFlyout', () => {
      renderWithBrowserRouter(<App />);

      expect(screen.getByTestId('selection-flyout')).toBeInTheDocument();
    });
  });

  describe('Character display', () => {
    it('should display characters from data prop', () => {
      renderWithBrowserRouter(<App />);

      expect(screen.getByText('Mickey Mouse')).toBeInTheDocument();
      expect(screen.getByText('Donald Duck')).toBeInTheDocument();
      expect(screen.getByText('Goofy')).toBeInTheDocument();
    });
  });
});
