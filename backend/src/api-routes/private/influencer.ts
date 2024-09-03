import { prisma } from '@/utils/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

// todo: separete routes in different files

const influencerRequestSchema = z.object({
  name: z.string().min(3),
  niche: z.string(),
  reach: z.number(),
  instagram: z.string(),
  image: z.string(),
  cep: z.string(),
});

const influencerResponseSchema = z.object({
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
});

export async function influencerRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/influencer',
    {
      schema: {
        summary: 'Creates a new influencer',
        tags: ['influencer'],
        body: influencerRequestSchema,
        response: {
          201: z.object({
            createdInfluencer: influencerResponseSchema,
          }),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const existingInfluencer = await prisma.influencer.findUnique({
        where: { instagram: request.body.instagram },
      });

      if (existingInfluencer)
        return reply.status(409).send({
          message: 'Influencer already exists.',
        });

      const influencerData = {
        ...request.body,

        // todo: get values from viacep api
        state: 'todo',
        city: 'todo',
        neighborhood: 'todo',
        street: 'todo',
      };

      const influencer = await prisma.influencer.create({
        data: influencerData,
      });

      return reply.status(201).send({
        createdInfluencer: influencer,
      });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/influencers',
    {
      schema: {
        summary: 'Get all influencers',
        tags: ['influencer'],
        response: {
          200: z.object({
            allInfluencers: z.array(influencerResponseSchema),
          }),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (_, reply) => {
      const allInfluencers = await prisma.influencer.findMany();
      return reply.send({ allInfluencers });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/influencer/:id',
    {
      schema: {
        summary: 'Get an influencer by ID',
        tags: ['influencer'],
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            influencer: influencerResponseSchema,
          }),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const influencer = await prisma.influencer.findUnique({
        where: { id },
      });

      if (!influencer)
        return reply.status(404).send({ message: 'Influencer not found.' });

      return reply.send({ influencer });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    '/influencer/:id',
    {
      schema: {
        summary: 'Update an influencer',
        tags: ['influencer'],
        params: z.object({
          id: z.coerce.number(),
        }),
        body: influencerRequestSchema,
        response: {
          200: z.object({
            updatedInfluencer: influencerResponseSchema,
          }),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const existingInfluencer = await prisma.influencer.findUnique({
        where: { id },
      });

      if (!existingInfluencer)
        return reply.status(404).send({ message: 'Influencer not found.' });

      const influencer = await prisma.influencer.update({
        where: { id },
        data: request.body,
      });

      return reply.send({ updatedInfluencer: influencer });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/influencer/:id',
    {
      schema: {
        summary: 'Delete an influencer',
        tags: ['influencer'],
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          204: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

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
  );
}
