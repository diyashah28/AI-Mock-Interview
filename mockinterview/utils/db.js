// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import * as schema from './schema'
// const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
// export const db = drizzle(sql, {schema});
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" }); // or .env.local

// const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
const sql=neon("postgresql://ai-mock-interview_owner:2sOlv7piCSdm@ep-quiet-glitter-a5didt55.us-east-2.aws.neon.tech/ai-mock-interview?sslmode=require");
export const db = drizzle({ client: sql });