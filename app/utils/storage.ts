const TOKEN_KEY = 'liliblog_token'
const TOKEN_EXPIRES_KEY = 'liliblog_token_expires'
const USER_INFO_KEY = 'liliblog_user_info'

function hasStorage(): boolean {
  return import.meta.client && typeof localStorage !== 'undefined'
}

export function getToken(): string | null {
  if (!hasStorage()) return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (!hasStorage()) return
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  if (!hasStorage()) return
  localStorage.removeItem(TOKEN_KEY)
}

export function getTokenExpires(): number {
  if (!hasStorage()) return 0
  const value = localStorage.getItem(TOKEN_EXPIRES_KEY)
  return value ? Number(value) : 0
}

export function setTokenExpires(expiresIn: number): void {
  if (!hasStorage()) return
  localStorage.setItem(TOKEN_EXPIRES_KEY, String(Date.now() + expiresIn * 1000))
}

export function removeTokenExpires(): void {
  if (!hasStorage()) return
  localStorage.removeItem(TOKEN_EXPIRES_KEY)
}

export function isTokenExpiringSoon(thresholdMs = 5 * 60 * 1000): boolean {
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
  if (!hasStorage()) return null
  const data = localStorage.getItem(USER_INFO_KEY)
  if (!data) return null
  try {
    return JSON.parse(data) as T
  } catch {
    return null
  }
}

export function setUserInfo<T>(info: T): void {
  if (!hasStorage()) return
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(info))
}

export function removeUserInfo(): void {
  if (!hasStorage()) return
  localStorage.removeItem(USER_INFO_KEY)
}

export function clearAuth(): void {
  removeToken()
  removeTokenExpires()
  removeUserInfo()
}
