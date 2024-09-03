import { prisma } from '@/utils/prisma';
import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const signupRequestSchema = z.object({
  name: z.string().min(3).max(32),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .max(50)
    .refine((pass) => /[0-9]/.test(pass), {
      message: 'Password must contain at least one number.',
    }),
});

const signupResponseSchema = z.object({
  createdAdmin: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
  }),
});

export async function signupAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/signup',
    {
      schema: {
        summary: 'Admin signup',
        tags: ['auth'],
        body: signupRequestSchema,
        response: {
          201: signupResponseSchema,
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { name, email, password } = request.body;

      const existingAdmin = await prisma.admin.findUnique({ where: { email } });

      if (existingAdmin)
        return reply.status(409).send({
          message: 'This email address already exists.',
        });

      const passwordHash = await bcrypt.hash(password, 10);
      const createdAdmin = await prisma.admin.create({
        data: { name, email, password: passwordHash },
      });

      return reply.status(201).send({
        createdAdmin: {
          id: createdAdmin.id,
          name: createdAdmin.name,
          email: createdAdmin.email,
        },
      });
    }
  );
}
