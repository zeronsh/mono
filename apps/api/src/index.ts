import { serve } from 'bun';
import { handleThreadPostRequest, handleThreadResumeGetRequest } from '@zeron/lib/thread';
import { auth } from '@zeron/lib/auth';

const server = serve({
    routes: {
        '/api/chat': {
            POST: request => {
                return handleThreadPostRequest(request);
            },
        },
        '/api/chat/:threadId/stream': {
            GET: request => {
                return handleThreadResumeGetRequest(request);
            },
        },
        '/api/auth/*': {
            POST: request => {
                return auth.handler(request);
            },
            GET: request => {
                return auth.handler(request);
            },
        },
    },
});

console.log(`Listening on ${server.url}`);
