import { z } from 'zod';

export interface Influencer {
  id: number;
  name: string;
  niche: string;
  reach: number;
  instagram: string;
  image: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  createdAt: string;
  updateAt: string;
}

export interface AllInfluencersResponse {
  influencers: Influencer[];
  totalInfluencers: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface InfluencerCreateRequest {
  name: string;
  niche: string;
  reach: number;
  instagram: string;
  image: string;
  cep: string;
}

export interface InfluencerUpdateRequest {
  name?: string;
  niche?: string;
  reach?: number;
  instagram?: string;
  image?: string;
  cep?: string;
}

export const uniqueInfluencerResponseSchema = z.object({
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
  brands: z.array(
    z.object({
      brand: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        niche: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    }),
  ),
});

export type UniqueInfluencerResponse = z.infer<
  typeof uniqueInfluencerResponseSchema
>;
