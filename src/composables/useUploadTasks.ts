import { ref } from 'vue'
import type { Ref } from 'vue'
import { PROCESSING_HINT_DELAY } from '@/composables/useUploadProgress'
import type { UploadProgressEvent, UploadPhase } from '@/api/file'

export type UploadTaskStatus = 'active' | 'error'

export interface UploadTask {
    id: number
    name: string
    percent: number
    phase: UploadPhase
    status: UploadTaskStatus
}

/** 失败态停留时长，让用户看清是哪个文件失败了 */
const ERROR_HOLD_MS = 2000

let nextId = 1

/**
 * 编辑器上传任务列表（每个编辑器实例一份，不用模块级共享）。
 *
 * 这里刻意只维护数据，不往 contenteditable 里插任何节点：
 * vditor 在 input / keydown 时会把 .vditor-reset 的 innerHTML 整体交给 Lute
 * 转成 markdown，插进去的占位节点会被当成原始 HTML 写进正文，且无法自愈。
 */
export function useUploadTasks() {
    const tasks = ref<UploadTask[]>([])
    const hintTimers = new Map<number, ReturnType<typeof setTimeout>>()
    const errorTimers = new Map<number, ReturnType<typeof setTimeout>>()

    function clearHint(id: number) {
        const timer = hintTimers.get(id)
        if (timer) {
            clearTimeout(timer)
            hintTimers.delete(id)
        }
    }

    /** 请求体已发完、后端正在转存七牛：延迟切入「处理中」，小文件不至于闪一下 */
    function scheduleProcessing(id: number) {
        if (hintTimers.has(id)) return
        hintTimers.set(
            id,
            setTimeout(() => {
                hintTimers.delete(id)
                const task = tasks.value.find((t) => t.id === id)
                if (task && task.status === 'active') {
                    task.phase = 'processing'
                }
            }, PROCESSING_HINT_DELAY),
        )
    }

    function start(name: string): number {
        const id = nextId++
        tasks.value.push({ id, name, percent: 0, phase: 'uploading', status: 'active' })
        return id
    }

    function update(id: number, e: UploadProgressEvent) {
        const task = tasks.value.find((t) => t.id === id)
        if (!task || task.status !== 'active') return
        if (e.phase === 'processing') {
            task.percent = 100
            scheduleProcessing(id)
            return
        }
        task.percent = Math.max(0, Math.min(100, Math.round(e.percent)))
    }

    function remove(id: number) {
        tasks.value = tasks.value.filter((t) => t.id !== id)
    }

    /** 成功：立即移除任务 */
    function finish(id: number) {
        clearHint(id)
        remove(id)
    }

    /** 失败：留在列表里显示错误态，稍后自动移除 */
    function fail(id: number) {
        clearHint(id)
        const task = tasks.value.find((t) => t.id === id)
        if (!task) return
        task.status = 'error'
        task.phase = 'uploading'
        errorTimers.set(
            id,
            setTimeout(() => {
                errorTimers.delete(id)
                remove(id)
            }, ERROR_HOLD_MS),
        )
    }

    /** 组件卸载时清干净，避免计时器泄漏到下一次挂载 */
    function dispose() {
        hintTimers.forEach((timer) => clearTimeout(timer))
        hintTimers.clear()
        errorTimers.forEach((timer) => clearTimeout(timer))
        errorTimers.clear()
        tasks.value = []
    }

    return { tasks: tasks as Ref<UploadTask[]>, start, update, finish, fail, dispose }
}
