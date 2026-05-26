import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticles, getArticleById, getArticleBySlug } from '@/api/article'
import type { Article, ArticleDetail } from '@/types/article'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'

export const useArticleStore = defineStore('article', () => {
    const publicList = ref<Article[]>([])
    const myList = ref<Article[]>([])
    const currentArticle = ref<ArticleDetail | null>(null)
    const loading = ref(false)
    const total = ref(0)

    async function fetchPublicArticles(params?: Record<string, any>, append = false) {
        loading.value = true
        try {
            const res = await getArticles(params) as unknown as ApiResponse<PageResult<Article>>
            const data = res.data?.records || []
            total.value = res.data?.total || 0
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

    async function fetchMyArticles(params?: Record<string, any>) {
        loading.value = true
        try {
            const res = await getArticles(params) as unknown as ApiResponse<PageResult<Article>>
            myList.value = res.data?.records || []
            total.value = res.data?.total || 0
            return res.data
        } finally {
            loading.value = false
        }
    }

    async function fetchArticleDetail(id: number) {
        loading.value = true
        try {
            const res = await getArticleById(id) as unknown as ApiResponse<ArticleDetail>
            currentArticle.value = res.data
            return res.data
        } finally {
            loading.value = false
        }
    }

    async function fetchArticleBySlug(slug: string) {
        loading.value = true
        try {
            const res = await getArticleBySlug(slug) as unknown as ApiResponse<ArticleDetail>
            currentArticle.value = res.data
            return res.data
        } finally {
            loading.value = false
        }
    }

    function clearCurrentArticle() {
        currentArticle.value = null
    }

    return {
        publicList,
        myList,
        currentArticle,
        loading,
        total,
        fetchPublicArticles,
        fetchMyArticles,
        fetchArticleDetail,
        fetchArticleBySlug,
        clearCurrentArticle,
    }
})
