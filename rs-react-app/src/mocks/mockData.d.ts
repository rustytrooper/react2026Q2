export declare const mockCharackterNotFoundResponse: {
  error: string;
};
export declare const mockAchilles: {
  info: {
    count: number;
    totalPages: number;
    previousPage: null;
    nextPage: null;
  };
  data: {
    _id: number;
    films: string[];
    shortFilms: never[];
    tvShows: string[];
    videoGames: string[];
    parkAttractions: never[];
    allies: never[];
    enemies: never[];
    name: string;
    imageUrl: string;
    url: string;
  }[];
};
export declare const mockAuntGertie: {
  info: {
    count: number;
    totalPages: number;
    previousPage: null;
    nextPage: null;
  };
  data: {
    _id: number;
    films: string[];
    shortFilms: never[];
    tvShows: never[];
    videoGames: never[];
    parkAttractions: never[];
    allies: never[];
    enemies: never[];
    name: string;
    imageUrl: string;
    url: string;
  };
};
export declare const mockOmitAuntGertie: {
  _id: number;
  films: string[];
  shortFilms: never[];
  tvShows: never[];
  videoGames: never[];
  parkAttractions: never[];
  allies: never[];
  enemies: never[];
  name: string;
  imageUrl: string;
  url: string;
};
export declare const mockAvatarSingh: {
  info: {
    count: number;
    totalPages: number;
    previousPage: null;
    nextPage: null;
  };
  data: {
    _id: number;
    films: never[];
    shortFilms: never[];
    tvShows: never[];
    videoGames: never[];
    parkAttractions: never[];
    allies: never[];
    enemies: never[];
    name: string;
    imageUrl: string;
    url: string;
  };
};
export declare const mockAvemetrus: {
  info: {
    count: number;
    totalPages: number;
    previousPage: null;
    nextPage: null;
  };
  data: {
    _id: number;
    films: never[];
    shortFilms: never[];
    tvShows: string[];
    videoGames: never[];
    parkAttractions: never[];
    allies: never[];
    enemies: never[];
    name: string;
    imageUrl: string;
    url: string;
  };
};
export declare const mockCharactersResponse: {
  info: {
    count: number;
    totalPages: number;
    previousPage: null;
    nextPage: string;
  };
  data: (
    | {
        _id: number;
        films: string[];
        shortFilms: never[];
        tvShows: never[];
        videoGames: never[];
        parkAttractions: never[];
        allies: never[];
        enemies: never[];
        name: string;
        imageUrl: string;
        url: string;
      }
    | {
        _id: number;
        films: never[];
        shortFilms: never[];
        tvShows: string[];
        videoGames: never[];
        parkAttractions: never[];
        allies: never[];
        enemies: never[];
        name: string;
        imageUrl: string;
        url: string;
      }
  )[];
};
export declare const mockCharactersResponsePage2: {
  info: {
    count: number;
    totalPages: number;
    previousPage: string;
    nextPage: string;
  };
  data: (
    | {
        info: {
          count: number;
          totalPages: number;
          previousPage: null;
          nextPage: null;
        };
        data: {
          _id: number;
          films: string[];
          shortFilms: never[];
          tvShows: never[];
          videoGames: never[];
          parkAttractions: never[];
          allies: never[];
          enemies: never[];
          name: string;
          imageUrl: string;
          url: string;
        };
      }
    | {
        info: {
          count: number;
          totalPages: number;
          previousPage: null;
          nextPage: null;
        };
        data: {
          _id: number;
          films: never[];
          shortFilms: never[];
          tvShows: string[];
          videoGames: never[];
          parkAttractions: never[];
          allies: never[];
          enemies: never[];
          name: string;
          imageUrl: string;
          url: string;
        };
      }
  )[];
};
