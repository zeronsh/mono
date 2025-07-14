import * as schema from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from './env';

export const db = drizzle(env.ZERO_UPSTREAM_DB, { schema });

export { schema };
