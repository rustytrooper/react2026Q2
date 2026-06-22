import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

const mockGetSelectedCount = vi.fn();
const mockClearSelection = vi.fn();
const mockGetSelectedCharacters = vi.fn();

vi.mock('../../store/useDownloadData', () => ({
  default: () => ({
    getSelectedCount: mockGetSelectedCount,
    clearSelection: mockClearSelection,
    getSelectedCharacters: mockGetSelectedCharacters,
  }),
}));

vi.mock('../../helpers/converToCsv', () => ({
  downloadAsCsv: vi.fn(),
}));

import { downloadAsCsv } from '../../helpers/converToCsv';
import SelectionFlyout from './FlyOut';

describe('SelectionFlyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSelectedCount.mockReturnValue(3);
    mockGetSelectedCharacters.mockReturnValue([
      { _id: 1, name: 'Mickey Mouse', films: [], tvShows: [], videoGames: [] },
      { _id: 2, name: 'Donald Duck', films: [], tvShows: [], videoGames: [] },
      { _id: 3, name: 'Goofy', films: [], tvShows: [], videoGames: [] },
    ]);
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  describe('Visibility', () => {
    it('should not render when selectedCount is 0', () => {
      mockGetSelectedCount.mockReturnValue(0);

      render(<SelectionFlyout />);

      expect(
        screen.queryByText('Amount of chosen characters:')
      ).not.toBeInTheDocument();
    });
  });

  describe('Download functionality', () => {
    it('should not call downloadAsCsv when no characters are selected', async () => {
      mockGetSelectedCount.mockReturnValue(0);
      mockGetSelectedCharacters.mockReturnValue([]);

      render(<SelectionFlyout />);

      expect(screen.queryByText('Download')).not.toBeInTheDocument();
      expect(downloadAsCsv).not.toHaveBeenCalled();
    });
  });
});
