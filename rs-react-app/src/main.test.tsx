import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

vi.mock('./App', () => ({
  default: () => <div data-testid="mock-app">Mock App</div>,
}));

vi.mock('./index.css', () => ({}));

describe('Main entry point', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
    mockCreateRoot.mockClear();
    mockRender.mockClear();
    mockCreateRoot.mockReturnValue({ render: mockRender });
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
    cleanup();
  });

  it('should find root element', async () => {
    await import('./main');

    expect(mockCreateRoot).toHaveBeenCalledWith(
      document.getElementById('root')
    );
  });
});
