import env from '@/env';
import { PrismaClient } from '@prisma/client';

const shouldLog = env.NODE_ENV === 'development';

export const prisma = new PrismaClient({
  log: shouldLog ? ['query', 'info', 'warn', 'error'] : [],
});
