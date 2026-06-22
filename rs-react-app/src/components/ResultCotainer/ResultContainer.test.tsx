import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import ResultContainer from './ResultContainer';
import type { DisneyApiResponse, Character } from '../../types/charachterType';

const mockNavigate = vi.fn();
const mockLocation = { search: '' };

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

vi.mock('../../ui-kit/Card', () => ({
  default: ({
    imageUrl,
    name,
    films,
    tvShows,
    id,
  }: {
    imageUrl: string;
    name: string;
    films: string[];
    tvShows: string[];
    id: number;
  }) => (
    <div data-testid="card" data-id={id} data-name={name}>
      <img data-testid="card-image" src={imageUrl} alt={name} />
      <h3 data-testid="card-name">{name}</h3>
      <div data-testid="card-films">
        Films: {films?.length ? films.join(', ') : 'None'}
      </div>
      <div data-testid="card-tvshows">
        TV Shows: {tvShows?.length ? tvShows.join(', ') : 'None'}
      </div>
    </div>
  ),
}));

const renderWithBrowserRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ResultContainer', () => {
  const mockCharacter: Character = {
    _id: 1,

    name: 'Mickey Mouse',
    imageUrl: 'https://example.com/mickey.jpg',
    films: ['Film 1', 'Film 2'],
    tvShows: ['Show 1', 'Show 2'],
    shortFilms: [],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    url: '',
  };

  const mockResponse: DisneyApiResponse = {
    info: {
      count: 3,
      totalPages: 1,
      previousPage: null,
      nextPage: null,
    },
    data: [mockCharacter],
  };

  const mockMultipleResponse: DisneyApiResponse = {
    info: {
      count: 3,
      totalPages: 1,
      previousPage: null,
      nextPage: null,
    },
    data: [
      mockCharacter,
      {
        ...mockCharacter,
        _id: 2,
        name: 'Donald Duck',
        imageUrl: 'https://example.com/donald.jpg',
        films: ['Donald Film'],
        tvShows: [],
      },
      {
        ...mockCharacter,
        _id: 3,

        name: 'Goofy',
        imageUrl: 'https://example.com/goofy.jpg',
        films: [],
        tvShows: ['Goofy Show'],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.search = '';
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
    cleanup();
  });

  describe('Basic rendering', () => {
    it('should render nothing when characters is null', () => {
      renderWithBrowserRouter(<ResultContainer characters={null} />);

      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('should render nothing when characters.data is empty', () => {
      const emptyResponse: DisneyApiResponse = {
        info: {
          count: 0,
          totalPages: 0,
          previousPage: null,
          nextPage: null,
        },
        data: [],
      };

      renderWithBrowserRouter(<ResultContainer characters={emptyResponse} />);

      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('should render cards from response data', () => {
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(1);
      expect(screen.getByText('Mickey Mouse')).toBeInTheDocument();
    });

    it('should render multiple cards when multiple characters provided', () => {
      renderWithBrowserRouter(
        <ResultContainer characters={mockMultipleResponse} />
      );

      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(3);
      expect(screen.getByText('Mickey Mouse')).toBeInTheDocument();
      expect(screen.getByText('Donald Duck')).toBeInTheDocument();
      expect(screen.getByText('Goofy')).toBeInTheDocument();
    });
  });

  describe('Character data display', () => {
    it('should display character name correctly', () => {
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const name = screen.getByTestId('card-name');
      expect(name).toHaveTextContent('Mickey Mouse');
    });

    it('should display character image correctly', () => {
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const image = screen.getByTestId('card-image');
      expect(image).toHaveAttribute('src', 'https://example.com/mickey.jpg');
      expect(image).toHaveAttribute('alt', 'Mickey Mouse');
    });

    it('should display films when available', () => {
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      expect(screen.getByTestId('card-films')).toHaveTextContent(
        'Films: Film 1, Film 2'
      );
    });

    it('should display "None" when films array is empty', () => {
      const characterWithNoFilms: DisneyApiResponse = {
        ...mockResponse,
        data: [{ ...mockCharacter, films: [] }],
      };

      renderWithBrowserRouter(
        <ResultContainer characters={characterWithNoFilms} />
      );

      expect(screen.getByTestId('card-films')).toHaveTextContent('Films: None');
    });

    it('should display TV shows when available', () => {
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      expect(screen.getByTestId('card-tvshows')).toHaveTextContent(
        'TV Shows: Show 1, Show 2'
      );
    });

    it('should display "None" when tvShows array is empty', () => {
      const characterWithNoTvShows: DisneyApiResponse = {
        ...mockResponse,
        data: [{ ...mockCharacter, tvShows: [] }],
      };

      renderWithBrowserRouter(
        <ResultContainer characters={characterWithNoTvShows} />
      );

      expect(screen.getByTestId('card-tvshows')).toHaveTextContent(
        'TV Shows: None'
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate to character details when card is clicked', async () => {
      const user = userEvent.setup();
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const card = screen.getByTestId('card');
      await user.click(card);

      expect(mockNavigate).toHaveBeenCalledWith('character/1');
    });

    it('should preserve search parameters when navigating', async () => {
      mockLocation.search = '?page=2&query=test';
      const user = userEvent.setup();

      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const card = screen.getByTestId('card');
      await user.click(card);

      expect(mockNavigate).toHaveBeenCalledWith(
        'character/1?page=2&query=test'
      );
    });

    it('should navigate with empty search when location.search is empty', async () => {
      mockLocation.search = '';
      const user = userEvent.setup();

      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const card = screen.getByTestId('card');
      await user.click(card);

      expect(mockNavigate).toHaveBeenCalledWith('character/1');
    });

    it('should navigate correctly for different characters', async () => {
      const user = userEvent.setup();
      renderWithBrowserRouter(
        <ResultContainer characters={mockMultipleResponse} />
      );

      const cards = screen.getAllByTestId('card');
      const secondCard = cards[1];
      await user.click(secondCard);

      expect(mockNavigate).toHaveBeenCalledWith('character/2');
    });
  });

  describe('CSS classes', () => {
    it('should have correct grid layout classes', () => {
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const grid = document.querySelector('ul');
      expect(grid).toHaveClass('grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('sm:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
      expect(grid).toHaveClass('gap-y-4');
      expect(grid).toHaveClass('gap-x-2');
      expect(grid).toHaveClass('mt-5');
      expect(grid).toHaveClass('mx-auto');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined films and tvShows gracefully', () => {
      const characterWithUndefinedFields = {
        info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
        data: [
          {
            ...mockCharacter,
            films: undefined as unknown as string[],
            tvShows: undefined as unknown as string[],
          },
        ],
      };

      renderWithBrowserRouter(
        <ResultContainer
          characters={characterWithUndefinedFields as DisneyApiResponse}
        />
      );

      expect(screen.getByTestId('card-films')).toHaveTextContent('Films: None');
      expect(screen.getByTestId('card-tvshows')).toHaveTextContent(
        'TV Shows: None'
      );
    });

    it('should pass id prop to Card component', () => {
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('data-id', '1');
    });

    it('should pass name as data attribute', () => {
      renderWithBrowserRouter(<ResultContainer characters={mockResponse} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('data-name', 'Mickey Mouse');
    });
  });
});
