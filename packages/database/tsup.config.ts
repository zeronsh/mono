import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: './src/index.ts',
        schema: './src/schema.ts',
        queries: './src/queries.ts',
        zero: './src/zero.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
});
