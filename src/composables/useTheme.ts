import { ref, watch } from 'vue'

export interface ThemeInfo {
  id: string
  name: string
  preview: { primary: string; bg: string; surface: string }
}

export interface CustomThemeOverrides {
  primary?: string
  secondary?: string
  bg?: string
  surface?: string
  elevated?: string
  fontSize?: number
  borderRadius?: number
}

const THEME_KEY = 'liliblog-theme'
const CUSTOM_KEY = 'liliblog-theme-custom'

export const themes: ThemeInfo[] = [
  {
    id: 'cyber-dark',
    name: '赛博暗夜',
    preview: { primary: '#00f0ff', bg: '#0a0a0f', surface: '#111118' },
  },
  {
    id: 'light',
    name: '明亮模式',
    preview: { primary: '#0284c7', bg: '#f8fafc', surface: '#ffffff' },
  },
  {
    id: 'ocean',
    name: '深海幽蓝',
    preview: { primary: '#38bdf8', bg: '#0c1222', surface: '#131b2e' },
  },
  {
    id: 'forest',
    name: '翠影森林',
    preview: { primary: '#4ade80', bg: '#0a0f0a', surface: '#111a11' },
  },
]

const currentTheme = ref<string>(localStorage.getItem(THEME_KEY) || 'cyber-dark')
const customOverrides = ref<CustomThemeOverrides>(loadCustom())

function loadCustom(): CustomThemeOverrides {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

function applyTheme(themeId: string) {
  document.documentElement.setAttribute('data-theme', themeId)
  localStorage.setItem(THEME_KEY, themeId)
  currentTheme.value = themeId
  applyCustomOverrides()
}

function applyCustomOverrides() {
  const o = customOverrides.value
  const root = document.documentElement.style
  if (o.primary) {
    root.setProperty('--color-primary', o.primary)
    root.setProperty('--color-primary-rgb', hexToRgb(o.primary))
  }
  if (o.secondary) {
    root.setProperty('--color-secondary', o.secondary)
    root.setProperty('--color-secondary-rgb', hexToRgb(o.secondary))
  }
  if (o.bg) {
    root.setProperty('--color-bg', o.bg)
    root.setProperty('--color-bg-rgb', hexToRgb(o.bg))
  }
  if (o.surface) {
    root.setProperty('--color-surface', o.surface)
    root.setProperty('--color-surface-rgb', hexToRgb(o.surface))
  }
  if (o.elevated) {
    root.setProperty('--color-elevated', o.elevated)
    root.setProperty('--color-elevated-rgb', hexToRgb(o.elevated))
  }
  if (o.fontSize) {
    root.setProperty('--font-size-base', `${o.fontSize}px`)
  }
  if (o.borderRadius !== undefined) {
    root.setProperty('--radius-sm', `${o.borderRadius}px`)
    root.setProperty('--radius-md', `${o.borderRadius + 4}px`)
    root.setProperty('--radius-lg', `${o.borderRadius + 8}px`)
  }
}

function setCustom(overrides: CustomThemeOverrides) {
  customOverrides.value = overrides
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(overrides))
  applyCustomOverrides()
}

function resetCustom() {
  customOverrides.value = {}
  localStorage.removeItem(CUSTOM_KEY)
  const root = document.documentElement.style
  root.removeProperty('--color-primary')
  root.removeProperty('--color-primary-rgb')
  root.removeProperty('--color-secondary')
  root.removeProperty('--color-secondary-rgb')
  root.removeProperty('--color-bg')
  root.removeProperty('--color-bg-rgb')
  root.removeProperty('--color-surface')
  root.removeProperty('--color-surface-rgb')
  root.removeProperty('--color-elevated')
  root.removeProperty('--color-elevated-rgb')
  root.removeProperty('--font-size-base')
  root.removeProperty('--radius-sm')
  root.removeProperty('--radius-md')
  root.removeProperty('--radius-lg')
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'cyber-dark'
  applyTheme(saved)
}

watch(currentTheme, (val) => {
  applyTheme(val)
})

export function useTheme() {
  return {
    currentTheme,
    themes,
    customOverrides,
    setTheme: applyTheme,
    setCustom,
    resetCustom,
    initTheme,
  }
}
