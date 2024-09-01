import { prisma } from '@/utils/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import bcrypt from 'bcrypt';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function loginAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/login',
    {
      schema: {
        body: bodySchema,
        response: {
          200: z.object({
            message: z.string(),
            loggedAdmin: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
            }),
          }),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const admin = await prisma.admin.findUnique({ where: { email } });

      if (!admin)
        return reply.status(409).send({
          message: 'This email address does not exist.',
        });

      const isPasswordCorret = await bcrypt.compare(password, admin.password);
      if (!isPasswordCorret) {
        return reply.status(401).send({
          message: 'Incorrect password.',
        });
      }

      const token = request.jwt.sign({
        id: admin.id,
        name: admin.name,
        email: admin.email,
      });

      reply.setCookie('access_token', token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return reply.status(200).send({
        message: 'Admin login successful.',
        loggedAdmin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
    }
  );
}
