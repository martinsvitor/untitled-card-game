import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            reporter: ['text', 'json', 'html'],
            enabled: true,
            reportsDirectory:'./tests/unit/coverage'
        },
    },
})