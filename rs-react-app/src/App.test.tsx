import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { useDisneyData } from './hooks/useFetchCharacters/useFetchCharacters';
import { BrowserRouter } from 'react-router';
import type { Character } from './types/charachterType';

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
  default: ({ characters }: { characters: Character[] | null }) => (
    <div data-testid="result-container">
      {characters?.map((char: Character) => (
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

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  };
});

vi.mock('./hooks/useFetchCharacters/useFetchCharacters', () => ({
  useDisneyData: vi.fn(),
}));

const mockUseDisneyData = useDisneyData as Mock;

describe('App Component', () => {
  const defaultMockData = {
    data: [
      { id: 1, name: 'Mickey Mouse' },
      { id: 2, name: 'Donald Duck' },
      { id: 3, name: 'Goofy' },
    ],
    loading: false,
    currentPage: 1,
    totalPages: 10,
    searchQueryFromURL: '',
    handleSubmit: vi.fn(),
    handlePageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDisneyData.mockReturnValue(defaultMockData);
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render loader when loading is true', () => {
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      loading: true,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('result-container')).not.toBeInTheDocument();
  });

  it('should render main components when loading is false', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    const resultContainers = screen.getAllByTestId('result-container');
    expect(resultContainers.length).toBeGreaterThan(0);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('should display characters from data prop', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText('Mickey Mouse')).toBeInTheDocument();
    expect(screen.getByText('Donald Duck')).toBeInTheDocument();
    expect(screen.getByText('Goofy')).toBeInTheDocument();
  });

  it('should pass correct props to SearchForm', () => {
    const searchQuery = 'mickey';
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      searchQueryFromURL: searchQuery,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toHaveAttribute('value', searchQuery);
  });

  it('should call handleSubmit when search form is submitted', async () => {
    const handleSubmit = vi.fn();
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      handleSubmit,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);

    expect(handleSubmit).toHaveBeenCalledWith('test query');
  });

  it('should display correct pagination info', () => {
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      currentPage: 5,
      totalPages: 20,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText('Page 5 of 20')).toBeInTheDocument();
  });

  it('should call handlePageChange with next page when next button clicked', async () => {
    const handlePageChange = vi.fn();
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      currentPage: 5,
      totalPages: 20,
      handlePageChange,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(6);
  });

  it('should call handlePageChange with previous page when prev button clicked', async () => {
    const handlePageChange = vi.fn();
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      currentPage: 5,
      totalPages: 20,
      handlePageChange,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const prevButton = screen.getByText('Previous');
    await userEvent.click(prevButton);

    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('should disable previous button on first page', () => {
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      currentPage: 1,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      currentPage: 10,
      totalPages: 10,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('should handle empty characters array', () => {
    mockUseDisneyData.mockReturnValue({
      ...defaultMockData,
      data: [],
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const resultContainers = screen.getAllByTestId('result-container');
    expect(resultContainers.length).toBeGreaterThan(0);
    expect(screen.queryByText('Mickey Mouse')).not.toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const container = document.querySelector('.w-full.bg-gray-100');
    expect(container).toBeInTheDocument();

    const innerContainer = document.querySelector(
      '.container.w-\\[90vw\\].mx-auto.px-4'
    );
    expect(innerContainer).toBeInTheDocument();
  });
});
