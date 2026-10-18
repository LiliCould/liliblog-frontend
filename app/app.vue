<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
  </NuxtLayout>

  <ClientOnly>
    <AuthModal />
    <UploadProgressOverlay />
  </ClientOnly>
</template>

<script setup lang="ts">
const { initTheme } = useTheme()
const { initCodeTheme } = useCodeTheme()
const { startAutoCheck, stopAutoCheck, checkAndRefresh } = useTokenRefresh()
const userStore = useUserStore()

onMounted(() => {
  initTheme()
  initCodeTheme()
  userStore.init()

  if (userStore.isLoggedIn) {
    startAutoCheck()
    checkAndRefresh()
  }
})

watch(() => userStore.isLoggedIn, (loggedIn) => {
  if (!import.meta.client) return
  if (loggedIn) {
    startAutoCheck()
    checkAndRefresh()
  } else {
    stopAutoCheck()
  }
})

onUnmounted(() => {
  stopAutoCheck()
})
</script>
