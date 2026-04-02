const TOKEN_KEY = 'liliblog_token'
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
    removeUserInfo()
}
