import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { CharacterDetail } from './CharacterDetail';
import { useCharacterDetail } from '../../hooks/useFetchCharacters/useCharactersDetail';

vi.mock('../../hooks/useFetchCharacters/useCharactersDetail', () => ({
  useCharacterDetail: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockLocation = { search: '' };

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useParams: () => ({ id: '367' }),
  };
});

const mockUseCharacterDetail = useCharacterDetail as unknown as ReturnType<
  typeof vi.fn
>;

const renderWithBrowserRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CharacterDetail', () => {
  const mockCharacter = {
    _id: 367,
    name: 'Aunt Gertie',
    imageUrl: 'https://example.com/image.jpg',
    films: ["Mickey's Once Upon a Christmas"],
    tvShows: [],
    shortFilms: [],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    url: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.search = '';
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
  });

  describe('Loading state', () => {
    it('should show refreshing indicator when isRefetching is true', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: true,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(screen.getByText('Refreshing...')).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should show error message when error occurs', () => {
      const error = new Error('Failed to fetch character');
      mockUseCharacterDetail.mockReturnValue({
        data: null,
        isLoading: false,
        isRefetching: false,
        error,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(
        screen.getByText('Error: Failed to fetch character')
      ).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should call refetch when Try Again button is clicked', async () => {
      const mockRefetch = vi.fn();
      const user = userEvent.setup();
      const error = new Error('Failed to fetch character');

      mockUseCharacterDetail.mockReturnValue({
        data: null,
        isLoading: false,
        isRefetching: false,
        error,
        refetch: mockRefetch,
      });

      renderWithBrowserRouter(<CharacterDetail />);

      const tryAgainButton = screen.getByText('Try Again');
      await user.click(tryAgainButton);

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Character data display', () => {
    it('should display character name when loaded successfully', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(screen.getByText('Aunt Gertie')).toBeInTheDocument();
    });

    it('should display default name when character name is empty', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: { ...mockCharacter, name: '' },
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(screen.getByText('CHARACTER!')).toBeInTheDocument();
    });

    it('should display character image when imageUrl exists', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('alt', 'Aunt Gertie');
    });

    it('should not display image when imageUrl is missing', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: { ...mockCharacter, imageUrl: null },
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should display films when available', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(
        screen.getByText("Films: Mickey's Once Upon a Christmas")
      ).toBeInTheDocument();
    });

    it('should display N/A when films array is empty', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: { ...mockCharacter, films: [] },
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(screen.getByText('Films: N/A')).toBeInTheDocument();
    });

    it('should display TV shows when available', () => {
      const characterWithTvShows = {
        ...mockCharacter,
        tvShows: ['Mickey Mouse Clubhouse', 'Mickey Mouse Works'],
      };
      mockUseCharacterDetail.mockReturnValue({
        data: characterWithTvShows,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(
        screen.getByText('TV Shows: Mickey Mouse Clubhouse, Mickey Mouse Works')
      ).toBeInTheDocument();
    });

    it('should display N/A when tvShows array is empty', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: { ...mockCharacter, tvShows: [] },
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      expect(screen.getByText('TV Shows: N/A')).toBeInTheDocument();
    });
  });

  describe('Refresh functionality', () => {
    it('should display refresh button', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      const refreshButton = screen.getByText('🔄 Refresh');
      expect(refreshButton).toBeInTheDocument();
    });

    it('should call refetch when refresh button is clicked', async () => {
      const mockRefetch = vi.fn();
      const user = userEvent.setup();

      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithBrowserRouter(<CharacterDetail />);

      const refreshButton = screen.getByText('🔄 Refresh');
      await user.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate back when close button is clicked', async () => {
      const user = userEvent.setup();
      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      const closeButton = screen.getByText('✕');
      await user.click(closeButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('CSS classes', () => {
    it('should have correct overlay classes', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      const overlay = document.querySelector('.character-detail-overlay');
      const content = document.querySelector('.character-detail-content');

      expect(overlay).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it('should have correct refresh button classes', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderWithBrowserRouter(<CharacterDetail />);

      const refreshButton = screen.getByText('🔄 Refresh');
      expect(refreshButton).toHaveClass('bg-purple-400');
      expect(refreshButton).toHaveClass('rounded-xl');
      expect(refreshButton).toHaveClass('hover:bg-purple-300');
      expect(refreshButton).toHaveClass('dark:bg-purple-950');
      expect(refreshButton).toHaveClass('dark:hover:bg-purple-800');
    });
  });

  describe('Edge cases', () => {
    it('should return null when character is null', () => {
      mockUseCharacterDetail.mockReturnValue({
        data: null,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { container } = renderWithBrowserRouter(<CharacterDetail />);

      expect(
        container.querySelector('.character-detail-overlay')
      ).not.toBeInTheDocument();
    });

    it('should handle missing id parameter', () => {
      vi.mocked(vi.importActual('react-router')).then((actual) => {
        return {
          ...actual,
          useParams: () => ({ id: undefined }),
        };
      });

      mockUseCharacterDetail.mockReturnValue({
        data: null,
        isLoading: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { container } = renderWithBrowserRouter(<CharacterDetail />);

      expect(
        container.querySelector('.character-detail-overlay')
      ).not.toBeInTheDocument();
    });
  });
});
