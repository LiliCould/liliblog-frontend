<template>
  <div v-if="tocItems.length > 0" class="panel-glass p-5">
    <div class="widget-title mb-3 pb-2 border-b border-[var(--glass-border)]">
      <List class="w-5 h-5 text-t-primary" />
      <h3 class="text-base font-semibold text-t-title m-0">目录</h3>
    </div>

    <nav class="flex flex-col gap-0.5 max-h-[26rem] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(var(--color-primary-rgb),0.15)] [&::-webkit-scrollbar-thumb]:rounded-full">
      <a
        v-for="item in tocItems"
        :key="item.id"
        :href="`#${item.id}`"
        class="block py-2 px-3 rounded-md text-sm text-t-body no-underline transition-all duration-200 relative hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] hover:translate-x-1 group/toc"
        :class="{
          'pl-4': item.level === 2,
          'pl-7 text-xs': item.level === 3,
          '!text-t-primary bg-[rgba(var(--color-primary-rgb),0.06)] font-medium': activeId === item.id,
        }"
        :aria-current="activeId === item.id ? 'true' : undefined"
        @click.prevent="scrollToHeading(item.id)"
      >
        <span
          class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-t-primary transition-[height] duration-200 [box-shadow:0_0_6px_rgba(var(--color-primary-rgb),0.4)]"
          :class="activeId === item.id ? 'h-4/5' : 'h-0 group-hover/toc:h-3/5'"
        />
        <span class="line-clamp-1">{{ item.text }}</span>
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { List } from 'lucide-vue-next'
import { extractTocItems } from '~/utils/toc'

const props = defineProps<{
  htmlContent: string
}>()

const tocItems = computed(() => extractTocItems(props.htmlContent))
const { y } = useWindowScroll()
const activeId = ref('')

watchEffect(() => {
  if (!import.meta.client) return
  // 依赖滚动位置与目录项，滚动时更新当前标题
  void y.value
  let current = ''
  for (const item of tocItems.value) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= 120) current = item.id
  }
  activeId.value = current
})

function scrollToHeading(id: string): void {
  if (!import.meta.client) return
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}
</script>
