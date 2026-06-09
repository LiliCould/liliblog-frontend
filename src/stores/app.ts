import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCategories as getCategoriesApi } from '@/api/category'
import { getTags as getTagsApi } from '@/api/tag'
import type { Category } from '@/types/category'
import type { Tag } from '@/types/tag'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'

export const useAppStore = defineStore('app', () => {
    const categories = ref<Category[]>([])
    const tags = ref<Tag[]>([])
    const globalLoading = ref(false)
    const isMobileNavOpen = ref(false)

    const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
    const isMobile = computed(() => windowWidth.value < 768)

    function _updateWidth() {
        windowWidth.value = window.innerWidth
    }

    function initResizeListener() {
        window.addEventListener('resize', _updateWidth)
    }

    function destroyResizeListener() {
        window.removeEventListener('resize', _updateWidth)
    }

    async function fetchCategories() {
        const res = await getCategoriesApi({ size: 100 }) as unknown as ApiResponse<PageResult<Category>>
        categories.value = res.data?.records || []
    }

    async function fetchTags() {
        const res = await getTagsApi({ size: 100 }) as unknown as ApiResponse<PageResult<Tag>>
        tags.value = res.data?.records || []
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
        isMobile,
        windowWidth,
        fetchCategories,
        fetchTags,
        initAppData,
        toggleMobileNav,
        closeMobileNav,
        initResizeListener,
        destroyResizeListener,
    }
})
