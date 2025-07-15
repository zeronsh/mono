import { db, schema } from '@zeron/database';
import * as queries from '@zeron/database/queries';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { anonymous, jwt, magicLink } from 'better-auth/plugins';
import { env } from './env';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    trustedOrigins: [env.APP_SCHEME, env.APP_URL],
    advanced: {
        cookiePrefix: 'zeron-native',
        crossSubDomainCookies: {
            enabled: true,
        },
    },
    databaseHooks: {
        user: {
            create: {
                after: async user => {
                    await queries.createSettings(db, { userId: user.id });
                },
            },
        },
    },
    plugins: [
        jwt(),
        magicLink({
            sendMagicLink: async ({ email, token, url }) => {
                // Implement your magic link sending logic here
                console.log({
                    email,
                    token,
                    url,
                });
            },
        }),
        anonymous({
            onLinkAccount: async ({ anonymousUser, newUser }) => {
                const existingSettings = await queries.getSettingsByUserId(
                    db,
                    anonymousUser.user.id
                );

                if (existingSettings) {
                    await queries.updateSettings(db, {
                        userId: newUser.user.id,
                        settings: {
                            userId: newUser.user.id,
                        },
                    });
                }

                await queries.transferChatsFromAnonymousToUser(db, {
                    anonymousUserId: anonymousUser.user.id,
                    userId: newUser.user.id,
                });

                await queries.transferMessagesFromAnonymousToUser(db, {
                    anonymousUserId: anonymousUser.user.id,
                    userId: newUser.user.id,
                });
            },
        }),
    ],
});
