import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function logoutAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/logout',
    {
      schema: {
        summary: 'Admin logout',
        tags: ['auth'],
        response: {
          302: z.object({}), // redirection response
        },
        description: 'Log out the admin and redirect to login page',
      },
    },
    async (_, reply) => {
      reply.clearCookie('access_token');
      return reply.redirect('/login?message=logout');
    }
  );
}
