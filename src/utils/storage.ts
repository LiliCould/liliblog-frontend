const TOKEN_KEY = 'liliblog_token'
const TOKEN_EXPIRES_KEY = 'liliblog_token_expires'
const USER_INFO_KEY = 'liliblog_user_info'

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
}

export function getTokenExpires(): number {
    const val = localStorage.getItem(TOKEN_EXPIRES_KEY)
    return val ? Number(val) : 0
}

export function setTokenExpires(expiresIn: number): void {
    const expiresAt = Date.now() + expiresIn * 1000
    localStorage.setItem(TOKEN_EXPIRES_KEY, String(expiresAt))
}

export function removeTokenExpires(): void {
    localStorage.removeItem(TOKEN_EXPIRES_KEY)
}

export function isTokenExpiringSoon(thresholdMs: number = 5 * 60 * 1000): boolean {
    const expiresAt = getTokenExpires()
    if (!expiresAt) return false
    return Date.now() + thresholdMs >= expiresAt
}

export function isTokenExpired(): boolean {
    const expiresAt = getTokenExpires()
    if (!expiresAt) return true
    return Date.now() >= expiresAt
}

export function getUserInfo<T>(): T | null {
    const data = localStorage.getItem(USER_INFO_KEY)
    if (!data) return null
    try {
        return JSON.parse(data) as T
    } catch {
        return null
    }
}

export function setUserInfo<T>(info: T): void {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info))
}

export function removeUserInfo(): void {
    localStorage.removeItem(USER_INFO_KEY)
}

export function clearAuth(): void {
    removeToken()
    removeTokenExpires()
    removeUserInfo()
}
