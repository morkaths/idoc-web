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
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    verify: '/auth/verify/email',
    resend: '/auth/verify/resend',
    changePassword: '/auth/password/change',
    forgotPassword: '/auth/password/forgot',
    resetPassword: '/auth/password/reset',
  },
  users: crud('/users'),
  roles: crud('/roles'),
  permissions: crud('/permissions'),
  authors: crud('/authors'),
  categories: crud('/categories'),
  books: crud('/books'),
  borrows: {
    ...crud('/borrows'),
    history: '/borrows/history',
    extend: (id: string) => `/borrows/${id}/extend`,
    return: (id: string) => `/borrows/${id}/return`,
  },
  folders: crud('/folders'),
  reviews: crud('/reviews'),
  bookmarks: {
    ...crud('/bookmarks'),
    status: (ids: readonly string[]) => `/bookmarks/status?ids=${ids.join(',')}`,
  },
  files: {
    ...crud('/files'),
    findByUser: '/files/user',
    upload: '/files/upload',
    uploadPresigned: '/files/upload/presigned',
    completePresignedUpload: '/files/upload/complete',
    download: (id: string) => `/files/${id}/download`,
  },
  images: {
    upload: '/images/upload',
    delete: (url: string) => `/images/${url}`,
  },
} as const;

export const ApiEndpoint = {
  meta: META,
  endpoints: ENDPOINTS,
} as const;

export type ApiEndpointType = typeof ApiEndpoint;
export default ApiEndpoint;
