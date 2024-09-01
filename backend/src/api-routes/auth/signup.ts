import { prisma } from '@/utils/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import bcrypt from 'bcrypt';

const bodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .refine((pass) => /[0-9]/.test(pass), {
      message: 'Password must contain at least one number.',
    }),
});

export async function signupAdmin(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/signup',
    {
      schema: {
        body: bodySchema,
        response: {
          201: z.object({
            createdAdmin: z.object({
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

      reply.status(201).send({
        createdAdmin: {
          id: createdAdmin.id,
          name: createdAdmin.name,
          email: createdAdmin.email,
        },
      });
    }
  );
}
