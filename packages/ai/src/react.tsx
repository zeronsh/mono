import { useChat } from '@ai-sdk/react';
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
import { Fragment, memo, useEffect, useMemo } from 'react';
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
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    message: UIMessageWithMetaData;
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

export type AssistantMessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    message: UIMessageWithMetaData;
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

export type PendingMessageProps = {
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

export type PromptInputProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    stop: ReturnType<typeof useChat<UIMessageWithMetaData>>['stop'];
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    id: string;
};

type MessageProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    message: UIMessageWithMetaData;
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
    hasNextMessage: boolean;
    hasPreviousMessage: boolean;
};

type MessagesProps<UIMessageWithMetaData extends UIMessage = UIMessage> = {
    messages: UIMessageWithMetaData[];
    status: ReturnType<typeof useChat<UIMessageWithMetaData>>['status'];
    sendMessage: ReturnType<typeof useChat<UIMessageWithMetaData>>['sendMessage'];
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
    PromptInput: React.ComponentType<PromptInputProps<UIMessageWithMetaData>>;
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

    const Messages = memo(function Messages(props: MessagesProps<UIMessageWithMetaData>) {
        return props.messages.map((message, i) => (
            <Message
                key={message.id}
                status={props.status}
                message={message}
                sendMessage={props.sendMessage}
                hasNextMessage={props.messages[i + 1] !== undefined}
                hasPreviousMessage={props.messages[i - 1] !== undefined}
            />
        ));
    });

    const Message = memo(function Message(props: MessageProps<UIMessageWithMetaData>) {
        const { status, message, sendMessage, hasNextMessage, hasPreviousMessage } = props;

        if (message.role === 'assistant' && message.parts.length > 0) {
            return (
                <AssistantMessage
                    status={status}
                    message={message}
                    sendMessage={sendMessage}
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={hasPreviousMessage}
                />
            );
        }

        if (message.role === 'assistant' && message.parts.length === 0) {
            return (
                <PendingMessage
                    hasNextMessage={hasNextMessage}
                    hasPreviousMessage={hasPreviousMessage}
                />
            );
        }

        if (message.role === 'user' && !props.hasNextMessage) {
            return (
                <Fragment>
                    <UserMessage
                        status={status}
                        message={message}
                        sendMessage={sendMessage}
                        hasPreviousMessage={hasPreviousMessage}
                        hasNextMessage={true}
                    />
                    <PendingMessage hasNextMessage={hasNextMessage} hasPreviousMessage={true} />
                </Fragment>
            );
        }

        return (
            <UserMessage
                status={status}
                message={message}
                sendMessage={sendMessage}
                hasPreviousMessage={hasPreviousMessage}
                hasNextMessage={hasNextMessage}
            />
        );
    });

    function Chat(props: ChatProps<Metadata, DataParts, Tools, UIMessageWithMetaData>) {
        const helpers = useChat<UIMessageWithMetaData>({
            id: props.id,
            generateId: props.generateId,
            experimental_throttle: props.experimental_throttle,
            messages: props.messages,
            transport: props.transport,
            onData: props.onData,
            onFinish: props.onFinish,
            onError: props.onError,
        });

        const debouncedStatus = useDebounce(helpers.status, 100);

        useEffect(() => {
            if (debouncedStatus === 'ready' && props.messages) {
                helpers.setMessages(props.messages);
            }
        }, [debouncedStatus, props.messages]);

        useEffect(() => {
            if (props.streamId && helpers.messages && helpers.status === 'ready') {
                const lastMessage = helpers.messages.at(-1);
                if (lastMessage && lastMessage.role === 'user') {
                    helpers.resumeStream();
                }
            }
        }, [props.streamId, helpers.messages, helpers.status]);

        return (
            <ChatContainer>
                <ChatContainerContent>
                    <Messages
                        status={helpers.status}
                        messages={helpers.messages}
                        sendMessage={helpers.sendMessage}
                    />
                </ChatContainerContent>
                <PromptInput
                    id={helpers.id}
                    status={helpers.status}
                    stop={helpers.stop}
                    sendMessage={helpers.sendMessage}
                />
            </ChatContainer>
        );
    }

    return memo(function ChatRoot(
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
}
