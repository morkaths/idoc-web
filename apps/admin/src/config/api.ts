import env from './env';

const crud = (path: string) => ({
  find: () => path,
  search: () => `${path}/search`,
  findById: (id: string) => `${path}/${id}`,
  findByIds: (ids: readonly string[]) => `${path}/bulk?ids=${ids.join(',')}`,
  create: () => path,
  createMany: () => `${path}/bulk`,
  update: (id: string) => `${path}/${id}`,
  updateMany: (ids: readonly string[]) => `${path}/bulk?ids=${ids.join(',')}`,
  delete: (id: string) => `${path}/${id}`,
  deleteMany: (ids: readonly string[]) => `${path}/bulk?ids=${ids.join(',')}`,
});

export const AgentEndpoint = {
  meta: {
    baseURL: env.agent.url,
    timeout: 15_000,
  },
  endpoints: {},
} as const;

export const ApiEndpoint = {
  meta: {
    baseURL: env.api.url,
    timeout: 10_000,
  },
  endpoints: {
    auth: {
      login: () => '/auth/sign-in',
      loginGoogle: () => '/auth/oauth/sign-in',
      register: () => '/auth/sign-up',
      verify: () => '/auth/verify',
      resend: () => '/auth/resend',
      refresh: () => '/auth/refresh',
      logout: () => '/auth/sign-out',
      forgotPassword: () => '/auth/password/forgot',
      resetPassword: () => '/auth/password/reset',
      changePassword: () => '/auth/password/change',
      update: () => '/auth/update',
    },
    users: {
      ...crud('/users'),
      me: () => '/users/me',
      updateMe: () => '/users/me',
    },
    authors: crud('/authors'),
    categories: crud('/categories'),
    books: crud('/books'),
    borrows: {
      ...crud('/loans'),
      history: () => '/loans/history',
      extend: (id: string) => `/loans/${id}/extend`,
      return: (id: string) => `/loans/${id}/return`,
      view: (id: string) => `/loans/${id}/view-ticket`,
    },
    bookmarks: {
      ...crud('/bookmarks'),
      status: (ids: readonly string[]) => `/bookmarks/status?ids=${ids.join(',')}`,
    },
    folders: crud('/folders'),
    reviews: crud('/reviews'),
    files: {
      ...crud('/files'),
      download: (id: string) => `/files/${id}/download`,
      upload: () => '/files/upload',
      uploadPresigned: () => '/files/upload/presigned',
      completePresignedUpload: (uploadId: string) => `/files/upload/complete/${uploadId}`,
      view: (id: string) => `/files/${id}/view`,
      storageUsage: () => '/storage/usage',
    },
    images: {
      upload: () => '/images/upload',
      delete: () => '/images',
    },
    notifications: {
      find: () => '/notifications',
      stream: () => '/notifications/stream',
      markRead: (id: string) => `/notifications/${id}/read`,
      markAllRead: () => '/notifications/read-all',
      countUnread: () => '/notifications/unread',
    },
    recommendations: {
      sync: () => '/ai/recommendations/sync',
      syncBook: (bookId: string) => `/ai/recommendations/sync/${bookId}`,
      train: () => '/ai/recommendations/train',
      metrics: () => '/ai/recommendations/metrics',
      similar: (bookId: string) => `/ai/recommendations/similar/${bookId}`,
      recommend: (userId: string, strategy: string) =>
        `/ai/recommendations?user_id=${userId}&strategy=${strategy}`,
      interactions: () => '/ai/recommendations/interactions',
      feed: () => '/ai/recommendations/feed',
      removeBook: (bookId: string) => `/ai/recommendations/${bookId}`,
    },
  },
} as const;

export type ApiEndpointType = typeof ApiEndpoint;
export default ApiEndpoint;
