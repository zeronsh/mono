import { env } from './env';

export function cors<T extends Bun.BunRequest>(
    handler: ((request: T) => Promise<Response>) | Response
) {
    return async (request: T) => {
        const response = handler instanceof Response ? handler : await handler(request);

        // Get origin from request
        const origin = request.headers.get('origin');
        const allowedOrigins = [env.APP_URL, env.APP_SCHEME];

        // Set CORS headers (use set instead of append to prevent duplicates)
        if (origin && allowedOrigins.includes(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin);
        } else if (!origin) {
            // For same-origin requests or when origin is not present
            response.headers.set('Access-Control-Allow-Origin', env.APP_URL);
        }

        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, X-Requested-With'
        );
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

        // Add Vary header to indicate that the response varies based on Origin
        response.headers.set('Vary', 'Origin');

        return response;
    };
}
