<template>
  <div v-if="tocItems.length > 0" class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
    <h4 class="text-sm font-semibold text-white mb-3 pb-2 border-b-2 border-[#00f0ff] inline-block shadow-[0_2px_8px_rgba(0,240,255,0.2)]">目录</h4>
    <nav class="flex flex-col gap-0.5">
      <a
        v-for="item in tocItems"
        :key="item.id"
        :href="'#' + item.id"
        class="block py-1 text-[13px] text-[#6b7280] rounded no-underline leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap border-l-2 border-transparent transition-all duration-200 hover:bg-[rgba(0,240,255,0.06)] hover:text-[#00f0ff] hover:border-l-[rgba(0,240,255,0.3)] hover:[text-shadow:0_0_8px_rgba(0,240,255,0.3)]"
        :class="{
          'pl-4': item.level === 2,
          'pl-7 text-xs': item.level === 3,
        }"
        @click.prevent="scrollToHeading(item.id)"
      >
        {{ item.text }}
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TocItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  htmlContent: string
}>()

const tocItems = computed<TocItem[]>(() => {
  if (!props.htmlContent) return []
  const items: TocItem[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(props.htmlContent, 'text/html')
  const headings = doc.querySelectorAll('h2, h3')

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))
    const text = heading.textContent?.trim() || ''
    const id = heading.id || text.toLowerCase().replace(/\s+/g, '-')
    if (text) {
      items.push({ id, text, level })
    }
  })

  return items
})

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
