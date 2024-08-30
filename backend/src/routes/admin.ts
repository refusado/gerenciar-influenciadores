import { prisma } from '@/utils/prisma';
import { FastifyInstance } from 'fastify';

export async function adminRoutes(app: FastifyInstance) {
  app.post<{
    Body: {
      name: string;
      email: string;
      password: string;
    };
  }>('/signup', async (request, reply) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return reply.status(400).send({
        success: false,
        message: 'Missing required fields.',
      });
    }

    const adminExists = await prisma.admin.findUnique({
      where: { email },
    });

    if (adminExists) {
      return reply.status(409).send({
        success: false,
        message: 'This email address already exists.',
      });
    }

    const admin = await prisma.admin.create({
      data: { name, email, password },
    });

    reply.status(201).send({
      success: true,
      admin,
    });
  });
}
