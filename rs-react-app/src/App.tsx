import './App.css';
import SearchForm from './components/SearchForm/SearchForm';
import ResultContainer from './components/ResultCotainer/ResultContainer';
import { type ReactNode } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Loader } from './components/Loader/Loader';
// import { Outlet } from 'react-router';
import { useDisneyData } from './hooks/useFetchCharacters/useFetchCharacters';
import { Pagination } from './components/Pagination/Pagination';
import SelectionFlyout from './components/FlyOut/FlyOut';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cashTTL } from './constants';


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

function App(): ReactNode {
  const {
    data,
    loading,
    currentPage,
    totalPages,
    searchQueryFromURL,
    handleSubmit,
    handlePageChange,
  } = useDisneyData();

  return loading ? (
    <Loader data-testId="loader" />
  ) : (
    <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <div className="w-full bg-gray-100 dark:bg-purple-900 transition-all duration-300">
        <div className="container w-[90vw] mx-auto px-4">
          <div className="flex justify-center items-center ">
            <SearchForm
              onSubmit={handleSubmit}
              initialValue={searchQueryFromURL}
              key={searchQueryFromURL}
            />{' '}
          </div>
          <ResultContainer characters={data} />
          {/* <Outlet /> */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <SelectionFlyout />
    </ErrorBoundary>
       </QueryClientProvider>
  );
}
export default App;
