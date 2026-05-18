import dayjs from 'dayjs'

export const DEFAULT_AVATAR = 'https://oss.lilicould.cn/cover/df3523eb-ee5d-43c7-95bf-c85d78444484_xiaodingdang.png'

export function resolveAvatar(avatar?: string | null): string {
    return avatar || DEFAULT_AVATAR
}

export function handleAvatarError(e: Event): void {
    const img = e.target as HTMLImageElement
    if (img && img.src !== DEFAULT_AVATAR) {
        img.src = DEFAULT_AVATAR
    }
}

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

export function formatMessageTime(dateStr?: string): string {
    if (!dateStr) return ''
    const now = dayjs()
    const target = dayjs(dateStr)
    const isToday = now.isSame(target, 'day')
    const isYesterday = now.subtract(1, 'day').isSame(target, 'day')

    if (isToday) {
        return target.format('HH:mm')
    } else if (isYesterday) {
        return `昨天 ${target.format('HH:mm')}`
    } else if (now.isSame(target, 'year')) {
        return target.format('MM-DD HH:mm')
    } else {
        return target.format('YYYY-MM-DD HH:mm')
    }
}

export function formatNumber(num: number): string {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}w`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return String(num)
}
