import { FastifyInstance } from 'fastify';

import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { signupAdmin } from './admin/signup';
import errorHandler from '@/error-handler';
import { loginAdmin } from './admin/login';
import { logoutAdmin } from './admin/logout';

export async function apiRoutes(app: FastifyInstance) {
  app.setErrorHandler(errorHandler);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.get('/health', async (_, reply) => reply.send({ success: true }));

  app.register(signupAdmin);
  app.register(loginAdmin);
  app.register(logoutAdmin);
}
