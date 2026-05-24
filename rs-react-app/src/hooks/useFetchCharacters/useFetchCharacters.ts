import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from '../../helpers/localStorage';
import useDisneyStore from '../../store/useDownloadData';

const itemsPerPage = 10;

export function useDisneyData() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQueryFromURL = searchParams.get('query') || '';

  const data = useDisneyStore((state) => state.data);
  const loading = useDisneyStore((state) => state.loading);
  const error = useDisneyStore((state) => state.error);
  const totalPages = useDisneyStore((state) => state.totalPages);
  const loadData = useDisneyStore((state) => state.loadData);

  const clearSelection = useDisneyStore((state) => state.clearSelection);
  const getSelectedCount = useDisneyStore((state) => state.getSelectedCount);
  const getSelectedCharacters = useDisneyStore(
    (state) => state.getSelectedCharacters
  );

  useEffect(() => {
    loadData(searchQueryFromURL, currentPage, itemsPerPage);
  }, [searchQueryFromURL, currentPage, loadData]);

  useEffect(() => {
    const initialize = async () => {
      if (!searchQueryFromURL) {
        const savedQuery = initializeSearchValue();
        if (savedQuery) {
          setSearchParams({ query: savedQuery, page: '1' });
        }
      }
    };

    initialize();
  }, [searchQueryFromURL, setSearchParams]);

  const handleSubmit = useCallback(
    (term: string) => {
      if (!term) {
        setSearchParams((prev) => {
          prev.delete('query');
          prev.delete('page');
          return prev;
        });
      } else {
        const trimmed = trimValue(term);
        saveSearchValue(trimmed);
        setSearchParams({ query: trimmed, page: '1' });
      }
    },
    [setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      if (searchQueryFromURL) {
        params.set('query', searchQueryFromURL);
      }
      params.set('page', newPage.toString());
      setSearchParams(params);
    },
    [setSearchParams, searchQueryFromURL, searchParams]
  );

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    searchQueryFromURL,

    handleSubmit,
    handlePageChange,

    clearSelection,
    getSelectedCount,
    getSelectedCharacters,
  };
}
