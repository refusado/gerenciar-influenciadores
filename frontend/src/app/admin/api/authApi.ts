import { AxiosResponse } from 'axios';
import { api } from './axios';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '@/types/auth';

const authApi = {
  register: async (data: SignupRequest): Promise<SignupResponse> => {
    const response: AxiosResponse<SignupResponse> = await api.post(
      '/signup',
      data,
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/login',
      data,
    );
    return response.data;
  },
};

export default authApi;
