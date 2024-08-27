import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    include: [
      'frontend/**/*.test.{js,jsx,ts,tsx}',  // This will include only test files under the frontend directory
      'frontend/**/__tests__/*.{js,jsx,ts,tsx}'  // This will include only files in __tests__ directories under the frontend directory
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'lcov', 'clover'],
      reportsDirectory: './frontend/coverage',
      all: true,
      include: [
        'frontend/src/**/*.{js,jsx}'
      ],
      exclude: [
        '**/*.test.{js,jsx,ts,tsx}',
        'frontend/src/setupTests.js',
        'frontend/src/reportWebVitals.js',
        'node_modules/',
        'frontend/src/models/',
        'frontend/src/App.jsx',
        'frontend/src/main.jsx',
        'frontend/src/styles/',
        'frontend/src/utils/',
        'frontend/src/components/EditBar.jsx',
        'frontend/src/components/EditWindow.jsx',
        'frontend/src/functions/loginFunctions.jsx',
        'frontend/src/functions/CourseFunctions.jsx',
      ]
    }
  }
});