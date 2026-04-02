import dayjs from 'dayjs'

export function formatDate(dateStr: string, pattern = 'YYYY-MM-DD'): string {
    if (!dateStr) return ''
    return dayjs(dateStr).format(pattern)
}

export function formatDateTime(dateStr: string): string {
    return formatDate(dateStr, 'YYYY-MM-DD HH:mm')
}

export function formatRelativeTime(dateStr: string): string {
    if (!dateStr) return ''
    const now = dayjs()
    const target = dayjs(dateStr)
    const diffMinutes = now.diff(target, 'minute')
    const diffHours = now.diff(target, 'hour')
    const diffDays = now.diff(target, 'day')

    if (diffMinutes < 1) return '刚刚'
    if (diffMinutes < 60) return `${diffMinutes}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 30) return `${diffDays}天前`
    return formatDate(dateStr)
}

export function formatNumber(num: number): string {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}w`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return String(num)
}
