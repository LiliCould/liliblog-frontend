<template>
  <aside class="hidden lg:flex flex-col gap-6 sticky top-24 self-start">
    <div class="panel-glass p-5">
      <div class="widget-title mb-3 pb-2 border-b border-[var(--glass-border)]">
        <FolderOpen class="w-5 h-5 text-t-primary" />
        <h3 class="text-base font-semibold text-t-title m-0">分类</h3>
      </div>

      <div class="flex flex-col gap-0.5">
        <NuxtLink
          v-for="cat in displayedCategories"
          :key="cat.id"
          :to="`/category/${encodeURIComponent(cat.slug)}`"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium text-t-body no-underline transition-all duration-200 relative hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:translate-x-1 group/cat"
        >
          <span class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-t-primary to-t-secondary rounded-full transition-[height] duration-200 [box-shadow:0_0_6px_rgba(var(--color-primary-rgb),0.4)] group-hover/cat:h-3/5" />
          <span>{{ cat.name }}</span>
          <ChevronRight class="w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover/cat:opacity-100 group-hover/cat:translate-x-0" />
        </NuxtLink>
        <button
          v-if="categoryList.length > limit && !expanded"
          class="flex items-center justify-center gap-1 px-3.5 py-2 rounded-md text-xs text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] cursor-pointer"
          @click="expanded = true"
        >
          <ChevronDown class="w-3.5 h-3.5" />
          展开更多 ({{ categoryList.length - limit }})
        </button>
        <button
          v-if="expanded"
          class="flex items-center justify-center gap-1 px-3.5 py-2 rounded-md text-xs text-t-muted transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] cursor-pointer"
          @click="expanded = false"
        >
          <ChevronUp class="w-3.5 h-3.5" />
          收起
        </button>
        <div v-if="categoryList.length === 0" class="flex flex-col items-center gap-2 py-8 text-t-muted text-sm">
          <AlertCircle class="w-10 h-10 opacity-40" />
          <span>暂无分类</span>
        </div>
      </div>
    </div>

    <MyInfo />
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { AlertCircle, ChevronDown, ChevronRight, ChevronUp, FolderOpen } from 'lucide-vue-next'

const { data: categories } = await useCategories()
const limit = 5
const expanded = ref(false)
const categoryList = computed(() => categories.value || [])
const displayedCategories = computed(() =>
  expanded.value ? categoryList.value : categoryList.value.slice(0, limit),
)
</script>
