import { AxiosResponse } from 'axios';
import { api } from './axios';
import {
  AllInfluencersResponse,
  Influencer,
  UniqueInfluencerResponse,
} from '@/types/influencer';

const influencerApi = {
  createInfluencer: async (data: FormData): Promise<Influencer> => {
    const response: AxiosResponse<{ createdInfluencer: Influencer }> =
      await api.post('/influencer', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    return response.data.createdInfluencer;
  },

  getAllInfluencers: async ({
    page = 1,
    limit = 10,
  }): Promise<AllInfluencersResponse> => {
    page = Math.max(1, page);

    const response: AxiosResponse<AllInfluencersResponse> = await api.get(
      `/influencers?page=${page}&limit=${limit}`,
    );

    return response.data;
  },

  getInfluencerById: async (id: number): Promise<UniqueInfluencerResponse> => {
    const response: AxiosResponse = await api.get(`/influencer/${id}`);

    return response.data;
  },

  updateInfluencer: async (id: number, data: FormData): Promise<Influencer> => {
    const response: AxiosResponse<{ updatedInfluencer: Influencer }> =
      await api.put(`/influencer/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    return response.data.updatedInfluencer;
  },

  deleteInfluencer: async (id: number): Promise<void> => {
    await api.delete(`/influencer/${id}`);
  },

  linkBrandToInfluencer: async (id: number, brandId: number): Promise<void> => {
    await api.post(`/influencer-brand-connection`, {
      influencerId: id,
      brandId: brandId,
    });
  },
};

export default influencerApi;
