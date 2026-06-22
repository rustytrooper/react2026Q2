import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { charactersApi } from './charactersApi';

describe('charactersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getCharacters', () => {
    const mockResponse = {
      data: [
        { _id: 1, name: 'Mickey Mouse' },
        { _id: 2, name: 'Donald Duck' },
      ],
      info: { count: 2, totalPages: 1, previousPage: null, nextPage: null },
    };

    it('should fetch characters without query', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      const result = await charactersApi.getCharacters({
        query: '',
        page: 1,
        pageSize: 10,
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=1&pageSize=10'
      );
      expect(result).toEqual({
        data: mockResponse.data,
        info: mockResponse.info,
      });
    });

    it('should fetch characters with query', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      const result = await charactersApi.getCharacters({
        query: 'mickey',
        page: 1,
        pageSize: 10,
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=1&pageSize=10&name=mickey'
      );
      expect(result).toEqual({
        data: mockResponse.data,
        info: mockResponse.info,
      });
    });

    it('should handle different page and pageSize values', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      await charactersApi.getCharacters({
        query: '',
        page: 3,
        pageSize: 20,
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character?page=3&pageSize=20'
      );
    });

    it('should handle empty response data', async () => {
      const emptyResponse = {
        data: [],
        info: { count: 0, totalPages: 0, previousPage: null, nextPage: null },
      };
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(emptyResponse),
      });

      const result = await charactersApi.getCharacters({
        query: 'nonexistent',
        page: 1,
        pageSize: 10,
      });

      expect(result.data).toHaveLength(0);
      expect(result.info.count).toBe(0);
    });

    it('should throw error on network failure', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error')
      );

      await expect(
        charactersApi.getCharacters({
          query: '',
          page: 1,
          pageSize: 10,
        })
      ).rejects.toThrow('Network error');

      consoleErrorSpy.mockRestore();
    });

    it('should throw error on invalid JSON response', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(
        charactersApi.getCharacters({
          query: '',
          page: 1,
          pageSize: 10,
        })
      ).rejects.toThrow('Invalid JSON');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getCharacterById', () => {
    const mockCharacter = {
      _id: 367,
      name: 'Aunt Gertie',
      films: ["Mickey's Once Upon a Christmas"],
      tvShows: [],
      imageUrl: 'https://example.com/image.jpg',
    };

    it('should fetch character by id', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: mockCharacter }),
      });

      const result = await charactersApi.getCharacterById('367');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character/367'
      );
      expect(result).toEqual(mockCharacter);
    });

    it('should handle string id correctly', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: mockCharacter }),
      });

      await charactersApi.getCharacterById('112');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character/112'
      );
    });

    it('should return undefined for non-existent character', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: null }),
      });

      const result = await charactersApi.getCharacterById('999999');

      expect(result).toBeNull();
    });

    it('should handle API returning error object', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ error: 'There is nothing here' }),
      });

      const result = await charactersApi.getCharacterById('999999');

      expect(result).toBeUndefined();
    });

    it('should throw error on network failure', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error')
      );

      await expect(charactersApi.getCharacterById('367')).rejects.toThrow(
        'Network error'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should throw error on invalid JSON response', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(charactersApi.getCharacterById('367')).rejects.toThrow(
        'Invalid JSON'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle id with special characters', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: null }),
      });

      await charactersApi.getCharacterById('abc123!@#');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character/abc123!@#'
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle sequential getCharacters calls', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({ data: [{ name: 'Mickey' }], info: { count: 1 } }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({ data: [{ name: 'Donald' }], info: { count: 1 } }),
        });

      const firstResult = await charactersApi.getCharacters({
        query: '',
        page: 1,
        pageSize: 10,
      });
      const secondResult = await charactersApi.getCharacters({
        query: '',
        page: 2,
        pageSize: 10,
      });

      expect(firstResult.data[0].name).toBe('Mickey');
      expect(secondResult.data[0].name).toBe('Donald');
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent getCharacterById calls', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve({ data: { name: 'Character' } }),
      });

      await Promise.all([
        charactersApi.getCharacterById('1'),
        charactersApi.getCharacterById('2'),
        charactersApi.getCharacterById('3'),
      ]);

      expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    });
  });
});
