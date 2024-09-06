import { z } from 'zod';
import { influencerResponseSchema } from './influencer';

export const brandRequestSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  niche: z.string(),
});

export type BrandRequest = z.infer<typeof brandRequestSchema>;

const brandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  niche: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BrandResponse = z.infer<typeof brandResponseSchema>;

export const uniqueBrandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  niche: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  influencers: z.array(influencerResponseSchema),
});

export type UniqueBrandResponse = z.infer<typeof uniqueBrandResponseSchema>;
