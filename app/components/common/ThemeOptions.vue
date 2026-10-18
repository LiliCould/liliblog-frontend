<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-2.5">
      <button
        v-for="theme in themes"
        :key="theme.id"
        type="button"
        class="group flex items-center gap-2.5 rounded-control border p-2.5 text-left transition-all duration-200 cursor-pointer"
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

    <label class="flex items-center justify-between gap-3 rounded-control border border-t-border px-3 py-2.5 cursor-pointer">
      <span class="text-xs text-t-body">跟随系统明暗</span>
      <input
        type="checkbox"
        class="w-4 h-4 accent-[var(--color-primary)]"
        :checked="followSystem"
        @change="setFollowSystem(($event.target as HTMLInputElement).checked)"
      />
    </label>

    <p class="text-[11px] leading-relaxed text-t-muted">
      主题会保存在本地，公开页面不依赖登录状态。
    </p>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const { themes, currentTheme, followSystem, applyTheme, setFollowSystem } = useTheme()
</script>
