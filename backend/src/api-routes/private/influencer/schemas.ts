import { z } from 'zod';

export const influencerRequestSchema = z.object({
  name: z.string().min(3),
  niche: z.string(),
  reach: z.number(),
  instagram: z.string(),
  image: z.string(),
  cep: z.string().length(8).regex(/^\d+$/, {
    message: 'CEP must contain only numbers',
  }),
});

export const influencerResponseSchema = z.object({
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

export const errorResponseSchema = z.object({
  message: z.string(),
  error: z.any().optional(),
});
