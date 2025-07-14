import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: './src/index.ts',
        permissions: './src/permissions.ts',
        schema: './src/schema.ts',
        types: './src/types.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
});
