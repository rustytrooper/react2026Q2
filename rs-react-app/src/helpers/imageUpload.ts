export const validateImage = (
  file: File
): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPEG, JPG and PNG images are allowed',
    };
  }
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 2MB' };
  }

  return { isValid: true };
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
