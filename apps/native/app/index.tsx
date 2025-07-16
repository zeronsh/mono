import { Stack } from 'expo-router';

import { Container } from '@/components/Container';
import { Thread } from '@/components/thread';
import { DefaultChatTransport } from 'ai';
import { env } from '@/lib/env';
import { useDatabase } from '@/context/database';
import { useSettings } from '@/hooks/use-settings';

export default function Home() {
    useSettings();
    const db = useDatabase();

    return (
        <>
            <Stack.Screen options={{ title: 'Home' }} />
            <Container>
                <Thread
                    transport={
                        new DefaultChatTransport({
                            api: env.EXPO_PUBLIC_API_URL + '/api/chat',
                            credentials: 'include',
                            prepareSendMessagesRequest: async ({ id, messages }) => {
                                const settings = db.query.setting
                                    .where('userId', '=', db.userID)
                                    .one()
                                    .materialize();
                                return {
                                    body: {
                                        id,
                                        message: messages.at(-1),
                                        modelId: settings.data?.modelId,
                                    },
                                };
                            },
                        })
                    }
                />
            </Container>
        </>
    );
}
