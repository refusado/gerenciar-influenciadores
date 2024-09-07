import { prisma } from '@/utils/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { influencerResponseSchema } from './influencer/schemas';

// todo: separete routes in different files

const brandRequestSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  niche: z.string(),
});

const brandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  niche: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const uniqueBrandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  niche: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  influencers: z.array(influencerResponseSchema),
});

export async function brandRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/brand',
    {
      schema: {
        summary: 'Creates a new brand',
        tags: ['brand'],
        body: brandRequestSchema,
        response: {
          201: brandResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, description, niche } = request.body;

      const brand = await prisma.brand.create({
        data: { name, description, niche },
      });

      return reply.status(201).send(brand);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/brands',
    {
      schema: {
        summary: 'Get all brands',
        tags: ['brand'],
        querystring: z.object({
          page: z.coerce.number().default(1).optional(),
          limit: z.coerce.number().default(10).optional(),
        }),
        response: {
          200: z.object({
            brands: z.array(brandResponseSchema),
            totalBrands: z.number(),
            currentPage: z.number(),
            limit: z.number(),
            totalPages: z.number(),
          }),
          '4xx': z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page = 1, limit = 10 } = request.query;

      const [brands, totalBrands] = await Promise.all([
        prisma.brand.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.brand.count(),
      ]);

      return reply.send({
        brands,
        totalBrands,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalBrands / limit),
      });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/brand/:id',
    {
      schema: {
        summary: 'Get a brand by ID',
        tags: ['brand'],
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: uniqueBrandResponseSchema,
          '4xx': z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const brand = await prisma.brand.findUnique({
        where: { id },
      });

      if (!brand)
        return reply.status(404).send({ message: 'Brand not found.' });

      const influencers = await prisma.influencerBrandLink.findMany({
        where: { brandId: id },
        select: { influencer: true },
      });

      return reply.send({
        ...brand,
        influencers: influencers.map((influencer) => influencer.influencer),
      });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    '/brand/:id',
    {
      schema: {
        summary: 'Update a brand',
        tags: ['brand'],
        params: z.object({
          id: z.coerce.number(),
        }),
        body: brandRequestSchema.partial().strict(),
        response: {
          200: z.object({
            updatedBrand: brandResponseSchema,
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

      const existingBrand = await prisma.brand.findUnique({
        where: { id },
        select: {
          name: true,
          description: true,
          niche: true,
        },
      });

      if (!existingBrand)
        return reply.status(404).send({ message: 'Brand not found.' });

      const newData = {
        ...existingBrand,
        ...request.body,
      };

      const updatedBrand = await prisma.brand.update({
        where: { id },
        data: newData,
      });

      return reply.send({ updatedBrand });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/brand/:id',
    {
      schema: {
        summary: 'Delete a brand',
        tags: ['brand'],
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

      const existingBrand = await prisma.brand.findUnique({
        where: { id },
      });

      if (!existingBrand)
        return reply.status(404).send({ message: 'Brand not found.' });

      await prisma.brand.delete({
        where: { id },
      });

      return reply.status(204).send();
    }
  );
}
