import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubmissionCard } from './SubmissionCard';
import type { Submission } from '../../schemas/formSchema';

describe('SubmissionCard', () => {
  const mockSubmission: Submission = {
    id: '123',
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
      avatar: 'https://example.com/avatar.jpg',
    },
  };

  const uncontrolledSubmission: Submission = {
    id: '456',
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

  describe('Basic rendering', () => {
    it('should render submission name', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render submission email', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should render submission age', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('should render submission gender', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      expect(screen.getByText('male')).toBeInTheDocument();
    });

    it('should render submitted date', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      expect(screen.getByText(/Submitted:/)).toBeInTheDocument();
    });
  });

  describe('Form type badge', () => {
    it('should show "React Hook Form" badge for rhf type', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      const badge = screen.getByText('React Hook Form');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-blue-600');
      expect(badge).toHaveClass('text-white');
    });

    it('should show "Uncontrolled" badge for uncontrolled type', () => {
      render(
        <SubmissionCard
          submission={uncontrolledSubmission}
          isHighlighted={false}
        />
      );

      const badge = screen.getByText('Uncontrolled');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-gray-200');
      expect(badge).toHaveClass('text-gray-700');
    });
  });

  describe('Terms acceptance status', () => {
    it('should show "Accepted" with green color when terms accepted', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      const termsStatus = screen.getByText('Accepted');
      expect(termsStatus).toBeInTheDocument();
      expect(termsStatus).toHaveClass('text-green-600');
    });

    it('should show "Not accepted" with red color when terms not accepted', () => {
      const notAcceptedSubmission: Submission = {
        ...mockSubmission,
        data: { ...mockSubmission.data, termsAccepted: false },
      };
      render(
        <SubmissionCard
          submission={notAcceptedSubmission}
          isHighlighted={false}
        />
      );

      const termsStatus = screen.getByText('Not accepted');
      expect(termsStatus).toBeInTheDocument();
      expect(termsStatus).toHaveClass('text-red-600');
    });
  });

  describe('Avatar rendering', () => {
    it('should render avatar image when avatar URL is provided', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      const avatar = screen.getByAltText('Avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(avatar).toHaveClass(
        'w-12',
        'h-12',
        'rounded-full',
        'object-cover'
      );
    });

    it('should not render avatar when avatar URL is not provided', () => {
      render(
        <SubmissionCard
          submission={uncontrolledSubmission}
          isHighlighted={false}
        />
      );

      expect(screen.queryByAltText('Avatar')).not.toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should have correct name styles', () => {
      render(
        <SubmissionCard submission={mockSubmission} isHighlighted={false} />
      );

      const name = screen.getByText('John Doe');
      expect(name).toHaveClass('text-lg');
      expect(name).toHaveClass('font-semibold');
      expect(name).toHaveClass('text-gray-800');
    });
  });

  describe('Date formatting', () => {
    it('should format submission date correctly', () => {
      const fixedDateSubmission: Submission = {
        ...mockSubmission,
        submittedAt: '2024-12-25T15:45:00.000Z',
      };
      render(
        <SubmissionCard
          submission={fixedDateSubmission}
          isHighlighted={false}
        />
      );

      expect(screen.getByText(/Submitted:/)).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle missing avatar gracefully', () => {
      const submissionWithoutAvatar: Submission = {
        ...mockSubmission,
        data: { ...mockSubmission.data, avatar: undefined },
      };
      render(
        <SubmissionCard
          submission={submissionWithoutAvatar}
          isHighlighted={false}
        />
      );

      expect(screen.queryByAltText('Avatar')).not.toBeInTheDocument();
    });
  });
});
