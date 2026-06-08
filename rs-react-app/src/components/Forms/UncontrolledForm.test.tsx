import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { UncontrolledForm } from './UncontrolledForm';
import { useSubmissionStore } from '../../store/submissionStore';

vi.mock('../../store/submissionStore', () => ({
  useSubmissionStore: vi.fn(),
}));

vi.mock('./shared/CountryAutocomplete', () => ({
  CountryAutocomplete: ({
    value,
    onChange,
    error,
    id,
    name,
  }: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    id?: string;
    name?: string;
  }) => (
    <div data-testid="country-autocomplete">
      <input
        data-testid="country-input"
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select country"
      />
      {error && <span data-testid="country-error">{error}</span>}
    </div>
  ),
}));

vi.mock('./shared/PasswordStrengthIndicator', () => ({
  PasswordStrengthIndicator: ({ password }: { password: string }) => (
    <div data-testid="password-strength">
      Strength: {password.length >= 8 ? 'Strong' : 'Weak'}
    </div>
  ),
}));

vi.mock('./shared/ImageUpload', () => ({
  ImageUpload: ({
    value,
    onChange,
    error,
  }: {
    value: string;
    onChange: (base64: string) => void;
    error?: string;
  }) => (
    <div data-testid="image-upload">
      <button
        data-testid="upload-button"
        onClick={() => onChange('data:image/png;base64,mock')}
      >
        Upload Image
      </button>
      {value && <img data-testid="uploaded-image" src={value} alt="Preview" />}
      {error && <span data-testid="image-error">{error}</span>}
    </div>
  ),
}));

const mockAddSubmission = vi.fn();
const mockUseSubmissionStore = useSubmissionStore as unknown as ReturnType<
  typeof vi.fn
>;

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSubmissionStore.mockImplementation((selector) => {
      const state = { addSubmission: mockAddSubmission };
      return selector(state);
    });
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render cancel and submit buttons', () => {
      render(<UncontrolledForm />);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should have submit button enabled by default', () => {
      render(<UncontrolledForm />);

      const submitButton = screen.getByText('Submit');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form validation', () => {
    it('should validate name starts with uppercase', async () => {
      const user = userEvent.setup();
      render(<UncontrolledForm />);

      const nameInput = screen.getByLabelText(/Name/i);
      await user.type(nameInput, 'john');
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Name must start with uppercase letter')
        ).toBeInTheDocument();
      });
    });

    it('should validate age range', async () => {
      const user = userEvent.setup();
      render(<UncontrolledForm />);

      const ageInput = screen.getByLabelText(/Age/i);
      await user.type(ageInput, '-5');
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Age cannot be negative')).toBeInTheDocument();
      });

      await user.clear(ageInput);
      await user.type(ageInput, '150');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Age must be realistic')).toBeInTheDocument();
      });
    });
  });

  describe('Cancel functionality', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();
      render(<UncontrolledForm onCancel={onCancel} />);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('Image upload', () => {
    it('should handle image upload', async () => {
      const user = userEvent.setup();
      render(<UncontrolledForm />);

      const uploadButton = screen.getByTestId('upload-button');
      await user.click(uploadButton);

      expect(screen.getByTestId('uploaded-image')).toBeInTheDocument();
    });
  });

  describe('Country selection', () => {
    it('should handle country selection', async () => {
      const user = userEvent.setup();
      render(<UncontrolledForm />);

      const countryInput = screen.getByPlaceholderText('Select country');
      await user.type(countryInput, 'Ukraine');

      expect(countryInput).toHaveValue('Ukraine');
    });
  });
});
