import { ref, reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: number
  type: ToastType
  message: string
  duration: number
  visible: boolean
  leaving: boolean
}

const toasts = reactive<ToastItem[]>([])
let nextId = 0
let queue: ToastItem[] = []
let isShowing = false

const ERROR_CODE_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '没有操作权限',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  409: '数据冲突，请刷新后重试',
  422: '提交的数据验证失败',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂不可用',
  504: '网关超时',
}

const SILENT_ERROR_CODES = new Set([
  401,
])

const BUSINESS_ERROR_MESSAGES: Record<number, string> = {
  403: '没有操作权限',
  40401: '资源不存在',
  40301: '权限不足',
  40001: '参数错误',
  40101: '认证失败',
}

function getErrorMessage(error: unknown): string {
  if (!error) return '操作失败'
  if (typeof error === 'string') return error
  if (error instanceof Error) {
    const msg = error.message
    if (msg === 'Network Error') return '网络连接失败，请检查网络'
    if (msg.includes('timeout')) return '请求超时，请稍后重试'
    return msg || '操作失败'
  }
  const err = error as any
  if (err.response) {
    const status = err.response.status
    if (SILENT_ERROR_CODES.has(status)) return ''
    const serverMsg = err.response.data?.msg || err.response.data?.message
    if (serverMsg) return serverMsg
    return ERROR_CODE_MESSAGES[status] || `请求失败(${status})`
  }
  if (err.code !== undefined && err.code !== 0) {
    return BUSINESS_ERROR_MESSAGES[err.code] || err.msg || err.message || `操作失败(${err.code})`
  }
  return err.msg || err.message || '操作失败'
}

function isSilentError(error: unknown): boolean {
  if (!error) return false
  const err = error as any
  if (err.response?.status && SILENT_ERROR_CODES.has(err.response.status)) return true
  return false
}

function processQueue() {
  if (isShowing || queue.length === 0) return
  isShowing = true
  const item = queue.shift()!
  toasts.push(item)
  requestAnimationFrame(() => {
    item.visible = true
  })
  setTimeout(() => {
    dismiss(item.id)
  }, item.duration)
}

function dismiss(id: number) {
  const item = toasts.find(t => t.id === id)
  if (!item) return
  item.leaving = true
  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id)
    if (idx > -1) toasts.splice(idx, 1)
    isShowing = false
    processQueue()
  }, 200)
}

function addToast(type: ToastType, message: string, duration?: number) {
  if (!message) return
  const item: ToastItem = {
    id: nextId++,
    type,
    message,
    duration: duration ?? (type === 'success' ? 1500 : 2000),
    visible: false,
    leaving: false,
  }
  queue.push(item)
  processQueue()
}

export function useToast() {
  function success(message: string) {
    addToast('success', message)
  }

  function error(errorOrMessage: unknown, fallbackMessage?: string) {
    if (isSilentError(errorOrMessage)) return
    const msg = getErrorMessage(errorOrMessage) || fallbackMessage || '操作失败'
    if (!msg) return
    addToast('error', msg)
  }

  function warning(message: string) {
    addToast('warning', message, 2500)
  }

  function info(message: string) {
    addToast('info', message, 2000)
  }

  function businessError(code: number, msg?: string) {
    if (SILENT_ERROR_CODES.has(code)) return
    const message = msg || BUSINESS_ERROR_MESSAGES[code] || `操作失败(${code})`
    addToast('error', message)
  }

  return {
    toasts: ref(toasts),
    success,
    error,
    warning,
    info,
    businessError,
    dismiss,
  }
}
