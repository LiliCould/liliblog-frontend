import { ref, watch } from 'vue'

export interface ThemeInfo {
  id: string
  name: string
  preview: { primary: string; bg: string; surface: string }
  systemMapping?: 'light' | 'dark'
}

export interface CustomThemeOverrides {
  primary?: string
  secondary?: string
  tertiary?: string
  accent?: string
  title?: string
  body?: string
  bg?: string
  surface?: string
  elevated?: string
  card?: string
  border?: string
  inputBg?: string
  codeBg?: string
  fontSize?: number
  fontFamily?: string
  lineHeight?: number
  borderRadius?: number
  contentMaxWidth?: number
}

const THEME_KEY = 'liliblog-theme'
const CUSTOM_KEY = 'liliblog-theme-custom'
const FOLLOW_SYSTEM_KEY = 'liliblog-theme-follow-system'

export const themes: ThemeInfo[] = [
  {
    id: 'light',
    name: '明亮模式',
    preview: { primary: '#0284c7', bg: '#f8fafc', surface: '#ffffff' },
    systemMapping: 'light',
  },
  {
    id: 'cyber-dark',
    name: '赛博暗夜',
    preview: { primary: '#00f0ff', bg: '#0a0a0f', surface: '#111118' },
    systemMapping: 'dark',
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

const currentTheme = ref<string>(localStorage.getItem(THEME_KEY) || 'light')
const customOverrides = ref<CustomThemeOverrides>(loadCustom())
const followSystem = ref<boolean>(localStorage.getItem(FOLLOW_SYSTEM_KEY) === 'true')

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

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveThemeForSystem(systemPref: 'light' | 'dark'): string {
  const mapped = themes.find(t => t.systemMapping === systemPref)
  return mapped ? mapped.id : 'light'
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
  if (o.tertiary) {
    root.setProperty('--color-tertiary', o.tertiary)
    root.setProperty('--color-tertiary-rgb', hexToRgb(o.tertiary))
  }
  if (o.accent) {
    root.setProperty('--color-accent', o.accent)
  }
  if (o.title) {
    root.setProperty('--color-title', o.title)
  }
  if (o.body) {
    root.setProperty('--color-body', o.body)
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
  if (o.card) {
    root.setProperty('--color-card', o.card)
    root.setProperty('--color-card-rgb', hexToRgb(o.card))
  }
  if (o.border) {
    root.setProperty('--color-border-solid', o.border)
  }
  if (o.inputBg) {
    root.setProperty('--color-input-bg', o.inputBg)
  }
  if (o.codeBg) {
    root.setProperty('--color-code-bg', o.codeBg)
  }
  if (o.fontSize) {
    root.setProperty('--font-size-base', `${o.fontSize}px`)
  }
  if (o.fontFamily) {
    root.setProperty('--font-body', o.fontFamily)
  }
  if (o.lineHeight) {
    root.setProperty('--line-height-normal', `${o.lineHeight}`)
  }
  if (o.borderRadius !== undefined) {
    root.setProperty('--radius-sm', `${o.borderRadius}px`)
    root.setProperty('--radius-md', `${o.borderRadius + 4}px`)
    root.setProperty('--radius-lg', `${o.borderRadius + 8}px`)
  }
  if (o.contentMaxWidth) {
    root.setProperty('--content-max-width', `${o.contentMaxWidth}px`)
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
  root.removeProperty('--color-tertiary')
  root.removeProperty('--color-tertiary-rgb')
  root.removeProperty('--color-accent')
  root.removeProperty('--color-title')
  root.removeProperty('--color-body')
  root.removeProperty('--color-bg')
  root.removeProperty('--color-bg-rgb')
  root.removeProperty('--color-surface')
  root.removeProperty('--color-surface-rgb')
  root.removeProperty('--color-elevated')
  root.removeProperty('--color-elevated-rgb')
  root.removeProperty('--color-card')
  root.removeProperty('--color-card-rgb')
  root.removeProperty('--color-border-solid')
  root.removeProperty('--color-input-bg')
  root.removeProperty('--color-code-bg')
  root.removeProperty('--font-size-base')
  root.removeProperty('--font-body')
  root.removeProperty('--line-height-normal')
  root.removeProperty('--radius-sm')
  root.removeProperty('--radius-md')
  root.removeProperty('--radius-lg')
  root.removeProperty('--content-max-width')
}

function enableFollowSystem() {
  followSystem.value = true
  localStorage.setItem(FOLLOW_SYSTEM_KEY, 'true')
  resetCustom()
  const systemPref = getSystemTheme()
  applyTheme(resolveThemeForSystem(systemPref))
}

function disableFollowSystem() {
  followSystem.value = false
  localStorage.setItem(FOLLOW_SYSTEM_KEY, 'false')
}

function setTheme(themeId: string) {
  followSystem.value = false
  localStorage.setItem(FOLLOW_SYSTEM_KEY, 'false')
  applyTheme(themeId)
}

function handleSystemThemeChange(e: MediaQueryListEvent) {
  if (!followSystem.value) return
  const systemPref: 'light' | 'dark' = e.matches ? 'dark' : 'light'
  applyTheme(resolveThemeForSystem(systemPref))
}

let mediaQuery: MediaQueryList | null = null

function initTheme() {
  if (followSystem.value) {
    const systemPref = getSystemTheme()
    applyTheme(resolveThemeForSystem(systemPref))
  } else {
    const saved = localStorage.getItem(THEME_KEY) || 'light'
    applyTheme(saved)
  }

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
}

function destroyTheme() {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
    mediaQuery = null
  }
}

watch(currentTheme, (val) => {
  applyTheme(val)
})

export function useTheme() {
  return {
    currentTheme,
    themes,
    customOverrides,
    followSystem,
    setTheme,
    setCustom,
    resetCustom,
    enableFollowSystem,
    disableFollowSystem,
    initTheme,
    destroyTheme,
    getSystemTheme,
  }
}
