import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * 主题状态管理 Store
 * 管理暗色/亮色模式切换
 * @description 切换时使用硬切动画（0ms 或 50ms），禁止 300ms 平滑过渡
 */
export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false)

  // Actions

  /**
   * 切换主题
   * @description 硬切切换，无平滑过渡动画
   */
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  /**
   * 设置主题
   * @param dark 是否暗色模式
   */
  const setTheme = (dark: boolean) => {
    isDark.value = dark
    applyTheme()
  }

  /**
   * 初始化主题
   * @description 从 localStorage 读取主题偏好，默认跟随系统
   */
  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  /**
   * 应用主题到 DOM
   * @description 使用硬切方式，0ms 过渡
   */
  const applyTheme = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
  }
})
