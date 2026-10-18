<template>
  <div
    v-if="tocItems.length > 0"
    class="bg-[rgba(var(--color-card-rgb),0.85)] border border-t-border rounded-lg p-5 transition-all duration-200 relative overflow-hidden hover:[box-shadow:0_8px_32px_rgba(var(--color-primary-rgb),0.1),0_0_1px_rgba(var(--color-primary-rgb),0.3)] hover:-translate-y-0.5 hover:border-[rgba(var(--color-primary-rgb),0.3)] group"
    style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
  >
    <div class="absolute top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-t-primary to-t-secondary transition-[width] duration-300 [box-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.4)] group-hover:w-full" />
    <div class="flex items-center gap-2.5 mb-3 pb-2 border-b border-t-border">
      <List class="w-5 h-5 text-t-primary [filter:drop-shadow(0_0_3px_rgba(var(--color-primary-rgb),0.3))]" />
      <h3 class="text-base font-semibold text-t-title m-0">目录</h3>
    </div>

    <nav class="flex flex-col gap-0.5 max-h-[26rem] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(var(--color-primary-rgb),0.15)] [&::-webkit-scrollbar-thumb]:rounded-full">
      <a
        v-for="item in tocItems"
        :key="item.id"
        :href="`#${item.id}`"
        class="block py-2 px-3 rounded-md text-sm text-t-body no-underline transition-all duration-200 relative hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:translate-x-1 group/toc"
        :class="{ 'pl-4': item.level === 2, 'pl-7 text-xs': item.level === 3 }"
        @click.prevent="scrollToHeading(item.id)"
      >
        <span class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-t-primary to-t-secondary rounded-full transition-[height] duration-200 [box-shadow:0_0_6px_rgba(var(--color-primary-rgb),0.4)] group-hover/toc:h-3/5" />
        <span class="line-clamp-1">{{ item.text }}</span>
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { List } from 'lucide-vue-next'
import { extractTocItems } from '~/utils/toc'

const props = defineProps<{
  htmlContent: string
}>()

const tocItems = computed(() => extractTocItems(props.htmlContent))

function scrollToHeading(id: string): void {
  if (!import.meta.client) return
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}
</script>
