import { useUnistyles } from 'react-native-unistyles';

import { Stack } from 'expo-router';
import { DatabaseProvider } from '@/context/database';

export default function Layout() {
    const { theme } = useUnistyles();

    return (
        <DatabaseProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTitleStyle: {
                        color: theme.colors.typography,
                    },
                    headerTintColor: theme.colors.typography,
                }}
            />
        </DatabaseProvider>
    );
}
