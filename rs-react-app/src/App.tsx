import './App.css';
import SearchForm from './components/SearchForm/SearchForm';
import ResultContainer from './components/ResultCotainer/ResultContainer';
import { type ReactNode } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Loader } from './components/Loader/Loader';
import { Outlet } from 'react-router';
import { useDisneyData } from './hooks/useFetchCharacters/useFetchCharacters';
import { Pagination } from './components/Pagination/Pagination';

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
    <Loader />
  ) : (
    <ErrorBoundary>
      <div className="w-full bg-gray-100">
        <div className="container w-[90vw] mx-auto px-4">
          <div className="flex justify-center items-center ">
            <SearchForm
              onSubmit={handleSubmit}
              initialValue={searchQueryFromURL}
            />{' '}
          </div>
          <ResultContainer characters={data} />
          <Outlet />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
export default App;
