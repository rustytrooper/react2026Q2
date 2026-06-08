import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Modal } from './Modal';
import { beforeAll } from 'vitest';

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      (this as any).open = true;
    };
  }

  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      (this as any).open = false;
    };
  }
});

beforeEach(() => {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
  cleanup();
});

afterEach(() => {
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) {
    document.body.removeChild(modalRoot);
  }
  cleanup();
});

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal content when isOpen is true', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
      });
    });

    it('should render with default title', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Form Modal')).toBeInTheDocument();
      });
    });

    it('should render with custom title', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Custom Title">
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
      });
    });

    it('should render close button', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close modal');
        expect(closeButton).toBeInTheDocument();
      });
    });
  });

  describe('Closing behavior', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      const dialog = document.querySelector('dialog');
      if (dialog) {
        await user.click(dialog);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not call onClose when clicking inside modal content', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      const content = screen.getByText('Content');
      await user.click(content);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Portal behavior', () => {
    it('should render modal in modal-root when portal exists', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Portal Content</div>
        </Modal>
      );

      await waitFor(() => {
        const modalRoot = document.getElementById('modal-root');
        expect(modalRoot).toBeInTheDocument();
        const dialog = modalRoot?.querySelector('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });

    it('should return null when modal-root does not exist', () => {
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot) {
        document.body.removeChild(modalRoot);
      }

      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(container.innerHTML).toBe('');
    });
  });

  describe('CSS classes and styles', () => {
    it('should have correct dialog classes', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        const dialog = document.querySelector('dialog');
        expect(dialog).toHaveClass(
          'rounded-lg',
          'shadow-xl',
          'w-full',
          'max-w-2xl',
          'mx-auto',
          'mt-10'
        );
      });
    });

    it('should have correct container div classes', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        const container = document.querySelector(
          '.bg-white.rounded-lg.overflow-hidden'
        );
        expect(container).toBeInTheDocument();
      });
    });

    it('should have correct header classes', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        const header = document.querySelector(
          '.sticky.top-0.bg-white.border-b'
        );
        expect(header).toBeInTheDocument();
      });
    });

    it('should have correct title classes', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        const title = document.querySelector('#modal-title');
        expect(title).toHaveClass('text-xl', 'font-semibold', 'text-gray-800');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have close button with aria-label', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close modal');
        expect(closeButton).toBeInTheDocument();
      });
    });

    it('should have modal-title id on title', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        const title = document.getElementById('modal-title');
        expect(title).toBeInTheDocument();
      });
    });
  });

  describe('SVG icon', () => {
    it('should render close icon', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      await waitFor(() => {
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('w-6', 'h-6');
      });
    });
  });
});
