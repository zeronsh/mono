import { env } from '@/lib/env';
import { anonymousClient, magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
    baseURL: env.EXPO_PUBLIC_API_URL,
    plugins: [
        magicLinkClient(),
        anonymousClient(),
        expoClient({
            scheme: 'zeron',
            storagePrefix: 'zeron',
            storage: SecureStore,
        }),
    ],
});
