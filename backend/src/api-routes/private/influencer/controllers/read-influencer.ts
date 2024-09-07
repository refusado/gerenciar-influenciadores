import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/utils/prisma';

export async function getAllInfluencersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { page, limit } = request.query as { page: number; limit: number };

  // todo: filters by name, reach, niche, oldest/newest, last updated

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

  const brands = await prisma.influencerBrandLink.findMany({
    where: { influencerId: id },
    select: { brand: true },
  });

  return reply.status(200).send({ ...influencer, brands });
}
