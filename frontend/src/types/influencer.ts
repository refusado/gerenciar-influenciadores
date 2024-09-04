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

export interface GetInfluencersResponse {
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
