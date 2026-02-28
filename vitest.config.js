import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './test/setupTests.jsx',
        coverage: {
            provider: 'v8', // changing 'c8' to 'v8' as c8 is deprecated in newer vitest versions
            reporter: ['text', 'lcov'],
            exclude: ['server/**', 'node_modules/**']
        }
    }
});
