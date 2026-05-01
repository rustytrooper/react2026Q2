import type { DisneyApiResponse } from '../types/charachterType';

export async function fetchData(): Promise<DisneyApiResponse> {
  const data = await fetch('https://api.disneyapi.dev/character');
  const result = data.json();
  return result;
}
