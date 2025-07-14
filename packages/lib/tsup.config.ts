import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        chat: './src/chat.ts',
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
