import {
    AIError,
    convertUIMessagesToModelMessages,
    createResumeStreamResponse,
    createUIMessageStreamResponse,
} from '@zeron/ai';
import { ThreadMessage } from '@zeron/ai/types';
import { db } from '@zeron/database';
import * as queries from '@zeron/database/queries';
import { convertToModelMessages, generateText, smoothStream } from 'ai';
import { createResumableStreamContext } from 'resumable-stream';
import z from 'zod';
import { auth } from './auth';
import { nanoid } from '@zeron/ai/utils';

type ThreadErrorCodes =
    | 'ThreadAlreadyStreaming'
    | 'ThreadNotFound'
    | 'StreamNotFound'
    | 'NotAuthorized'
    | 'ModelNotFound';

class ThreadError extends AIError<ThreadErrorCodes> {}

const streamContext = createResumableStreamContext({
    waitUntil: promise => promise,
});

async function prepareThread(args: {
    userId: string;
    threadId: string;
    streamId: string;
    modelId: string;
    message: ThreadMessage;
}) {
    return db.transaction(async tx => {
        let [thread, message, model] = await Promise.all([
            queries.getThreadById(tx, args.threadId),
            queries.getMessageById(tx, args.message.id),
            queries.getModelById(tx, args.modelId),
        ]);

        if (!model) {
            throw new ThreadError('ModelNotFound', {
                status: 404,
                message: 'Model with (modelId) does not exist',
                metadata: {
                    modelId: args.modelId,
                },
            });
        }

        if (!thread) {
            [thread] = await queries.createThread(tx, {
                userId: args.userId,
                threadId: args.threadId,
            });
        }

        if (thread.status === 'streaming') {
            throw new ThreadError('ThreadAlreadyStreaming', {
                metadata: {
                    threadId: args.threadId,
                },
            });
        }

        if (thread.userId !== args.userId) {
            throw new ThreadError('NotAuthorized', {
                message: 'User is not the owner of the thread',
                metadata: {
                    threadId: args.threadId,
                },
            });
        }

        await queries.updateThread(tx, {
            threadId: args.threadId,
            status: 'streaming',
            streamId: args.streamId,
            updatedAt: new Date(),
        });

        if (!message) {
            [message] = await queries.createMessage(tx, {
                threadId: args.threadId,
                userId: args.userId,
                message: args.message,
            });
        }

        if (message) {
            [[message]] = await Promise.all([
                queries.updateMessage(tx, {
                    messageId: args.message.id,
                    message: args.message,
                    updatedAt: new Date(),
                }),
                queries.deleteTrailingMessages(tx, {
                    threadId: args.threadId,
                    messageId: args.message.id,
                    messageCreatedAt: message.createdAt,
                }),
            ]);
        }

        const history = await queries.getThreadMessageHistory(tx, args.threadId);

        return {
            model,
            thread,
            message,
            history,
        };
    });
}

async function prepareResumeThread(args: { threadId: string; userId: string }) {
    const thread = await queries.getThreadById(db, args.threadId);

    if (!thread) {
        throw new ThreadError('ThreadNotFound', {
            status: 404,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    if (thread.userId !== args.userId) {
        throw new ThreadError('NotAuthorized', {
            status: 403,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    if (!thread.streamId) {
        throw new ThreadError('StreamNotFound', {
            status: 404,
            metadata: {
                threadId: args.threadId,
                userId: args.userId,
            },
        });
    }

    return thread.streamId;
}

async function generateThreadTitle(threadId: string, message: ThreadMessage) {
    const { text } = await generateText({
        model: 'google/gemini-2.0-flash-001',
        system: `\nc
        - you will generate a short title based on the first message a user begins a conversation with
        - ensure it is not more than 80 characters long
        - the title should be a summary of the user's message
        - do not use quotes or colons`,
        temperature: 0.8,
        messages: convertToModelMessages([message]),
    });

    await queries.updateThreadTitle(db, {
        threadId,
        title: text,
    });
}

async function saveMessageAndResetThreadStatus({
    threadId,
    userId,
    message,
}: {
    threadId: string;
    userId: string;
    message: ThreadMessage;
}) {
    await db.transaction(async tx => {
        await Promise.all([
            await queries.createMessage(tx, {
                threadId,
                userId,
                message,
            }),
            await queries.updateThread(tx, {
                threadId,
                status: 'ready',
                streamId: null,
            }),
        ]);
    });
}

export function createThreadPostHandler(request: Bun.BunRequest<'/api/chat'>) {
    return createUIMessageStreamResponse<ThreadMessage>()({
        request,
        schema: z.object({
            id: z.string(),
            modelId: z.string(),
            message: z.any(),
        }),
        onPrepare: async ({ body, request }) => {
            const session = await auth.api.getSession({
                headers: request.headers,
            });

            if (!session) {
                throw new ThreadError('NotAuthorized');
            }

            const streamId = nanoid();

            const { history, thread, message, model } = await prepareThread({
                streamId,
                modelId: body.modelId,
                userId: session.user.id,
                threadId: body.id,
                message: body.message,
            });

            return {
                streamId,
                threadId: thread.id,
                userId: session.user.id,
                model,
                thread,
                message,
                messages: await convertUIMessagesToModelMessages(history, {
                    supportsImages: model.capabilities.includes('vision'),
                    supportsDocuments: model.capabilities.includes('documents'),
                }),
            };
        },
        onStream: ({ context: { messages, model } }) => {
            return {
                model: model.model,
                messages,
                temperature: 0.8,
                experimental_transform: smoothStream({
                    chunking: 'word',
                }),
            };
        },
        onStreamMessageMetadata: ({ part, context: { model } }) => {
            if (part.type === 'start') {
                return {
                    model: {
                        id: model.id,
                        name: model.name,
                        icon: model.icon,
                    },
                };
            }
        },
        onAfterStream: async ({ context: { threadId, message, streamId, thread }, stream }) => {
            const promises: Promise<any>[] = [];

            if (!thread.title) {
                promises.push(generateThreadTitle(threadId, message.message));
            }

            promises.push(streamContext.createNewResumableStream(streamId, () => stream));

            await Promise.all(promises);
        },
        onStreamError: ({ error, writer }) => {
            console.error(error);
            writer.write({
                type: 'data-error',
                data: 'Error generating response.',
            });
        },
        onFinish: async ({ responseMessage, context: { threadId, userId } }) => {
            await saveMessageAndResetThreadStatus({
                threadId,
                userId,
                message: responseMessage,
            });
        },
    });
}

export function createThreadGetHandler(request: Bun.BunRequest<'/api/chat/:threadId/stream'>) {
    return createResumeStreamResponse({
        streamContext,
        onPrepare: async () => {
            const threadId = request.params.threadId;

            const session = await auth.api.getSession({
                headers: request.headers,
            });

            if (!session) {
                throw new ThreadError('NotAuthorized');
            }

            const streamId = await prepareResumeThread({
                threadId,
                userId: session.user.id,
            });

            return streamId;
        },
    });
}
