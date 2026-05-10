import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './src/mocks/node';
import { configure } from '@testing-library/react';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

configure({
  getElementError: (message, container) => {
    const error = new Error(message);
    return error;
  },
});
