'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic'
import { cashTTL } from '../../constants';
// import '../../App.css';
// import '../../index.css';

const App = dynamic(() => import('../../App'), { ssr: false })

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

export function ClientOnly() {
  console.log('Rendering ClientOnly')
  return (
        <QueryClientProvider client={queryClient}>
      <App />  
            </QueryClientProvider>
  )
}