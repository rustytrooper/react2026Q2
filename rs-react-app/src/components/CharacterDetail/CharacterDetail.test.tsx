import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { CharacterDetail } from './CharacterDetail';

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

vi.mock('../../helpers/fetchData', () => ({
  fetchCharacterById: vi.fn(),
}));

import { fetchCharacterById } from '../../helpers/fetchData';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CharacterDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.search = '';
    cleanup();
  });
  afterAll(() => {
    cleanup();
  });

  it('should show loading state initially', () => {
    (fetchCharacterById as Mock).mockImplementation(
      () => new Promise(() => {})
    );
    renderWithRouter(<CharacterDetail />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error when fetch fails', async () => {
    (fetchCharacterById as Mock).mockRejectedValue(new Error('API Error'));
    renderWithRouter(<CharacterDetail />);

    await waitFor(() => {
      expect(screen.getByText('Error loading character')).toBeInTheDocument();
    });
  });

  it('should display character data when loaded successfully', async () => {
    const mockCharacter = {
      _id: 367,
      name: 'Aunt Gertie',
      imageUrl: 'https://example.com/image.jpg',
      films: ["Mickey's Once Upon a Christmas"],
      tvShows: [],
    };
    (fetchCharacterById as Mock).mockResolvedValue(mockCharacter);

    renderWithRouter(<CharacterDetail />);

    await waitFor(() => {
      expect(screen.getByText('Aunt Gertie')).toBeInTheDocument();
      expect(
        screen.getByText("Films: Mickey's Once Upon a Christmas")
      ).toBeInTheDocument();
      expect(screen.getByText('TV Shows: N/A')).toBeInTheDocument();
    });
  });

  it('should return null when response has no data', async () => {
    (fetchCharacterById as Mock).mockResolvedValue(null);
    const { container } = renderWithRouter(<CharacterDetail />);

    await waitFor(() => {
      expect(
        container.querySelector('.character-detail-overlay')
      ).not.toBeInTheDocument();
    });
  });

  it('should navigate back on close button click', async () => {
    const mockCharacter = {
      _id: 367,
      name: 'Aunt Gertie',
      imageUrl: 'https://example.com/image.jpg',
      films: [],
      tvShows: [],
    };
    (fetchCharacterById as Mock).mockResolvedValue(mockCharacter);
    mockLocation.search = '?page=2';

    renderWithRouter(<CharacterDetail />);

    await waitFor(() => {
      expect(screen.getByText('Aunt Gertie')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕');
    await userEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/?page=2');
  });
});
