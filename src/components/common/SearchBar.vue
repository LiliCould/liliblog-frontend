<template>
  <div class="w-full max-w-[560px] flex items-center gap-2">
    <div class="flex-1 relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280] transition-colors duration-300" :class="{ 'text-[#00f0ff]': isFocused }" />
      <input
        v-model="keyword"
        type="text"
        :placeholder="placeholder"
        class="w-full h-11 pl-11 pr-4 rounded-full bg-[#111118] border border-[rgba(0,240,255,0.15)] text-white placeholder-[#6b7280] text-sm outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_12px_rgba(0,240,255,0.15)]"
        @keyup.enter="handleSearch"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <button
      class="h-11 px-5 rounded-full bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] text-[#00f0ff] text-sm font-semibold transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] active:scale-95"
      @click="handleSearch"
    >
      搜索
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'

withDefaults(defineProps<{
  placeholder?: string
}>(), {
  placeholder: '搜索文章...',
})

const emit = defineEmits<{
  (e: 'search', keyword: string): void
}>()

const keyword = ref('')
const isFocused = ref(false)

function handleSearch() {
  const kw = keyword.value.trim()
  if (kw) {
    emit('search', kw)
  }
}

defineExpose({ keyword })
</script>
