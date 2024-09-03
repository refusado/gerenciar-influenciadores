import errorHandler from '@/error-handler';
import { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { authRoutes } from './auth';
import { influencerRoutes } from './influencer';
import { brandRoutes } from './brand';

export async function apiRoutes(app: FastifyInstance) {
  app.setErrorHandler(errorHandler);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.get('/health', async (_, reply) => reply.send({ success: true }));

  app.register(authRoutes);
  app.register(influencerRoutes);
  app.register(brandRoutes);
}
