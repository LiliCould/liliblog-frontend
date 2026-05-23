<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="mb-6">
      <component :is="iconComponent"
        class="w-14 h-14 text-t-primary opacity-50" />
    </div>

    <h3 class="text-base font-semibold text-t-title mb-1.5">{{ message }}</h3>
    <p v-if="description" class="text-sm text-t-muted max-w-[300px]">{{ description }}</p>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Inbox, FileX, Users, Search } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  message?: string
  description?: string
  type?: 'empty' | 'notfound' | 'nouser' | 'search'
}>(), {
  message: '暂无数据',
  type: 'empty',
})

const iconMap: Record<string, any> = {
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
