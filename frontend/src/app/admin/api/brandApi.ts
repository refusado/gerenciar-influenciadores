import { AxiosResponse } from 'axios';
import { api } from './axios';
import {
  BrandRequest,
  BrandResponse,
  UniqueBrandResponse,
} from '@/types/brand';
import { UpdateBrand } from '@/components/brand-modals/update-brand';

export interface AllBrandsResponse {
  brands: BrandResponse[];
  totalBrands: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

const brandApi = {
  createBrand: async (data: BrandRequest): Promise<BrandResponse> => {
    const response: AxiosResponse<BrandResponse> = await api.post(
      '/brand',
      data,
    );

    return response.data;
  },

  getAllBrands: async ({
    page = 1,
    limit = 10,
  }): Promise<AllBrandsResponse> => {
    page = Math.max(1, page);

    const response: AxiosResponse<AllBrandsResponse> = await api.get(
      `/brands?page=${page}&limit=${limit}`,
    );

    return response.data;
  },

  getBrandById: async (id: number): Promise<UniqueBrandResponse> => {
    const response: AxiosResponse<UniqueBrandResponse> = await api.get(
      `/brand/${id}`,
    );
    return response.data;
  },

  updateBrand: async (
    id: number,
    data: UpdateBrand,
  ): Promise<BrandResponse> => {
    const response: AxiosResponse<{ updatedBrand: BrandResponse }> =
      await api.put(`/brand/${id}`, data);
    return response.data.updatedBrand;
  },

  deleteBrand: async (id: number): Promise<void> => {
    await api.delete(`/brand/${id}`);
  },
};

export default brandApi;
