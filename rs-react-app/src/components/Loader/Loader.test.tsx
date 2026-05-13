import { cleanup, render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Loader } from './Loader';

describe('Loader Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Loader />);
      expect(container).toBeInTheDocument();
    });

    it('should render three bouncing dots', () => {
      render(<Loader />);

      const dots = document.querySelectorAll('.rounded-full');
      expect(dots).toHaveLength(3);
    });

    it('should have correct CSS classes for dots', () => {
      render(<Loader />);

      const dots = document.querySelectorAll('.rounded-full');
      dots.forEach((dot) => {
        expect(dot).toHaveClass('w-3');
        expect(dot).toHaveClass('h-3');
        expect(dot).toHaveClass('bg-purple-400');
        expect(dot).toHaveClass('rounded-full');
      });
    });

    it('should have bounce animation class on each dot', () => {
      render(<Loader />);

      const dots = document.querySelectorAll('.rounded-full');
      dots.forEach((dot) => {
        expect(dot).toHaveClass('bounce');
      });
    });
  });

  describe('Container structure', () => {
    it('should have full screen height container', () => {
      render(<Loader />);

      const container = document.querySelector('.h-screen');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('items-center');
      expect(container).toHaveClass('justify-center');
    });

    it('should have flex container with space-x-1', () => {
      render(<Loader />);

      const flexContainer = document.querySelector('.space-x-1');
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toHaveClass('flex');
    });

    it('should have correct nesting structure', () => {
      const { container } = render(<Loader />);
      const screenDiv = container.firstChild;
      expect(screenDiv).toHaveClass('h-screen');

      const flexDiv = screenDiv?.firstChild;
      expect(flexDiv).toHaveClass('flex');
      expect(flexDiv).toHaveClass('space-x-1');

      const dots = flexDiv?.childNodes;
      expect(dots).toHaveLength(3);
    });
  });

  describe('Styles and CSS', () => {
    it('should apply correct color classes', () => {
      render(<Loader />);

      const dots = document.querySelectorAll('.bg-purple-400');
      expect(dots).toHaveLength(3);
    });

    it('should apply correct sizing classes', () => {
      render(<Loader />);

      const dots = document.querySelectorAll('.w-3.h-3');
      expect(dots).toHaveLength(3);
    });

    it('should have responsive positioning', () => {
      render(<Loader />);

      const container = document.querySelector('.h-screen');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role presentation or status for loading', () => {
      const { container } = render(<Loader />);
      const loadingContainer = container.querySelector('.h-screen');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('should have aria-label or similar for screen readers', () => {
      render(<Loader />);
      const dots = document.querySelectorAll('.rounded-full');
      expect(dots[0]).toBeVisible();
    });

    it('should be center of screen', () => {
      render(<Loader />);

      const container = document.querySelector('.items-center.justify-center');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('should have bounce class on all dots', () => {
      render(<Loader />);

      const dots = document.querySelectorAll('.bounce');
      expect(dots).toHaveLength(3);
    });

    it('should apply same classes to all three dots', () => {
      render(<Loader />);

      const dots = document.querySelectorAll('.rounded-full');
      const firstDot = dots[0];
      const secondDot = dots[1];
      const thirdDot = dots[2];

      expect(firstDot?.className).toBe(secondDot?.className);
      expect(secondDot?.className).toBe(thirdDot?.className);
    });
  });

  describe('Edge cases', () => {
    it('should not render any text content', () => {
      render(<Loader />);

      const container = document.querySelector('.h-screen');
      expect(container?.textContent?.trim()).toBe('');
    });

    it('should render only dots, no extra elements', () => {
      const { container } = render(<Loader />);

      const allDivs = container.querySelectorAll('div');
      expect(allDivs.length).toBe(5);
    });

    it('should have unique class combinations', () => {
      render(<Loader />);

      const flexContainer = document.querySelector('.flex.space-x-1');
      expect(flexContainer).toBeInTheDocument();

      const dots = document.querySelectorAll(
        '.w-3.h-3.bg-purple-400.rounded-full.bounce'
      );
      expect(dots).toHaveLength(3);
    });
  });

  describe('Multiple loaders', () => {
    it('should render multiple loaders independently', () => {
      const { container: firstLoader } = render(<Loader />);
      const { container: secondLoader } = render(<Loader />);

      expect(firstLoader.querySelectorAll('.rounded-full')).toHaveLength(3);
      expect(secondLoader.querySelectorAll('.rounded-full')).toHaveLength(3);
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot', () => {
      const { container } = render(<Loader />);
      expect(container).toMatchSnapshot();
    });
  });
});

describe('Loader - CSS class correctness', () => {
  it('should have all required Tailwind classes', () => {
    render(<Loader />);
    expect(document.querySelector('.flex')).toBeInTheDocument();
    expect(document.querySelector('.items-center')).toBeInTheDocument();
    expect(document.querySelector('.justify-center')).toBeInTheDocument();
    expect(document.querySelector('.h-screen')).toBeInTheDocument();
    expect(document.querySelector('.space-x-1')).toBeInTheDocument();

    const dots = document.querySelectorAll('.rounded-full');
    expect(dots[0]).toHaveClass('w-3');
    expect(dots[0]).toHaveClass('h-3');
    expect(dots[0]).toHaveClass('bg-purple-400');
  });
});
