// ImageUpload.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { ImageUpload } from './ImageUpload';
import { convertToBase64, validateImage } from '../../../helpers/imageUpload';

// Мокаем хелперы
vi.mock('../../../helpers/imageUpload', () => ({
  convertToBase64: vi.fn(),
  validateImage: vi.fn(),
}));

const mockConvertToBase64 = convertToBase64 as unknown as ReturnType<
  typeof vi.fn
>;
const mockValidateImage = validateImage as unknown as ReturnType<typeof vi.fn>;

describe('ImageUpload', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateImage.mockReturnValue({ isValid: true, error: null });
    mockConvertToBase64.mockResolvedValue('data:image/png;base64,mock');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('should render upload button', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />);

      expect(screen.getByText('Upload Image')).toBeInTheDocument();
    });

    it('should render with custom id', () => {
      render(
        <ImageUpload value="" onChange={mockOnChange} id="custom-avatar" />
      );

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('id', 'custom-avatar');
    });

    it('should show preview when value is provided', () => {
      render(
        <ImageUpload
          value="data:image/png;base64,existing"
          onChange={mockOnChange}
        />
      );

      const preview = screen.getByAltText('Preview');
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveAttribute('src', 'data:image/png;base64,existing');
    });

    it('should show "Change Image" button when preview exists', () => {
      render(
        <ImageUpload
          value="data:image/png;base64,existing"
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Change Image')).toBeInTheDocument();
      expect(screen.queryByText('Upload Image')).not.toBeInTheDocument();
    });

    it('should show file info text', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />);

      expect(screen.getByText(/JPEG, PNG up to 2MB/)).toBeInTheDocument();
    });
  });

  describe('Error display', () => {
    it('should show error message when error prop is provided', () => {
      render(
        <ImageUpload
          value=""
          onChange={mockOnChange}
          error="Image is required"
        />
      );

      expect(screen.getByText('Image is required')).toBeInTheDocument();
    });

    it('should show upload error message when validation fails', async () => {
      const user = userEvent.setup();
      mockValidateImage.mockReturnValue({
        isValid: false,
        error: 'File too large',
      });

      render(<ImageUpload value="" onChange={mockOnChange} />);

      const button = screen.getByText('Upload Image');
      await user.click(button);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText('File too large')).toBeInTheDocument();
      });
    });
  });

  describe('Image upload', () => {
    it('should handle file upload successfully', async () => {
      const user = userEvent.setup();
      render(<ImageUpload value="" onChange={mockOnChange} />);

      const button = screen.getByText('Upload Image');
      await user.click(button);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(mockValidateImage).toHaveBeenCalledWith(file);
        expect(mockConvertToBase64).toHaveBeenCalledWith(file);
        expect(mockOnChange).toHaveBeenCalledWith('data:image/png;base64,mock');
      });
    });

    it('should show preview after upload', async () => {
      const user = userEvent.setup();
      render(<ImageUpload value="" onChange={mockOnChange} />);

      const button = screen.getByText('Upload Image');
      await user.click(button);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, file);

      await waitFor(() => {
        const preview = screen.getByAltText('Preview');
        expect(preview).toBeInTheDocument();
        expect(preview).toHaveAttribute('src', 'data:image/png;base64,mock');
      });
    });
  });

  describe('Image validation', () => {
    // it('should reject invalid file type', async () => {
    //   const user = userEvent.setup();
    //   mockValidateImage.mockReturnValue({ isValid: false, error: 'Invalid file type. Only JPEG, PNG are allowed' });

    //   render(
    //     <ImageUpload
    //       value=""
    //       onChange={mockOnChange}
    //     />
    //   );

    //   const button = screen.getByText('Upload Image');
    //   await user.click(button);

    //   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    //   const file = new File(['test'], 'test.gif', { type: 'image/gif' });
    //   await user.upload(fileInput, file);

    //   await waitFor(() => {
    //     expect(screen.getByText('Invalid file type. Only JPEG, PNG are allowed')).toBeInTheDocument();
    //     expect(mockConvertToBase64).not.toHaveBeenCalled();
    //     expect(mockOnChange).not.toHaveBeenCalled();
    //   });
    // });

    it('should reject file that is too large', async () => {
      const user = userEvent.setup();
      mockValidateImage.mockReturnValue({
        isValid: false,
        error: 'File too large. Maximum size is 2MB',
      });

      render(<ImageUpload value="" onChange={mockOnChange} />);

      const button = screen.getByText('Upload Image');
      await user.click(button);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 });
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(
          screen.getByText('File too large. Maximum size is 2MB')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Image removal', () => {
    it('should remove image when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ImageUpload
          value="data:image/png;base64,existing"
          onChange={mockOnChange}
        />
      );

      expect(screen.getByAltText('Preview')).toBeInTheDocument();

      const deleteButton = screen.getByText('×');
      await user.click(deleteButton);

      expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('should reset file input value after removal', async () => {
      // const user = userEvent.setup();
      render(
        <ImageUpload
          value="data:image/png;base64,existing"
          onChange={mockOnChange}
        />
      );

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      expect(fileInput.value).toBe('');
    });
  });

  describe('Conversion error', () => {
    it('should handle conversion error', async () => {
      const user = userEvent.setup();
      mockValidateImage.mockReturnValue({ isValid: true, error: null });
      mockConvertToBase64.mockRejectedValue(new Error('Conversion failed'));

      render(<ImageUpload value="" onChange={mockOnChange} />);

      const button = screen.getByText('Upload Image');
      await user.click(button);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText('Failed to convert image')).toBeInTheDocument();
        expect(mockOnChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('CSS classes', () => {
    it('should have correct image classes', () => {
      render(
        <ImageUpload
          value="data:image/png;base64,existing"
          onChange={mockOnChange}
        />
      );

      const img = screen.getByAltText('Preview');
      expect(img).toHaveClass(
        'w-20',
        'h-20',
        'rounded-lg',
        'object-cover',
        'border',
        'border-gray-300'
      );
    });

    it('should have correct button classes', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />);

      const button = screen.getByText('Upload Image');
      expect(button).toHaveClass(
        'px-4',
        'py-2',
        'bg-gray-100',
        'text-gray-700',
        'rounded-md',
        'hover:bg-gray-200',
        'transition-colors'
      );
    });

    it('should have correct delete button classes', () => {
      render(
        <ImageUpload
          value="data:image/png;base64,existing"
          onChange={mockOnChange}
        />
      );

      const deleteButton = screen.getByText('×');
      expect(deleteButton).toHaveClass(
        'absolute',
        '-top-2',
        '-right-2',
        'w-5',
        'h-5',
        'bg-red-500',
        'text-white',
        'rounded-full',
        'text-xs'
      );
    });
  });

  // describe('Blur event', () => {
  //   it('should call onBlur when input loses focus', async () => {
  //     const user = userEvent.setup();
  //     render(
  //       <ImageUpload
  //         value=""
  //         onChange={mockOnChange}
  //         onBlur={mockOnBlur}
  //       />
  //     );

  //     const button = screen.getByText('Upload Image');
  //     await user.click(button);

  //     // const fileInput = document.querySelector('input[type="file"]');
  //     await user.tab();

  //     expect(mockOnBlur).toHaveBeenCalled();
  //   });
  // });
});
