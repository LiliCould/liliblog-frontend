<template>
  <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[rgba(var(--color-primary-rgb),0.08)]">
      <component :is="iconComponent" class="h-7 w-7 text-t-primary opacity-70" />
    </div>

    <h3 class="text-base font-semibold text-t-title mb-1.5">{{ message }}</h3>
    <p v-if="description" class="max-w-[300px] text-sm leading-relaxed text-t-muted">{{ description }}</p>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileX, Inbox, Search, Users } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  message?: string
  description?: string
  type?: 'empty' | 'notfound' | 'nouser' | 'search'
}>(), {
  message: '暂无数据',
  type: 'empty',
})

const iconMap = {
  empty: Inbox,
  notfound: FileX,
  nouser: Users,
  search: Search,
}

const iconComponent = computed(() => iconMap[props.type] || Inbox)

const defaultDescriptions: Record<string, string> = {
  empty: '这里还没有内容哦',
  notfound: '你访问的资源可能已被移除或暂时不可用',
  nouser: '该用户不存在或已被注销',
  search: '没有找到匹配的结果',
}

const description = computed(() => props.description || defaultDescriptions[props.type] || '')
</script>
