import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

export default defineConfig({
    test: {
        include: ['**/*.spec.ts'],
        exclude: ['node_modules/**'],
        dir: 'tests/',
        globals: true,
        silent: 'passed-only',
    },
    env: {
        ...config({ path: '../.env.test.local'}).parsed,
    }
});