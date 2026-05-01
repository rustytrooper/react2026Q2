interface Info {
  count: number;
}
export interface Character {
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
