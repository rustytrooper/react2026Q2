import type { Character, DisneyApiResponse } from '../types/charachterType';

const defaultPage = 1;
const defaultPageSize = 10;

export async function fetchData(
  page: number = defaultPage,
  pageSize: number = defaultPageSize
): Promise<DisneyApiResponse | null> {
  try {
    const url = `https://api.disneyapi.dev/character?page=${page}&pageSize=${pageSize}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error('Error while fetching data', e);
    throw e;
  }
}

export async function fetchCharacterById(
  id: string
): Promise<Character | null> {
  try {
    const url = `https://api.disneyapi.dev/character/${id}`;
    const response = await fetch(url);
    const result = await response.json();
    return result as Character;
  } catch (e) {
    console.error('Error while fetching data', e);
    throw e;
  }
}

export async function fetchFilteredData(
  searchTerm: string,
  page: number = defaultPage,
  pageSize: number = defaultPageSize
): Promise<DisneyApiResponse | null> {
  try {
    const encodedTerm = encodeURIComponent(searchTerm.trim());
    const url = `https://api.disneyapi.dev/character?name=${encodedTerm}&page=${page}&pageSize=${pageSize}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error('Error while fetching data', e);
    throw e;
  }
}
