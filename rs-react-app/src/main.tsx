import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { Router } from './router/Router.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const cashTTL = Number(import.meta.env.VITE_CACHE_TTL) || 1000 * 60 * 5;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cashTTL,
      gcTime: cashTTL * 2,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={Router} />
    </QueryClientProvider>
  </StrictMode>
);
