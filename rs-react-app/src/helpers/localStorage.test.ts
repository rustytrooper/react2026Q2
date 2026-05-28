import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  trimValue,
  initializeSearchValue,
  saveSearchValue,
} from './localStorage';

const STORAGE_KEY = 'searchValue';

describe('localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('trimValue', () => {
    it('should trim whitespace from beginning and end of string', () => {
      expect(trimValue('  hello  ')).toBe('hello');
      expect(trimValue('  hello world  ')).toBe('hello world');
      expect(trimValue('\thello\n')).toBe('hello');
    });

    it('should return empty string when input is empty string', () => {
      expect(trimValue('')).toBe('');
    });

    it('should return empty string when input is only whitespace', () => {
      expect(trimValue('   ')).toBe('');
      expect(trimValue('\t\n  ')).toBe('');
    });

    it('should not modify string without whitespace', () => {
      expect(trimValue('hello')).toBe('hello');
      expect(trimValue('hello world')).toBe('hello world');
    });

    it('should handle string with spaces inside but not at edges', () => {
      expect(trimValue('hello   world')).toBe('hello   world');
    });
  });

  describe('saveSearchValue', () => {
    it('should save trimmed search term to localStorage', () => {
      saveSearchValue('  mickey mouse  ');

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe('mickey mouse');
    });

    it('should save empty string when searchTerm is empty', () => {
      saveSearchValue('');

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe('');
    });

    it('should save empty string when searchTerm is only whitespace', () => {
      saveSearchValue('   ');

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe('');
    });

    it('should overwrite existing value in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'old value');

      saveSearchValue('new value');

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe('new value');
    });

    it('should handle saving special characters', () => {
      const specialValue = '!@#$%^&*()_+{}[]|\\:;"\'<>,.?/~`';
      saveSearchValue(specialValue);

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe(specialValue);
    });

    it('should handle saving very long string', () => {
      const longString = 'a'.repeat(1000);
      saveSearchValue(longString);

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe(longString);
    });
  });

  describe('initializeSearchValue', () => {
    it('should return saved value from localStorage when it exists', () => {
      localStorage.setItem(STORAGE_KEY, 'saved search');

      const result = initializeSearchValue();

      expect(result).toBe('saved search');
    });

    it('should handle empty string saved in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, '');

      const result = initializeSearchValue();

      expect(result).toBe('');
    });

    it('should return undefined when localStorage is empty', () => {
      const result = initializeSearchValue();

      expect(result).toBeUndefined();
    });

    it('should handle whitespace-only saved value', () => {
      localStorage.setItem(STORAGE_KEY, '   ');

      const result = initializeSearchValue();

      expect(result).toBe('   ');
    });
  });

  describe('Integration tests - save and initialize workflow', () => {
    it('should save and then retrieve the same value', () => {
      const searchTerm = '  donald duck  ';

      saveSearchValue(searchTerm);
      const retrieved = initializeSearchValue();

      expect(retrieved).toBe('donald duck');
    });

    it('should handle multiple save and initialize operations', () => {
      saveSearchValue('first');
      expect(initializeSearchValue()).toBe('first');

      saveSearchValue('second');
      expect(initializeSearchValue()).toBe('second');

      saveSearchValue('  third  ');
      expect(initializeSearchValue()).toBe('third');
    });

    it('should preserve trimmed value when saving and initializing', () => {
      const withSpaces = '  minnie mouse  ';

      saveSearchValue(withSpaces);
      const retrieved = initializeSearchValue();

      expect(retrieved).toBe('minnie mouse');
      expect(retrieved).not.toBe(withSpaces);
    });
  });
});

describe('localStorage helpers - additional coverage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('trimValue edge cases', () => {
    it('should handle numbers as input', () => {
      expect(trimValue(' 123 ')).toBe('123');
    });

    it('should handle tabs and newlines only', () => {
      expect(trimValue('\t\n\r')).toBe('');
    });

    it('should handle mixed whitespace characters', () => {
      expect(trimValue(' \t\n\r hello \t\n\r ')).toBe('hello');
    });
  });

  describe('saveSearchValue - error handling', () => {
    it('should throw error when localStorage is not available', () => {
      const originalLocalStorage = globalThis.localStorage;

      delete globalThis.localStorage;

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => saveSearchValue('test')).toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
      globalThis.localStorage = originalLocalStorage;
      consoleErrorSpy.mockRestore();
    });
  });

  describe('initializeSearchValue - error handling', () => {
    it('should handle localStorage being null', () => {
      const originalLocalStorage = globalThis.localStorage;

      globalThis.localStorage = null;

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => initializeSearchValue()).toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      globalThis.localStorage = originalLocalStorage;
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveSearchValue - edge cases with trimValue', () => {
    it('should save trimmed value even if original had only spaces', () => {
      saveSearchValue('     ');

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe('');
    });

    it('should preserve case sensitivity', () => {
      saveSearchValue('MiCkEy MoUsE');

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe('MiCkEy MoUsE');
    });
  });

  describe('initializeSearchValue - return value scenarios', () => {
    it('should return saved value even if it is just whitespace', () => {
      localStorage.setItem(STORAGE_KEY, '   ');

      const result = initializeSearchValue();
      expect(result).toBe('   ');
    });

    it('should handle numeric string saved in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, '12345');

      const result = initializeSearchValue();
      expect(result).toBe('12345');
    });

    it('should handle special characters saved in localStorage', () => {
      const specialValue = '!@#$%^&*()_+{}[]|\\:;"\'<>,.?/~`';
      localStorage.setItem(STORAGE_KEY, specialValue);

      const result = initializeSearchValue();
      expect(result).toBe(specialValue);
    });
  });

  describe('Edge cases with empty or falsy values', () => {
    it('should handle empty string in trimValue', () => {
      expect(trimValue('')).toBe('');
    });
  });

  describe('Performance and large data', () => {
    it('should handle very large string (10KB)', () => {
      const largeString = 'x'.repeat(10 * 1024);

      saveSearchValue(largeString);

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe(largeString);
    });

    it('should handle unicode characters correctly', () => {
      const unicodeString = '🌟 Hello 世界 🌍';

      saveSearchValue(unicodeString);

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe(unicodeString);
    });

    it('should handle emoji characters', () => {
      const emojiString = '😀😃😄😁😆😅😂🤣';

      saveSearchValue(emojiString);

      const savedValue = localStorage.getItem(STORAGE_KEY);
      expect(savedValue).toBe(emojiString);
    });
  });

  describe('Consecutive operations', () => {
    it('should handle many consecutive saves', () => {
      for (let i = 0; i < 100; i++) {
        saveSearchValue(`value ${i}`);
        expect(localStorage.getItem(STORAGE_KEY)).toBe(`value ${i}`);
      }
    });

    it('should handle save and initialize interleaved', () => {
      saveSearchValue('first');
      expect(initializeSearchValue()).toBe('first');

      saveSearchValue('  second  ');
      expect(initializeSearchValue()).toBe('second');

      saveSearchValue('');
      expect(initializeSearchValue()).toBe('');

      saveSearchValue('   ');
      expect(initializeSearchValue()).toBe('');
    });
  });
});
