import { config } from 'dotenv';
import z from 'zod';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
}

// validating env variables with zod to ensure they are in the correct format
const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  BASE_URL: z.string().default('http://localhost:3333'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
});

export default schema.parse(process.env);
