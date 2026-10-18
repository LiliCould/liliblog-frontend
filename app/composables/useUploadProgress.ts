import { readonly, ref } from 'vue'
import type { Ref } from 'vue'
import { uploadFile } from '~/api/file'
import type { UploadPhase, UploadProgressEvent } from '~/api/file'
import type { ApiResponse } from '~/types'

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

export function useUploadProgress() {
  function clearTimers(): void {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    if (processingTimer) {
      clearTimeout(processingTimer)
      processingTimer = null
    }
  }

  function start(label: string): void {
    clearTimers()
    state.value = { visible: true, label, percent: 0, phase: 'uploading' }
  }

  function scheduleProcessing(): void {
    if (processingTimer) return
    processingTimer = setTimeout(() => {
      processingTimer = null
      if (state.value.visible) state.value.phase = 'processing'
    }, PROCESSING_HINT_DELAY)
  }

  function update(event: UploadProgressEvent): void {
    if (!state.value.visible) return
    if (event.phase === 'processing') {
      state.value.percent = 100
      scheduleProcessing()
      return
    }
    state.value.percent = Math.max(0, Math.min(100, Math.round(event.percent)))
  }

  function finish(): void {
    const wasProcessing = state.value.phase === 'processing'
    clearTimers()
    if (wasProcessing) {
      state.value.visible = false
      return
    }
    state.value.percent = 100
    hideTimer = setTimeout(() => {
      state.value.visible = false
    }, 500)
  }

  function fail(): void {
    clearTimers()
    state.value.visible = false
  }

  function hide(): void {
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

export function uploadWithProgress(file: File, type: string, label: string): Promise<ApiResponse<string>> {
  const { start, update, finish, fail } = useUploadProgress()
  start(label)
  return uploadFile(file, type, event => update(event))
    .then((response) => {
      finish()
      return response
    })
    .catch((error) => {
      fail()
      throw error
    })
}
