<template>
  <PopoverRoot v-if="variant === 'popover'" v-model:open="open">
    <PopoverTrigger as-child>
      <slot name="trigger">
        <button
          class="flex items-center justify-center w-9 h-9 rounded-control text-t-muted hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-200 cursor-pointer"
          aria-label="主题设置"
        >
          <Palette class="w-4 h-4" />
        </button>
      </slot>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        align="end"
        :side-offset="8"
        class="panel-glass z-[var(--z-popover)] w-[320px] max-w-[calc(100vw-2rem)] p-4 outline-none"
      >
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-t-border">
          <div class="flex items-center gap-2">
            <Palette class="w-4 h-4 text-t-primary" />
            <h3 class="text-sm font-semibold text-t-title">主题设置</h3>
          </div>
          <PopoverClose as-child>
            <button
              class="w-8 h-8 rounded-control flex items-center justify-center text-t-muted transition-colors duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)] cursor-pointer"
              aria-label="关闭主题设置"
            >
              <X class="w-4 h-4" />
            </button>
          </PopoverClose>
        </div>

        <ThemeOptions />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>

  <div v-else>
    <ThemeOptions />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Palette, X } from 'lucide-vue-next'
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'

const props = withDefaults(defineProps<{
  variant?: 'popover' | 'inline'
  open?: boolean
}>(), {
  variant: 'popover',
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})
</script>
