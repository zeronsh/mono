import { PendingMessageProps } from '@zeron/ai/react';
import { ActivityIndicator, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function PendingMessage(props: PendingMessageProps) {
    const { hasNextMessage, hasPreviousMessage } = props;

    styles.useVariants({
        hasNextMessage,
        hasPreviousMessage,
    });

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#fff" />
        </View>
    );
}

const styles = StyleSheet.create(theme => ({
    container: {
        paddingVertical: theme.utils.spacing(3),
        variants: {
            hasNextMessage: {
                false: {
                    paddingBottom: theme.utils.spacing(6),
                },
            },
            hasPreviousMessage: {
                false: {
                    paddingTop: theme.utils.spacing(6),
                },
            },
        },
    },
}));
