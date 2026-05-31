export const charactersApi = {
  getCharacters: async ({
    query,
    page,
    pageSize,
  }: {
    query: string;
    page: number;
    pageSize: number;
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (query) {
      params.append('name', query);
    }

    const response = await fetch(
      `https://api.disneyapi.dev/character?${params}`
    );
    const data = await response.json();

    return {
      data: data.data,
      totalPages: Math.ceil(data.total / pageSize),
      total: data.total,
    };
  },
  getCharacterById: async (id: string) => {
    const response = await fetch(`https://api.disneyapi.dev/character/${id}`);
    const data = await response.json();
    return data.data;
  },
};
