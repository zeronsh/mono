import { useChat, Chat as ChatStore } from '@ai-sdk/react';
import type {
    UIMessage,
    UIDataTypes,
    UITools,
    ChatTransport,
    ChatOnDataCallback,
    ChatOnFinishCallback,
    ChatOnErrorCallback,
    IdGenerator,
} from 'ai';
import {
    createContext,
    memo,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useSyncExternalStore,
} from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { nanoid } from './utils';

export type ChatProps<
    Metadata = {},
    DataParts extends UIDataTypes = UIDataTypes,
    Tools extends UITools = never,
    UIMessageWithMetaData extends UIMessage<Metadata, DataParts, Tools> = UIMessage<
        Metadata,
        DataParts,
        Tools
    >,
> = {
    // AI SDK v5 props
    id?: string;
    streamId?: string | null;
    generateId?: IdGenerator;
    messages?: UIMessageWithMetaData[];
    transport?: ChatTransport<UIMessageWithMetaData>;
    onData?: ChatOnDataCallback<UIMessageWithMetaData>;
    onFinish?: ChatOnFinishCallback<UIMessageWithMetaData>;
    onError?: ChatOnErrorCallback;
    experimental_throttle?: number;
};

export type UserMessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    message: UIMessageWithMetaData;
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

export type AssistantMessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    message: UIMessageWithMetaData;
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

export type PendingMessageProps = {
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

type MessageProps = {
    id: string;
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

const ChatContext = createContext<ChatStore<any> | undefined>(undefined);

export function useChatStore() {
    const chat = useContext(ChatContext);
    if (!chat) {
        throw new Error('useChatStore must be used within a ChatProvider');
    }
    return chat;
}

export function createChatSelector<UIMessageWithMetaData extends UIMessage = UIMessage>() {
    return function useChatSelector<Return>(
        key: '~registerErrorCallback' | '~registerStatusCallback' | '~registerMessagesCallback',
        selector: (chat: ChatStore<UIMessageWithMetaData>) => Return
    ): Return {
        const chat = useChatStore();
        return useSyncExternalStore(
            chat[key],
            () => selector(chat),
            () => selector(chat)
        );
    };
}

const getMessageIds = (messages: UIMessage[]): readonly string[] => {
    // We cache by the *references* to the message objects
    let cache = (getMessageIds as any)._cache;
    if (!cache) cache = (getMessageIds as any)._cache = new WeakMap();

    if (cache.has(messages)) return cache.get(messages)!;

    const ids = messages.map(m => m.id);
    // freeze to guarantee no accidental mutation
    const frozen = Object.freeze(ids) as readonly string[];
    cache.set(messages, frozen);
    return frozen;
};

export function createChatComponent<
    Metadata = {},
    DataParts extends UIDataTypes = UIDataTypes,
    Tools extends UITools = never,
    UIMessageWithMetaData extends UIMessage<Metadata, DataParts, Tools> = UIMessage<
        Metadata,
        DataParts,
        Tools
    >,
>(options: {
    UserMessage: React.ComponentType<UserMessageProps<UIMessageWithMetaData>>;
    AssistantMessage: React.ComponentType<AssistantMessageProps<UIMessageWithMetaData>>;
    PendingMessage: React.ComponentType<PendingMessageProps>;
    PromptInput: React.ComponentType<any>;
    ChatContainer: React.ComponentType<any>;
    ChatContainerContent: React.ComponentType<any>;
}) {
    const {
        UserMessage,
        AssistantMessage,
        PendingMessage,
        PromptInput,
        ChatContainer,
        ChatContainerContent,
    } = options;

    const useChatSelector = createChatSelector<UIMessageWithMetaData>();

    const Messages = memo(function BaseMessages() {
        const messageIds = useChatSelector('~registerMessagesCallback', chat =>
            getMessageIds(chat.messages)
        );

        return messageIds.map((id, i: number) => (
            <Message
                key={id}
                id={id}
                hasNextMessage={messageIds[i + 1] !== undefined}
                hasPreviousMessage={messageIds[i - 1] !== undefined}
            />
        ));
    });

    const Message = memo(function BaseMessage(props: MessageProps): React.ReactNode[] {
        const { id, hasNextMessage, hasPreviousMessage } = props;

        const message = useChatSelector('~registerMessagesCallback', chat =>
            chat.messages.find(message => message.id === id)
        );

        const children: React.ReactNode[] = [];

        if (!message) {
            return children;
        }

        if (message.role === 'assistant' && message.parts.length > 0) {
            children.push(
                <AssistantMessage
                    key={message.id}
                    message={message}
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={hasPreviousMessage}
                />
            );
        }

        if (message.role === 'assistant' && message.parts.length === 0) {
            children.push(
                <PendingMessage
                    key="pending-message"
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={hasPreviousMessage}
                />
            );
        }

        if (message.role === 'user') {
            children.push(
                <UserMessage
                    key={message.id}
                    message={message}
                    hasPreviousMessage={hasPreviousMessage}
                    hasNextMessage={true}
                />
            );
        }

        if (message.role === 'user' && !props.hasNextMessage) {
            children.push(
                <PendingMessage
                    key="pending-message"
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={true}
                />
            );
        }

        return children;
    });

    const ChatProvider = memo(function BaseChatProvider(props: {
        children: React.ReactNode;
        chat: ChatStore<UIMessageWithMetaData>;
    }) {
        return <ChatContext.Provider value={props.chat}>{props.children}</ChatContext.Provider>;
    });

    const Chat = memo(function BaseChat(
        props: ChatProps<Metadata, DataParts, Tools, UIMessageWithMetaData>
    ) {
        const ref = useRef<ChatStore<UIMessageWithMetaData>>(
            new ChatStore({
                id: props.id,
                generateId: props.generateId,
                messages: props.messages,
                transport: props.transport,
                onData: props.onData,
                onFinish: props.onFinish,
                onError: props.onError,
            })
        );

        const chat = useChat<UIMessageWithMetaData>({
            experimental_throttle: props.experimental_throttle,
            chat: ref.current,
        });

        const debouncedStatus = useDebounce(chat.status, 100);

        useEffect(() => {
            if (debouncedStatus === 'ready' && props.messages) {
                chat.setMessages(props.messages);
            }
        }, [debouncedStatus, props.messages]);

        useEffect(() => {
            if (props.streamId && chat.messages && chat.status === 'ready') {
                const lastMessage = chat.messages.at(-1);
                if (lastMessage && lastMessage.role === 'user') {
                    chat.resumeStream();
                }
            }
        }, [props.streamId, chat.messages, chat.status]);

        return (
            <ChatProvider chat={ref.current}>
                <ChatContainer>
                    <ChatContainerContent>
                        <Messages />
                    </ChatContainerContent>
                    <PromptInput />
                </ChatContainer>
            </ChatProvider>
        );
    });

    const ChatRoot = memo(function BaseChatRoot(
        props: ChatProps<Metadata, DataParts, Tools, UIMessageWithMetaData>
    ) {
        const generateId = props.generateId ?? nanoid;

        const id = useMemo(() => {
            if (props.id) {
                return props.id;
            }

            return generateId();
        }, [props.id, generateId]);

        return (
            <Chat
                key={id}
                id={id}
                streamId={props.streamId}
                generateId={generateId}
                messages={props.messages}
                transport={props.transport}
                onData={props.onData}
                onFinish={props.onFinish}
                onError={props.onError}
            />
        );
    });
    return {
        Chat: ChatRoot,
    };
}
