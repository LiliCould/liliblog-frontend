<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { initTheme } = useTheme()
const { initCodeTheme } = useCodeTheme()
const userStore = useUserStore()

onMounted(() => {
  initTheme()
  initCodeTheme()
  userStore.init()
})
</script>
