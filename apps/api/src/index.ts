import { serve } from 'bun';
import { handleThreadPostRequest, handleThreadResumeGetRequest } from './thread';
import { auth } from './auth';
import { cors } from './cors';

const server = serve({
    routes: {
        '/api/chat': {
            POST: cors(handleThreadPostRequest),
            OPTIONS: cors(new Response(null, { status: 200 })),
        },
        '/api/chat/:threadId/stream': {
            GET: cors(handleThreadResumeGetRequest),
            OPTIONS: cors(new Response(null, { status: 200 })),
        },
        '/api/auth/*': {
            GET: cors(auth.handler),
            POST: cors(auth.handler),
            OPTIONS: cors(new Response(null, { status: 200 })),
        },
    },
});

console.log(`Listening on ${server.url}`);
