import type { Component } from 'vue'
import { Home, Info, MessageCircle } from 'lucide-vue-next'

export interface PrimaryNavItem {
  path: string
  label: string
  icon: Component
}

/** Header 与移动端抽屉共用，避免路径重复维护 */
export const primaryNavItems: PrimaryNavItem[] = [
  { path: '/', label: '首页', icon: Home },
  { path: '/about', label: '关于', icon: Info },
  { path: '/article/id/2', label: '交流', icon: MessageCircle },
]
