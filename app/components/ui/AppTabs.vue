<template>
  <TabsRoot :model-value="modelValue" @update:model-value="onUpdate">
    <TabsList
      class="flex"
      :class="[variant === 'underline' ? 'border-b border-t-border' : 'gap-2', listClass]"
    >
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="outline-none cursor-pointer transition-all duration-200"
        :class="[variant === 'underline' ? underlineClass : pillClass, triggerClass]"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
    <slot />
  </TabsRoot>
</template>

<script setup lang="ts">
import { TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

export interface TabItem {
  label: string
  value: string
}

withDefaults(defineProps<{
  modelValue: string
  tabs: TabItem[]
  variant?: 'underline' | 'pill'
  listClass?: string
  triggerClass?: string
}>(), {
  variant: 'underline',
  listClass: '',
  triggerClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const underlineClass = [
  'flex-1 py-2.5 text-sm font-medium border-b-2 border-transparent text-t-muted',
  'hover:text-t-body',
  'data-[state=active]:text-t-primary data-[state=active]:border-t-primary',
  'focus-visible:bg-[rgba(var(--color-primary-rgb),0.06)]',
].join(' ')

const pillClass = [
  'shrink-0 px-3.5 py-1.5 rounded-control text-xs font-medium border border-t-border text-t-muted',
  'hover:text-t-body hover:border-[rgba(var(--color-primary-rgb),0.3)]',
  'data-[state=active]:text-t-primary data-[state=active]:border-t-primary data-[state=active]:bg-[rgba(var(--color-primary-rgb),0.12)]',
  'focus-visible:bg-[rgba(var(--color-primary-rgb),0.08)]',
].join(' ')

function onUpdate(value: unknown): void {
  if (typeof value === 'string') {
    emit('update:modelValue', value)
  }
}
</script>
