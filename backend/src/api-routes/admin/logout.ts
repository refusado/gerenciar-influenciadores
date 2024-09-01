import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function logoutAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/logout',
    {
      schema: {
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (_, reply) => {
      reply.clearCookie('access_token');

      return reply.status(200).send({
        message: 'Admin logout successful.',
      });
    }
  );
}
