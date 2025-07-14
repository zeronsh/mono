import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        ZERO_UPSTREAM_DB: z.string().url(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
