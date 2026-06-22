import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { Router } from './router/Router.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cashTTL } from './constants.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cashTTL,
      gcTime: cashTTL * 2,
      retry: 1,
      throwOnError: (error) => {
        console.error('Global error handler:', error);
        return false;
      },
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
