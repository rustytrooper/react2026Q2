import { describe, it, expect } from 'vitest';
import type { Character } from '../types/charachterType';
import { convertToCSV } from './converToCsv';

describe('convertToCSV', () => {
  const mockCharacter: Character = {
    _id: 123,
    name: 'Mickey Mouse',
    films: ['Steamboat Willie', 'Fantasia'],
    shortFilms: [],
    tvShows: ['Mickey Mouse Clubhouse', 'Mickey Mouse Works'],
    videoGames: ['Kingdom Hearts', 'Epic Mickey'],
    parkAttractions: [],
    allies: [],
    enemies: [],
    imageUrl: 'https://example.com/mickey.jpg',
    url: 'https://api.disneyapi.dev/characters/123',
  };

  describe('Basic functionality', () => {
    it('should return empty string when characters array is empty', () => {
      const result = convertToCSV([]);
      expect(result).toBe('');
    });

    it('should include headers in CSV output', () => {
      const result = convertToCSV([mockCharacter]);

      expect(result).toContain(
        'ID,Name,Films Count,Films,TV Shows Count,TV Shows,Video Games Count,Video Games,Image URL,URL'
      );
    });

    it('should include character data in CSV output', () => {
      const result = convertToCSV([mockCharacter]);

      expect(result).toContain('123');
      expect(result).toContain('Mickey Mouse');
      expect(result).toContain('Steamboat Willie; Fantasia');
      expect(result).toContain('Mickey Mouse Clubhouse; Mickey Mouse Works');
    });
  });

  describe('Character data conversion', () => {
    it('should correctly count films, tvShows, and videoGames', () => {
      const result = convertToCSV([mockCharacter]);
      const lines = result.split('\n');
      const dataRow = lines[1];

      expect(dataRow).toContain(',2,');
      expect(dataRow).toContain(',2,');
      expect(dataRow).toContain(',2,');
    });

    it('should handle character with empty arrays', () => {
      const characterWithEmptyArrays: Character = {
        ...mockCharacter,
        films: [],
        tvShows: [],
        videoGames: [],
      };

      const result = convertToCSV([characterWithEmptyArrays]);

      expect(result).toContain(',0,');
      expect(result).toContain(',0,');
      expect(result).toContain(',0,');
      expect(result).not.toContain(';');
    });

    it('should handle character with missing optional fields', () => {
      const characterWithMissingFields = {
        _id: 456,
        name: 'Test Character',
        films: undefined,
        tvShows: undefined,
        videoGames: undefined,
      } as unknown as Character;

      const result = convertToCSV([characterWithMissingFields]);

      expect(result).toContain('456');
      expect(result).toContain('Test Character');
      expect(result).toContain(',0,');
      expect(result).toContain(',0,');
      expect(result).toContain(',0,');
    });

    it('should handle character with empty name', () => {
      const characterWithEmptyName: Character = {
        ...mockCharacter,
        name: '',
      };

      const result = convertToCSV([characterWithEmptyName]);

      expect(result).toContain('123');
      expect(result).toContain(',,');
    });

    it('should handle character with missing _id', () => {
      const characterWithoutId = {
        ...mockCharacter,
        _id: undefined,
      } as Character;

      const result = convertToCSV([characterWithoutId]);

      expect(result).toContain(',Mickey Mouse');
    });
  });

  describe('CSV escaping', () => {
    it('should escape commas in fields', () => {
      const characterWithCommas: Character = {
        ...mockCharacter,
        name: 'Mouse, Mickey',
        films: ['Film, with comma'],
      };

      const result = convertToCSV([characterWithCommas]);

      expect(result).toContain('"Mouse, Mickey"');
      expect(result).toContain('"Film, with comma"');
    });

    it('should escape quotes in fields', () => {
      const characterWithQuotes: Character = {
        ...mockCharacter,
        name: 'Mickey "The Mouse" Mouse',
        films: ['Film "quote" example'],
      };

      const result = convertToCSV([characterWithQuotes]);

      expect(result).toContain('"Mickey ""The Mouse"" Mouse"');
      expect(result).toContain('"Film ""quote"" example"');
    });

    it('should escape newlines in fields', () => {
      const characterWithNewlines: Character = {
        ...mockCharacter,
        name: 'Mickey\nMouse',
        films: ['Film\nwith newline'],
      };

      const result = convertToCSV([characterWithNewlines]);

      expect(result).toContain('"Mickey\nMouse"');
      expect(result).toContain('"Film\nwith newline"');
    });

    it('should handle fields with multiple special characters', () => {
      const characterWithSpecialChars: Character = {
        ...mockCharacter,
        name: 'Mouse, Mickey "The Great"',
        films: ['Film, "special" \n characters'],
      };

      const result = convertToCSV([characterWithSpecialChars]);

      expect(result).toContain('"Mouse, Mickey ""The Great"""');
      expect(result).toContain('"Film, ""special"" \n characters"');
    });
  });

  describe('Multiple characters', () => {
    it('should handle multiple characters', () => {
      const character2: Character = {
        ...mockCharacter,
        _id: 456,
        name: 'Donald Duck',
        films: ['Donald Film'],
        tvShows: ['Donald Show'],
        videoGames: ['Donald Game'],
      };

      const result = convertToCSV([mockCharacter, character2]);
      const lines = result.split('\n');

      expect(lines).toHaveLength(3);
      expect(lines[1]).toContain('123');
      expect(lines[1]).toContain('Mickey Mouse');
      expect(lines[2]).toContain('456');
      expect(lines[2]).toContain('Donald Duck');
    });

    it('should handle many characters', () => {
      const characters = Array(10)
        .fill(null)
        .map((_, i) => ({
          ...mockCharacter,
          _id: i,
          name: `Character ${i}`,
        }));

      const result = convertToCSV(characters);
      const lines = result.split('\n');

      expect(lines).toHaveLength(11);
      expect(lines[1]).toContain('Character 0');
      expect(lines[10]).toContain('Character 9');
    });
  });

  describe('escapeCSVField helper', () => {
    it('should handle undefined and null', () => {
      const characterWithUndefined: Character = {
        ...mockCharacter,
        name: undefined as unknown as string,
      };

      const result = convertToCSV([characterWithUndefined]);

      expect(result).toContain(',,');
    });

    it('should wrap field in quotes if it contains comma', () => {
      const characterWithComma: Character = {
        ...mockCharacter,
        name: 'Mickey, Mouse',
      };

      const result = convertToCSV([characterWithComma]);

      expect(result).toContain('"Mickey, Mouse"');
    });

    it('should not wrap field in quotes if no special characters', () => {
      const characterNormal: Character = {
        ...mockCharacter,
        name: 'Mickey Mouse',
      };

      const result = convertToCSV([characterNormal]);

      expect(result).toContain('Mickey Mouse');
      expect(result).not.toContain('"Mickey Mouse"');
    });
  });
});

