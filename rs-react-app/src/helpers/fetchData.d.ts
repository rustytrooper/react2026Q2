import type { DisneyApiResponse } from '../types/charachterType';
export declare function fetchData(): Promise<DisneyApiResponse | null>;
export declare function fetchFilteredData(
  searchTerm: string
): Promise<DisneyApiResponse | null>;
