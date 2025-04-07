import { defineConfig } from 'vitest/config'
import { resolve } from "node:path";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src")
      }
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/vitest/setup.ts',
    include: ['**/tests/vitest/**/*.{test,spec}.?(c|m)[jt]s?(x)']
  },
  envDir: '../',
  assetsInclude: ['**/public/**/*.json'],
  esbuild: {
    legalComments: 'none',
  }
});