describe('convertToCSV additional coverage', () => {
  const baseCharacter: Character = {
    _id: 1,
    name: 'Test Character',
    films: ['Film 1'],
    shortFilms: [],
    tvShows: ['Show 1'],
    videoGames: ['Game 1'],
    parkAttractions: [],
    allies: [],
    enemies: [],
    imageUrl: 'https://example.com/image.jpg',
    url: 'https://example.com/url',
  };

  describe('Edge cases with empty strings', () => {
    it('should handle null values for optional fields', () => {
      const characterWithNullFields = {
        ...baseCharacter,
        films: null,
        tvShows: null,
        videoGames: null,
      } as unknown as Character;

      const result = convertToCSV([characterWithNullFields]);

      expect(result).toContain(',0,');
      expect(result).toContain(',0,');
      expect(result).toContain(',0,');
    });
  });

  describe('Single character edge cases', () => {
    it('should handle character with single film', () => {
      const characterWithOneFilm: Character = {
        ...baseCharacter,
        films: ['Only One Film'],
      };

      const result = convertToCSV([characterWithOneFilm]);

      expect(result).toContain('Only One Film');
      expect(result).not.toContain(';');
    });

    it('should handle character with single tv show', () => {
      const characterWithOneShow: Character = {
        ...baseCharacter,
        tvShows: ['Only One Show'],
      };

      const result = convertToCSV([characterWithOneShow]);

      expect(result).toContain('Only One Show');
      expect(result).not.toContain(';');
    });

    it('should handle character with single video game', () => {
      const characterWithOneGame: Character = {
        ...baseCharacter,
        videoGames: ['Only One Game'],
      };

      const result = convertToCSV([characterWithOneGame]);

      expect(result).toContain('Only One Game');
      expect(result).not.toContain(';');
    });
  });

  describe('Special characters in arrays', () => {
    it('should handle semicolons in array items', () => {
      const characterWithSemicolon: Character = {
        ...baseCharacter,
        films: ['Film with; semicolon'],
      };

      const result = convertToCSV([characterWithSemicolon]);

      expect(result).toContain('Film with; semicolon');
    });

    it('should handle multiple special characters in one field', () => {
      const characterWithComplexField: Character = {
        ...baseCharacter,
        name: 'Complex, "Name" with\nnewline',
      };

      const result = convertToCSV([characterWithComplexField]);

      expect(result).toContain('"Complex, ""Name"" with\nnewline"');
    });
  });

  describe('Large values', () => {
    it('should handle very long name', () => {
      const veryLongName = 'A'.repeat(1000);
      const characterWithLongName: Character = {
        ...baseCharacter,
        name: veryLongName,
      };

      const result = convertToCSV([characterWithLongName]);

      expect(result).toContain(veryLongName);
    });

    it('should handle many items in arrays', () => {
      const manyItems = Array(50)
        .fill(null)
        .map((_, i) => `Item ${i}`);
      const characterWithManyItems: Character = {
        ...baseCharacter,
        films: manyItems,
      };

      const result = convertToCSV([characterWithManyItems]);

      expect(result).toContain('Item 0');
      expect(result).toContain('Item 49');
      expect(result).toContain(';');
    });
  });

  describe('CSV structure validation', () => {
    it('should have correct number of columns in header', () => {
      const result = convertToCSV([baseCharacter]);
      const header = result.split('\n')[0];
      const columnCount = header.split(',').length;

      expect(columnCount).toBe(10);
    });

    it('should have same number of columns in data row as header', () => {
      const result = convertToCSV([baseCharacter]);
      const lines = result.split('\n');
      const headerColumns = lines[0].split(',').length;
      const dataColumns = lines[1].split(',').length;

      expect(dataColumns).toBe(headerColumns);
    });
  });
});

