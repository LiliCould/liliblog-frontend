import { ref, readonly } from 'vue'
import type { Ref } from 'vue'
import { uploadFile } from '@/api/file'
import type { UploadProgressEvent, UploadPhase } from '@/api/file'
import type { ApiResponse } from '@/types/api'

/**
 * 进入「服务器处理中」提示前等待的时长（毫秒）。
 * 小文件的转存空窗可能只有几十毫秒，立即切换文案会闪一下，
 * 因此延迟到超过该阈值才真正改变形态；期间若已返回，用户只看到一次干净的完成。
 */
export const PROCESSING_HINT_DELAY = 400

export interface UploadProgressState {
    visible: boolean
    label: string
    percent: number
    phase: UploadPhase
}

const state = ref<UploadProgressState>({
    visible: false,
    label: '',
    percent: 0,
    phase: 'uploading',
})

let hideTimer: ReturnType<typeof setTimeout> | null = null
let processingTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 全局上传进度弹窗（封面 / 头像等单文件场景）。
 * 通过模块级 state 共享，配合 <UploadProgressOverlay /> 全局挂载一次。
 */
export function useUploadProgress() {
    function clearTimers() {
        if (hideTimer) {
            clearTimeout(hideTimer)
            hideTimer = null
        }
        if (processingTimer) {
            clearTimeout(processingTimer)
            processingTimer = null
        }
    }

    function start(label: string) {
        clearTimers()
        state.value = { visible: true, label, percent: 0, phase: 'uploading' }
    }

    /** 延迟切入「服务器处理中」，已排期则不重复排 */
    function scheduleProcessing() {
        if (processingTimer) return
        processingTimer = setTimeout(() => {
            processingTimer = null
            if (state.value.visible) {
                state.value.phase = 'processing'
            }
        }, PROCESSING_HINT_DELAY)
    }

    function update(e: UploadProgressEvent) {
        if (!state.value.visible) return
        if (e.phase === 'processing') {
            state.value.percent = 100
            scheduleProcessing()
            return
        }
        state.value.percent = Math.max(0, Math.min(100, Math.round(e.percent)))
    }

    function finish() {
        const wasProcessing = state.value.phase === 'processing'
        clearTimers()
        // 处理阶段本就已经展示了完整的等待反馈，无需再停留；否则让 100% 稍作停留
        if (wasProcessing) {
            state.value.visible = false
            return
        }
        state.value.percent = 100
        hideTimer = setTimeout(() => {
            state.value.visible = false
        }, 500)
    }

    function fail() {
        clearTimers()
        state.value.visible = false
    }

    function hide() {
        clearTimers()
        state.value.visible = false
    }

    return {
        state: readonly(state) as Ref<UploadProgressState>,
        start,
        update,
        finish,
        fail,
        hide,
    }
}

/**
 * 上传文件并自动弹出全局进度条，返回上传结果的 Promise。
 * 适用于封面、头像等单文件上传场景。
 */
export function uploadWithProgress(file: File, type: string, label: string): Promise<ApiResponse<string>> {
    const { start, update, finish, fail } = useUploadProgress()
    start(label)
    return uploadFile(file, type, (e) => update(e))
        .then((res) => {
            finish()
            return res as unknown as ApiResponse<string>
        })
        .catch((err) => {
            fail()
            throw err
        })
}
