<template>
  <UserProfileContent :user-id="userId" :self="false" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '~/types'
import { absoluteUrl } from '~/utils/seo'

const route = useRoute()
const api = useApi()
const userId = computed(() => Number(route.params.id))

const { data: user } = await useAsyncData(
  () => `user-seo-page:${userId.value}`,
  () => api.get<User>(`/api/user/${userId.value}`).catch(() => null),
  { watch: [userId], default: () => null },
)

if (!user.value) {
  throw createError({ statusCode: 404, statusMessage: '用户不存在', fatal: true })
}

useSeoMeta({
  title: () => `${user.value?.nickname || '用户'} | 立里博客`,
  description: () => `查看 ${user.value?.nickname || '该用户'} 在立里博客发布的文章。`,
  ogTitle: () => `${user.value?.nickname || '用户'} | 立里博客`,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: absoluteUrl(`/user/${userId.value}`) }],
}))
</script>
