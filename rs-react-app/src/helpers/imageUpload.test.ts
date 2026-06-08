import { describe, it, expect } from 'vitest';
import { validateImage } from './imageUpload';

describe('validateImage', () => {
  describe('File type validation', () => {
    it('should return isValid true for JPEG image', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImage(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return isValid true for JPG image', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpg' });
      const result = validateImage(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return isValid true for PNG image', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = validateImage(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return isValid false for GIF image', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only JPEG, JPG and PNG images are allowed');
    });

    it('should return isValid false for WEBP image', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only JPEG, JPG and PNG images are allowed');
    });

    it('should return isValid false for BMP image', () => {
      const file = new File(['test'], 'test.bmp', { type: 'image/bmp' });
      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only JPEG, JPG and PNG images are allowed');
    });

    it('should return isValid false for SVG image', () => {
      const file = new File(['test'], 'test.svg', { type: 'image/svg+xml' });
      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only JPEG, JPG and PNG images are allowed');
    });

    it('should return isValid false for non-image file', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only JPEG, JPG and PNG images are allowed');
    });
  });

  describe('File size validation', () => {
    it('should return isValid true for file smaller than 2MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const result = validateImage(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return isValid true for file exactly 2MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 });

      const result = validateImage(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return isValid false for file larger than 2MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 });

      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image size must be less than 2MB');
    });

    it('should return isValid false for very large file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 100 * 1024 * 1024 });

      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image size must be less than 2MB');
    });
  });

  describe('Combined validation', () => {
    it('should prioritize type error over size error', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      Object.defineProperty(file, 'size', { value: 1 * 1024 * 1024 });

      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only JPEG, JPG and PNG images are allowed');
    });

    it('should validate correct file type and size', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1.5 * 1024 * 1024 });

      const result = validateImage(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
