<template>
  <div>
  <UserProfileContent
    v-if="userId"
    v-model:active-tab="activeTab"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :user="user"
    :articles="articles"
    :total="total"
    :pending="pending"
    :self="true"
    @refresh="refresh"
  />
  <AppLayout v-else :show-hero="false">
    <div class="flex flex-col gap-3">
      <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-t-surface animate-pulse" />
    </div>
  </AppLayout>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: '我的主页 | 立里博客',
  robots: 'noindex',
})

const userStore = useUserStore()
const userId = computed(() => userStore.userId)

const {
  user,
  articles,
  total,
  pending,
  refresh,
  currentPage,
  pageSize,
  activeTab,
} = useUserProfileData(userId, true)
</script>
