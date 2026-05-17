<script setup lang="ts">
import { X, CheckCircle, AlertCircle, Info } from 'lucide-vue-next'

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface Props {
  toasts: ToastItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colorMap = {
  success: 'text-accent-toxic',
  error: 'text-accent-rose',
  info: 'text-primary',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-20 right-4 z-[200] space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 px-4 py-3 bg-bg-surface border border-border rounded-xl shadow-lg min-w-[280px]"
        >
          <component
            :is="iconMap[toast.type]"
            :class="['w-5 h-5', colorMap[toast.type]]"
          />
          <span class="flex-1 text-sm text-text-body">{{ toast.message }}</span>
          <button
            class="p-1 rounded text-text-meta hover:text-text-title"
            @click="emit('remove', toast.id)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0ms;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
