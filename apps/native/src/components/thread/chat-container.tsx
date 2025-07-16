import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function ChatContainer({ children }: { children: React.ReactNode }) {
    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        maxWidth: theme.widths.md,
    },
}));
