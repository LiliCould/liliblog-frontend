<template>
  <Teleport to="body">
    <!-- FAB 按钮 -->
    <button v-if="tocItems.length > 0"
      class="md:hidden fixed right-4 z-[60] w-11 h-11 rounded-full flex items-center justify-center border border-t-border bg-[rgba(var(--color-card-rgb),0.95)] text-t-primary shadow-lg active:scale-95 transition-transform duration-150"
      :style="{ bottom: `calc(var(--mobile-bottom-nav-height, 56px) + 16px + env(safe-area-inset-bottom, 0px))` }"
      @click="open = !open">
      <List class="w-5 h-5" />
    </button>

    <!-- 遮罩 -->
    <Transition name="fade">
      <div v-if="open" class="md:hidden fixed inset-0 z-[65] bg-black/40" @click="open = false"></div>
    </Transition>

    <!-- 目录面板 -->
    <Transition name="slide-up">
      <div v-if="open && tocItems.length > 0"
        class="md:hidden fixed inset-x-0 z-[70] bg-[rgba(var(--color-card-rgb),0.98)] border-t border-t-border rounded-t-2xl shadow-2xl"
        :style="{ bottom: `calc(var(--mobile-bottom-nav-height, 56px) + env(safe-area-inset-bottom, 0px))`, maxHeight: '60dvh' }">
        <!-- 拖拽指示条 -->
        <div class="flex justify-center pt-3 pb-1">
          <div class="w-10 h-1 rounded-full bg-t-border"></div>
        </div>

        <!-- 标题 -->
        <div class="flex items-center gap-2.5 px-5 pb-2 border-b border-t-border">
          <List class="w-4 h-4 text-t-primary" />
          <h3 class="text-sm font-semibold text-t-title m-0">目录</h3>
          <span class="ml-auto text-xs text-t-muted">{{ tocItems.length }} 项</span>
        </div>

        <!-- 目录列表 -->
        <nav class="overflow-y-auto p-3 space-y-0.5" style="max-height: calc(60dvh - 60px);">
          <a v-for="item in tocItems" :key="item.id" :href="'#' + item.id"
            class="block py-2 px-3 rounded-md text-sm text-t-body no-underline transition-all duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.06)] active:bg-[rgba(var(--color-primary-rgb),0.1)]"
            :class="{
              'pl-5': item.level === 2,
              'pl-8 text-xs': item.level === 3,
            }" @click.prevent="handleClick(item.id)">
            {{ item.text }}
          </a>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { List } from 'lucide-vue-next'

interface TocItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  htmlContent: string
}>()

const open = ref(false)

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

function handleClick(id: string) {
  open.value = false
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
