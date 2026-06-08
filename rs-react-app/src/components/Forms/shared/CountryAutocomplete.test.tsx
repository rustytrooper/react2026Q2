// CountryAutocomplete.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { CountryAutocomplete } from './CountryAutocomplete';

describe('CountryAutocomplete', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  describe('Rendering', () => {
    it('should render input with correct value', () => {
      render(
        <CountryAutocomplete value="United States" onChange={mockOnChange} />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('United States');
    });

    it('should render input with default id and name', () => {
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'country');
      expect(input).toHaveAttribute('name', 'country');
    });

    it('should render input with custom id and name', () => {
      render(
        <CountryAutocomplete
          value=""
          onChange={mockOnChange}
          id="custom-country"
          name="custom-country"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-country');
      expect(input).toHaveAttribute('name', 'custom-country');
    });

    it('should have placeholder text', () => {
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText('Type to search country...');
      expect(input).toBeInTheDocument();
    });

    it('should have autocomplete off', () => {
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autocomplete', 'off');
    });
  });

  describe('Error state', () => {
    it('should show error border when error prop is provided', () => {
      render(
        <CountryAutocomplete
          value=""
          onChange={mockOnChange}
          error="Country is required"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('should not show error border when no error', () => {
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-gray-300');
      expect(input).not.toHaveClass('border-red-500');
    });
  });

  // describe('Dropdown behavior', () => {
  // it('should show dropdown on input focus', async () => {
  //   const user = userEvent.setup();
  //   render(
  //     <CountryAutocomplete
  //       value=""
  //       onChange={mockOnChange}
  //     />
  //   );

  //   const input = screen.getByRole('textbox');
  //   await user.click(input);

  //   const dropdown = screen.getByRole('listbox');
  //   expect(dropdown).toBeInTheDocument();
  // });

  // it('should show dropdown when typing', async () => {
  //   const user = userEvent.setup();
  //   render(
  //     <CountryAutocomplete
  //       value=""
  //       onChange={mockOnChange}
  //     />
  //   );

  //   const input = screen.getByRole('textbox');
  //   await user.type(input, 'U');

  //   const dropdown = screen.getByRole('listbox');
  //   expect(dropdown).toBeInTheDocument();
  // });

  // it('should close dropdown when clicking outside', async () => {
  //   const user = userEvent.setup();
  //   render(
  //     <div>
  //       <div data-testid="outside">Outside</div>
  //       <CountryAutocomplete
  //         value=""
  //         onChange={mockOnChange}
  //       />
  //     </div>
  //   );

  //   const input = screen.getByRole('textbox');
  //   await user.click(input);

  //   expect(screen.getByRole('listbox')).toBeInTheDocument();

  //   const outside = screen.getByTestId('outside');
  //   await user.click(outside);

  //   await waitFor(() => {
  //     expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  //   });
  // });
  // });

  describe('Filtering', () => {
    // it('should filter countries based on search term', async () => {
    //   const user = userEvent.setup();
    //   render(
    //     <CountryAutocomplete
    //       value=""
    //       onChange={mockOnChange}
    //     />
    //   );

    //   const input = screen.getByRole('textbox');
    //   await user.type(input, 'United');

    //   const dropdown = screen.getByRole('listbox');
    //   const listItems = dropdown.querySelectorAll('li');

    //   expect(listItems.length).toBeGreaterThan(0);
    //   expect(screen.getByText('United States')).toBeInTheDocument();
    // });

    it('should show "No countries found" when no matches', async () => {
      const user = userEvent.setup();
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'NonexistentCountryXYZ');

      expect(screen.getByText('No countries found')).toBeInTheDocument();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should be case insensitive', async () => {
      const user = userEvent.setup();
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'ukr');

      expect(screen.getByText('Ukraine')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should call onChange with selected country', async () => {
      const user = userEvent.setup();
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      const countryOption = screen.getByText('United States');
      await user.click(countryOption);

      expect(mockOnChange).toHaveBeenCalledWith('United States');
    });

    it('should close dropdown after selection', async () => {
      const user = userEvent.setup();
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      const countryOption = screen.getByText('United States');
      await user.click(countryOption);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should update input value after selection', async () => {
      const user = userEvent.setup();
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      const countryOption = screen.getByText('United States');
      await user.click(countryOption);

      expect(input).toHaveValue('United States');
    });
  });

  describe('Controlled component', () => {
    it('should update input when value prop changes', async () => {
      const { rerender } = render(
        <CountryAutocomplete value="" onChange={mockOnChange} />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');

      rerender(<CountryAutocomplete value="Ukraine" onChange={mockOnChange} />);

      expect(input).toHaveValue('Ukraine');
    });
  });

  describe('Keyboard interactions', () => {
    it('should handle onBlur callback', async () => {
      const user = userEvent.setup();
      render(
        <CountryAutocomplete
          value=""
          onChange={mockOnChange}
          onBlur={mockOnBlur}
        />
      );

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  describe('CSS classes', () => {
    it('should have correct input classes', () => {
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(
        'w-full',
        'px-3',
        'py-2',
        'border',
        'rounded-md',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-blue-500'
      );
    });

    // it('should have correct dropdown classes', async () => {
    //   const user = userEvent.setup();
    //   render(
    //     <CountryAutocomplete
    //       value=""
    //       onChange={mockOnChange}
    //     />
    //   );

    //   const input = screen.getByRole('textbox');
    //   await user.click(input);

    //   const dropdown = screen.getByRole('listbox');
    //   expect(dropdown).toHaveClass('absolute', 'z-10', 'w-full', 'mt-1', 'bg-white', 'border', 'border-gray-300', 'rounded-md', 'shadow-lg', 'max-h-48', 'overflow-auto');
    // });

    it('should have correct list item classes', async () => {
      const user = userEvent.setup();
      render(<CountryAutocomplete value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      const listItem = screen.getByText('United States');
      expect(listItem).toHaveClass(
        'px-3',
        'py-2',
        'hover:bg-blue-50',
        'cursor-pointer',
        'transition-colors'
      );
    });
  });
});
