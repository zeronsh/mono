import { Button } from '@/components/ui/button';
import { useChatStore } from '@zeron/ai/react';
import { useState } from 'react';
import { View, TextInput } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function PromptInput() {
    const { sendMessage } = useChatStore();
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage({
                text: message,
            });
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
                placeholderTextColor={styles.placeholder.color}
                multiline
                maxLength={1000}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
            />
            <Button
                title="Send"
                onPress={handleSendMessage}
                disabled={!message.trim()}
                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            />
        </View>
    );
}

const styles = StyleSheet.create((theme, rt) => ({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: theme.utils.spacing(6),
        borderTopLeftRadius: theme.utils.spacing(6),
        borderTopRightRadius: theme.utils.spacing(6),
        paddingBottom: rt.insets.bottom + theme.utils.spacing(6),
        backgroundColor: theme.colors.backgroundSecondary,
    },
    textInput: {
        flex: 1,
        borderRadius: 20,
        maxHeight: 120,
        minHeight: 40,
        fontSize: 16,
        color: theme.colors.typography,
        width: '100%',
        _web: {
            outline: 'none',
            _placeholder: {
                color: theme.colors.azureRadiance,
            },
        },
    },
    placeholder: {
        color: theme.colors.typography + '60',
    },
    sendButton: {
        paddingHorizontal: theme.utils.spacing(theme.margins.lg),
        paddingVertical: theme.utils.spacing(theme.margins.sm),
        minHeight: 40,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
}));
