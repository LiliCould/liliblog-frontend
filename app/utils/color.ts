/**
 * 把十六进制颜色转换成带透明度的 rgba。
 * 后端标签色可能是 3/6/8 位 hex；非法值回退到主题主色。
 */
export function withAlpha(color: string | null | undefined, alpha: number): string {
  const safeAlpha = Math.min(1, Math.max(0, alpha))
  const fallback = `rgba(var(--color-primary-rgb), ${safeAlpha})`

  if (!color) return fallback

  let value = color.trim()
  if (!value.startsWith('#')) return fallback

  value = value.slice(1)
  if (value.length === 3) {
    value = value.split('').map(char => char + char).join('')
  }
  if (value.length === 6) {
    value += 'ff'
  }
  if (value.length !== 8 || !/^[0-9a-f]+$/i.test(value)) {
    return fallback
  }

  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)
  const sourceAlpha = Number.parseInt(value.slice(6, 8), 16) / 255

  return `rgba(${red}, ${green}, ${blue}, ${(safeAlpha * sourceAlpha).toFixed(3)})`
}
