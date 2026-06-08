import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import App from './App';

vi.mock('./components/Modal/Modal', () => ({
  Modal: ({
    isOpen,
    onClose,
    title,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        <div data-testid="modal-content">{children}</div>
      </div>
    ) : null,
}));

vi.mock('./components/Forms/ReactHookForm', () => ({
  ReactHookForm: ({
    onSuccess,
    onCancel,
  }: {
    onSuccess: () => void;
    onCancel: () => void;
  }) => (
    <div data-testid="rhf-form">
      <button data-testid="rhf-submit" onClick={onSuccess}>
        Submit
      </button>
      <button data-testid="rhf-cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

vi.mock('./components/Forms/UncontrolledForm', () => ({
  UncontrolledForm: ({
    onSuccess,
    onCancel,
  }: {
    onSuccess: () => void;
    onCancel: () => void;
  }) => (
    <div data-testid="uncontrolled-form">
      <button data-testid="uncontrolled-submit" onClick={onSuccess}>
        Submit
      </button>
      <button data-testid="uncontrolled-cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

vi.mock('./components/SubmissionList/SubmissionsList', () => ({
  SubmissionsList: ({ highlightId }: { highlightId: string | null }) => (
    <div data-testid="submissions-list">
      <span data-testid="highlight-id">{highlightId}</span>
      <div>Submissions List</div>
    </div>
  ),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('should render title', () => {
      render(<App />);

      expect(screen.getByText('📝 React Forms Task')).toBeInTheDocument();
      expect(
        screen.getByText('Choose a form type to submit your information')
      ).toBeInTheDocument();
    });

    it('should render form buttons', () => {
      render(<App />);

      expect(screen.getByText('📝 Open Uncontrolled Form')).toBeInTheDocument();
      expect(screen.getByText('⚛️ Open React Hook Form')).toBeInTheDocument();
    });

    it('should render SubmissionsList component', () => {
      render(<App />);

      expect(screen.getByTestId('submissions-list')).toBeInTheDocument();
      expect(
        screen.getByText('📋 Form Submissions History')
      ).toBeInTheDocument();
    });

    it('should not render modal initially', () => {
      render(<App />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should have correct container classes', () => {
      render(<App />);

      const container = document.querySelector('.min-h-screen.bg-gray-50');
      expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
    });

    it('should have correct inner container classes', () => {
      render(<App />);

      const innerContainer = document.querySelector(
        '.max-w-6xl.mx-auto.px-4.py-8'
      );
      expect(innerContainer).toHaveClass(
        'max-w-6xl',
        'mx-auto',
        'px-4',
        'py-8'
      );
    });

    it('should have correct button classes', () => {
      render(<App />);

      const uncontrolledButton = screen.getByText('📝 Open Uncontrolled Form');
      const rhfButton = screen.getByText('⚛️ Open React Hook Form');

      expect(uncontrolledButton).toHaveClass(
        'px-6',
        'py-3',
        'bg-green-600',
        'text-white',
        'font-semibold',
        'rounded-lg',
        'hover:bg-green-700',
        'transition-colors',
        'shadow-md',
        'cursor-pointer'
      );
      expect(rhfButton).toHaveClass(
        'px-6',
        'py-3',
        'bg-blue-600',
        'text-white',
        'font-semibold',
        'rounded-lg',
        'hover:bg-blue-700',
        'transition-colors',
        'shadow-md',
        'cursor-pointer'
      );
    });
  });

  describe('Modal opening', () => {
    it('should open modal with UncontrolledForm when Uncontrolled button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      const uncontrolledButton = screen.getByText('📝 Open Uncontrolled Form');
      await user.click(uncontrolledButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          'Uncontrolled Form'
        );
        expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
      });
    });

    it('should open modal with ReactHookForm when RHF button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      const rhfButton = screen.getByText('⚛️ Open React Hook Form');
      await user.click(rhfButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          'React Hook Form'
        );
        expect(screen.getByTestId('rhf-form')).toBeInTheDocument();
      });
    });
  });

  describe('Modal closing', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      const uncontrolledButton = screen.getByText('📝 Open Uncontrolled Form');
      await user.click(uncontrolledButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId('modal-close');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });

    it('should close modal after form success submission', async () => {
      const user = userEvent.setup();
      render(<App />);

      const uncontrolledButton = screen.getByText('📝 Open Uncontrolled Form');
      await user.click(uncontrolledButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('uncontrolled-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });

    it('should close modal when cancel button is clicked in form', async () => {
      const user = userEvent.setup();
      render(<App />);

      const uncontrolledButton = screen.getByText('📝 Open Uncontrolled Form');
      await user.click(uncontrolledButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const cancelButton = screen.getByTestId('uncontrolled-cancel');
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form switching', () => {
    it('should show UncontrolledForm when openModal is called with uncontrolled', async () => {
      const user = userEvent.setup();
      render(<App />);

      const uncontrolledButton = screen.getByText('📝 Open Uncontrolled Form');
      await user.click(uncontrolledButton);

      await waitFor(() => {
        expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
        expect(screen.queryByTestId('rhf-form')).not.toBeInTheDocument();
      });
    });

    it('should show ReactHookForm when openModal is called with rhf', async () => {
      const user = userEvent.setup();
      render(<App />);

      const rhfButton = screen.getByText('⚛️ Open React Hook Form');
      await user.click(rhfButton);

      await waitFor(() => {
        expect(screen.getByTestId('rhf-form')).toBeInTheDocument();
        expect(
          screen.queryByTestId('uncontrolled-form')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Modal title', () => {
    it('should show "Uncontrolled Form" title when uncontrolled form is active', async () => {
      const user = userEvent.setup();
      render(<App />);

      const uncontrolledButton = screen.getByText('📝 Open Uncontrolled Form');
      await user.click(uncontrolledButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          'Uncontrolled Form'
        );
      });
    });

    it('should show "React Hook Form" title when rhf form is active', async () => {
      const user = userEvent.setup();
      render(<App />);

      const rhfButton = screen.getByText('⚛️ Open React Hook Form');
      await user.click(rhfButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          'React Hook Form'
        );
      });
    });
  });

  describe('SubmissionsList integration', () => {
    it('should pass highlightId to SubmissionsList', () => {
      render(<App />);

      const highlightId = screen.getByTestId('highlight-id');
      expect(highlightId).toBeInTheDocument();
    });
  });
});
