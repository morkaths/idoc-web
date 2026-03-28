import env from './env';

const crud = (path: string) => ({
  find: path,
  findById: (id: string) => `${path}/${id}`,
  findByIds: (ids: readonly string[]) => `${path}/bulk?ids=${ids.join(',')}`,
  create: path,
  createMany: `${path}/bulk`,
  update: (id: string) => `${path}/${id}`,
  updateMany: (ids: readonly string[]) => `${path}/bulk?ids=${ids.join(',')}`,
  delete: (id: string) => `${path}/${id}`,
  deleteMany: (ids: readonly string[]) => `${path}/bulk?ids=${ids.join(',')}`,
});

// ── Connection meta ───────────────────────────────────────────────────────────

export const META = {
  baseURL: env.api.url,
  timeout: 10_000,
} as const;

// ── Endpoint tree ─────────────────────────────────────────────────────────────

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    loginGoogle: '/auth/login/google',
    register: '/auth/register',
    verify: '/auth/verify',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    update: '/auth/update',
  },
  users: crud('/users'),
  roles: crud('/roles'),
  permissions: crud('/permissions'),
  profiles: {
    ...crud('/profiles'),
    me: '/profiles/me',
  },
  authors: crud('/authors'),
  categories: crud('/categories'),
  books: crud('/books'),
  borrows: {
    ...crud('/borrows'),
    history: '/borrows/history',
    extend: (id: string) => `/borrows/${id}/extend`,
    return: (id: string) => `/borrows/${id}/return`,
    read: (id: string) => `/borrows/${id}/read`,
  },
  bookmarks: {
    ...crud('/bookmarks'),
    status: (ids: readonly string[]) => `/bookmarks/status?ids=${ids.join(',')}`,
  },
  folders: crud('/folders'),
  reviews: crud('/reviews'),
  files: {
    ...crud('/files'),
    findByUser: '/files/user',
    download: (id: string) => `/files/${id}/download`,
    upload: '/files/upload',
    uploadPresigned: '/files/upload/presigned',
    completePresignedUpload: '/files/upload/complete',
    view: (id: string) => `/files/${id}/view`,
  },
  images: {
    upload: '/images/upload',
    delete: (url: string) => `/images/${url}`,
  },
} as const;

export const API_CONFIG = {
  baseURL: META.baseURL,
  timeout: META.timeout,
  endpoints: ENDPOINTS,
} as const;

export const ApiEndpoint = {
  meta: META,
  endpoints: ENDPOINTS,
} as const;

export type ApiEndpointType = typeof ApiEndpoint;
export default API_CONFIG;
