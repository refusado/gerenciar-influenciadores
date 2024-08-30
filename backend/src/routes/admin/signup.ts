import { prisma } from '@/utils/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

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

/**
 * POST /admin/signup
 *
 * @summary Create a new admin user
 *
 * @body {name: string, email: string, password: string}
 *
 * @response 201 {createdAdmin: {id: number, name: string, email: string}}
 */
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
      const { name, email, password } = request.body;

      const existingAdmin = await prisma.admin.findUnique({ where: { email } });

      if (existingAdmin)
        return reply.status(409).send({
          message: 'This email address already exists.',
        });

      const createdAdmin = await prisma.admin.create({
        data: { name, email, password },
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
