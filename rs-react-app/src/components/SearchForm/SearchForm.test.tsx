import { cleanup, render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import SearchForm from './SearchForm';

describe('Testing search form component', () => {
  afterEach(() => {
    localStorage.clear();
    cleanup();
  });
  it('should render correctly search form component', () => {
    const { getByTestId } = render(
      <SearchForm initialValue="" onSubmit={vi.fn()} />
    );

    expect(getByTestId('searchForm')).toBeInTheDocument();
    expect(getByTestId('formInput')).toBeInTheDocument();
    expect(getByTestId('formButton')).toBeInTheDocument();
  });

  it('should submit with correct value', async () => {
    const testUserInput = 'begin';
    const user = userEvent.setup();

    const mockOnSubmit = vi.fn();

    const { getByTestId } = render(
      <SearchForm initialValue="" onSubmit={mockOnSubmit} />
    );

    await user.type(getByTestId('formInput'), testUserInput);
    await user.click(getByTestId('formButton'));

    await waitFor(() => {
      expect(getByTestId('formInput')).toHaveValue(testUserInput);
    });
    expect(getByTestId('formInput')).toHaveValue(testUserInput);
    expect(mockOnSubmit).toHaveBeenCalledWith(testUserInput);
  });

  it('should have empty input when nothing is saved in local storage', () => {
    const { getByTestId } = render(
      <SearchForm initialValue="" onSubmit={vi.fn()} />
    );

    expect(getByTestId('formInput')).toHaveValue('');
  });
});
