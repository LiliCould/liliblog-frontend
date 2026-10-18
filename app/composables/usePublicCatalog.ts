import type { Article, Category, PageResult, Tag } from '~/types'

export function useCategories() {
  const api = useApi()
  return useAsyncData<Category[]>(
    'public-categories',
    async () => {
      const data = await api.get<PageResult<Category>>('/api/category', { size: 100, status: 1 })
      return data.records || []
    },
    { default: () => [] },
  )
}

export function useTags() {
  const api = useApi()
  return useAsyncData<Tag[]>(
    'public-tags',
    async () => {
      const data = await api.get<PageResult<Tag>>('/api/tag', { size: 100 })
      return data.records || []
    },
    { default: () => [] },
  )
}

export function useRandomArticles(num = 5) {
  const api = useApi()
  return useAsyncData<Article[]>(
    `public-random-articles:${num}`,
    async () => {
      const data = await api.get<Article[]>('/api/article/random', { num })
      return Array.isArray(data) ? data : []
    },
    { default: () => [] },
  )
}
