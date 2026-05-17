import { ref } from 'vue'
import type { ToastItem } from '@/components/ui/Toast.vue'

const toasts = ref<ToastItem[]>([])

let idCounter = 0

export function useToast() {
  const add = (type: ToastItem['type'], message: string, duration = 3000) => {
    const id = `toast-${++idCounter}`
    toasts.value.push({ id, type, message })
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => add('success', message, duration)
  const error = (message: string, duration?: number) => add('error', message, duration)
  const info = (message: string, duration?: number) => add('info', message, duration)

  return {
    toasts,
    add,
    remove,
    success,
    error,
    info,
  }
}
