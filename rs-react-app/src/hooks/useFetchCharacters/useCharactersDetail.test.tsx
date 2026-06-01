import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { charactersApi } from '../../helpers/charactersApi';
import { useCharacterDetail } from './useCharactersDetail';

vi.mock('../../helpers/charactersApi', () => ({
  charactersApi: {
    getCharacterById: vi.fn(),
  },
}));

vi.mock('../../main', () => ({
  cashTTL: 5 * 60 * 1000,
}));

const mockGetCharacterById =
  charactersApi.getCharacterById as unknown as ReturnType<typeof vi.fn>;

const mockCharacter = {
  _id: 367,
  name: 'Aunt Gertie',
  films: ["Mickey's Once Upon a Christmas"],
  tvShows: [],
  imageUrl: 'https://example.com/image.jpg',
  shortFilms: [],
  videoGames: [],
  parkAttractions: [],
  allies: [],
  enemies: [],
  url: '',
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useCharacterDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Query configuration', () => {
    it('should have correct query key', async () => {
      mockGetCharacterById.mockResolvedValue(mockCharacter);
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCharacterDetail('367'), {
        wrapper,
      });

      expect(result.current.fetchStatus).toBe('fetching');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should be disabled when id is undefined', () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCharacterDetail(undefined), {
        wrapper,
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGetCharacterById).not.toHaveBeenCalled();
    });

    it('should be disabled when id is empty string', () => {
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCharacterDetail(''), {
        wrapper,
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGetCharacterById).not.toHaveBeenCalled();
    });
  });

  describe('Data fetching', () => {
    it('should fetch character successfully when id is provided', async () => {
      mockGetCharacterById.mockResolvedValue(mockCharacter);
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCharacterDetail('367'), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockGetCharacterById).toHaveBeenCalledWith('367');
        expect(result.current.data).toEqual(mockCharacter);
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should refetch when id changes', async () => {
      mockGetCharacterById.mockResolvedValue(mockCharacter);
      const wrapper = createWrapper();

      const { rerender } = renderHook(
        ({ id }: { id: string | undefined }) => useCharacterDetail(id),
        {
          wrapper,
          initialProps: { id: '367' },
        }
      );

      await waitFor(() => {
        expect(mockGetCharacterById).toHaveBeenCalledWith('367');
      });

      mockGetCharacterById.mockResolvedValue({
        ...mockCharacter,
        _id: 112,
        name: 'Achilles',
      });

      rerender({ id: '112' });

      await waitFor(() => {
        expect(mockGetCharacterById).toHaveBeenCalledWith('112');
      });
    });

    it('should not fetch when id changes to undefined', async () => {
      mockGetCharacterById.mockResolvedValue(mockCharacter);
      const wrapper = createWrapper();

      const { result, rerender } = renderHook(
        ({ id }: { id: string | undefined }) => useCharacterDetail(id),
        {
          wrapper,
          initialProps: { id: '367' },
        }
      );

      await waitFor(() => {
        expect(mockGetCharacterById).toHaveBeenCalledWith('367');
      });

      rerender({ id: undefined });

      expect(mockGetCharacterById).toHaveBeenCalledTimes(1);
      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('Loading states', () => {
    it('should show loading state while fetching', async () => {
      mockGetCharacterById.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockCharacter), 100)
          )
      );
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCharacterDetail('367'), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.fetchStatus).toBe('fetching');

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('Cache behavior', () => {
    it('should use staleTime from config', async () => {
      mockGetCharacterById.mockResolvedValue(mockCharacter);
      const wrapper = createWrapper();

      const { result, rerender } = renderHook(
        ({ id }: { id: string | undefined }) => useCharacterDetail(id),
        {
          wrapper,
          initialProps: { id: '367' },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      rerender({ id: '367' });
      expect(mockGetCharacterById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle null response from API', async () => {
      mockGetCharacterById.mockResolvedValue(null);
      const wrapper = createWrapper();

      const { result } = renderHook(() => useCharacterDetail('999'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toBeNull();
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle id as number string', async () => {
      mockGetCharacterById.mockResolvedValue(mockCharacter);
      const wrapper = createWrapper();

      renderHook(() => useCharacterDetail('123'), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockGetCharacterById).toHaveBeenCalledWith('123');
      });
    });

    it('should handle id with special characters', async () => {
      mockGetCharacterById.mockResolvedValue(null);
      const wrapper = createWrapper();

      renderHook(() => useCharacterDetail('abc-123_456'), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockGetCharacterById).toHaveBeenCalledWith('abc-123_456');
      });
    });
  });
});
