// PasswordStrengthIndicator.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  describe('Rendering', () => {
    it('should render progress bar', () => {
      render(<PasswordStrengthIndicator password="" />);

      const progressBar = document.querySelector('.w-full.h-2.bg-gray-200');
      expect(progressBar).toBeInTheDocument();
    });

    // it('should show all requirements', () => {
    //   render(<PasswordStrengthIndicator password="" />);

    //   expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    //   expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
    //   expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
    //   expect(screen.getByText('One number')).toBeInTheDocument();
    //   expect(screen.getByText('One special character')).toBeInTheDocument();
    // });

    it('should show password strength text', () => {
      render(<PasswordStrengthIndicator password="" />);

      expect(screen.getByText(/Password strength:/)).toBeInTheDocument();
    });
  });

  // describe('Strength calculation', () => {
  // it('should show "Very Weak" for empty password', () => {
  //   render(<PasswordStrengthIndicator password="" />);

  //   expect(screen.getByText('Password strength: Very Weak')).toBeInTheDocument();
  // });

  // it('should show "Very Weak" for password with only 1 requirement', () => {
  //   render(<PasswordStrengthIndicator password="a" />);

  //   expect(screen.getByText('Password strength: Very Weak')).toBeInTheDocument();
  // });

  // it('should show "Weak" for password with 2 requirements', () => {
  //   render(<PasswordStrengthIndicator password="aaaaaaaa" />);

  //   expect(screen.getByText('Password strength: Weak')).toBeInTheDocument();
  // });

  // it('should show "Fair" for password with 3 requirements', () => {
  //   render(<PasswordStrengthIndicator password="aaaaaaaaA" />);

  //   expect(screen.getByText('Password strength: Fair')).toBeInTheDocument();
  // });

  // it('should show "Good" for password with 4 requirements', () => {
  //   render(<PasswordStrengthIndicator password="aaaaaaaaA1" />);

  //   expect(screen.getByText('Password strength: Good')).toBeInTheDocument();
  // });

  //   it('should show "Strong" for password meeting all requirements', () => {
  //     render(<PasswordStrengthIndicator password="Password123!" />);

  //     expect(screen.getByText('Password strength: Strong')).toBeInTheDocument();
  //   });
  // });

  describe('Progress bar color', () => {
    it('should have red color for Very Weak (≤20%)', () => {
      render(<PasswordStrengthIndicator password="a" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveClass('bg-red-500');
    });

    it('should have orange color for Weak (21-40%)', () => {
      render(<PasswordStrengthIndicator password="aaaaaaaa" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveClass('bg-orange-500');
    });

    it('should have yellow color for Fair (41-60%)', () => {
      render(<PasswordStrengthIndicator password="aaaaaaaaA" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveClass('bg-yellow-500');
    });

    it('should have blue color for Good (61-80%)', () => {
      render(<PasswordStrengthIndicator password="aaaaaaaaA1" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveClass('bg-blue-500');
    });

    it('should have green color for Strong (81-100%)', () => {
      render(<PasswordStrengthIndicator password="Password123!" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveClass('bg-green-500');
    });
  });

  describe('Progress bar width', () => {
    it('should have 0% width for empty password', () => {
      render(<PasswordStrengthIndicator password="" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveStyle('width: 0%');
    });

    it('should have 20% width for 1 requirement', () => {
      render(<PasswordStrengthIndicator password="a" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveStyle('width: 20%');
    });

    it('should have 40% width for 2 requirements', () => {
      render(<PasswordStrengthIndicator password="aaaaaaaa" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveStyle('width: 40%');
    });

    it('should have 60% width for 3 requirements', () => {
      render(<PasswordStrengthIndicator password="aaaaaaaaA" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveStyle('width: 60%');
    });

    it('should have 80% width for 4 requirements', () => {
      render(<PasswordStrengthIndicator password="aaaaaaaaA1" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveStyle('width: 80%');
    });

    it('should have 100% width for 5 requirements', () => {
      render(<PasswordStrengthIndicator password="Password123!" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveStyle('width: 100%');
    });
  });

  describe('Requirement indicators', () => {
    it('should show checkmark for met requirements', () => {
      render(<PasswordStrengthIndicator password="Password123!" />);

      expect(screen.getByText('✓ At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('✓ One uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('✓ One lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('✓ One number')).toBeInTheDocument();
      expect(screen.getByText('✓ One special character')).toBeInTheDocument();
    });

    it('should show circle for unmet requirements', () => {
      render(<PasswordStrengthIndicator password="" />);

      expect(screen.getByText('○ At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('○ One uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('○ One lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('○ One number')).toBeInTheDocument();
      expect(screen.getByText('○ One special character')).toBeInTheDocument();
    });

    it('should have green color for met requirements', () => {
      render(<PasswordStrengthIndicator password="Password123!" />);

      const metRequirement = screen.getByText('✓ At least 8 characters');
      expect(metRequirement).toHaveClass('text-green-600');
    });

    it('should have gray color for unmet requirements', () => {
      render(<PasswordStrengthIndicator password="" />);

      const unmetRequirement = screen.getByText('○ At least 8 characters');
      expect(unmetRequirement).toHaveClass('text-gray-400');
    });
  });

  describe('CSS classes', () => {
    it('should have correct container classes', () => {
      render(<PasswordStrengthIndicator password="" />);

      const container = document.querySelector('.mt-2.space-y-2');
      expect(container).toHaveClass('mt-2', 'space-y-2');
    });

    it('should have correct progress bar container classes', () => {
      render(<PasswordStrengthIndicator password="" />);

      const progressContainer = document.querySelector(
        '.w-full.h-2.bg-gray-200.rounded-full.overflow-hidden'
      );
      expect(progressContainer).toHaveClass(
        'w-full',
        'h-2',
        'bg-gray-200',
        'rounded-full',
        'overflow-hidden'
      );
    });

    it('should have correct progress fill classes', () => {
      render(<PasswordStrengthIndicator password="Password123!" />);

      const progressFill = document.querySelector(
        '.h-full.transition-all.duration-300.bg-green-500'
      );
      expect(progressFill).toHaveClass(
        'h-full',
        'transition-all',
        'duration-300',
        'bg-green-500'
      );
    });

    it('should have correct text classes', () => {
      render(<PasswordStrengthIndicator password="" />);

      const text = screen.getByText(/Password strength:/);
      expect(text).toHaveClass('text-xs', 'text-gray-600');
    });
  });

  // describe('Edge cases', () => {
  // it('should handle very long password', () => {
  //   const longPassword = 'A'.repeat(100) + '1'.repeat(100) + '!' + 'a'.repeat(100);
  //   render(<PasswordStrengthIndicator password={longPassword} />);

  //   expect(screen.getByText('Password strength: Strong')).toBeInTheDocument();
  // });

  // it('should handle password with all special characters', () => {
  //   render(<PasswordStrengthIndicator password="!@#$%^&*()" />);

  //   expect(screen.getByText('Password strength: Very Weak')).toBeInTheDocument();
  // });

  // it('should handle password with numbers only', () => {
  //   render(<PasswordStrengthIndicator password="12345678" />);

  //   expect(screen.getByText('Password strength: Weak')).toBeInTheDocument();
  // });

  //   it('should handle password with letters only', () => {
  //     render(<PasswordStrengthIndicator password="abcdefgh" />);

  //     expect(screen.getByText('Password strength: Weak')).toBeInTheDocument();
  //   });
  // });

  describe('Transition animation', () => {
    it('should have transition-all class on progress fill', () => {
      render(<PasswordStrengthIndicator password="Password123!" />);

      const progressFill = document.querySelector('.h-full');
      expect(progressFill).toHaveClass('transition-all', 'duration-300');
    });
  });
});
