import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategories as getCategoriesApi } from '@/api/category'
import { getTagList as getTagListApi } from '@/api/tag'
import type { Category } from '@/types/category.d'
import type { Tag } from '@/types/tag.d'
import type { ApiResponse } from '@/types/api.d'

export const useAppStore = defineStore('app', () => {
    const categories = ref<Category[]>([])
    const tags = ref<Tag[]>([])
    const globalLoading = ref(false)
    const isMobileNavOpen = ref(false)

    async function fetchCategories() {
        const res = await getCategoriesApi() as unknown as ApiResponse<Category[]>
        categories.value = res.data || []
    }

    async function fetchTags() {
        const res = await getTagListApi() as unknown as ApiResponse<Tag[]>
        tags.value = res.data || []
    }

    async function initAppData() {
        await Promise.allSettled([fetchCategories(), fetchTags()])
    }

    function toggleMobileNav() {
        isMobileNavOpen.value = !isMobileNavOpen.value
    }

    function closeMobileNav() {
        isMobileNavOpen.value = false
    }

    return {
        categories,
        tags,
        globalLoading,
        isMobileNavOpen,
        fetchCategories,
        fetchTags,
        initAppData,
        toggleMobileNav,
        closeMobileNav,
    }
})
