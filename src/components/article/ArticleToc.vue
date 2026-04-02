<template>
  <div v-if="tocItems.length > 0" class="article-toc">
    <h4 class="toc-title">目录</h4>
    <nav class="toc-nav">
      <a
        v-for="item in tocItems"
        :key="item.id"
        :href="'#' + item.id"
        :class="['toc-link', `toc-level-${item.level}`]"
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
  const parser = new DOMParser()
  const doc = parser.parseFromString(props.htmlContent, 'text/html')
  const headings = doc.querySelectorAll('h1, h2, h3, h4')
  const items: TocItem[] = []

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1))
    const text = heading.textContent?.trim() || ''
    const id = heading.id || `heading-${index}`
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

<style scoped>
.article-toc {
  position: sticky;
  top: calc(var(--header-height) + 20px);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 16px;
  max-height: calc(100vh - var(--header-height) - 40px);
  overflow-y: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.toc-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-title);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
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
}

.toc-link:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.toc-level-2 { padding-left: 16px; }
.toc-level-3 { padding-left: 28px; font-size: 12px; }
.toc-level-4 { padding-left: 40px; font-size: 12px; }
</style>
