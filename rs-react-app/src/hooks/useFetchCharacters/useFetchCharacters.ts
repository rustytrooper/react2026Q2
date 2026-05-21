import { useState, useEffect, useCallback } from 'react';
import { fetchData, fetchFilteredData } from '../../helpers/fetchData';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from '../../helpers/localStorage';
import type { DisneyApiResponse } from '../../types/charachterType';
import { useSearchParams } from 'react-router';

const itemsPerPage = 10;

export function useDisneyData() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQueryFromURL = searchParams.get('query') || '';

  const [data, setData] = useState<DisneyApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const loadData = useCallback(async (query: string, page: number) => {
    setLoading(true);
    setError(false);
    try {
      let response: DisneyApiResponse | null;
      if (query) {
        response = await fetchFilteredData(query, page, itemsPerPage);
      } else {
        response = await fetchData(page, itemsPerPage);
      }
      setData(response);
      setTotalPages(response?.info?.totalPages || 0);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (searchQueryFromURL) {
        await loadData(searchQueryFromURL, currentPage);
        return;
      }

      const savedQuery = initializeSearchValue();
      if (savedQuery) {
        setSearchParams({ query: savedQuery, page: '1' });
      } else {
        await loadData('', currentPage);
      }
    };

    initialize();
  }, [searchQueryFromURL, currentPage]);

  const handleSubmit = useCallback(
    (term: string) => {
      if (!term) {
        setSearchParams((prev) => {
          prev.delete('query');
          prev.delete('page');
          return prev;
        });
        loadData('', 1);
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
      setSearchParams({
        query: searchQueryFromURL,
        page: newPage.toString(),
      });
    },
    [setSearchParams, searchQueryFromURL]
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
  };
}
