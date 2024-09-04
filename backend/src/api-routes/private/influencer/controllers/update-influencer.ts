import { prisma } from '@/utils/prisma';
import { uploadImage } from '@/utils/upload-image';
import { getAddressByCep } from '@/utils/viacep';
import { FastifyRequest, FastifyReply } from 'fastify';
import { influencerRequestSchema } from '../schemas';

export async function updateInfluencerHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  const existingInfluencer = await prisma.influencer.findUnique({
    where: { id },
  });

  if (!existingInfluencer) {
    return reply.status(404).send({ message: 'Influencer not found.' });
  }

  const parts = request.parts();

  let jsonData = {};
  let imageFileName;

  for await (const part of parts) {
    if (part.fieldname === 'data' && 'value' in part) {
      try {
        const value = part.value as string;
        jsonData = JSON.parse(value.toString());
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return reply.status(400).send({
          message: 'Invalid JSON data',
        });
      }
    } else if (part.fieldname === 'image') {
      if (
        part.type === 'file' &&
        part.fieldname === 'image' &&
        part.mimetype.includes('image')
      ) {
        imageFileName = await uploadImage(part);
      } else {
        return reply.status(400).send({
          message: 'Invalid file',
        });
      }
    }
  }

  if (!jsonData || !imageFileName) {
    return reply.status(400).send({
      message: 'Missing data or image',
    });
  }

  const parsedData = influencerRequestSchema
    .omit({ image: true })
    .partial()
    .strict()
    .parse(jsonData);

  if (
    parsedData.instagram &&
    parsedData.instagram !== existingInfluencer.instagram
  ) {
    const influencerWithSameInstagram = await prisma.influencer.findUnique({
      where: { instagram: parsedData.instagram },
    });

    if (influencerWithSameInstagram && influencerWithSameInstagram.id !== id) {
      return reply.status(409).send({
        message: 'Instagram already being used by another influencer.',
      });
    }
  }

  let newAddress = {
    state: existingInfluencer.state,
    city: existingInfluencer.city,
    neighborhood: existingInfluencer.neighborhood,
    street: existingInfluencer.street,
  };

  if (parsedData.cep && parsedData.cep !== existingInfluencer.cep) {
    const address = await getAddressByCep(parsedData.cep);
    if (!address) throw new Error('Internal server error');

    if ('error' in address) {
      return reply.status(400).send({
        message: `Error searching for CEP: ${address.error}`,
      });
    }

    newAddress = {
      state: address.data.uf,
      city: address.data.localidade,
      neighborhood: address.data.bairro,
      street: address.data.logradouro,
    };
  }

  const updatedInfluencer = await prisma.influencer.update({
    where: { id },
    data: {
      ...parsedData,
      image: imageFileName,
      ...newAddress,
    },
  });

  return reply.send({ updatedInfluencer });
}
