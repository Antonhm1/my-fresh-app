/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./backend/test/setup.ts'],
    include: ['backend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['node_modules', 'dist', 'e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['backend/**/*.{js,ts}'],
      exclude: [
        'backend/**/*.{test,spec}.{js,ts}',
        'backend/test/**/*',
        'backend/**/*.d.ts',
      ],
      thresholds: {
        global: {
          branches: 75,
          functions: 75,
          lines: 75,
          statements: 75,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@backend': path.resolve(__dirname, './backend'),
    },
  },
})
