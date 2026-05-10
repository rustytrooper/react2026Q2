import { http, HttpHandler, HttpResponse } from 'msw';

import {
  mockAchilles,
  mockCharackterNotFoundResponse,
  mockCharactersResponse,
  mockCharactersResponsePage2,
  mockAuntGertie,
} from './mockData';

export const getCharactersHandler = () => {
  return http.get('https://api.disneyapi.dev/character', ({ request }) => {
    const url = new URL(request.url);

    const characterName = url.searchParams.get('name');

    if (characterName && characterName.toLowerCase() === 'achilles') {
      return HttpResponse.json(mockAchilles);
    }

    return HttpResponse.json(mockCharactersResponse);
  });
};

export const getCharactersPageTwoHandler = () => {
  return http.get('https://api.disneyapi.dev/character?page=2', () => {
    return HttpResponse.json(mockCharactersResponsePage2);
  });
};

export const getSingleCharacterHandler = () => {
  return http.get(
    'https://api.disneyapi.dev/character' + '/:id',
    ({ params }) => {
      if (params.id !== '367') {
        return HttpResponse.json(null);
      }
      return HttpResponse.json(mockAuntGertie);
    }
  );
};

export const getCharactersNotFoundHandler = () => {
  return http.get('https://api.disneyapi.dev/character', () => {
    return HttpResponse.json(mockCharackterNotFoundResponse);
  });
};

export const getErrorResponseHandler = () => {
  return http.get('https://api.disneyapi.dev/character', () => {
    return HttpResponse.json(null, { status: 404 });
  });
};

export const handlers: HttpHandler[] = [
  getCharactersHandler(),
  getSingleCharacterHandler(),
];
