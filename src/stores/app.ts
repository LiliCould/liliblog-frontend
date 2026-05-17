import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * 应用状态管理 Store
 * 管理全局 UI 状态，如侧边栏、加载状态等
 */
export const useAppStore = defineStore('app', () => {
  // State
  /** 移动端左侧边栏是否展开 */
  const sidebarOpen = ref(false)
  /** 全局加载状态 */
  const globalLoading = ref(false)
  /** 页面标题 */
  const pageTitle = ref('')

  // Actions

  /**
   * 切换侧边栏状态
   */
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  /**
   * 设置侧边栏状态
   * @param open 是否展开
   */
  const setSidebarOpen = (open: boolean) => {
    sidebarOpen.value = open
  }

  /**
   * 设置全局加载状态
   * @param loading 是否加载中
   */
  const setGlobalLoading = (loading: boolean) => {
    globalLoading.value = loading
  }

  /**
   * 设置页面标题
   * @param title 标题
   */
  const setPageTitle = (title: string) => {
    pageTitle.value = title
    document.title = title ? `${title} - LiliBlog` : 'LiliBlog'
  }

  return {
    sidebarOpen,
    globalLoading,
    pageTitle,
    toggleSidebar,
    setSidebarOpen,
    setGlobalLoading,
    setPageTitle,
  }
})
