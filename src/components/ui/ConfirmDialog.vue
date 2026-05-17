<script setup lang="ts">
import { X, AlertTriangle } from 'lucide-vue-next'

interface Props {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '确认操作',
  description: '确定要执行此操作吗？',
  confirmText: '确认',
  cancelText: '取消',
  danger: false,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()

const close = () => {
  emit('update:open', false)
}

const confirm = () => {
  emit('confirm')
  close()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />
      <div class="relative bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-sm">
        <div class="flex items-start gap-4">
          <div
            :class="[
              'p-2 rounded-xl',
              danger ? 'bg-accent-rose/10' : 'bg-primary/10',
            ]"
          >
            <AlertTriangle
              :class="['w-6 h-6', danger ? 'text-accent-rose' : 'text-primary']"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-text-title mb-1">{{ title }}</h3>
            <p class="text-sm text-text-meta">{{ description }}</p>
          </div>
          <button class="p-1 rounded text-text-meta hover:text-text-title" @click="close">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="flex items-center justify-end gap-3 mt-6">
          <button
            class="px-4 py-2 rounded-lg text-sm text-text-body hover:bg-bg-canvas transition-none"
            @click="close"
          >
            {{ cancelText }}
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-none',
              danger
                ? 'bg-accent-rose text-white hover:opacity-90'
                : 'bg-primary text-primary-foreground hover:opacity-90',
            ]"
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
