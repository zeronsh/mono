import { Part } from '@/components/thread/part';
import { AssistantMessageProps } from '@zeron/ai/react';
import { ThreadMessage } from '@zeron/ai/types';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function AssistantMessage(props: AssistantMessageProps<ThreadMessage>) {
    const { message, hasNextMessage, hasPreviousMessage } = props;

    styles.useVariants({
        hasNextMessage,
        hasPreviousMessage,
    });

    return (
        <View style={styles.container}>
            {message.parts.map(part => (
                <Part part={part} />
            ))}
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
