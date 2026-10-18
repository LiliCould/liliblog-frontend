import { toast } from 'vue-sonner'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

function normalizeError(error: unknown): string {
  if (!error) return '操作失败'
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message || '操作失败'
  const value = error as { msg?: string; message?: string }
  return value.msg || value.message || '操作失败'
}

export function useToast() {
  function success(message: string): void {
    toast.success(message)
  }

  function error(errorOrMessage: unknown, fallbackMessage?: string): void {
    const message = normalizeError(errorOrMessage) || fallbackMessage
    if (message) toast.error(message)
  }

  function warning(message: string): void {
    toast.warning(message)
  }

  function info(message: string): void {
    toast.info(message)
  }

  function businessError(code: number, message?: string): void {
    if (code === 401) return
    toast.error(message || `操作失败(${code})`)
  }

  function dismiss(id?: string | number): void {
    toast.dismiss(id)
  }

  return {
    success,
    error,
    warning,
    info,
    businessError,
    dismiss,
  }
}
