import { serve } from 'bun';
import { handleThreadPostRequest, handleThreadResumeGetRequest } from './thread';
import { auth } from './auth';
import { cors } from './cors';

const server = serve({
    routes: {
        '/*': {
            OPTIONS: cors(new Response(null, { status: 200 })),
        },
        '/api/chat': {
            POST: cors(handleThreadPostRequest),
        },
        '/api/chat/:threadId/stream': {
            GET: cors(handleThreadResumeGetRequest),
        },
        '/api/auth/*': {
            POST: cors(auth.handler),
            GET: cors(auth.handler),
        },
    },
});

console.log(`Listening on ${server.url}`);
