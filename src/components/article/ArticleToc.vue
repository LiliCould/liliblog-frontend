<template>
  <div v-if="tocItems.length > 0" class="article-toc">
    <h4 class="toc-title">目录</h4>
    <nav class="toc-nav">
      <a v-for="item in tocItems" :key="item.id" :href="'#' + item.id" :class="['toc-link', `toc-level-${item.level}`]"
        @click.prevent="scrollToHeading(item.id)">
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
  markdownContent: string
}>()

const tocItems = computed<TocItem[]>(() => {
  if (!props.markdownContent) return []
  const items: TocItem[] = []
  const lines = props.markdownContent.split('\n')
  let inCodeBlock = false

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }

    if (inCodeBlock) return

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const id = text || `heading-${index}`
      if (text) {
        items.push({ id, text, level })
      }
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

<style scoped>
.article-toc {
  background: var(--color-card);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.toc-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-title);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0, 240, 255, 0.2);
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-link {
  display: block;
  padding: 4px 8px;
  font-size: 13px;
  color: var(--color-body);
  text-decoration: none;
  border-radius: var(--radius-sm);
  line-height: 1.5;
  transition: all 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-left: 2px solid transparent;
}

.toc-link:hover {
  background: rgba(0, 240, 255, 0.06);
  color: var(--color-primary);
  border-left-color: rgba(0, 240, 255, 0.3);
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
}

.toc-level-2 {
  padding-left: 16px;
}

.toc-level-3 {
  padding-left: 28px;
  font-size: 12px;
}

.toc-level-4 {
  padding-left: 40px;
  font-size: 12px;
}
</style>
