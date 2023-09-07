import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
 
neonConfig.fetchConnectionCache = true;
 
export const sql = neon(process.env.DATABASE_URL!);
export const db: NeonHttpDatabase = drizzle(sql);
