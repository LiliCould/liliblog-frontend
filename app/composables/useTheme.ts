export interface ThemeInfo {
  id: string
  name: string
  preview: { primary: string; bg: string; surface: string }
  systemMapping?: 'light' | 'dark'
}

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

const THEME_KEY = 'liliblog-theme'
const FOLLOW_SYSTEM_KEY = 'liliblog-theme-follow-system'

export function useTheme() {
  const currentTheme = useState<string>('liliblog-theme', () => 'light')
  const followSystem = useState<boolean>('liliblog-theme-follow-system', () => false)

  function resolveSystemTheme(): string {
    if (!import.meta.client) return 'light'
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    return themes.find(theme => theme.systemMapping === system)?.id || 'light'
  }

  function applyTheme(themeId: string): void {
    const theme = themes.find(item => item.id === themeId)
    if (!theme) return

    currentTheme.value = theme.id
    if (!import.meta.client) return

    document.documentElement.setAttribute('data-theme', theme.id)
    try {
      localStorage.setItem(THEME_KEY, theme.id)
    } catch {
      // localStorage 不可用时仅保留当前会话状态
    }
  }

  function setFollowSystem(value: boolean): void {
    followSystem.value = value
    if (!import.meta.client) return

    try {
      localStorage.setItem(FOLLOW_SYSTEM_KEY, String(value))
    } catch {
      // ignore
    }

    if (value) applyTheme(resolveSystemTheme())
  }

  function initTheme(): void {
    if (!import.meta.client) return

    try {
      if (import.meta.dev) {
        const queryTheme = new URLSearchParams(window.location.search).get('theme')
        if (queryTheme && themes.some(theme => theme.id === queryTheme)) {
          applyTheme(queryTheme)
          return
        }
      }

      const saved = localStorage.getItem(THEME_KEY)
      if (saved && themes.some(theme => theme.id === saved)) {
        applyTheme(saved)
        return
      }
      followSystem.value = localStorage.getItem(FOLLOW_SYSTEM_KEY) === 'true'
    } catch {
      // ignore
    }

    applyTheme(followSystem.value ? resolveSystemTheme() : 'light')
  }

  function destroyTheme(): void {
    // 预留：当前主题使用纯 DOM 属性，无需清理监听
  }

  return {
    themes,
    currentTheme,
    followSystem,
    initTheme,
    destroyTheme,
    applyTheme,
    setFollowSystem,
  }
}
