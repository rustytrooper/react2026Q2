import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchData, fetchCharacterById, fetchFilteredData } from './fetchData';
import type { DisneyApiResponse } from '../types/charachterType';

describe('fetchData', () => {
  const mockResponse: DisneyApiResponse = {
    info: { count: 10, totalPages: 1, previousPage: null, nextPage: null },
    data: [
      {
        _id: 1,
        name: 'Mickey Mouse',
        films: [],
        shortFilms: [],
        tvShows: [],
        videoGames: [],
        parkAttractions: [],
        allies: [],
        enemies: [],
        imageUrl: '',
        url: '',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchData', () => {
    it('should fetch data with default parameters', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchData();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=1&pageSize=10'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch data with custom page and pageSize', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchData(3, 20);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=3&pageSize=20'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle HTTP error responses', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      const result = await fetchData();
      expect(result).toEqual({ error: 'Not found' });
    });
  });

  describe('fetchCharacterById', () => {
    const mockCharacterResponse: DisneyApiResponse = {
      info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
      data: [
        {
          _id: 367,
          name: 'Aunt Gertie',
          films: [],
          shortFilms: [],
          tvShows: [],
          videoGames: [],
          parkAttractions: [],
          allies: [],
          enemies: [],
          imageUrl: '',
          url: '',
        },
      ],
    };

    it('should fetch character by id', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockCharacterResponse),
      });

      const result = await fetchCharacterById('367');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character/367'
      );
      expect(result).toEqual(mockCharacterResponse);
    });

    it('should handle string ids correctly', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockCharacterResponse),
      });

      await fetchCharacterById('112');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character/112'
      );
    });

    it('should handle non-existent character', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ error: 'There is nothing here' }),
      });

      const result = await fetchCharacterById('999999');

      expect(result).toEqual({ error: 'There is nothing here' });
    });
  });

  describe('fetchFilteredData', () => {
    const mockFilteredResponse: DisneyApiResponse = {
      info: { count: 2, totalPages: 1, previousPage: null, nextPage: null },
      data: [
        {
          _id: 112,
          name: 'Achilles',
          films: [],
          shortFilms: [],
          tvShows: [],
          videoGames: [],
          parkAttractions: [],
          allies: [],
          enemies: [],
          imageUrl: '',
          url: '',
        },
        {
          _id: 31,
          name: 'Achilles',
          films: [],
          shortFilms: [],
          tvShows: [],
          videoGames: [],
          parkAttractions: [],
          allies: [],
          enemies: [],
          imageUrl: '',
          url: '',
        },
      ],
    };

    it('should fetch filtered data with search term', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      const result = await fetchFilteredData('achilles');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=achilles&page=1&pageSize=10'
      );
      expect(result).toEqual(mockFilteredResponse);
    });

    it('should encode search term correctly', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('mickey mouse');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=mickey%20mouse&page=1&pageSize=10'
      );
    });

    it('should trim search term before encoding', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('  mickey  ');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=mickey&page=1&pageSize=10'
      );
    });

    it('should handle special characters in search term', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('mickey@#$%');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=mickey%40%23%24%25&page=1&pageSize=10'
      );
    });

    it('should fetch filtered data with custom page and pageSize', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      const result = await fetchFilteredData('donald', 2, 20);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=donald&page=2&pageSize=20'
      );
      expect(result).toEqual(mockFilteredResponse);
    });

    it('should use default page and pageSize when not specified', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('goofy');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=goofy&page=1&pageSize=10'
      );
    });

    it('should return empty result when no matches found', async () => {
      const emptyResponse = {
        info: { count: 0, totalPages: 0, previousPage: null, nextPage: null },
        data: [],
      };
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(emptyResponse),
      });

      const result = await fetchFilteredData('nonexistentcharacterxyz');

      expect(result).toEqual(emptyResponse);
      expect(result?.data).toHaveLength(0);
    });

    it('should handle empty search term', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=&page=1&pageSize=10'
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle sequential fetch calls correctly', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ data: [{ name: 'Mickey' }] }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ data: [{ name: 'Donald' }] }),
        });

      const firstResult = await fetchData(1);
      const secondResult = await fetchData(2);

      expect(firstResult).toEqual({ data: [{ name: 'Mickey' }] });
      expect(secondResult).toEqual({ data: [{ name: 'Donald' }] });
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent fetch calls', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: [] }),
      });

      await Promise.all([
        fetchData(1),
        fetchData(2),
        fetchFilteredData('test', 1),
        fetchCharacterById('123'),
      ]);

      expect(globalThis.fetch).toHaveBeenCalledTimes(4);
    });
  });
});
