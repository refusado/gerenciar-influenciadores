import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/utils/prisma';

export async function getAllInfluencersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { page, limit } = request.query as { page: number; limit: number };

  const [allInfluencers, totalInfluencers] = await Promise.all([
    prisma.influencer.findMany({
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.influencer.count(),
  ]);

  return reply.send({
    influencers: allInfluencers,
    totalInfluencers,
    currentPage: page,
    limit,
    totalPages: Math.ceil(totalInfluencers / limit),
  });
}

export async function getInfluencerByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  const influencer = await prisma.influencer.findUnique({
    where: { id },
  });

  if (!influencer)
    return reply.status(404).send({ message: 'Influencer not found.' });

  return reply.send({ influencer });
}
