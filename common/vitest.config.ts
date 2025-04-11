import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['**/*.spec.ts'],
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: 'html',
            reportsDirectory: './coverage'
        },
        globals: true
    }
});