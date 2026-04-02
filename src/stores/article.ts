import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPublicArticles, getPublicArticleById, getPublicArticleBySlug, searchArticles } from '@/api/public'
import { getMyArticles as getMyArticlesApi } from '@/api/article'
import type { Article } from '@/types/article.d'
import type { ApiResponse } from '@/types/api.d'

export const useArticleStore = defineStore('article', () => {
    const publicList = ref<Article[]>([])
    const myList = ref<Article[]>([])
    const currentArticle = ref<Article | null>(null)
    const searchResults = ref<Article[]>([])
    const loading = ref(false)

    async function fetchPublicArticles(pageNum?: number, pageSize?: number, append = false) {
        loading.value = true
        try {
            const params = pageNum !== undefined ? { pageNum, pageSize: pageSize || 10 } : undefined
            const res = await getPublicArticles(params) as unknown as ApiResponse<Article[]>
            const data = res.data || []
            if (append) {
                publicList.value = [...publicList.value, ...data]
            } else {
                publicList.value = data
            }
            return data
        } finally {
            loading.value = false
        }
    }

    async function fetchMyArticles(pageNum?: number, pageSize?: number) {
        loading.value = true
        try {
            const params = pageNum !== undefined ? { pageNum, pageSize: pageSize || 10 } : undefined
            const res = await getMyArticlesApi(params) as unknown as ApiResponse<Article[]>
            myList.value = res.data || []
            return res.data
        } finally {
            loading.value = false
        }
    }

    async function fetchArticleDetail(id: number) {
        loading.value = true
        try {
            const res = await getPublicArticleById(id) as unknown as ApiResponse<Article>
            currentArticle.value = res.data
            return res.data
        } finally {
            loading.value = false
        }
    }

    async function fetchArticleBySlug(slug: string) {
        loading.value = true
        try {
            const res = await getPublicArticleBySlug(slug) as unknown as ApiResponse<Article>
            currentArticle.value = res.data
            return res.data
        } finally {
            loading.value = false
        }
    }

    async function search(keyword: string) {
        loading.value = true
        try {
            const res = await searchArticles(keyword) as unknown as ApiResponse<Article[]>
            searchResults.value = res.data || []
            return res.data
        } finally {
            loading.value = false
        }
    }

    function clearSearch() {
        searchResults.value = []
    }

    function clearCurrentArticle() {
        currentArticle.value = null
    }

    return {
        publicList,
        myList,
        currentArticle,
        searchResults,
        loading,
        fetchPublicArticles,
        fetchMyArticles,
        fetchArticleDetail,
        fetchArticleBySlug,
        search,
        clearSearch,
        clearCurrentArticle,
    }
})
