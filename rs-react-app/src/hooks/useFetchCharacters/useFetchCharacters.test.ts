import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { fetchData, fetchFilteredData } from '../../helpers/fetchData';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from '../../helpers/localStorage';
import { useSearchParams } from 'react-router';
import { useDisneyData } from './useFetchCharacters';

vi.mock('../../helpers/fetchData', () => ({
  fetchData: vi.fn(),
  fetchFilteredData: vi.fn(),
}));

vi.mock('../../helpers/localStorage', () => ({
  initializeSearchValue: vi.fn(),
  saveSearchValue: vi.fn(),
  trimValue: vi.fn((value) => value.trim()),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

const mockFetchData = fetchData as ReturnType<typeof vi.fn>;
const mockFetchFilteredData = fetchFilteredData as ReturnType<typeof vi.fn>;
const mockInitializeSearchValue = initializeSearchValue as ReturnType<
  typeof vi.fn
>;
const mockSaveSearchValue = saveSearchValue as ReturnType<typeof vi.fn>;
const mockTrimValue = trimValue as ReturnType<typeof vi.fn>;
const mockUseSearchParams = useSearchParams as ReturnType<typeof vi.fn>;

const mockResponse = {
  info: { count: 10, totalPages: 5, previousPage: null, nextPage: null },
  data: [{ _id: 1, name: 'Mickey' }],
};

describe('useDisneyData', () => {
  let mockSetSearchParams: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetSearchParams = vi.fn();
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);
    mockFetchData.mockResolvedValue(mockResponse);
    mockFetchFilteredData.mockResolvedValue(mockResponse);
    mockTrimValue.mockImplementation((value) => value.trim());
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  afterAll(() => {
    cleanup();
  });

  describe('Initialization', () => {
    it('should initialize with URL query parameter', async () => {
      const searchParams = new URLSearchParams('?query=mickey&page=2');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);

      const { result } = renderHook(() => useDisneyData());

      expect(result.current.searchQueryFromURL).toBe('mickey');
      expect(result.current.currentPage).toBe(2);
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(mockFetchFilteredData).toHaveBeenCalledWith('mickey', 2, 10);
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.totalPages).toBe(5);
      });
    });

    it('should initialize with saved query from localStorage when no URL query', async () => {
      const searchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockInitializeSearchValue.mockReturnValue('saved');

      renderHook(() => useDisneyData());

      expect(mockInitializeSearchValue).toHaveBeenCalled();
      expect(mockSetSearchParams).toHaveBeenCalledWith({
        query: 'saved',
        page: '1',
      });
    });

    it('should load default data when no query in URL or localStorage', async () => {
      const searchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockInitializeSearchValue.mockReturnValue('');

      renderHook(() => useDisneyData());

      await waitFor(() => {
        expect(mockFetchData).toHaveBeenCalledWith(1, 10);
        expect(mockSetSearchParams).not.toHaveBeenCalled();
      });
    });
  });

  describe('Data loading', () => {
    it('should load data when URL parameters change', async () => {
      const searchParams = new URLSearchParams('?query=test&page=1');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);

      const { rerender } = renderHook(() => useDisneyData());

      await waitFor(() => {
        expect(mockFetchFilteredData).toHaveBeenCalledWith('test', 1, 10);
      });

      const newSearchParams = new URLSearchParams('?query=test&page=2');
      mockUseSearchParams.mockReturnValue([
        newSearchParams,
        mockSetSearchParams,
      ]);
      rerender();

      await waitFor(() => {
        expect(mockFetchFilteredData).toHaveBeenCalledWith('test', 2, 10);
      });
    });

    it('should fetch filtered data when query exists', async () => {
      const searchParams = new URLSearchParams('?query=mickey&page=1');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);

      renderHook(() => useDisneyData());

      await waitFor(() => {
        expect(mockFetchFilteredData).toHaveBeenCalledWith('mickey', 1, 10);
        expect(mockFetchData).not.toHaveBeenCalled();
      });
    });

    it('should fetch unfiltered data when query is empty', async () => {
      const searchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockInitializeSearchValue.mockReturnValue('');

      renderHook(() => useDisneyData());

      await waitFor(() => {
        expect(mockFetchData).toHaveBeenCalledWith(1, 10);
        expect(mockFetchFilteredData).not.toHaveBeenCalled();
      });
    });

    it('should handle loading state correctly', async () => {
      const searchParams = new URLSearchParams('?query=test&page=1');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockFetchFilteredData.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useDisneyData());

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    it('should handle submit with non-empty term', async () => {
      const searchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockTrimValue.mockReturnValue('trimmed query');

      const { result } = renderHook(() => useDisneyData());

      await act(async () => {
        result.current.handleSubmit('  trimmed query  ');
      });

      expect(mockTrimValue).toHaveBeenCalledWith('  trimmed query  ');
      expect(mockSaveSearchValue).toHaveBeenCalledWith('trimmed query');
      expect(mockSetSearchParams).toHaveBeenCalledWith({
        query: 'trimmed query',
        page: '1',
      });
    });
  });

  describe('Total pages calculation', () => {
    it('should set totalPages from response', async () => {
      const searchParams = new URLSearchParams('?query=test&page=1');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockFetchFilteredData.mockResolvedValue({
        info: {
          count: 100,
          totalPages: 20,
          previousPage: null,
          nextPage: null,
        },
        data: [],
      });

      const { result } = renderHook(() => useDisneyData());

      await waitFor(() => {
        expect(result.current.totalPages).toBe(20);
      });
    });

    it('should set totalPages to 0 when response has no info', async () => {
      const searchParams = new URLSearchParams('?query=test&page=1');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockFetchFilteredData.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useDisneyData());

      await waitFor(() => {
        expect(result.current.totalPages).toBe(0);
      });
    });
  });

  describe('URL synchronization', () => {
    it('should update URL when search params change', async () => {
      const searchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockInitializeSearchValue.mockReturnValue('');

      const { result } = renderHook(() => useDisneyData());

      await act(async () => {
        result.current.handleSubmit('new search');
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith({
        query: 'new search',
        page: '1',
      });
    });
  });

  describe('Performance and memoization', () => {
    it('should memoize handleSubmit with useCallback', () => {
      const searchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);

      const { result, rerender } = renderHook(() => useDisneyData());

      const firstHandleSubmit = result.current.handleSubmit;

      rerender();

      expect(result.current.handleSubmit).toBe(firstHandleSubmit);
    });

    it('should memoize handlePageChange with useCallback', () => {
      const searchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);

      const { result, rerender } = renderHook(() => useDisneyData());

      const firstHandlePageChange = result.current.handlePageChange;

      rerender();

      expect(result.current.handlePageChange).toBe(firstHandlePageChange);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty response from API', async () => {
      const searchParams = new URLSearchParams('?query=test&page=1');
      mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);
      mockFetchFilteredData.mockResolvedValue(null);

      const { result } = renderHook(() => useDisneyData());

      await waitFor(() => {
        expect(result.current.data).toBeNull();
        expect(result.current.totalPages).toBe(0);
      });
    });
  });
});
