// app/App.tsx (создайте этот файл рядом с page.tsx)
'use client'

import '../App.css';
import { type ReactNode } from 'react';
import { useDisneyData } from '../hooks/useFetchCharacters/useFetchCharacters';
import { Loader } from '../components/Loader/Loader';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import SearchForm from '../components/SearchForm/SearchForm';
import ResultContainer from '../components/ResultCotainer/ResultContainer';
import { Pagination } from '../components/Pagination/Pagination';
import SelectionFlyout from '../components/FlyOut/FlyOut';

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
    <ErrorBoundary>
      <div className="w-full bg-gray-100 dark:bg-purple-900 transition-all duration-300">
        <div className="container w-[90vw] mx-auto px-4">
          <div className="flex justify-center items-center">
            <SearchForm
              onSubmit={handleSubmit}
              initialValue={searchQueryFromURL}
              key={searchQueryFromURL}
            />
          </div>
          <ResultContainer characters={data} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <SelectionFlyout />
    </ErrorBoundary>
  );
}

export default App;