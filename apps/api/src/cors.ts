import { env } from './env';

export function cors<T extends Bun.BunRequest>(
    handler: ((request: T) => Promise<Response>) | Response
) {
    return async (request: T) => {
        const response = handler instanceof Response ? handler : await handler(request);
        response.headers.set('Access-Control-Allow-Origin', env.APP_URL);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        return response;
    };
}
