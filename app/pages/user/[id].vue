<template>
  <UserProfileContent
    v-model:active-tab="activeTab"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :user="user"
    :articles="articles"
    :total="total"
    :pending="pending"
    :self="false"
    @refresh="refresh"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { absoluteUrl } from '~/utils/seo'

const route = useRoute()
const userId = computed(() => Number(route.params.id))

const {
  user,
  articles,
  total,
  pending,
  refresh,
  currentPage,
  pageSize,
  activeTab,
} = useUserProfileData(userId, false)

useSeoMeta({
  title: () => `${user.value?.nickname || '用户'} | 立里博客`,
  description: () => `查看 ${user.value?.nickname || '该用户'} 在立里博客发布的文章。`,
  ogTitle: () => `${user.value?.nickname || '用户'} | 立里博客`,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: absoluteUrl(`/user/${userId.value}`) }],
}))
</script>
