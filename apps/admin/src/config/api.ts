import * as ENV from './env';

export const API_CONFIG = {
  timeout: 10000,
  baseURL: ENV.API_URL,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      verify: '/auth/verify',
      refresh: '/auth/refresh',
      logout: '/auth/logout',
      update: '/auth/update',
    },
    user: {
      find: '/users',
      findById: (id: string) => `/users/${id}`,
      create: '/users',
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
    role: {
      find: '/roles',
      findById: (id: string) => `/roles/${id}`,
      create: '/roles',
      update: (id: string) => `/roles/${id}`,
      delete: (id: string) => `/roles/${id}`,
    },
    permission: {
      find: '/permissions',
      findById: (id: string) => `/permissions/${id}`,
      create: '/permissions',
      update: (id: string) => `/permissions/${id}`,
      delete: (id: string) => `/permissions/${id}`,
    },
    profile: {
      me: '/profiles/me',
      find: '/profiles',
      findById: (id: string) => `/profiles/${id}`,
      create: '/profiles',
      update: (id: string) => `/profiles/${id}`,
      delete: (id: string) => `/profiles/${id}`
    },
    author: {
      find: '/authors',
      findById: (id: string) => `/authors/${id}`,
      create: '/authors',
      update: (id: string) => `/authors/${id}`,
      delete: (id: string) => `/authors/${id}`,
    },
    category: {
      find: '/categories',
      findById: (id: string) => `/categories/${id}`,
      create: '/categories',
      update: (id: string) => `/categories/${id}`,
      delete: (id: string) => `/categories/${id}`,
    },
    book: {
      find: '/books',
      findById: (id: string) => `/books/${id}`,
      create: '/books',
      update: (id: string) => `/books/${id}`,
      delete: (id: string) => `/books/${id}`,
    },
    file: {
      find: '/files',
      findByUser: '/files/user',
      findByKey: (key: string) => `/files/${key}`,
      download: (key: string) => `/files/${key}/download`,
      upload: '/files/upload/url',
      confirm: '/files/upload/confirm',
      delete: (key: string) => `/files/${key}`,
    },
    image: {
      upload: '/images/upload',
      delete: '/images/delete',
    },
  },
};
