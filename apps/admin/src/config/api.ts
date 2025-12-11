import * as ENV from './env';

export const API_CONFIG = {
  timeout: 10000,
  baseURL: ENV.API_URL,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      verify: '/auth/verify',
      update: '/auth/update',
    },
    user: {
      me: '/users/me',
      find: '/users',
      findById: (id: string) => `/users/${id}`,
      create: '/users',
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
    book: {
      find: '/books',
      findById: (id: string) => `/books/${id}`,
      create: '/books',
      update: (id: string) => `/books/${id}`,
      delete: (id: string) => `/books/${id}`,
    },
    category: {
      find: '/categories',
      findById: (id: string) => `/categories/${id}`,
      create: '/categories',
      update: (id: string) => `/categories/${id}`,
      delete: (id: string) => `/categories/${id}`,
    },
  },
};
