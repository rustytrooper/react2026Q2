import { useRef, useState } from 'react';
import { convertToBase64, validateImage } from '../../../helpers/imageUpload';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  onBlur?: () => void;
  error?: string;
  id?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  onBlur,
  error,
  id = 'avatar',
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(value);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploadError('');

    try {
      const base64 = await convertToBase64(file);
      setPreview(base64);
      onChange(base64);
    } catch (error) {
      setUploadError('Failed to convert image');
    }
  };

  const removeImage = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-start gap-4">
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-lg object-cover border border-gray-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex-1">
          <input
            id={id}
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
            onBlur={onBlur}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {preview ? 'Change Image' : 'Upload Image'}
          </button>
          <p className="text-xs text-gray-500 mt-1">JPEG, PNG up to 2MB</p>
        </div>
      </div>

      {(error || uploadError) && (
        <p className="text-red-500 text-sm mt-1">{error || uploadError}</p>
      )}
    </div>
  );
};
