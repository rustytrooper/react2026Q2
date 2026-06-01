import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDisneyData } from './useFetchCharacters';

vi.mock('../../helpers/charactersApi', () => ({
  charactersApi: {
    getCharacters: vi.fn(),
  },
}));

vi.mock('../../helpers/localStorage', () => ({
  initializeSearchValue: vi.fn(),
  saveSearchValue: vi.fn(),
  trimValue: vi.fn((value: string) => value.trim()),
}));

vi.mock('../../store/useDownloadData', () => ({
  default: vi.fn(),
}));

const mockSetSearchParams = vi.fn();
const mockGetSearchParams = vi.fn(() => new URLSearchParams());

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useSearchParams: () => [mockGetSearchParams(), mockSetSearchParams],
  };
});

import { charactersApi } from '../../helpers/charactersApi';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from '../../helpers/localStorage';
import useDisneyStore from '../../store/useDownloadData';

const mockCharactersApi = charactersApi.getCharacters as unknown as ReturnType<
  typeof vi.fn
>;
const mockInitializeSearchValue =
  initializeSearchValue as unknown as ReturnType<typeof vi.fn>;
const mockSaveSearchValue = saveSearchValue as unknown as ReturnType<
  typeof vi.fn
>;
const mockTrimValue = trimValue as unknown as ReturnType<typeof vi.fn>;
const mockUseDisneyStore = useDisneyStore as unknown as ReturnType<
  typeof vi.fn
>;

const mockResponse = {
  info: { count: 10, totalPages: 5, previousPage: null, nextPage: null },
  data: [{ _id: 1, name: 'Mickey Mouse' }],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </BrowserRouter>
    );
  };
}

describe('useDisneyData', () => {
  const mockClearSelection = vi.fn();
  const mockGetSelectedCount = vi.fn(() => 0);
  const mockGetSelectedCharacters = vi.fn(() => []);

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSearchParams.mockReturnValue(new URLSearchParams());
    mockCharactersApi.mockResolvedValue(mockResponse);
    mockTrimValue.mockImplementation((value: string) => value.trim());
    mockUseDisneyStore.mockImplementation((selector) => {
      const state = {
        clearSelection: mockClearSelection,
        getSelectedCount: mockGetSelectedCount,
        getSelectedCharacters: mockGetSelectedCharacters,
      };
      return selector(state);
    });
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDisneyData(), {
        wrapper,
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.searchQueryFromURL).toBe('');
      expect(result.current.loading).toBe(true);
    });

    it('should load saved query from localStorage when no URL query', async () => {
      mockInitializeSearchValue.mockReturnValue('saved');
      const wrapper = createWrapper();

      renderHook(() => useDisneyData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockInitializeSearchValue).toHaveBeenCalled();
      });
    });

    it('should not load saved query when URL query exists', async () => {
      mockGetSearchParams.mockReturnValue(
        new URLSearchParams('query=test&page=1')
      );
      mockInitializeSearchValue.mockReturnValue('saved');
      const wrapper = createWrapper();

      renderHook(() => useDisneyData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockInitializeSearchValue).not.toHaveBeenCalled();
      });
    });
  });

  describe('Data fetching', () => {
    it('should fetch characters successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDisneyData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockCharactersApi).toHaveBeenCalledWith({
          query: '',
          page: 1,
          pageSize: 10,
        });
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.totalPages).toBe(5);
      });
    });

    it('should fetch filtered data when query exists', async () => {
      mockGetSearchParams.mockReturnValue(
        new URLSearchParams('query=mickey&page=2')
      );
      const wrapper = createWrapper();

      renderHook(() => useDisneyData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockCharactersApi).toHaveBeenCalledWith({
          query: 'mickey',
          page: 2,
          pageSize: 10,
        });
      });
    });

    it('should handle API error', async () => {
      mockCharactersApi.mockRejectedValue(new Error('Network error'));
      const wrapper = createWrapper();

      const { result } = renderHook(() => useDisneyData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });
    });
  });

  describe('handleSubmit', () => {
    it('should handle submit with non-empty term', async () => {
      mockTrimValue.mockReturnValue('mickey');
      const wrapper = createWrapper();

      const { result } = renderHook(() => useDisneyData(), {
        wrapper,
      });

      await act(async () => {
        result.current.handleSubmit('  mickey  ');
      });

      expect(mockTrimValue).toHaveBeenCalledWith('  mickey  ');
      expect(mockSaveSearchValue).toHaveBeenCalledWith('mickey');
    });

    it('should handle submit with empty term', async () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useDisneyData(), {
        wrapper,
      });

      await act(async () => {
        result.current.handleSubmit('');
      });

      expect(mockSaveSearchValue).not.toHaveBeenCalled();
    });
  });

  describe('handlePageChange', () => {
    it('should change page correctly', async () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useDisneyData(), {
        wrapper,
      });

      await act(async () => {
        result.current.handlePageChange(3);
      });

      expect(mockSetSearchParams).toHaveBeenCalled();
    });
  });

  describe('Store functions', () => {
    it('should expose store functions', () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useDisneyData(), {
        wrapper,
      });

      expect(result.current.clearSelection).toBeDefined();
      expect(result.current.getSelectedCount).toBeDefined();
      expect(result.current.getSelectedCharacters).toBeDefined();
    });
  });
});
