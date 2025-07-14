import { env } from './env';
import { anonymousClient, magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    baseURL: env.EXPO_PUBLIC_API_URL,
    plugins: [magicLinkClient(), anonymousClient()],
});
