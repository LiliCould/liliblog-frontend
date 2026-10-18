<template>
  <button
    v-if="tocItems.length > 0"
    class="md:hidden fixed right-4 z-[var(--z-bottom-nav)] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] text-t-primary shadow-lg transition-transform duration-150 active:scale-95"
    :style="{ bottom: 'calc(var(--mobile-bottom-nav-height, 56px) + 16px + var(--safe-bottom, 0px))' }"
    aria-label="打开目录"
    @click="open = true"
  >
    <List class="h-5 w-5" />
  </button>

  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay
        class="md:hidden fixed inset-0 z-[var(--z-modal)] bg-[var(--color-overlay)] backdrop-blur-sm data-[state=open]:animate-[overlay-in_200ms_ease-out] data-[state=closed]:animate-[overlay-out_150ms_ease-in]"
      />

      <DialogContent
        class="md:hidden fixed inset-x-0 z-[var(--z-modal)] rounded-t-2xl border-t border-[var(--glass-border)] bg-[var(--glass-bg-strong)] shadow-2xl outline-none data-[state=open]:animate-[sheet-in_300ms_cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-[sheet-out_200ms_ease-in]"
        :style="{ bottom: 'calc(var(--mobile-bottom-nav-height, 56px) + var(--safe-bottom, 0px))', maxHeight: '70dvh' }"
      >
        <DialogTitle class="sr-only">文章目录</DialogTitle>
        <DialogDescription class="sr-only">点击目录项跳转到对应章节</DialogDescription>

        <div class="flex justify-center pt-3 pb-1">
          <div class="h-1 w-10 rounded-full bg-t-border" />
        </div>

        <div class="flex items-center gap-2.5 border-b border-[var(--glass-border)] px-5 pb-2">
          <List class="h-4 w-4 text-t-primary" />
          <h3 class="m-0 text-sm font-semibold text-t-title">目录</h3>
          <span class="ml-auto text-xs text-t-muted">{{ tocItems.length }} 项</span>
          <DialogClose as-child>
            <button class="flex h-9 w-9 items-center justify-center rounded-control text-t-muted hover:bg-[rgba(var(--color-primary-rgb),0.08)] hover:text-t-primary" aria-label="关闭目录">
              <X class="h-4 w-4" />
            </button>
          </DialogClose>
        </div>

        <nav class="overflow-y-auto overscroll-contain p-3 space-y-0.5" style="max-height: calc(70dvh - 64px);">
          <button
            v-for="item in tocItems"
            :key="item.id"
            class="block min-h-11 w-full rounded-control px-3 py-2 text-left text-sm text-t-body no-underline transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:text-t-primary"
            :class="{ 'pl-5': item.level === 2, 'pl-8 text-xs': item.level === 3 }"
            @click="handleClick(item.id)"
          >
            {{ item.text }}
          </button>
        </nav>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { List, X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { extractTocItems } from '~/utils/toc'

const props = defineProps<{
  htmlContent: string
}>()

const open = ref(false)
const tocItems = computed(() => extractTocItems(props.htmlContent))

function onOpenChange(value: boolean): void {
  open.value = value
}

function handleClick(id: string): void {
  open.value = false
  if (!import.meta.client) return
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}
</script>
