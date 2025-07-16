import { AssistantMessage } from '@/components/thread/assistant-message';
import { ChatContainer } from '@/components/thread/chat-container';
import { ChatContainerContent } from '@/components/thread/chat-container-content';
import { PendingMessage } from '@/components/thread/pending-message';
import { PromptInput } from '@/components/thread/prompt-input';
import { UserMessage } from '@/components/thread/user-message';
import { createChatComponent } from '@zeron/ai/react';

export const { Chat: Thread } = createChatComponent({
    ChatContainer,
    ChatContainerContent,
    AssistantMessage,
    UserMessage,
    PendingMessage,
    PromptInput,
});
