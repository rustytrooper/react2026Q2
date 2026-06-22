import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useDisneyStore from './useDownloadData';
import { fetchData, fetchFilteredData } from '../helpers/fetchData';
import type { Character, DisneyApiResponse } from '../types/charachterType';

vi.mock('../helpers/fetchData', () => ({
  fetchData: vi.fn(),
  fetchFilteredData: vi.fn(),
}));

const mockFetchData = fetchData as unknown as ReturnType<typeof vi.fn>;
const mockFetchFilteredData = fetchFilteredData as unknown as ReturnType<
  typeof vi.fn
>;

describe('useDisneyStore', () => {
  const mockCharacter1: Character = {
    _id: 1,
    name: 'Mickey Mouse',
    films: ['Film 1'],
    shortFilms: [],
    tvShows: ['Show 1'],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    imageUrl: 'https://example.com/mickey.jpg',
    url: '',
  };

  const mockCharacter2: Character = {
    _id: 2,
    name: 'Donald Duck',
    films: ['Film 2'],
    shortFilms: [],
    tvShows: ['Show 2'],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    imageUrl: 'https://example.com/donald.jpg',
    url: '',
  };

  const mockResponse: DisneyApiResponse = {
    info: { count: 10, totalPages: 5, previousPage: null, nextPage: null },
    data: [mockCharacter1, mockCharacter2],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDisneyStore.setState({
      data: null,
      loading: false,
      error: false,
      totalPages: 0,
      selectedIds: new Set<number>(),
      allCharacters: [],
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const state = useDisneyStore.getState();

      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBe(false);
      expect(state.totalPages).toBe(0);
      expect(state.selectedIds.size).toBe(0);
      expect(state.allCharacters).toEqual([]);
    });
  });

  describe('loadData', () => {
    it('should load data without query (page 1)', async () => {
      mockFetchData.mockResolvedValue(mockResponse);

      await useDisneyStore.getState().loadData('', 1, 10);

      const state = useDisneyStore.getState();
      expect(mockFetchData).toHaveBeenCalledWith(1, 10);
      expect(state.data).toEqual(mockResponse);
      expect(state.totalPages).toBe(5);
      expect(state.loading).toBe(false);
      expect(state.allCharacters).toEqual([mockCharacter1, mockCharacter2]);
    });

    it('should load data with query', async () => {
      mockFetchFilteredData.mockResolvedValue(mockResponse);

      await useDisneyStore.getState().loadData('mickey', 1, 10);

      expect(mockFetchFilteredData).toHaveBeenCalledWith('mickey', 1, 10);
      const state = useDisneyStore.getState();
      expect(state.data).toEqual(mockResponse);
    });

    it('should set loading state correctly while fetching', async () => {
      mockFetchData.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const loadPromise = useDisneyStore.getState().loadData('', 1, 10);

      expect(useDisneyStore.getState().loading).toBe(true);

      await loadPromise;
      expect(useDisneyStore.getState().loading).toBe(false);
    });

    it('should handle error when fetch fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockFetchData.mockRejectedValue(new Error('Network error'));

      await useDisneyStore.getState().loadData('', 1, 10);

      const state = useDisneyStore.getState();
      expect(state.error).toBe(true);
      expect(state.loading).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    describe('allCharacters accumulation', () => {
      const page1Response: DisneyApiResponse = {
        info: { count: 4, totalPages: 2, previousPage: null, nextPage: null },
        data: [mockCharacter1, mockCharacter2],
      };

      const page2Response: DisneyApiResponse = {
        info: { count: 4, totalPages: 2, previousPage: null, nextPage: null },
        data: [
          { ...mockCharacter1, _id: 3 },
          { ...mockCharacter2, _id: 4 },
        ],
      };

      it('should replace allCharacters on page 1', async () => {
        mockFetchData.mockResolvedValue(page1Response);

        await useDisneyStore.getState().loadData('', 1, 10);

        expect(useDisneyStore.getState().allCharacters).toHaveLength(2);
        expect(useDisneyStore.getState().allCharacters[0]._id).toBe(1);
        expect(useDisneyStore.getState().allCharacters[1]._id).toBe(2);
      });

      it('should append unique characters on page 2', async () => {
        mockFetchData
          .mockResolvedValueOnce(page1Response)
          .mockResolvedValueOnce(page2Response);

        await useDisneyStore.getState().loadData('', 1, 10);
        expect(useDisneyStore.getState().allCharacters).toHaveLength(2);

        await useDisneyStore.getState().loadData('', 2, 10);
        expect(useDisneyStore.getState().allCharacters).toHaveLength(4);
      });

      it('should not duplicate characters when appending', async () => {
        const duplicateResponse: DisneyApiResponse = {
          info: { count: 2, totalPages: 1, previousPage: null, nextPage: null },
          data: [mockCharacter1],
        };

        mockFetchData.mockResolvedValue(duplicateResponse);

        await useDisneyStore.getState().loadData('', 1, 10);
        expect(useDisneyStore.getState().allCharacters).toHaveLength(1);

        await useDisneyStore.getState().loadData('', 2, 10);
        expect(useDisneyStore.getState().allCharacters).toHaveLength(1);
      });
    });
  });

  describe('selectCharacter', () => {
    beforeEach(async () => {
      mockFetchData.mockResolvedValue(mockResponse);
      await useDisneyStore.getState().loadData('', 1, 10);
    });

    it('should add character to selectedIds when not selected', () => {
      useDisneyStore.getState().selectCharacter(1);

      expect(useDisneyStore.getState().selectedIds.has(1)).toBe(true);
      expect(useDisneyStore.getState().selectedIds.size).toBe(1);
    });

    it('should remove character from selectedIds when already selected', () => {
      useDisneyStore.getState().selectCharacter(1);
      expect(useDisneyStore.getState().selectedIds.has(1)).toBe(true);

      useDisneyStore.getState().selectCharacter(1);
      expect(useDisneyStore.getState().selectedIds.has(1)).toBe(false);
      expect(useDisneyStore.getState().selectedIds.size).toBe(0);
    });

    it('should handle multiple selections', () => {
      useDisneyStore.getState().selectCharacter(1);
      useDisneyStore.getState().selectCharacter(2);

      expect(useDisneyStore.getState().selectedIds.size).toBe(2);
      expect(useDisneyStore.getState().selectedIds.has(1)).toBe(true);
      expect(useDisneyStore.getState().selectedIds.has(2)).toBe(true);
    });
  });

  describe('clearSelection', () => {
    beforeEach(async () => {
      mockFetchData.mockResolvedValue(mockResponse);
      await useDisneyStore.getState().loadData('', 1, 10);
      useDisneyStore.getState().selectCharacter(1);
      useDisneyStore.getState().selectCharacter(2);
      expect(useDisneyStore.getState().selectedIds.size).toBe(2);
    });

    it('should clear all selected characters', () => {
      useDisneyStore.getState().clearSelection();

      expect(useDisneyStore.getState().selectedIds.size).toBe(0);
    });
  });

  describe('getSelectedCount', () => {
    beforeEach(async () => {
      mockFetchData.mockResolvedValue(mockResponse);
      await useDisneyStore.getState().loadData('', 1, 10);
    });

    it('should return 0 when no characters selected', () => {
      const count = useDisneyStore.getState().getSelectedCount();
      expect(count).toBe(0);
    });

    it('should return correct count after selections', () => {
      useDisneyStore.getState().selectCharacter(1);
      expect(useDisneyStore.getState().getSelectedCount()).toBe(1);

      useDisneyStore.getState().selectCharacter(2);
      expect(useDisneyStore.getState().getSelectedCount()).toBe(2);

      useDisneyStore.getState().selectCharacter(1);
      expect(useDisneyStore.getState().getSelectedCount()).toBe(1);
    });
  });

  describe('getSelectedCharacters', () => {
    const mockCharacter3: Character = {
      ...mockCharacter1,
      _id: 3,
      name: 'Goofy',
    };

    beforeEach(async () => {
      const multiPageResponse: DisneyApiResponse = {
        info: { count: 3, totalPages: 2, previousPage: null, nextPage: null },
        data: [mockCharacter1, mockCharacter2],
      };
      const page2Response: DisneyApiResponse = {
        info: { count: 3, totalPages: 2, previousPage: null, nextPage: null },
        data: [mockCharacter3],
      };

      mockFetchData
        .mockResolvedValueOnce(multiPageResponse)
        .mockResolvedValueOnce(page2Response);

      await useDisneyStore.getState().loadData('', 1, 10);
      await useDisneyStore.getState().loadData('', 2, 10);
    });

    it('should return empty array when no characters selected', () => {
      const selected = useDisneyStore.getState().getSelectedCharacters();
      expect(selected).toEqual([]);
    });

    it('should return selected characters when some are selected', () => {
      useDisneyStore.getState().selectCharacter(1);
      useDisneyStore.getState().selectCharacter(3);

      const selected = useDisneyStore.getState().getSelectedCharacters();
      expect(selected).toHaveLength(2);
      expect(selected[0]._id).toBe(1);
      expect(selected[1]._id).toBe(3);
    });

    it('should return empty array after clearing selection', () => {
      useDisneyStore.getState().selectCharacter(1);
      expect(useDisneyStore.getState().getSelectedCharacters()).toHaveLength(1);

      useDisneyStore.getState().clearSelection();
      expect(useDisneyStore.getState().getSelectedCharacters()).toEqual([]);
    });
  });
});
