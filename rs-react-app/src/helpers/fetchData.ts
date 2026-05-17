import type { DisneyApiResponse } from '../types/charachterType';

export async function fetchData(id?: string): Promise<DisneyApiResponse | null> {
  try {
    let data
    if (id) {
      data = await fetch(`https://api.disneyapi.dev/character/${id}`);
    } else {
      data = await fetch('https://api.disneyapi.dev/character');
    }
    const result = await data.json();
    return result;
  } catch (e) {
    console.error('Error while fetching data', e);
    return null;
  }
}

export async function fetchFilteredData(
  searchTerm: string
): Promise<DisneyApiResponse | null> {
  try {
    const data = await fetch(
      `https://api.disneyapi.dev/character?name=${searchTerm}`
    );
    const result = await data.json();
    return result;
  } catch (e) {
    console.error('Error while fetching data', e);
    return null;
  }
}
