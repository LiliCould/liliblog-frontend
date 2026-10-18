<template>
  <AlertDialogRoot :open="open" @update:open="onOpenChange">
    <AlertDialogPortal>
      <AlertDialogOverlay class="fixed inset-0 z-[1300] bg-black/60 backdrop-blur-sm" />

      <AlertDialogContent class="fixed left-1/2 top-1/2 z-[1310] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 border border-t-border bg-t-surface p-6 shadow-2xl focus:outline-none">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="danger ? 'bg-[rgba(244,63,94,0.1)]' : 'bg-[rgba(var(--color-primary-rgb),0.1)]'">
              <AlertTriangle v-if="danger" class="w-5 h-5 text-[#f43f5e]" />
              <HelpCircle v-else class="w-5 h-5 text-t-primary" />
            </div>
            <AlertDialogTitle class="text-base font-semibold text-t-title m-0">{{ title }}</AlertDialogTitle>
          </div>
          <AlertDialogCancel as-child>
            <button class="w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer" aria-label="关闭">
              <X class="w-4 h-4" />
            </button>
          </AlertDialogCancel>
        </div>

        <AlertDialogDescription class="text-sm text-t-body leading-relaxed mb-6">
          <slot>{{ description }}</slot>
        </AlertDialogDescription>

        <div class="flex justify-end gap-3">
          <AlertDialogCancel as-child>
            <button class="px-4 py-2 text-sm text-t-muted border border-t-border hover:text-t-body transition-colors cursor-pointer">
              {{ cancelText }}
            </button>
          </AlertDialogCancel>
          <AlertDialogAction as-child>
            <button
              class="px-4 py-2 text-sm font-semibold text-white transition-all cursor-pointer hover:opacity-90"
              :class="danger ? 'bg-[#f43f5e]' : 'bg-t-primary'"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'reka-ui'
import { AlertTriangle, HelpCircle, X } from 'lucide-vue-next'

withDefaults(defineProps<{
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}>(), {
  title: '确认操作',
  description: '',
  confirmText: '确认',
  cancelText: '取消',
  danger: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

function onOpenChange(value: boolean): void {
  emit('update:open', value)
}
</script>
