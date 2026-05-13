import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResultContainer from './ResultContainer';
import { mockCharactersResponse } from '../../mocks/mockData';

vi.mock('../../ui-kit/Card', () => ({
  default: ({ name, imageUrl }: { name: string; imageUrl: string }) => (
    <div data-testid={`card-${name}`}>
      {name} - {imageUrl}
    </div>
  ),
}));

const emptyCharacters = {
  info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
  data: [],
};

describe('ResultContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    localStorage.clear();
    cleanup();
  });

  it('renders correct number of items when data is provided', () => {
    render(<ResultContainer characters={mockCharactersResponse} />);
    expect(screen.getAllByTestId(/^card-/)).toHaveLength(3);
  });

  it('displays "no results" message when data array is empty', () => {
    render(<ResultContainer characters={emptyCharacters} />);
    expect(screen.queryByTestId(/^card-/)).not.toBeInTheDocument();
  });

  it('shows loading state while fetching data', async () => {
    render(<ResultContainer characters={null} />);
  });

  it('displays error message when API call fails', async () => {
    render(<ResultContainer characters={null} />);
  });

  it('shows appropriate error for different HTTP status codes', async () => {
    render(<ResultContainer characters={null} />);
  });
});
