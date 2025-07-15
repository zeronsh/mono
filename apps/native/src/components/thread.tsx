import { createChatComponent } from '@zeron/ai/react';
import { View } from 'react-native';

export const {
    Chat: Thread,
    useChatSelector: useThreadSelector,
    useChatStore: useThreadStore,
} = createChatComponent({
    ChatContainer: View,
    ChatContainerContent: View,
    AssistantMessage: () => <View />,
    UserMessage: () => <View />,
    PendingMessage: () => <View />,
    PromptInput: () => <View />,
});
