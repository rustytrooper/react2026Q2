import type { DisneyApiResponse } from '../../types/charachterType';
export declare function useDisneyData(): {
  data: DisneyApiResponse | null;
  loading: boolean;
  error: boolean;
  currentPage: number;
  totalPages: number;
  searchQueryFromURL: string;
  handleSubmit: (term: string) => void;
  handlePageChange: (newPage: number) => void;
};
