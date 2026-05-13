import { HttpHandler } from 'msw';
export declare const getCharactersHandler: () => HttpHandler;
export declare const getCharactersPageTwoHandler: () => HttpHandler;
export declare const getSingleCharacterHandler: () => HttpHandler;
export declare const getCharactersNotFoundHandler: () => HttpHandler;
export declare const getErrorResponseHandler: () => HttpHandler;
export declare const handlers: HttpHandler[];
