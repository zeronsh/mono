import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function ChatContainerContent({ children }: { children: React.ReactNode }) {
    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: theme.utils.spacing(4),
    },
}));
