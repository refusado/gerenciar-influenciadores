'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';

const baseURL = 'http://localhost:3333/api';

export const api = axios.create({
  baseURL,
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

    console.log(error);

    return Promise.reject(error);
  },
);
