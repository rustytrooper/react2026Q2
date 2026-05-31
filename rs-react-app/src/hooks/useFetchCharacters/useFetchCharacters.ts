import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import useDisneyStore from '../../store/useDownloadData';
import { useCallback, useEffect } from 'react';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from '../../helpers/localStorage';
import { charactersApi } from '../../helpers/charactersApi';

const itemsPerPage = 10;
export function useDisneyData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQueryFromURL = searchParams.get('query') || '';

  const clearSelection = useDisneyStore((state) => state.clearSelection);
  const getSelectedCount = useDisneyStore((state) => state.getSelectedCount);
  const getSelectedCharacters = useDisneyStore(
    (state) => state.getSelectedCharacters
  );

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

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'characters',
      {
        query: searchQueryFromURL,
        page: currentPage,
        pageSize: itemsPerPage,
      },
    ],
    queryFn: () =>
      charactersApi.getCharacters({
        query: searchQueryFromURL,
        page: currentPage,
        pageSize: itemsPerPage,
      }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
    enabled: true,
  });

  const prefetchSearch = useCallback(
    (searchTerm: string) => {
      if (searchTerm && searchTerm !== searchQueryFromURL) {
        queryClient.prefetchQuery({
          queryKey: [
            'characters',
            {
              query: searchTerm,
              page: 1,
              pageSize: itemsPerPage,
            },
          ],
          queryFn: () =>
            charactersApi.getCharacters({
              query: searchTerm,
              page: 1,
              pageSize: itemsPerPage,
            }),
        });
      }
    },
    [queryClient, searchQueryFromURL]
  );

  const handleSubmit = useCallback(
    (term: string) => {
      const trimmed = term ? trimValue(term) : '';
      if (trimmed) {
        saveSearchValue(trimmed);
        prefetchSearch(trimmed);
      }
      setSearchParams((prev) => {
        if (!trimmed) {
          prev.delete('query');
        } else {
          prev.set('query', trimmed);
        }
        prev.set('page', '1');
        return prev;
      });
    },
    [setSearchParams, prefetchSearch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        if (searchQueryFromURL) {
          prev.set('query', searchQueryFromURL);
        }
        prev.set('page', newPage.toString());
        return prev;
      });
    },
    [setSearchParams, searchQueryFromURL]
  );

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [
        'characters',
        {
          query: searchQueryFromURL,
          page: currentPage,
          pageSize: itemsPerPage,
        },
      ],
    });
    refetch();
  };

  return {
    data,
    loading,
    error: error?.message || null,
    currentPage,
    totalPages: data?.totalPages || 0,
    searchQueryFromURL,
    handleSubmit,
    handlePageChange,
    handleManualRefresh,
    refetch,
    clearSelection,
    getSelectedCount,
    getSelectedCharacters,
  };
}
