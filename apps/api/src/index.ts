import z from 'zod';
import { serve } from 'bun';
import { smoothStream } from 'ai';
import type { ThreadMessage } from '@mono/ai/types';
import {
    convertUIMessagesToModelMessages,
    createResumeStreamResponse,
    createUIMessageStreamResponse,
} from '@mono/ai';
import {
    ThreadError,
    generateThreadTitle,
    prepareResumeThread,
    prepareThread,
    saveMessageAndResetThreadStatus,
    streamContext,
} from '@mono/lib/thread';
import { nanoid } from '@mono/ai/utils';
import { auth } from '@mono/lib/auth';

const server = serve({
    routes: {
        '/api/chat': {
            POST: request => {
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
                    onAfterStream: async ({
                        context: { threadId, message, streamId, thread },
                        stream,
                    }) => {
                        const promises: Promise<any>[] = [];

                        if (!thread.title) {
                            promises.push(generateThreadTitle(threadId, message.message));
                        }

                        promises.push(
                            streamContext.createNewResumableStream(streamId, () => stream)
                        );

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
            },
        },
        '/api/chat/:threadId/stream': {
            GET: request => {
                return createResumeStreamResponse({
                    streamContext,
                    onPrepare: async () => {
                        const session = await auth.api.getSession({
                            headers: request.headers,
                        });

                        if (!session) {
                            throw new ThreadError('NotAuthorized');
                        }

                        const threadId = request.params.threadId;

                        const streamId = await prepareResumeThread({
                            threadId,
                            userId: session.user.id,
                        });

                        return streamId;
                    },
                });
            },
        },
    },
});

console.log(`Listening on ${server.url}`);
