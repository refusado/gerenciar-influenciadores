import errorHandler from '@/error-handler';
import { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { privateRoutes } from './private';
import { publicRoutes } from './public/_index';
import { swaggerDocs } from '@/docs';
import z from 'zod';

export async function apiRoutes(app: FastifyInstance) {
  swaggerDocs(app);

  app.setErrorHandler(errorHandler);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.get(
    '/health',
    {
      schema: {
        summary: 'Health check',
        tags: ['health'],
        response: {
          200: z.object({ success: z.boolean() }),
        },
      },
    },
    async (_, reply) => reply.send({ success: true })
  );

  app.register(publicRoutes);
  app.register(privateRoutes);
}
