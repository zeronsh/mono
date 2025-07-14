import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        types: './src/types.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
});
