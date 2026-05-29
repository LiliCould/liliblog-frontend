<template>
  <aside class="hidden lg:flex flex-col gap-6 sticky top-24 self-start">
    <div
      class="bg-[rgba(var(--color-card-rgb),0.85)] border border-t-border rounded-lg p-5 transition-all duration-250 relative overflow-hidden hover:[box-shadow:0_8px_32px_rgba(var(--color-primary-rgb),0.1),0_0_1px_rgba(var(--color-primary-rgb),0.3)] hover:-translate-y-0.5 hover:border-[rgba(var(--color-primary-rgb),0.3)] group"
      style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
      <div
        class="absolute top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-t-primary to-t-secondary transition-[width] duration-400 [box-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.4)] group-hover:w-full">
      </div>
      <div class="flex items-center gap-2.5 mb-3 pb-2 border-b border-t-border">
        <FolderOpen class="w-5 h-5 text-t-primary [filter:drop-shadow(0_0_3px_rgba(var(--color-primary-rgb),0.3))]" />
        <h3 class="text-base font-semibold text-t-title m-0">分类</h3>
      </div>

      <div
        class="flex flex-col gap-0.5">
        <router-link v-for="cat in displayedCategories" :key="cat.id" :to="`/category/${cat.slug}`"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium text-t-body no-underline transition-all duration-250 relative hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:translate-x-1 group/cat">
          <span
            class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-t-primary to-t-secondary rounded-full transition-[height] duration-250 [box-shadow:0_0_6px_rgba(var(--color-primary-rgb),0.4)] group-hover/cat:h-3/5"></span>
          <span>{{ cat.name }}</span>
          <ChevronRight
            class="w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all duration-250 group-hover/cat:opacity-100 group-hover/cat:translate-x-0" />
        </router-link>
        <button v-if="appStore.categories.length > limit && !expanded"
          class="flex items-center justify-center gap-1 px-3.5 py-2 rounded-md text-xs text-t-muted transition-all duration-250 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] cursor-pointer"
          @click="expanded = true">
          <ChevronDown class="w-3.5 h-3.5" />
          展开更多 ({{ appStore.categories.length - limit }})
        </button>
        <button v-if="expanded"
          class="flex items-center justify-center gap-1 px-3.5 py-2 rounded-md text-xs text-t-muted transition-all duration-250 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] cursor-pointer"
          @click="expanded = false">
          <ChevronUp class="w-3.5 h-3.5" />
          收起
        </button>
        <div v-if="appStore.categories.length === 0" class="flex flex-col items-center gap-2 py-8 text-t-muted text-sm">
          <AlertCircle class="w-10 h-10 opacity-40" />
          <span>暂无分类</span>
        </div>
      </div>
    </div>

    <MyInfo />
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { FolderOpen, ChevronRight, ChevronDown, ChevronUp, AlertCircle } from 'lucide-vue-next'
import MyInfo from '@/components/common/MyInfo.vue'

const appStore = useAppStore()
const limit = 5
const expanded = ref(false)
const displayedCategories = computed(() =>
  expanded.value ? appStore.categories : appStore.categories.slice(0, limit)
)
</script>
