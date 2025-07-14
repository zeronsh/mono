import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
    out: './drizzle',
    schema: './src/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.ZERO_UPSTREAM_DB,
    },
});
