// import { defineConfig } from "drizzle-kit";
// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./utils/schema.js",
//   dbCredentials:{
//     url:"postgresql://ai-mock-interview_owner:2sOlv7piCSdm@ep-quiet-glitter-a5didt55.us-east-2.aws.neon.tech/ai-mock-interview?sslmode=require"
//   }
// });
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env.local' });

export default defineConfig({
  schema: "./utils/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    // url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
    url:"postgresql://ai-mock-interview_owner:2sOlv7piCSdm@ep-quiet-glitter-a5didt55.us-east-2.aws.neon.tech/ai-mock-interview?sslmode=require",
  },
});