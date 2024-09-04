import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/utils/prisma';
import { uploadImage } from '@/utils/upload-image';
import { getAddressByCep } from '@/utils/viacep';
import { influencerRequestSchema } from '../schemas';

export async function createInfluencerHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
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

  const parsedData = influencerRequestSchema
    .omit({ image: true })
    .parse(jsonData);

  const existingInfluencer = await prisma.influencer.findUnique({
    where: { instagram: parsedData.instagram },
  });

  if (existingInfluencer) {
    return reply.status(409).send({
      message: 'Influencer already exists.',
    });
  }

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

  const createdInfluencer = await prisma.influencer.create({
    data: influencerData,
  });

  return reply.status(201).send({ createdInfluencer });
}