describe('Integration: convertToCSV with real-world data', () => {
  it('should handle real Disney API response structure', () => {
    const realWorldCharacter: Character = {
      _id: 308,
      name: 'Winnie the Pooh',
      films: [
        'The Many Adventures of Winnie the Pooh',
        'Winnie the Pooh (2011)',
      ],
      shortFilms: [],
      tvShows: [
        'The New Adventures of Winnie the Pooh',
        'My Friends Tigger & Pooh',
      ],
      videoGames: ['Kingdom Hearts', 'Kingdom Hearts II'],
      parkAttractions: ['The Many Adventures of Winnie the Pooh'],
      allies: ['Tigger', 'Piglet', 'Eeyore'],
      enemies: [],
      imageUrl:
        'https://static.wikia.nocookie.net/disney/images/0/0d/Winnie_the_Pooh.png',
      url: 'https://api.disneyapi.dev/characters/308',
    };

    const result = convertToCSV([realWorldCharacter]);

    expect(result).toContain('Winnie the Pooh');
    expect(result).toContain(
      'The Many Adventures of Winnie the Pooh; Winnie the Pooh (2011)'
    );
    expect(result).toContain(
      'The New Adventures of Winnie the Pooh; My Friends Tigger & Pooh'
    );
    expect(result).toContain('Kingdom Hearts; Kingdom Hearts II');
  });

  it('should handle character with Unicode characters', () => {
    const characterWithUnicode: Character = {
      _id: 999,
      name: 'Élodie Müller',
      films: ['Café & Thé'],
      shortFilms: [],
      tvShows: ['München 慕尼黑'],
      videoGames: [],
      parkAttractions: [],
      allies: [],
      enemies: [],
      imageUrl: '',
      url: '',
    };

    const result = convertToCSV([characterWithUnicode]);

    expect(result).toContain('Élodie Müller');
    expect(result).toContain('Café & Thé');
    expect(result).toContain('München 慕尼黑');
  });
});
