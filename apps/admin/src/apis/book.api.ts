import { API_CONFIG } from '@/config/api';
// import { mockBooks } from '@/mocks';
import type { Book, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';

export const BookApi = {
  find: async (params?: FindParams): Promise<{ data: Book[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<Book[]>(
      API_CONFIG.endpoints.book.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Book | null> => {
    const response = await ApiRequest.apiGet<Book>(
      API_CONFIG.endpoints.book.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<Book>): Promise<Book | null> => {
    const response = await ApiRequest.apiPost<Book>(
      API_CONFIG.endpoints.book.create,
      { mode: 'private', data: data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<Book>): Promise<Book | null> => {
    const response = await ApiRequest.apiPatch<Book>(
      API_CONFIG.endpoints.book.update(id),
      { mode: 'private', data: data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiRequest.apiDelete<null>(
      API_CONFIG.endpoints.book.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },
};

// export const BookApiMock = {
//   find: async (params: FindParams = {}): Promise<{ data: Book[]; pagination?: Pagination }> => {
//     const { page = 1, limit = 10, filters, sorts: sort, query } = params;

//     // Start from full dataset
//     let items = [...mockBooks];

//     if (query) {
//       const q = query!.toLowerCase();
//       items = items.filter((b) => {
//         const fields = {
//           isbn: String(b.isbn ?? ''),
//           title: String(b.title ?? ''),
//           authors: (b.authors ?? []).map((a) => String(a?.name ?? '')).join(' '),
//         };
//         const haystack = Object.values(fields).filter(Boolean).join(' ').toLowerCase();
//         const matched = haystack.includes(q);
//         return matched;
//       });
//     }

//     // filters
//     if (filters && Object.keys(filters).length) {
//       // prefer 'category' key (toolbar sends columnId: 'category')
//       const categoryCondition = (filters as any).category ?? (filters as any).categories;
//       if (categoryCondition != null) {
//         const selectedIds = Array.isArray(categoryCondition)
//           ? categoryCondition.map((v: any) => String(v))
//           : [String(categoryCondition)];

//         items = items.filter((item) => {
//           // Lấy danh sách category IDs từ book (chỉ dùng trường 'categories')
//           const categoryIdsFromItem: string[] = Array.isArray((item as any).categories)
//             ? (item as any).categories.map((c: any) => String(c._id ?? c.id ?? c))
//             : [];

//           // Nếu book không có category nào, trả về false
//           if (categoryIdsFromItem.length === 0) return false;

//           // Kiểm tra tất cả selectedIds có trong categoryIdsFromItem không (Logic AND)
//           return selectedIds.every((selectedId) => categoryIdsFromItem.includes(selectedId));
//         });
//       }
//     }

//     // sort
//     if (Array.isArray(sort) && sort.length) {
//       items.sort((leftItem, rightItem) => {
//         for (const sortDescriptor of sort) {
//           const leftValue = (leftItem as any)[sortDescriptor.field];
//           const rightValue = (rightItem as any)[sortDescriptor.field];
//           if (leftValue == null && rightValue == null) continue;
//           if (leftValue == null) return 1;
//           if (rightValue == null) return -1;
//           if (typeof leftValue === 'string' && typeof rightValue === 'string') {
//             const cmp = leftValue.localeCompare(rightValue);
//             if (cmp !== 0) return sortDescriptor.dir === 'desc' ? -cmp : cmp;
//           } else {
//             if (leftValue > rightValue) return sortDescriptor.dir === 'desc' ? -1 : 1;
//             if (leftValue < rightValue) return sortDescriptor.dir === 'desc' ? 1 : -1;
//           }
//         }
//         return 0;
//       });
//     }

//     // pagination
//     const total = items.length;
//     const pages = Math.max(1, Math.ceil(total / limit));
//     const start = (page - 1) * limit;
//     const data = items.slice(start, start + limit);

//     return {
//       data,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages,
//       },
//     };
//   },
//   findById: async (id: string): Promise<Book | null> => {
//     const book = mockBooks.find((book) => book._id === id) || null;
//     return new Promise((resolve) => setTimeout(() => resolve(book), 200));
//   },
//   create: async (data: Partial<Book>): Promise<Book | null> => {
//     const newBook: Book = { _id: Date.now().toString(), ...data } as Book;
//     mockBooks.push(newBook);
//     return new Promise((resolve) => setTimeout(() => resolve(newBook), 200));
//   },
//   update: async (id: string, data: Partial<Book>): Promise<Book | null> => {
//     const index = mockBooks.findIndex((book) => book._id === id);
//     if (index === -1) return null;
//     mockBooks[index] = { ...mockBooks[index], ...data };
//     return new Promise((resolve) => setTimeout(() => resolve(mockBooks[index]), 200));
//   },
//   delete: async (id: string): Promise<boolean> => {
//     const index = mockBooks.findIndex((book) => book._id === id);
//     if (index === -1) return false;
//     mockBooks.splice(index, 1);
//     return new Promise((resolve) => setTimeout(() => resolve(true), 200));
//   },
// };
