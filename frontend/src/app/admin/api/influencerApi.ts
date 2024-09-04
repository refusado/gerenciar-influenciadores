import { AxiosResponse } from 'axios';
import { api } from './axios';
import { GetInfluencersResponse, Influencer } from '@/types/influencer';

const influencerApi = {
  createInfluencer: async (data: FormData): Promise<Influencer> => {
    const response: AxiosResponse<{ createdInfluencer: Influencer }> =
      await api.post('/influencer', data);
    return response.data.createdInfluencer;
  },

  getAllInfluencers: async ({
    page = 1,
    limit = 10,
  }): Promise<GetInfluencersResponse> => {
    page = Math.max(1, page);

    const response: AxiosResponse<GetInfluencersResponse> = await api.get(
      `/influencers?page=${page}&limit=${limit}`,
    );

    return response.data;
  },

  getInfluencerById: async (id: number): Promise<Influencer> => {
    const response: AxiosResponse<{ influencer: Influencer }> = await api.get(
      `/influencer/${id}`,
    );
    return response.data.influencer;
  },

  updateInfluencer: async (id: number, data: FormData): Promise<Influencer> => {
    const response: AxiosResponse<{ updatedInfluencer: Influencer }> =
      await api.put(`/influencer/${id}`, data);
    return response.data.updatedInfluencer;
  },

  deleteInfluencer: async (id: number): Promise<void> => {
    await api.delete(`/influencer/${id}`);
  },
};

export default influencerApi;
