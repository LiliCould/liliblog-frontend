<template>
  <div class="relative" ref="selectRef">
    <button type="button"
      class="w-full flex items-center justify-between px-3 py-1.5 bg-t-bg border border-t-border text-t-body text-sm outline-none transition-colors duration-200 focus:border-t-primary cursor-pointer"
      :class="buttonClass" @click="toggle" @keydown="onKeydown">
      <span :class="{ 'text-t-muted': !selectedLabel }">{{ selectedLabel || placeholder }}</span>
      <ChevronDown class="w-3.5 h-3.5 text-t-muted flex-shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }" />
    </button>
    <Transition :enter-active-class="'transition duration-150 ease-out'"
      :enter-from-class="'opacity-0 ' + (openUp ? 'translate-y-1' : '-translate-y-1')"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100 translate-y-0"
      :leave-to-class="'opacity-0 ' + (openUp ? 'translate-y-1' : '-translate-y-1')">
      <div v-if="isOpen" ref="dropdownRef"
        class="absolute z-50 left-0 right-0 bg-t-surface border border-t-border shadow-lg max-h-60 overflow-y-auto"
        :class="openUp ? 'bottom-full mb-1' : 'top-full mt-1'">
        <div v-for="option in options" :key="option.value"
          class="px-3 py-1.5 text-sm cursor-pointer transition-colors duration-150"
          :class="option.value === modelValue ? 'text-t-primary bg-[rgba(var(--color-primary-rgb),0.1)]' : 'text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.06)]'"
          @click="select(option.value)" @mouseenter="highlightedIndex = options.indexOf(option)">
          {{ option.label }}
        </div>
        <div v-if="options.length === 0" class="px-3 py-2 text-sm text-t-muted text-center">无选项</div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
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

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt?.label || ''
})

function calcDirection() {
  if (!selectRef.value) return
  const rect = selectRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const dropdownHeight = Math.min(props.options.length * 36, 240)
  openUp.value = spaceBelow < dropdownHeight && rect.top > spaceBelow
}

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    highlightedIndex.value = -1
    nextTick(calcDirection)
  }
}

function select(value: string | number) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      isOpen.value = true
      nextTick(calcDirection)
    }
    return
  }
  if (e.key === 'Escape') {
    isOpen.value = false
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
  } else if (e.key === 'Enter' && highlightedIndex.value >= 0) {
    e.preventDefault()
    select(props.options[highlightedIndex.value].value)
  }
}

function onClickOutside(e: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>
