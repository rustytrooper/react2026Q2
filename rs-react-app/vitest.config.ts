import { defaultExclude, defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      pool: 'forks',
      coverage: {
        provider: 'v8',
        exclude: [
          ...defaultExclude,
          'src/**/*.test.{js,jsx,ts,tsx}',
          'src/**/*.spec.{js,jsx,ts,tsx}',
          'src/index.{js,jsx,ts,tsx}',
          'src/setupTests.{js,ts}',
          'src/**/*.d.ts',
          'src/app.tsx',
          '**/constants.ts',
          '**/types.ts',
          '**/types',
          '**/__mocks__',
          '**/coverage',
        ],
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        thresholds: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 80,
        },
      },
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.ts'],
      testTimeout: 60000,
      hookTimeout: 60000,
      isolate: false,
    },
  })
);
