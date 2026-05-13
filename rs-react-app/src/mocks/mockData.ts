import type { DisneyApiResponse } from '../types/charachterType';

export const mockCharackterNotFoundResponse = {
  error: 'There is nothing here',
};

export const mockAchilles = {
  info: { count: 2, totalPages: 1, previousPage: null, nextPage: null },
  data: [
    {
      _id: 112,
      films: ['Hercules (film)'],
      shortFilms: [],
      tvShows: ['Hercules (TV series)'],
      videoGames: ['Kingdom Hearts III'],
      parkAttractions: [],
      allies: [],
      enemies: [],
      name: 'Achilles',
      imageUrl:
        'https://static.wikia.nocookie.net/disney/images/6/67/HATS_Achilles.png',
      url: 'https://api.disneyapi.dev/characters/112',
    },
    {
      _id: 31,
      films: ['The Hunchback of Notre Dame', 'The Hunchback of Notre Dame II'],
      shortFilms: [],
      tvShows: [],
      videoGames: ['Animated StoryBook: The Hunchback of Notre Dame'],
      parkAttractions: [],
      allies: [],
      enemies: [],
      name: 'Achilles',
      imageUrl:
        'https://static.wikia.nocookie.net/disney/images/8/8f/Achilles_HOND.jpg',
      url: 'https://api.disneyapi.dev/characters/31',
    },
  ],
} satisfies DisneyApiResponse;

export const mockAuntGertie = {
  info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
  data: {
    _id: 367,
    films: ["Mickey's Once Upon a Christmas"],
    shortFilms: [],
    tvShows: [],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    name: 'Aunt Gertie',
    imageUrl:
      'https://static.wikia.nocookie.net/disney/images/c/cd/Aunt-Gertie.jpg',
    url: 'https://api.disneyapi.dev/characters/367',
  },
};

const mockOmitAuntGertie = {
  _id: 367,
  films: ["Mickey's Once Upon a Christmas"],
  shortFilms: [],
  tvShows: [],
  videoGames: [],
  parkAttractions: [],
  allies: [],
  enemies: [],
  name: 'Aunt Gertie',
  imageUrl:
    'https://static.wikia.nocookie.net/disney/images/c/cd/Aunt-Gertie.jpg',
  url: 'https://api.disneyapi.dev/characters/367',
};
const mockAvatarSingh = {
  info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
  data: {
    _id: 378,
    films: [],
    shortFilms: [],
    tvShows: [],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    name: 'Avatar Singh',
    imageUrl:
      'https://static.wikia.nocookie.net/disney/images/2/20/Avatar_Singh.jpg',
    url: 'https://api.disneyapi.dev/characters/378',
  },
};

const mockOmitAvatarSingh = {
  _id: 378,
  films: [],
  shortFilms: [],
  tvShows: [],
  videoGames: [],
  parkAttractions: [],
  allies: [],
  enemies: [],
  name: 'Avatar Singh',
  imageUrl:
    'https://static.wikia.nocookie.net/disney/images/2/20/Avatar_Singh.jpg',
  url: 'https://api.disneyapi.dev/characters/378',
};

const mockAvemetrus = {
  info: { count: 1, totalPages: 1, previousPage: null, nextPage: null },
  data: {
    _id: 379,
    films: [],
    shortFilms: [],
    tvShows: ['American Dragon: Jake Long'],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    name: 'Avemetrus',
    imageUrl:
      'https://static.wikia.nocookie.net/disney/images/7/70/Avemetrus.png',
    url: 'https://api.disneyapi.dev/characters/379',
  },
};
const mockOmitAvamatrus = {
  _id: 379,
  films: [],
  shortFilms: [],
  tvShows: ['American Dragon: Jake Long'],
  videoGames: [],
  parkAttractions: [],
  allies: [],
  enemies: [],
  name: 'Avemetrus',
  imageUrl:
    'https://static.wikia.nocookie.net/disney/images/7/70/Avemetrus.png',
  url: 'https://api.disneyapi.dev/characters/379',
};

export const mockCharactersResponse = {
  info: {
    count: 50,
    totalPages: 197,
    previousPage: null,
    nextPage: 'http://api.disneyapi.dev/character?page=2&pageSize=50',
  },
  data: [mockOmitAvamatrus, mockOmitAvatarSingh, mockOmitAuntGertie],
};

export const mockCharactersResponsePage2 = {
  info: {
    count: 50,
    totalPages: 197,
    previousPage: 'http://api.disneyapi.dev/character?page=1&pageSize=50',
    nextPage: 'http://api.disneyapi.dev/character?page=3&pageSize=50',
  },
  data: [mockAuntGertie, mockAvatarSingh, mockAvemetrus],
};
