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

function handleAuthExpired(): void {
  userStore.clearSession()
}

onMounted(() => {
  initTheme()
  initCodeTheme()
  userStore.init()
  window.addEventListener('liliblog:auth-expired', handleAuthExpired)

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
  window.removeEventListener('liliblog:auth-expired', handleAuthExpired)
})
</script>
