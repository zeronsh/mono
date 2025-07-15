import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        ZERO_UPSTREAM_DB: z.url(),
        AI_GATEWAY_API_KEY: z.string().min(1),
        APP_URL: z.url(),
        APP_SCHEME: z.string().min(1),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
