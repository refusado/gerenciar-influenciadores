import { prisma } from '@/utils/prisma';
import { uploadImage } from '@/utils/upload-image';
import { getAddressByCep } from '@/utils/viacep';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const influencerRequestSchema = z.object({
  name: z.string().min(3),
  niche: z.string(),
  reach: z.number(),
  instagram: z.string(),
  image: z.string(),
  cep: z.string().length(8).regex(/^\d+$/, {
    message: 'CEP must contain only numbers',
  }),
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
        // body: influencerRequestSchema,
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
      const parts = request.parts();

      let jsonData = '';
      let imageFileName = '';

      for await (const part of parts) {
        if (part.fieldname === 'data') {
          if ('value' in part) {
            const value = part.value as string;
            jsonData = JSON.parse(value.toString());
          }
        } else if (part.fieldname === 'image' && part.type === 'file') {
          imageFileName = await uploadImage(part);
        }
      }

      const parsedData = influencerRequestSchema.parse(jsonData);

      const existingInfluencer = await prisma.influencer.findUnique({
        where: { instagram: parsedData.instagram },
      });

      if (existingInfluencer)
        return reply.status(409).send({
          message: 'Influencer already exists.',
        });

      const address = await getAddressByCep(parsedData.cep);
      if (!address) throw new Error('Internal server error');

      if ('error' in address) {
        return reply.status(400).send({
          message: `Error searching for CEP: ${address.error}`,
        });
      }

      const influencerData = {
        ...parsedData,
        image: imageFileName,
        state: address.data.estado,
        city: address.data.localidade,
        neighborhood: address.data.bairro,
        street: address.data.logradouro,
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
        body: influencerRequestSchema.strict().partial(),
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
        select: {
          name: true,
          niche: true,
          reach: true,
          instagram: true,
          image: true,
          cep: true,
          state: true,
          city: true,
          neighborhood: true,
          street: true,
        },
      });

      if (!existingInfluencer)
        return reply.status(404).send({ message: 'Influencer not found.' });

      let newAddress = {
        state: existingInfluencer.state,
        city: existingInfluencer.city,
        neighborhood: existingInfluencer.neighborhood,
        street: existingInfluencer.street,
      };

      if (request.body.cep) {
        const address = await getAddressByCep(request.body.cep);
        if (!address) throw new Error('Internal server error');

        if ('error' in address) {
          const statusMap = {
            notFound: 404,
            invalidFormat: 400,
            unknown: 500,
          };
          const status = statusMap[address.error];
          return reply.status(status).send({
            message: address.error,
          });
        }

        newAddress = {
          state: address.data.uf,
          city: address.data.localidade,
          neighborhood: address.data.bairro,
          street: address.data.logradouro,
        };
      }

      const influencer = await prisma.influencer.update({
        where: { id },
        data: {
          ...existingInfluencer,
          ...newAddress,
          ...request.body,
        },
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
