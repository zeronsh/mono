import { schema, Schema } from '@zeron/sync/schema';
import { Zero } from '@rocicorp/zero';
import { ZeroProvider } from '@rocicorp/zero/react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { env } from '@/lib/env';
import { authClient } from '@/lib/auth';

const DatabaseContext = createContext<Zero<Schema> | undefined>(undefined);

export function useDatabase() {
    const database = useContext(DatabaseContext);

    if (!database) {
        throw new Error('useZero must be used within a ZeroProvider');
    }

    return database;
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();
    const [isZeroReady, setIsZeroReady] = useState(false);

    const zero = useMemo(() => {
        if (!session) {
            return undefined;
        }

        if (!session.user) {
            return undefined;
        }

        try {
            const zeroInstance = new Zero({
                userID: session.user.id,
                server: env.EXPO_PUBLIC_ZERO_URL,
                auth: async () => {
                    if (session) {
                        const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/auth/token`, {
                            credentials: 'include',
                        });
                        const data = await response.json();
                        return data.token;
                    }
                },
                schema,
                kvStore: 'mem',
            });

            // Mark zero as ready after a brief delay to ensure React context is established
            setTimeout(() => setIsZeroReady(true), 0);
            return zeroInstance;
        } catch (error) {
            console.error('Failed to initialize Zero:', error);
            return undefined;
        }
    }, [session]);

    useEffect(() => {
        if (!session && !isPending) {
            // If the user is not signed in, sign them in as an anonymous user
            authClient.signIn.anonymous();
        }
    }, [session, isPending]);

    if (isPending || !session || !zero || !isZeroReady) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#000',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <DatabaseContext.Provider value={zero}>
            <ZeroProvider zero={zero}>{children}</ZeroProvider>
        </DatabaseContext.Provider>
    );
}
