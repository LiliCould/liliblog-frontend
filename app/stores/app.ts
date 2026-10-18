import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface Category {
  id: number
  name: string
  slug?: string
}

export interface Tag {
  id: number
  name: string
  color?: string
}

export const useAppStore = defineStore('app', () => {
  const categories = ref<Category[]>([])
  const tags = ref<Tag[]>([])
  const globalLoading = ref(false)
  const isMobileNavOpen = ref(false)
  const windowWidth = ref(1024)

  const isMobile = computed(() => windowWidth.value < 768)

  function updateWidth(): void {
    if (import.meta.client) windowWidth.value = window.innerWidth
  }

  function initResizeListener(): void {
    if (!import.meta.client) return
    updateWidth()
    window.addEventListener('resize', updateWidth, { passive: true })
  }

  function destroyResizeListener(): void {
    if (!import.meta.client) return
    window.removeEventListener('resize', updateWidth)
  }

  async function fetchCategories(): Promise<void> {
    // 阶段 2 接入 /api/category
  }

  async function fetchTags(): Promise<void> {
    // 阶段 2 接入 /api/tag
  }

  async function initAppData(): Promise<void> {
    // 阶段 2 接入公开数据；公开页面不依赖登录态
    await Promise.allSettled([fetchCategories(), fetchTags()])
  }

  function toggleMobileNav(): void {
    isMobileNavOpen.value = !isMobileNavOpen.value
  }

  function closeMobileNav(): void {
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
