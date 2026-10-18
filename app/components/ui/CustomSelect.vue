<template>
  <div ref="selectRef" class="relative">
    <button
      type="button"
      class="w-full flex items-center justify-between px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary cursor-pointer"
      :class="buttonClass"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span :class="{ 'text-t-muted': !selectedLabel }">{{ selectedLabel || placeholder }}</span>
      <ChevronDown class="w-3.5 h-3.5 text-t-muted flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        :enter-from-class="`opacity-0 ${openUp ? 'translate-y-1' : '-translate-y-1'}`"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        :leave-to-class="`opacity-0 ${openUp ? 'translate-y-1' : '-translate-y-1'}`"
      >
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="fixed z-[1250] bg-t-surface border border-t-border shadow-lg overflow-y-auto"
          :style="dropdownStyle"
        >
          <div
            v-for="option in options"
            :key="option.value"
            class="px-3 py-1.5 text-sm cursor-pointer transition-colors duration-150"
            :class="option.value === modelValue
              ? 'text-t-primary bg-[rgba(var(--color-primary-rgb),0.1)]'
              : 'text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.06)]'"
            @click="select(option.value)"
            @mouseenter="highlightedIndex = options.indexOf(option)"
          >
            {{ option.label }}
          </div>
          <div v-if="options.length === 0" class="px-3 py-2 text-sm text-t-muted text-center">无选项</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

export interface SelectOption {
  label: string
  value: string | number
}

const props = withDefaults(defineProps<{
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

const selectRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const openUp = ref(false)
const highlightedIndex = ref(-1)
const dropdownStyle = ref<CSSProperties>({})

const selectedLabel = computed(() => {
  const option = props.options.find(item => item.value === props.modelValue)
  return option?.label || ''
})

function calcPosition(): void {
  if (!import.meta.client || !selectRef.value) return

  const rect = selectRef.value.getBoundingClientRect()
  const gap = 4
  const viewportPadding = 8
  const maxDropdownHeight = 240
  const estimatedHeight = Math.min(props.options.length * 36 + 8, maxDropdownHeight)
  const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
  const spaceAbove = rect.top - viewportPadding

  openUp.value = spaceBelow < estimatedHeight && spaceAbove > spaceBelow

  const available = Math.max(80, openUp.value ? spaceAbove : spaceBelow)
  const height = Math.max(80, Math.min(estimatedHeight, available))
  const width = Math.min(
    Math.max(80, rect.width),
    Math.max(80, window.innerWidth - viewportPadding * 2),
  )
  const left = Math.min(
    Math.max(viewportPadding, rect.left),
    Math.max(viewportPadding, window.innerWidth - width - viewportPadding),
  )

  let top = openUp.value ? rect.top - height - gap : rect.bottom + gap
  top = Math.max(viewportPadding, Math.min(top, window.innerHeight - height - viewportPadding))

  dropdownStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    maxHeight: `${height}px`,
  }
}

function openDropdown(): void {
  isOpen.value = true
  highlightedIndex.value = -1
  nextTick(calcPosition)
}

function toggle(): void {
  if (isOpen.value) {
    isOpen.value = false
    return
  }
  openDropdown()
}

function select(value: string | number): void {
  emit('update:modelValue', value)
  isOpen.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (!isOpen.value) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      openDropdown()
    }
    return
  }
  if (event.key === 'Escape') {
    isOpen.value = false
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
  } else if (event.key === 'Enter' && highlightedIndex.value >= 0) {
    event.preventDefault()
    select(props.options[highlightedIndex.value].value)
  }
}

function onClickOutside(event: MouseEvent): void {
  const target = event.target as Node
  if (selectRef.value?.contains(target)) return
  if (dropdownRef.value?.contains(target)) return
  isOpen.value = false
}

function onViewportChange(): void {
  if (isOpen.value) calcPosition()
}

watch(isOpen, (open) => {
  if (!import.meta.client) return
  if (open) {
    window.addEventListener('scroll', onViewportChange, { passive: true, capture: true })
    window.addEventListener('resize', onViewportChange)
  } else {
    window.removeEventListener('scroll', onViewportChange, true)
    window.removeEventListener('resize', onViewportChange)
  }
})

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  if (import.meta.client) {
    window.removeEventListener('scroll', onViewportChange, true)
    window.removeEventListener('resize', onViewportChange)
  }
})
</script>
