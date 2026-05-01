import type { DisneyApiResponse } from '../types/charachterType';

export async function fetchData(): Promise<DisneyApiResponse> {
  const data = await fetch('https://api.disneyapi.dev/character');
  const result = await data.json();
  return result;
}

export async function fetchFilteredData(
  searchTerm: string
): Promise<DisneyApiResponse> {
  const data = await fetch(
    `https://api.disneyapi.dev/character?name=${searchTerm}`
  );
  const result = await data.json();
  return result;
}
