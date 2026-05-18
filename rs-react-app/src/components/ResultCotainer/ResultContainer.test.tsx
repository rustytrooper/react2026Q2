import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import ResultContainer from './ResultContainer';
import type { DisneyApiResponse } from '../../types/charachterType';
import {
  mockCharactersResponse,
  mockAchilles,
  mockAuntGertie,
  mockAvatarSingh,
  mockAvemetrus,
} from '../../mocks/mockData';

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
  }: {
    imageUrl: string;
    name: string;
    films: string[];
    tvShows: string[];
  }) => (
    <div data-testid="card" data-name={name}>
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

const server = setupServer();

describe('ResultContainer', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
    cleanup();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
    mockLocation.search = '';
    cleanup();
  });

  afterAll(() => {
    (server.close(), cleanup());
  });

  describe('Basic rendering', () => {
    it('should render nothing when characters is null', () => {
      render(
        <BrowserRouter>
          <ResultContainer characters={null} />
        </BrowserRouter>
      );

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

      render(
        <BrowserRouter>
          <ResultContainer characters={emptyResponse} />
        </BrowserRouter>
      );

      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('should render cards from mockCharactersResponse', () => {
      render(
        <BrowserRouter>
          <ResultContainer
            characters={mockCharactersResponse as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(mockCharactersResponse.data.length);

      mockCharactersResponse.data.forEach((character) => {
        expect(screen.getByText(character.name)).toBeInTheDocument();
      });
    });
  });

  describe('Character data display', () => {
    it('should display character name correctly', () => {
      render(
        <BrowserRouter>
          <ResultContainer
            characters={mockCharactersResponse as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const names = screen.getAllByTestId('card-name');
      expect(names[0]).toHaveTextContent(mockCharactersResponse.data[0].name);
    });

    it('should display character image correctly', () => {
      render(
        <BrowserRouter>
          <ResultContainer
            characters={mockCharactersResponse as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const images = screen.getAllByTestId('card-image');
      expect(images[0]).toHaveAttribute(
        'src',
        mockCharactersResponse.data[0].imageUrl
      );
    });

    it('should display films when available', () => {
      const characterWithFilms = {
        info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
        data: [mockAuntGertie.data],
      };

      render(
        <BrowserRouter>
          <ResultContainer
            characters={characterWithFilms as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const expectedFilms = mockAuntGertie.data.films.join(', ');
      expect(screen.getByTestId('card-films')).toHaveTextContent(
        `Films: ${expectedFilms}`
      );
    });

    it('should display "None" when films array is empty', () => {
      const characterWithoutFilms = {
        info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
        data: [mockAvatarSingh.data],
      };

      render(
        <BrowserRouter>
          <ResultContainer
            characters={characterWithoutFilms as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('card-films')).toHaveTextContent('Films: None');
    });

    it('should display TV shows when available', () => {
      const characterWithTvShows = {
        info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
        data: [mockAvemetrus.data],
      };

      render(
        <BrowserRouter>
          <ResultContainer
            characters={characterWithTvShows as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const expectedTvShows = mockAvemetrus.data.tvShows.join(', ');
      expect(screen.getByTestId('card-tvshows')).toHaveTextContent(
        `TV Shows: ${expectedTvShows}`
      );
    });

    it('should display "None" when tvShows array is empty', () => {
      const characterWithoutTvShows = {
        info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
        data: [mockAvatarSingh.data],
      };

      render(
        <BrowserRouter>
          <ResultContainer
            characters={characterWithoutTvShows as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('card-tvshows')).toHaveTextContent(
        'TV Shows: None'
      );
    });

    it('should handle multiple Achilles characters correctly', () => {
      render(
        <BrowserRouter>
          <ResultContainer characters={mockAchilles as DisneyApiResponse} />
        </BrowserRouter>
      );

      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(2);

      const achillesElements = screen.getAllByText('Achilles');
      expect(achillesElements).toHaveLength(2);
    });
  });

  describe('Navigation', () => {
    it('should navigate to character details when card is clicked', async () => {
      render(
        <BrowserRouter>
          <ResultContainer
            characters={mockCharactersResponse as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const firstCard = screen.getAllByTestId('card')[0];
      await userEvent.click(firstCard);

      const characterId = mockCharactersResponse.data[0]._id;
      expect(mockNavigate).toHaveBeenCalledWith(`character/${characterId}`);
    });

    it('should preserve search parameters when navigating', async () => {
      mockLocation.search = '?page=2&name=achilles';

      render(
        <BrowserRouter>
          <ResultContainer
            characters={mockCharactersResponse as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const firstCard = screen.getAllByTestId('card')[0];
      await userEvent.click(firstCard);

      const characterId = mockCharactersResponse.data[0]._id;
      expect(mockNavigate).toHaveBeenCalledWith(
        `character/${characterId}?page=2&name=achilles`
      );
    });

    it('should navigate with empty search when location.search is empty', async () => {
      mockLocation.search = '';

      render(
        <BrowserRouter>
          <ResultContainer
            characters={mockCharactersResponse as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const firstCard = screen.getAllByTestId('card')[0];
      await userEvent.click(firstCard);

      const characterId = mockCharactersResponse.data[0]._id;
      expect(mockNavigate).toHaveBeenCalledWith(`character/${characterId}`);
    });

    it('should navigate correctly for different characters', async () => {
      render(
        <BrowserRouter>
          <ResultContainer
            characters={mockCharactersResponse as DisneyApiResponse}
          />
        </BrowserRouter>
      );

      const cards = screen.getAllByTestId('card');

      await userEvent.click(cards[1]);
      const secondCharacterId = mockCharactersResponse.data[1]._id;
      expect(mockNavigate).toHaveBeenCalledWith(
        `character/${secondCharacterId}`
      );
    });
  });

  describe('CSS classes and styling', () => {
    it('should have correct grid layout classes', () => {
      render(
        <BrowserRouter>
          <ResultContainer
            characters={mockCharactersResponse as DisneyApiResponse}
          />
        </BrowserRouter>
      );

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
            ...mockAvatarSingh.data,
            films: undefined,
            tvShows: undefined,
          },
        ],
      };

      render(
        <BrowserRouter>
          <ResultContainer
            characters={
              characterWithUndefinedFields as unknown as DisneyApiResponse
            }
          />
        </BrowserRouter>
      );
      const filmsElements = screen.getAllByTestId('card-films');
      const tvShowsElements = screen.getAllByTestId('card-tvshows');

      expect(filmsElements[0]).toHaveTextContent('Films: None');
      expect(tvShowsElements[0]).toHaveTextContent('TV Shows: None');
    });

    it('should handle large number of characters efficiently', () => {
      const manyCharacters = {
        info: { count: 50, totalPages: 2, previousPage: null, nextPage: null },
        data: Array(50)
          .fill(null)
          .map((_, i) => ({
            ...mockAvatarSingh.data,
            _id: i,
            name: `Character ${i}`,
          })),
      };

      render(
        <BrowserRouter>
          <ResultContainer characters={manyCharacters as DisneyApiResponse} />
        </BrowserRouter>
      );

      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(50);
      expect(screen.getByText('Character 0')).toBeInTheDocument();
      expect(screen.getByText('Character 49')).toBeInTheDocument();
    });
  });
});

describe('ResultContainer with MSW integration', () => {
  const server = setupServer();

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should work with real MSW data flow', async () => {
    server.use(
      http.get('https://api.disneyapi.dev/character', () => {
        return HttpResponse.json(mockCharactersResponse);
      })
    );

    const response = await fetch('https://api.disneyapi.dev/character');
    const data = await response.json();

    render(
      <BrowserRouter>
        <ResultContainer characters={data as DisneyApiResponse} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('card').length).toBe(3);
    });
  });
});
