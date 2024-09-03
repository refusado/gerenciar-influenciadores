import { prisma } from '@/utils/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function influencerBrandLinkRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/influencer-brand-connection',
    {
      schema: {
        summary: 'Connect an influencer to a brand',
        tags: ['influencer-brand-connection'],
        body: z.object({
          influencerId: z.number(),
          brandId: z.number(),
        }),
        response: {
          201: z.object({
            createdLink: z.object({
              influencerId: z.number(),
              brandId: z.number(),
              createdAt: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { influencerId, brandId } = request.body;

      const link = await prisma.influencerBrandLink.create({
        data: { influencerId, brandId },
      });

      return reply.status(201).send({
        createdLink: link,
      });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/influencer-brand-connection',
    {
      schema: {
        summary: 'Remove a brand-influencer connection',
        tags: ['influencer-brand-connection'],
        body: z.object({
          influencerId: z.number(),
          brandId: z.number(),
        }),
        response: {
          204: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { influencerId, brandId } = request.body;

      await prisma.influencerBrandLink.delete({
        where: { influencerId_brandId: { influencerId, brandId } },
      });

      return reply.status(204).send();
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/brand/:brandId/influencers',
    {
      schema: {
        summary: 'Get all influencers connected to a brand',
        tags: ['influencer-brand-connection'],
        params: z.object({
          brandId: z.coerce.number(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              niche: z.string(),
              reach: z.number(),
              instagram: z.string(),
              image: z.string(),
              cep: z.string(),
              state: z.string(),
              city: z.string(),
              neighborhood: z.string(),
              street: z.string(),
              createdAt: z.date(),
              updateAt: z.date(),
            })
          ),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { brandId } = request.params;

      const brand = await prisma.brand.findUnique({
        where: { id: brandId },
      });

      if (!brand)
        return reply.status(404).send({ message: 'Brand not found.' });

      const influencers = await prisma.influencer.findMany({
        where: {
          InfluencerBrandLink: {
            some: { brandId },
          },
        },
      });

      return reply.send(influencers);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/influencer/:influencerId/brands',
    {
      schema: {
        summary: 'Get all brands connected to an influencer',
        tags: ['influencer-brand-connection'],
        params: z.object({
          influencerId: z.coerce.number(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              description: z.string(),
              niche: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            })
          ),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { influencerId } = request.params;

      const influencer = await prisma.influencer.findUnique({
        where: { id: influencerId },
      });

      if (!influencer)
        return reply.status(404).send({ message: 'Influencer not found.' });

      const brands = await prisma.brand.findMany({
        where: {
          InfluencerBrandLink: {
            some: { influencerId },
          },
        },
      });

      return reply.send(brands);
    }
  );
}
