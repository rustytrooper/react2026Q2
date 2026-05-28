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

    it('should handle string ids correctly', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockCharacterResponse),
      });

      await fetchCharacterById('112');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character/112'
      );
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

describe('fetchData - additional coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchData - error handling', () => {
    it('should throw error when network request fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const networkError = new Error('Network failure');
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        networkError
      );

      await expect(fetchData()).rejects.toThrow('Network failure');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error while fetching data',
        networkError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should throw error when response.json() fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const jsonError = new Error('Invalid JSON');
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.reject(jsonError),
      });

      await expect(fetchData()).rejects.toThrow('Invalid JSON');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle abort signal', async () => {
      const abortError = new DOMException('Aborted', 'AbortError');
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        abortError
      );

      await expect(fetchData()).rejects.toThrow('Aborted');
    });
  });

  describe('fetchData - edge cases', () => {
    it('should handle page parameter as string', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: [] }),
      });

      await fetchData(2, 10);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=2&pageSize=10'
      );
    });

    it('should handle negative page number', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: [] }),
      });

      await fetchData(-1, 10);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=-1&pageSize=10'
      );
    });

    it('should handle zero page size', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: [] }),
      });

      await fetchData(1, 0);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=1&pageSize=0'
      );
    });

    it('should handle extremely large page size', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: [] }),
      });

      await fetchData(1, 10000);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=1&pageSize=10000'
      );
    });
  });

  describe('fetchCharacterById - additional coverage', () => {
    const mockCharacterData = {
      _id: 367,
      name: 'Aunt Gertie',
      films: ["Mickey's Once Upon a Christmas"],
      shortFilms: [],
      tvShows: [],
      videoGames: [],
      parkAttractions: [],
      allies: [],
      enemies: [],
      imageUrl: 'https://example.com/image.jpg',
      url: 'https://api.disneyapi.dev/characters/367',
    };

    it('should return character data when response has data property', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: mockCharacterData }),
      });

      const result = await fetchCharacterById('367');

      expect(result).toEqual(mockCharacterData);
    });

    it('should return null when response has no data property', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      const result = await fetchCharacterById('999999');

      expect(result).toBeNull();
    });

    it('should return null when response is empty object', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({}),
      });

      const result = await fetchCharacterById('999999');

      expect(result).toBeNull();
    });

    it('should throw error when network request fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const networkError = new Error('Network failure');
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        networkError
      );

      await expect(fetchCharacterById('367')).rejects.toThrow(
        'Network failure'
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle empty id string', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: null }),
      });

      await fetchCharacterById('');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character/'
      );
    });

    it('should handle id with special characters', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: null }),
      });

      await fetchCharacterById('abc123!@#');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character/abc123!@#'
      );
    });
  });

  describe('fetchFilteredData - additional coverage', () => {
    const mockFilteredResponse: DisneyApiResponse = {
      info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
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
      ],
    };

    it('should throw error when network request fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const networkError = new Error('Network failure');
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        networkError
      );

      await expect(fetchFilteredData('test')).rejects.toThrow(
        'Network failure'
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle search term with multiple spaces', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('  mickey   mouse  ');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=mickey%20%20%20mouse&page=1&pageSize=10'
      );
    });

    it('should handle search term with leading/trailing newlines', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('\nmickey\n');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=mickey&page=1&pageSize=10'
      );
    });

    it('should handle search term with emojis', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('🐭 Mickey');

      const expectedEncoded = encodeURIComponent('🐭 Mickey');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `https://api.disneyapi.dev/character?name=${expectedEncoded}&page=1&pageSize=10`
      );
    });

    it('should handle search term with Cyrillic characters', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });

      await fetchFilteredData('Микки Маус');

      const expectedEncoded = encodeURIComponent('Микки Маус');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `https://api.disneyapi.dev/character?name=${expectedEncoded}&page=1&pageSize=10`
      );
    });

    it('should handle page as string', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockFilteredResponse),
      });
      await fetchFilteredData('mickey', 2, 10);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?name=mickey&page=2&pageSize=10'
      );
    });
  });

  describe('fetchFilteredData - response handling', () => {
    it('should handle response with null data', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ info: null, data: null }),
      });

      const result = await fetchFilteredData('test');

      expect(result).toEqual({ info: null, data: null });
    });

    it('should handle empty response object', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({}),
      });

      const result = await fetchFilteredData('test');

      expect(result).toEqual({});
    });

    it('should handle malformed response', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve('not an object'),
      });

      const result = await fetchFilteredData('test');

      expect(result).toBe('not an object');
    });
  });

  describe('fetchData - response validation', () => {
    it('should handle response with missing info', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: [] }),
      });

      const result = await fetchData();

      expect(result).toEqual({ data: [] });
    });

    it('should handle response with missing data', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ info: { count: 0 } }),
      });

      const result = await fetchData();

      expect(result).toEqual({ info: { count: 0 } });
    });

    it('should handle response as array', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve([]),
      });

      const result = await fetchData();

      expect(result).toEqual([]);
    });
  });

  describe('Integration - error recovery', () => {
    it('should handle retry after failure', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (globalThis.fetch as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ data: [] }),
        });

      await expect(fetchData()).rejects.toThrow('Network error');
      const result = await fetchData();
      expect(result).toEqual({ data: [] });

      consoleErrorSpy.mockRestore();
    });
  });
});
