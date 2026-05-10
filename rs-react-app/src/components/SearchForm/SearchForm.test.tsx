import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchForm from './SearchForm';

const mockSaveSearchValue = vi.fn();
const mockTrimValue = vi.fn((val: string) => val.trim());

vi.mock('../../helpers/localStorage', () => ({
  saveSearchValue: mockSaveSearchValue,
  trimValue: mockTrimValue,
}));

const mockOnSearch = vi.fn();
const mockOnSubmit = vi.fn();

describe('SearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTrimValue.mockImplementation((val: string) => val.trim());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders search input and search button', () => {
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays previously saved search term from localStorage on mount', () => {
    mockSaveSearchValue.mockImplementation((val) =>
      localStorage.setItem('searchTerm', val)
    );
    localStorage.setItem('searchTerm', 'test search');
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('textbox')).toHaveValue('test search');
  });

  it('shows empty input when no saved term exists', () => {
    localStorage.removeItem('searchTerm');
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('displays initialValue prop if provided', () => {
    render(
      <SearchForm
        onSearch={mockOnSearch}
        onSubmit={mockOnSubmit}
        initialValue="initial"
      />
    );
    expect(screen.getByRole('textbox')).toHaveValue('initial');
  });

  it('updates input value when user types', async () => {
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: ' new search ' } });
    expect(mockTrimValue).toHaveBeenCalledWith(' new search ');
    expect(mockOnSearch).toHaveBeenCalledWith('new search');
  });

  it('saves search term to localStorage on input change', () => {
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'save this' } });
    expect(mockSaveSearchValue).toHaveBeenCalledWith('save this');
  });

  it('trims whitespace from search input before saving', () => {
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  trimmed   ' } });
    expect(mockSaveSearchValue).toHaveBeenCalledWith('trimmed');
    expect(mockOnSearch).toHaveBeenCalledWith('trimmed');
  });

  it('triggers search callback with correct parameters on submit', () => {
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'submit term' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith('submit term');
  });

  it('retrieves saved search term on component mount via helpers', () => {
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
  });

  it('overwrites existing localStorage value when new search is performed', () => {
    localStorage.setItem('searchTerm', 'old');
    render(<SearchForm onSearch={mockOnSearch} onSubmit={mockOnSubmit} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(mockSaveSearchValue).toHaveBeenCalledWith('new value');
  });
});
