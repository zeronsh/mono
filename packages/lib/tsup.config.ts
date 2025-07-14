import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        thread: './src/thread.ts',
        'auth-client': './src/auth-client.ts',
        auth: './src/auth.ts',
        env: './src/env.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
});
