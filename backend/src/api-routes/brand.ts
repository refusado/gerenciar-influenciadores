import { prisma } from '@/utils/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

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

export async function brandRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/brand',
    {
      schema: {
        summary: 'Creates a new brand',
        tags: ['brand'],
        body: brandRequestSchema,
        response: {
          201: z.object({
            createdBrand: brandResponseSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, description, niche } = request.body;

      const brand = await prisma.brand.create({
        data: { name, description, niche },
      });

      return reply.status(201).send({
        createdBrand: brand,
      });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/brands',
    {
      schema: {
        summary: 'Get all brands',
        tags: ['brand'],
        response: {
          200: z.object({
            brands: z.array(brandResponseSchema),
          }),
          400: z.object({
            message: z.string(),
            error: z.any().optional(),
          }),
        },
      },
    },
    async (_, reply) => {
      const brands = await prisma.brand.findMany();
      return reply.send({ brands });
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
          200: z.object({
            brand: brandResponseSchema,
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

      const brand = await prisma.brand.findUnique({
        where: { id },
      });

      if (!brand)
        return reply.status(404).send({ message: 'Brand not found.' });

      return reply.send({ brand });
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
        body: brandRequestSchema,
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
      });

      if (!existingBrand)
        return reply.status(404).send({ message: 'Brand not found.' });

      const brand = await prisma.brand.update({
        where: { id },
        data: request.body,
      });

      return reply.send({ updatedBrand: brand });
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
