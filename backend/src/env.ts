import z from 'zod';

// validating env variables with zod to ensure they are in the correct format
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_BASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
});

export default schema.parse(process.env);
