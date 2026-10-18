import { ref } from 'vue'
import githubCss from '~/assets/styles/code-themes/github.css?raw'
import atomOneLightCss from '~/assets/styles/code-themes/atom-one-light.css?raw'
import githubDarkCss from '~/assets/styles/code-themes/github-dark.css?raw'
import atomOneDarkCss from '~/assets/styles/code-themes/atom-one-dark.css?raw'
import draculaCss from '~/assets/styles/code-themes/dracula.css?raw'
import monokaiSublimeCss from '~/assets/styles/code-themes/monokai-sublime.css?raw'
import vs2015Css from '~/assets/styles/code-themes/vs2015.css?raw'
import nordCss from '~/assets/styles/code-themes/nord.css?raw'
import tokyoNightDarkCss from '~/assets/styles/code-themes/tokyo-night-dark.css?raw'
import nightOwlCss from '~/assets/styles/code-themes/night-owl.css?raw'

export interface CodeThemeInfo {
  id: string
  name: string
  isDark: boolean
  preview: { bg: string; color: string }
  vditorStyle: string
}

const CODE_THEME_KEY = 'liliblog-code-theme'
const STYLE_ID = 'code-theme-style'
const DEFAULT_CODE_THEME = 'atom-one-dark'
const LIGHT_CODE_THEME = 'github'

const cssMap: Record<string, string> = {
  github: githubCss,
  'atom-one-light': atomOneLightCss,
  'github-dark': githubDarkCss,
  'atom-one-dark': atomOneDarkCss,
  dracula: draculaCss,
  'monokai-sublime': monokaiSublimeCss,
  vs2015: vs2015Css,
  nord: nordCss,
  'tokyo-night-dark': tokyoNightDarkCss,
  'night-owl': nightOwlCss,
}

export const codeThemes: CodeThemeInfo[] = [
  { id: 'github', name: 'GitHub', isDark: false, preview: { bg: '#f6f8fa', color: '#24292e' }, vditorStyle: 'github' },
  { id: 'atom-one-light', name: 'Atom Light', isDark: false, preview: { bg: '#fafafa', color: '#383a42' }, vditorStyle: 'atom-one-light' },
  { id: 'github-dark', name: 'GitHub Dark', isDark: true, preview: { bg: '#0d1117', color: '#c9d1d9' }, vditorStyle: 'github-dark' },
  { id: 'atom-one-dark', name: 'Atom One Dark', isDark: true, preview: { bg: '#282c34', color: '#abb2bf' }, vditorStyle: 'atom-one-dark' },
  { id: 'dracula', name: 'Dracula', isDark: true, preview: { bg: '#282936', color: '#e9e9f4' }, vditorStyle: 'base16/dracula' },
  { id: 'monokai-sublime', name: 'Monokai', isDark: true, preview: { bg: '#23241f', color: '#f8f8f2' }, vditorStyle: 'monokai-sublime' },
  { id: 'vs2015', name: 'VS 2015', isDark: true, preview: { bg: '#1e1e1e', color: '#dcdcdc' }, vditorStyle: 'vs2015' },
  { id: 'nord', name: 'Nord', isDark: true, preview: { bg: '#2e3440', color: '#d8dee9' }, vditorStyle: 'nord' },
  { id: 'tokyo-night-dark', name: 'Tokyo Night', isDark: true, preview: { bg: '#1a1b26', color: '#a9b1d6' }, vditorStyle: 'tokyo-night-dark' },
  { id: 'night-owl', name: 'Night Owl', isDark: true, preview: { bg: '#011627', color: '#d6deeb' }, vditorStyle: 'night-owl' },
]

const currentCodeTheme = ref<string>(DEFAULT_CODE_THEME)

function applyCodeTheme(themeId: string, persist = true): void {
  const theme = codeThemes.find(item => item.id === themeId)
  if (!theme) return

  currentCodeTheme.value = theme.id

  if (!import.meta.client) return

  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = STYLE_ID
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = cssMap[theme.id] ?? ''
  document.documentElement.setAttribute('data-code-theme', theme.id)

  if (!persist) return

  try {
    localStorage.setItem(CODE_THEME_KEY, theme.id)
  } catch {
    // ignore
  }
}

function setCodeTheme(themeId: string): void {
  applyCodeTheme(themeId, true)
}

function uiThemeIsLight(): boolean {
  if (!import.meta.client) return false
  return document.documentElement.getAttribute('data-theme') === 'light'
}

function hasSavedCodeTheme(): boolean {
  if (!import.meta.client) return false
  try {
    return Boolean(localStorage.getItem(CODE_THEME_KEY))
  } catch {
    return false
  }
}

/** 用户没有手动选过代码主题时，让它跟随界面明暗 */
function syncCodeThemeWithUi(): void {
  if (!import.meta.client || hasSavedCodeTheme()) return
  applyCodeTheme(uiThemeIsLight() ? LIGHT_CODE_THEME : DEFAULT_CODE_THEME, false)
}

function initCodeTheme(): void {
  if (!import.meta.client) return

  let saved: string | null = null
  try {
    saved = localStorage.getItem(CODE_THEME_KEY)
  } catch {
    // ignore
  }

  if (saved && cssMap[saved]) {
    applyCodeTheme(saved, false)
    return
  }

  applyCodeTheme(uiThemeIsLight() ? LIGHT_CODE_THEME : DEFAULT_CODE_THEME, false)
}

export function useCodeTheme() {
  return {
    currentCodeTheme,
    codeThemes,
    setCodeTheme,
    initCodeTheme,
    syncCodeThemeWithUi,
  }
}
