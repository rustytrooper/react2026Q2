import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(),
}));

vi.mock('react-router', () => ({
  RouterProvider: () => null,
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock('./router/Router.tsx', () => ({
  Router: {},
}));

vi.mock('./constants.ts', () => ({
  cashTTL: 5 * 60 * 1000,
}));

import { createRoot } from 'react-dom/client';

describe('Main configuration', () => {
  const mockRender = vi.fn();
  const mockCreateRoot = createRoot as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
    mockCreateRoot.mockReturnValue({ render: mockRender });
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
  });

  it('should create root and render app', async () => {
    await import('./main');
    expect(mockCreateRoot).toHaveBeenCalledWith(
      document.getElementById('root')
    );
    expect(mockRender).toHaveBeenCalled();
  });
});
