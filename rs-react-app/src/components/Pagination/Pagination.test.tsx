import { describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    cleanup();
  });

  describe('Basic rendering', () => {
    it('should render Previous and Next buttons', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should render page numbers', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Button states', () => {
    it('should disable Previous button on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });

    it('should disable Next button on last page', () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('should enable Previous button when not on first page', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByText('Previous');
      expect(prevButton).not.toBeDisabled();
    });

    it('should enable Next button when not on last page', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Page number display logic', () => {
    it('should show all pages when totalPages <= 5', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    it('should show pages with ellipsis at the end when currentPage <= 3', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should show pages with ellipsis at the beginning when currentPage >= totalPages - 2', () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    describe('Active page styling', () => {
      it('should not highlight non-current pages', () => {
        render(
          <Pagination
            currentPage={3}
            totalPages={10}
            onPageChange={mockOnPageChange}
          />
        );

        const pageButton = screen.getByText('2');
        expect(pageButton).not.toHaveClass('bg-purple-400');
        expect(pageButton).not.toHaveClass('text-white');
      });
    });

    describe('Ellipsis button', () => {
      it('should disable ellipsis button', () => {
        render(
          <Pagination
            currentPage={5}
            totalPages={10}
            onPageChange={mockOnPageChange}
          />
        );

        const ellipsisButtons = screen.getAllByText('...');
        ellipsisButtons.forEach((button) => {
          expect(button).toBeDisabled();
        });
      });
    });

    describe('Navigation clicks', () => {
      it('should call onPageChange with next page when Next button is clicked', async () => {
        render(
          <Pagination
            currentPage={3}
            totalPages={10}
            onPageChange={mockOnPageChange}
          />
        );

        const nextButton = screen.getByText('Next');
        await userEvent.click(nextButton);

        expect(mockOnPageChange).toHaveBeenCalledWith(4);
        expect(mockOnPageChange).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onPageChange when ellipsis is clicked', async () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const ellipsisButtons = screen.getAllByText('...');
      await userEvent.click(ellipsisButtons[0]);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it('should not call onPageChange when Previous is clicked on first page', async () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByText('Previous');
      await userEvent.click(prevButton);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it('should not call onPageChange when Next is clicked on last page', async () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next');
      await userEvent.click(nextButton);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe('CSS classes', () => {
    it('should have correct container classes', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const container = document.querySelector('.flex');
      expect(container).toHaveClass('justify-center');
      expect(container).toHaveClass('gap-2');
      expect(container).toHaveClass('mt-8');
    });

    it('should have correct button base classes', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const buttons = document.querySelectorAll('button');
      buttons.forEach((button) => {
        if (button.textContent !== '...') {
          expect(button).toHaveClass('px-4');
          expect(button).toHaveClass('py-2');
          expect(button).toHaveClass('border');
          expect(button).toHaveClass('cursor-pointer');
          expect(button).toHaveClass('rounded');
        }
      });
    });
  });

  describe('Edge cases', () => {
    it('should work with totalPages = 1', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeDisabled();
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('should work with totalPages = 0', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('should handle currentPage greater than totalPages gracefully', () => {
      render(
        <Pagination
          currentPage={15}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should handle negative currentPage', () => {
      render(
        <Pagination
          currentPage={-1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Keyboard and accessibility', () => {
    it('should have buttons with proper disabled attribute', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByText('Previous');
      expect(prevButton).toHaveAttribute('disabled');

      const nextButton = screen.getByText('Next');
      expect(nextButton).not.toHaveAttribute('disabled');
    });
  });
});
