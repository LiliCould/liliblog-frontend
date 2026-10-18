<template>
  <SelectRoot :model-value="modelValue" @update:model-value="onUpdate">
    <SelectTrigger
      class="flex w-full items-center justify-between gap-2 px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary cursor-pointer data-[placeholder]:text-t-muted"
      :class="buttonClass"
    >
      <SelectValue class="truncate text-left" :placeholder="placeholder" />
      <SelectIcon class="shrink-0">
        <ChevronDown class="w-3.5 h-3.5 text-t-muted" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="4"
        class="panel-glass z-[var(--z-popover)] min-w-[var(--reka-select-trigger-width)] max-h-[240px] overflow-hidden outline-none"
      >
        <SelectViewport class="p-1">
          <SelectItem
            v-for="option in options"
            :key="String(option.value)"
            :value="option.value"
            class="relative flex cursor-pointer select-none items-center gap-2 rounded-[6px] px-3 py-2 pr-8 text-sm text-t-body outline-none transition-colors duration-150 data-[highlighted]:bg-[rgba(var(--color-primary-rgb),0.08)] data-[highlighted]:text-t-primary data-[state=checked]:text-t-primary"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator class="absolute right-2 inline-flex items-center">
              <Check class="w-4 h-4" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

export interface SelectOption {
  label: string
  value: string | number
}

withDefaults(defineProps<{
  modelValue: string | number | undefined
  options: SelectOption[]
  placeholder?: string
  buttonClass?: string
}>(), {
  placeholder: '请选择',
  buttonClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function onUpdate(value: unknown): void {
  if (typeof value === 'string' || typeof value === 'number') {
    emit('update:modelValue', value)
  }
}
</script>
