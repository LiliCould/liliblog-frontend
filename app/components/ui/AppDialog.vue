<template>
  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm" />

      <DialogContent
        class="fixed left-1/2 top-1/2 z-[1210] w-full -translate-x-1/2 -translate-y-1/2 border border-t-border bg-t-surface p-6 max-md:inset-2 max-md:max-h-[90dvh] max-md:translate-x-0 max-md:translate-y-0 max-md:overflow-y-auto max-md:max-w-none focus:outline-none"
        :class="maxWidth"
      >
        <div class="flex items-center justify-between mb-5">
          <DialogTitle class="text-base font-semibold text-t-title m-0">{{ title }}</DialogTitle>
          <button class="w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer" aria-label="关闭" @click="close">
            <X class="w-4 h-4" />
          </button>
        </div>
        <DialogDescription class="sr-only">{{ description || title }}</DialogDescription>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { X } from 'lucide-vue-next'

withDefaults(defineProps<{
  open: boolean
  title: string
  description?: string
  maxWidth?: string
}>(), {
  description: '',
  maxWidth: 'max-w-md',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function onOpenChange(value: boolean): void {
  emit('update:open', value)
}

function close(): void {
  emit('update:open', false)
}
</script>
