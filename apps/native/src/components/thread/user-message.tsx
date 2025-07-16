import { Part } from '@/components/thread/part';
import { UserMessageProps } from '@zeron/ai/react';
import { ThreadMessage } from '@zeron/ai/types';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function UserMessage(props: UserMessageProps<ThreadMessage>) {
    const { message, hasNextMessage, hasPreviousMessage } = props;

    styles.useVariants({
        hasNextMessage,
        hasPreviousMessage,
    });

    return (
        <View style={styles.container}>
            <View style={styles.message}>
                {message.parts.map((part, i) => (
                    <Part key={i} part={part} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create(theme => ({
    container: {
        paddingVertical: theme.utils.spacing(3),
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
    message: {
        maxWidth: '70%',
        padding: theme.utils.spacing(5),
        backgroundColor: theme.colors.cornflowerBlue,
        borderTopLeftRadius: theme.utils.spacing(10),
        borderTopRightRadius: theme.utils.spacing(10),
        borderBottomLeftRadius: theme.utils.spacing(10),
        borderBottomRightRadius: theme.utils.spacing(3),
        color: theme.colors.typography,
    },
}));
