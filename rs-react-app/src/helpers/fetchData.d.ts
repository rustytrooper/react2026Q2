import type { DisneyApiResponse } from '../types/charachterType';
export declare function fetchData(
  page?: number,
  pageSize?: number
): Promise<DisneyApiResponse | null>;
export declare function fetchCharacterById(
  id: string
): Promise<DisneyApiResponse | null>;
export declare function fetchFilteredData(
  searchTerm: string,
  page?: number,
  pageSize?: number
): Promise<DisneyApiResponse | null>;
