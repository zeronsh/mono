import { match } from 'ts-pattern';
import { MessagePart } from '@zeron/ai/types';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function Part({ part }: { part: MessagePart }) {
    return match(part)
        .with({ type: 'text' }, ({ text }) => <Text style={styles.text}>{text}</Text>)
        .otherwise(() => null);
}

const styles = StyleSheet.create(theme => ({
    text: {
        color: theme.colors.typography,
        fontSize: 16,
    },
}));
