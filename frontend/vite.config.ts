import { defineConfig } from 'vitest/config'
import { resolve } from "node:path";
import react from '@vitejs/plugin-react'
import { PluginOption } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), /*visualizer({
    emitFile: true,
    filename: 'stats.html'
  }) as PluginOption*/],
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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          common: ['trucksim-completionist-common'],
          reactVendor: ['react', 'react-dom']
        }
      }
    }
  }
});
