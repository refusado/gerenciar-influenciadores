import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export async function swaggerDocs(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    swagger: {
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    transform: jsonSchemaTransform,
    openapi: {
      tags: [
        { name: 'auth', description: 'authentication related end-points' },
        {
          name: 'influencer-brand-connection',
          description: 'end-points for dealing with influencer and brand links',
        },
      ],
    },
  });

  await app.register(fastifySwaggerUI, {
    routePrefix: 'api/docs',
  });
}
