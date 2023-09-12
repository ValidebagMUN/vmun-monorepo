import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

neonConfig.fetchConnectionCache = true;
 
export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
