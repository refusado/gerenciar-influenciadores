'use client';

import { BASE_URL } from '@/consts';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const api = axios.create({
  baseURL: BASE_URL + '/api',
  withCredentials: true,
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/login?message=unauthorized';
    }

    console.log('API Error Status:', error.response?.status);

    return Promise.reject(error);
  },
);
