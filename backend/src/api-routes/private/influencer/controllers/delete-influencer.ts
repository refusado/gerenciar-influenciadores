import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/utils/prisma';

export async function deleteInfluencerHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  const existingInfluencer = await prisma.influencer.findUnique({
    where: { id },
  });

  if (!existingInfluencer)
    return reply.status(404).send({ message: 'Influencer not found.' });

  await prisma.influencer.delete({
    where: { id },
  });

  return reply.status(204).send();
}
