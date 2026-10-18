<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-[1200] bg-[rgba(0,0,0,0.5)]"
        role="dialog"
        aria-modal="true"
        aria-label="主题设置"
        @click="$emit('close')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-95"
          appear
        >
          <div
            class="absolute right-4 top-20 w-[320px] max-w-[calc(100vw-2rem)] rounded-xl border border-t-border bg-t-surface p-4 shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
            @click.stop
          >
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-t-border">
              <div class="flex items-center gap-2">
                <Palette class="w-4 h-4 text-t-primary" />
                <h3 class="text-sm font-semibold text-t-title">主题设置</h3>
              </div>
              <button
                class="w-8 h-8 rounded-md flex items-center justify-center text-t-muted transition-colors duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)]"
                aria-label="关闭主题设置"
                @click="$emit('close')"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <button
                v-for="theme in themes"
                :key="theme.id"
                class="group flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all duration-200"
                :class="currentTheme === theme.id
                  ? 'border-t-primary bg-[rgba(var(--color-primary-rgb),0.08)]'
                  : 'border-t-border hover:border-[rgba(var(--color-primary-rgb),0.4)] hover:bg-[rgba(var(--color-primary-rgb),0.04)]'"
                @click="applyTheme(theme.id)"
              >
                <span
                  class="w-8 h-8 rounded-full border border-black/10 shrink-0"
                  :style="{ background: `linear-gradient(135deg, ${theme.preview.primary} 0 50%, ${theme.preview.surface} 50% 100%)` }"
                />
                <span class="min-w-0">
                  <span class="block text-xs font-semibold text-t-title truncate">{{ theme.name }}</span>
                  <span class="block text-[10px] text-t-muted mt-0.5">{{ theme.id }}</span>
                </span>
                <Check v-if="currentTheme === theme.id" class="w-4 h-4 ml-auto text-t-primary shrink-0" />
              </button>
            </div>

            <label class="mt-4 flex items-center justify-between gap-3 rounded-lg border border-t-border px-3 py-2.5 cursor-pointer">
              <span class="text-xs text-t-body">跟随系统明暗</span>
              <input
                type="checkbox"
                class="w-4 h-4 accent-[var(--color-primary)]"
                :checked="followSystem"
                @change="setFollowSystem(($event.target as HTMLInputElement).checked)"
              />
            </label>

            <p class="mt-3 text-[11px] leading-relaxed text-t-muted">
              主题会保存在本地，公开页面不依赖登录状态。
            </p>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Check, Palette, X } from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
}>()

const { themes, currentTheme, followSystem, applyTheme, setFollowSystem } = useTheme()

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
