interface Info {
  count: number;
  totalPages: number;
  previousPage: number | null;
  nextPage: string | null;
}
export interface Character {
  info?: Info;
  _id: number;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  videoGames: string[];
  parkAttractions: string[];
  allies: string[];
  enemies: string[];
  name: string;
  imageUrl: string;
  url: string;
}

export interface DisneyApiResponse {
  info: Info;
  data: Character[];
}
