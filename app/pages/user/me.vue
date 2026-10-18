<template>
  <div v-if="userId">
    <UserProfileContent :user-id="userId" :self="true" />
  </div>
  <AppLayout v-else :show-hero="false">
    <div class="flex flex-col gap-3">
      <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-t-surface animate-pulse" />
    </div>
  </AppLayout>
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
</script>
