import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createInfluencerHandler } from './controllers/create-influencer';
import { deleteInfluencerHandler } from './controllers/delete-influencer';
import {
  getAllInfluencersHandler,
  getInfluencerByIdHandler,
} from './controllers/read-influencer';
import { updateInfluencerHandler } from './controllers/update-influencer';
import {
  errorResponseSchema,
  influencerResponseSchema,
  uniqueInfluencerResponseSchema,
} from './schemas';

export async function influencerRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/influencer',
    {
      schema: {
        summary: 'Creates a new influencer',
        tags: ['influencer'],
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({
            createdInfluencer: influencerResponseSchema,
          }),
          '4xx': errorResponseSchema,
        },
      },
    },
    createInfluencerHandler
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/influencers',
    {
      schema: {
        summary: 'Get all influencers',
        tags: ['influencer'],
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          limit: z.coerce.number().min(1).max(100).default(10),
        }),
        response: {
          200: z.object({
            influencers: z.array(influencerResponseSchema),
            totalInfluencers: z.number(),
            currentPage: z.number(),
            limit: z.number(),
            totalPages: z.number(),
          }),
          '4xx': errorResponseSchema,
        },
      },
    },
    getAllInfluencersHandler
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
          200: uniqueInfluencerResponseSchema,
          '4xx': errorResponseSchema,
        },
      },
    },
    getInfluencerByIdHandler
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    '/influencer/:id',
    {
      schema: {
        summary: 'Update an influencer',
        tags: ['influencer'],
        consumes: ['multipart/form-data'],
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            updatedInfluencer: influencerResponseSchema,
          }),
          '4xx': errorResponseSchema,
        },
      },
    },
    updateInfluencerHandler
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
    deleteInfluencerHandler
  );
}
