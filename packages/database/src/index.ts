import * as schema from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(process.env.ZERO_UPSTREAM_DB!, { schema });

export { schema };
