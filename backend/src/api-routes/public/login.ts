import { prisma } from '@/utils/prisma';
import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(50),
});

const loginResponseSchema = z.object({
  message: z.string(),
  loggedAdmin: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
  }),
});

export async function loginAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/login',
    {
      schema: {
        summary: 'Admin login',
        tags: ['auth'],
        body: loginRequestSchema,
        response: {
          200: loginResponseSchema,
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

      if (!admin) {
        return reply.status(404).send({
          message: 'This email address does not exist.',
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      if (!isPasswordCorrect) {
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
