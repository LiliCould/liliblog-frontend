import { ref } from 'vue'
import type { Ref } from 'vue'
import { PROCESSING_HINT_DELAY } from '~/composables/useUploadProgress'
import type { UploadPhase, UploadProgressEvent } from '~/api/file'

export type UploadTaskStatus = 'active' | 'error'

export interface UploadTask {
  id: number
  name: string
  percent: number
  phase: UploadPhase
  status: UploadTaskStatus
}

const ERROR_HOLD_MS = 2000
let nextId = 1

export function useUploadTasks() {
  const tasks = ref<UploadTask[]>([])
  const hintTimers = new Map<number, ReturnType<typeof setTimeout>>()
  const errorTimers = new Map<number, ReturnType<typeof setTimeout>>()

  function clearHint(id: number): void {
    const timer = hintTimers.get(id)
    if (timer) {
      clearTimeout(timer)
      hintTimers.delete(id)
    }
  }

  function scheduleProcessing(id: number): void {
    if (hintTimers.has(id)) return
    hintTimers.set(id, setTimeout(() => {
      hintTimers.delete(id)
      const task = tasks.value.find(item => item.id === id)
      if (task && task.status === 'active') task.phase = 'processing'
    }, PROCESSING_HINT_DELAY))
  }

  function start(name: string): number {
    const id = nextId++
    tasks.value.push({ id, name, percent: 0, phase: 'uploading', status: 'active' })
    return id
  }

  function update(id: number, event: UploadProgressEvent): void {
    const task = tasks.value.find(item => item.id === id)
    if (!task || task.status !== 'active') return
    if (event.phase === 'processing') {
      task.percent = 100
      scheduleProcessing(id)
      return
    }
    task.percent = Math.max(0, Math.min(100, Math.round(event.percent)))
  }

  function remove(id: number): void {
    tasks.value = tasks.value.filter(item => item.id !== id)
  }

  function finish(id: number): void {
    clearHint(id)
    remove(id)
  }

  function fail(id: number): void {
    clearHint(id)
    const task = tasks.value.find(item => item.id === id)
    if (!task) return
    task.status = 'error'
    task.phase = 'uploading'
    errorTimers.set(id, setTimeout(() => {
      errorTimers.delete(id)
      remove(id)
    }, ERROR_HOLD_MS))
  }

  function dispose(): void {
    hintTimers.forEach(timer => clearTimeout(timer))
    hintTimers.clear()
    errorTimers.forEach(timer => clearTimeout(timer))
    errorTimers.clear()
    tasks.value = []
  }

  return { tasks: tasks as Ref<UploadTask[]>, start, update, finish, fail, dispose }
}
