import { API_CONFIG } from '@/config/api'
import { mockCategories } from '@/mocks'
import type { Category, FindParams, Pagination } from '../types'
import * as ApiRequest from './config'

export const CategoryApi = {
  find: async (
    params?: FindParams
  ): Promise<{ data: Category[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<{
      data?: Category[]
      pagination?: Pagination
    }>(API_CONFIG.endpoints.category.find, { mode: 'public', params })
    if (response.success && response.data) {
      const payload = (response.data as any).data ?? response.data
      const pagination = (response.data as any).pagination as
        | Pagination
        | undefined
      return { data: payload as Category[], pagination }
    }
    return { data: [], pagination: undefined }
  },

  findAll: async (params?: FindParams): Promise<Category[]> => {
    try {
      const endpoint =
        (API_CONFIG.endpoints as any)?.category?.findAll ??
        API_CONFIG.endpoints.category.find

      const effectiveParams = {
        ...(params ?? {}),
        page: 1,
        limit: Number(params?.limit ?? 100000),
      }

      const response = await ApiRequest.apiGet<{
        data?: Category[]
        pagination?: Pagination
      }>(endpoint, { mode: 'public', params: effectiveParams })

      if (response.success && response.data) {
        const payload = (response.data as any).data ?? response.data
        return payload as Category[]
      }
    } catch {
      // ignore and return empty
    }
    return []
  },

  findById: async (id: string): Promise<Category | null> => {
    const response = await ApiRequest.apiGet<Category>(
      API_CONFIG.endpoints.category.findById(id),
      { mode: 'public' }
    )
    if (response.success && response.data) return response.data
    return null
  },

  create: async (data: Partial<Category>): Promise<Category | null> => {
    const response = await ApiRequest.apiPost<Category>(
      API_CONFIG.endpoints.category.create,
      { mode: 'private', data }
    )
    if (response.success && response.data) return response.data
    return null
  },

  update: async (
    id: string,
    data: Partial<Category>
  ): Promise<Category | null> => {
    const response = await ApiRequest.apiPatch<Category>(
      API_CONFIG.endpoints.category.update(id),
      { mode: 'private', data }
    )
    if (response.success && response.data) return response.data
    return null
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiRequest.apiDelete<null>(
      API_CONFIG.endpoints.category.delete(id),
      { mode: 'private' }
    )
    return response.success
  },
}

export const CategoryApiMock = {
  find: async (
    params: FindParams = {}
  ): Promise<{ data: Category[]; pagination?: Pagination }> => {
    const { page = 1, limit = 10, filters, sorts: sort, query } = params

    let items = [...mockCategories]

    if (query) {
      const q = String(query).toLowerCase()
      items = items.filter((c) => {
        const en = Array.isArray(c.translations)
          ? (c.translations.find((t) => t.lang === 'en')?.name ?? '')
          : ''
        const vi = Array.isArray(c.translations)
          ? (c.translations.find((t) => t.lang === 'vi')?.name ?? '')
          : ''
        const fields = {
          slug: String(c.slug ?? ''),
          enName: String(en),
          viName: String(vi),
        }
        const haystack = Object.values(fields)
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    }

    if (filters && Object.keys(filters).length) {
      for (const [key, condition] of Object.entries(filters)) {
        items = items.filter((item) => {
          const value = (item as any)[key]
          if (value == null) return false
          if (typeof condition === 'string')
            return String(value)
              .toLowerCase()
              .includes(String(condition).toLowerCase())
          if (Array.isArray(condition)) return condition.includes(value)
          if (typeof condition === 'object') {
            if ('$eq' in condition)
              return String(value) === String((condition as any).$eq)
            if ('$contains' in condition)
              return String(value)
                .toLowerCase()
                .includes(String((condition as any).$contains).toLowerCase())
            if ('$gte' in condition)
              return Number(value) >= Number((condition as any).$gte)
            if ('$lte' in condition)
              return Number(value) <= Number((condition as any).$lte)
          }
          return true
        })
      }
    }

    if (Array.isArray(sort) && sort.length) {
      items.sort((leftItem, rightItem) => {
        for (const sortDescriptor of sort) {
          const leftValue = (leftItem as any)[sortDescriptor.field]
          const rightValue = (rightItem as any)[sortDescriptor.field]
          if (leftValue == null && rightValue == null) continue
          if (leftValue == null) return 1
          if (rightValue == null) return -1
          if (typeof leftValue === 'string' && typeof rightValue === 'string') {
            const cmp = leftValue.localeCompare(rightValue)
            if (cmp !== 0) return sortDescriptor.dir === 'desc' ? -cmp : cmp
          } else {
            if (leftValue > rightValue)
              return sortDescriptor.dir === 'desc' ? -1 : 1
            if (leftValue < rightValue)
              return sortDescriptor.dir === 'desc' ? 1 : -1
          }
        }
        return 0
      })
    }

    const total = items.length
    const pages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const data = items.slice(start, start + limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    }
  },

  findAll: async (): Promise<Category[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve([...mockCategories]), 150)
    )
  },

  findById: async (id: string): Promise<Category | null> => {
    const category = mockCategories.find((c) => c._id === id) || null
    return new Promise((resolve) => setTimeout(() => resolve(category), 200))
  },

  create: async (data: Partial<Category>): Promise<Category | null> => {
    const newItem: Category = {
      _id: Date.now().toString(),
      ...data,
    } as Category
    mockCategories.push(newItem)
    return new Promise((resolve) => setTimeout(() => resolve(newItem), 200))
  },

  update: async (
    id: string,
    data: Partial<Category>
  ): Promise<Category | null> => {
    const index = mockCategories.findIndex((c) => c._id === id)
    if (index === -1) return null
    mockCategories[index] = { ...mockCategories[index], ...data }
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockCategories[index]), 200)
    )
  },

  delete: async (id: string): Promise<boolean> => {
    const index = mockCategories.findIndex((c) => c._id === id)
    if (index === -1) return false
    mockCategories.splice(index, 1)
    return new Promise((resolve) => setTimeout(() => resolve(true), 200))
  },
}
