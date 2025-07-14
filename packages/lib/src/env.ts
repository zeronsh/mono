import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        ZERO_UPSTREAM_DB: z.url(),
        AI_GATEWAY_API_KEY: z.string().min(1),
        APP_URL: z.url(),
        APP_SCHEME: z.string().min(1),
    },
    clientPrefix: 'EXPO_PUBLIC_',
    client: {
        EXPO_PUBLIC_API_URL: z.url(),
        EXPO_PUBLIC_ZERO_URL: z.url(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
