import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function logoutAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/logout',
    {
      schema: {
        response: {},
      },
    },
    async (_, reply) => {
      reply.clearCookie('access_token');

      return reply.redirect('/?logout');
    }
  );
}
