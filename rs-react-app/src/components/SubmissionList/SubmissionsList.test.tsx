import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { SubmissionsList } from './SubmissionsList';
import { useSubmissionStore } from '../../store/submissionStore';
import type { Submission } from '../../schemas/formSchema';

vi.mock('../../store/submissionStore', () => ({
  useSubmissionStore: vi.fn(),
}));

vi.mock('../SubmissionCard/SubmissionCard', () => ({
  SubmissionCard: vi.fn(({ submission, isHighlighted }) => (
    <div
      data-testid="submission-card"
      data-submission-id={submission.id}
      data-highlighted={isHighlighted}
    >
      {submission.data.name}
    </div>
  )),
}));

const mockUseSubmissionStore = useSubmissionStore as unknown as ReturnType<
  typeof vi.fn
>;

describe('SubmissionsList', () => {
  const mockSubmission1: Submission = {
    id: '1',
    submittedAt: '2024-01-15T10:30:00.000Z',
    formType: 'rhf',
    data: {
      name: 'John Doe',
      age: 25,
      email: 'john@example.com',
      gender: 'male',
      termsAccepted: true,
      password: 'password123',
      confirmPassword: 'password123',
      country: 'US',
    },
  };

  const mockSubmission2: Submission = {
    id: '2',
    submittedAt: '2024-01-15T11:30:00.000Z',
    formType: 'uncontrolled',
    data: {
      name: 'Jane Smith',
      age: 30,
      email: 'jane@example.com',
      gender: 'female',
      termsAccepted: true,
      password: 'pass456',
      confirmPassword: 'pass456',
      country: 'UK',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Empty state', () => {
    it('should show empty message when no submissions', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [] };
        return selector(state);
      });

      render(<SubmissionsList />);

      expect(screen.getByText(/✨ No submissions yet/)).toBeInTheDocument();
      expect(screen.queryByTestId('submission-card')).not.toBeInTheDocument();
    });

    it('should have correct empty state classes', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [] };
        return selector(state);
      });

      render(<SubmissionsList />);

      const container = screen
        .getByText(/✨ No submissions yet/)
        .closest('div');
      expect(container).toHaveClass(
        'text-center',
        'py-12',
        'px-4',
        'bg-gray-50',
        'rounded-lg'
      );
    });
  });

  describe('With submissions', () => {
    it('should render submission cards', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [mockSubmission1, mockSubmission2] };
        return selector(state);
      });

      render(<SubmissionsList />);

      const cards = screen.getAllByTestId('submission-card');
      expect(cards).toHaveLength(2);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should pass correct submission data to cards', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [mockSubmission1] };
        return selector(state);
      });

      render(<SubmissionsList />);

      const card = screen.getByTestId('submission-card');
      expect(card).toHaveAttribute('data-submission-id', '1');
    });

    it('should have correct grid layout classes', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [mockSubmission1, mockSubmission2] };
        return selector(state);
      });

      render(<SubmissionsList />);

      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass(
        'gap-4',
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-3'
      );
    });
  });

  describe('Highlight functionality', () => {
    it('should highlight submission when id matches highlightId', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [mockSubmission1, mockSubmission2] };
        return selector(state);
      });

      render(<SubmissionsList highlightId="1" />);

      const cards = screen.getAllByTestId('submission-card');
      const highlightedCard = cards.find(
        (card) => card.getAttribute('data-highlighted') === 'true'
      );
      const normalCard = cards.find(
        (card) => card.getAttribute('data-highlighted') === 'false'
      );

      expect(highlightedCard).toHaveAttribute('data-submission-id', '1');
      expect(normalCard).toHaveAttribute('data-submission-id', '2');
    });

    it('should not highlight any submission when highlightId is null', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [mockSubmission1, mockSubmission2] };
        return selector(state);
      });

      render(<SubmissionsList highlightId={null} />);

      const cards = screen.getAllByTestId('submission-card');
      cards.forEach((card) => {
        expect(card).toHaveAttribute('data-highlighted', 'false');
      });
    });

    it('should not highlight any submission when highlightId is undefined', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [mockSubmission1, mockSubmission2] };
        return selector(state);
      });

      render(<SubmissionsList />);

      const cards = screen.getAllByTestId('submission-card');
      cards.forEach((card) => {
        expect(card).toHaveAttribute('data-highlighted', 'false');
      });
    });

    it('should handle non-existent highlightId', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [mockSubmission1, mockSubmission2] };
        return selector(state);
      });

      render(<SubmissionsList highlightId="999" />);

      const cards = screen.getAllByTestId('submission-card');
      cards.forEach((card) => {
        expect(card).toHaveAttribute('data-highlighted', 'false');
      });
    });
  });

  describe('Multiple submissions', () => {
    it('should render many submissions', () => {
      const manySubmissions = Array(10)
        .fill(null)
        .map((_, i) => ({
          ...mockSubmission1,
          id: String(i),
          data: { ...mockSubmission1.data, name: `User ${i}` },
        }));

      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: manySubmissions };
        return selector(state);
      });

      render(<SubmissionsList />);

      const cards = screen.getAllByTestId('submission-card');
      expect(cards).toHaveLength(10);
      expect(screen.getByText('User 0')).toBeInTheDocument();
      expect(screen.getByText('User 9')).toBeInTheDocument();
    });
  });

  describe('Store integration', () => {
    it('should call useSubmissionStore with correct selector', () => {
      mockUseSubmissionStore.mockImplementation((selector) => {
        const state = { submissions: [] };
        return selector(state);
      });

      render(<SubmissionsList />);

      expect(mockUseSubmissionStore).toHaveBeenCalled();
    });
  });
});
