<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <span class="px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wide text-t-primary bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.2)]">JSON</span>
        <span class="text-[11px] text-t-muted">{{ charCount.toLocaleString() }} 字符</span>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" :class="toolBtnClass" title="格式化为 2 空格缩进" @click="formatJson">
          <Wand2 class="w-3.5 h-3.5" />
          格式化
        </button>
        <button type="button" :class="toolBtnClass" title="复制全部内容" @click="copyJson">
          <Check v-if="copied" class="w-3.5 h-3.5 text-t-success" />
          <Copy v-else class="w-3.5 h-3.5" />
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
    </div>

    <textarea
      v-model="model"
      :style="{ minHeight }"
      spellcheck="false"
      class="form-control font-mono text-xs leading-relaxed resize-y"
      :class="error ? 'is-invalid' : ''"
      placeholder="{}"
    />

    <div class="flex items-start justify-between gap-3">
      <p v-if="error" class="flex items-start gap-1.5 text-xs text-t-danger">
        <AlertCircle class="w-3.5 h-3.5 mt-px shrink-0" />
        <span>{{ error }}</span>
      </p>
      <span v-else class="text-[11px] text-t-muted">编辑后请保证 JSON 合法，保存时会再次校验</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { AlertCircle, Check, Copy, Wand2 } from 'lucide-vue-next'

const model = defineModel<string>({ required: true })

withDefaults(defineProps<{
  minHeight?: string
  error?: string
}>(), {
  minHeight: '420px',
  error: '',
})

const toast = useToast()

const toolBtnClass = 'btn-admin btn-admin-secondary'

const charCount = computed(() => model.value.length)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

function formatJson(): void {
  try {
    const parsed: unknown = JSON.parse(model.value)
    model.value = JSON.stringify(parsed, null, 2)
  } catch {
    toast.error('JSON 语法错误，无法格式化')
  }
}

async function copyJson(): Promise<void> {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      throw new Error('clipboard unavailable')
    }
    await navigator.clipboard.writeText(model.value)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1600)
    toast.success('已复制到剪贴板')
  } catch {
    toast.error('复制失败，请手动选择内容复制')
  }
}

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>
