import type { Character } from '../types/charachterType';

export const convertToCSV = (characters: Character[]): string => {
  if (!characters.length) return '';

  const headers = [
    'ID',
    'Name',
    'Films Count',
    'Films',
    'TV Shows Count',
    'TV Shows',
    'Video Games Count',
    'Video Games',
    'Image URL',
    'URL',
  ];

  const csvRows = [headers.join(',')];

  for (const character of characters) {
    const row = [
      character._id || '',
      escapeCSVField(character.name || ''),
      character.films?.length || 0,
      escapeCSVField(character.films?.join('; ') || ''),
      character.tvShows?.length || 0,
      escapeCSVField(character.tvShows?.join('; ') || ''),
      character.videoGames?.length || 0,
      escapeCSVField(character.videoGames?.join('; ') || ''),
      character.imageUrl || '',
      character.url || '',
    ];

    csvRows.push(row.join(','));
  }

  return csvRows.join('\n');
};

const escapeCSVField = (field: string): string => {
  if (field === undefined || field === null) return '';

  let stringField = String(field);

  if (
    stringField.includes(',') ||
    stringField.includes('"') ||
    stringField.includes('\n')
  ) {
    stringField = stringField.replace(/"/g, '""');
    stringField = `"${stringField}"`;
  }

  return stringField;
};

export const downloadAsCsv = (
  selectedCharacters: Character[],
  selectedCount: number
) => {
  const csvData = convertToCSV(selectedCharacters);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `disney-characters-${selectedCount}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
