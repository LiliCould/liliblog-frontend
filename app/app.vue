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

useSeoMeta({
  ogSiteName: '立里博客 LiliBlog',
  ogLocale: 'zh_CN',
  ogImage: DEFAULT_OG_IMAGE,
  twitterCard: 'summary_large_image',
  twitterImage: DEFAULT_OG_IMAGE,
})

useHead({
  script: [
    {
      key: 'website-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '立里博客',
        alternateName: ['LiliBlog', '立里可的博客', '立里'],
        url: 'https://lilicould.cn',
        description: '立里博客（LiliBlog）是立里可（LiliCould）的个人博客，分享技术、生活和思考。',
        inLanguage: 'zh-CN',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://lilicould.cn/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }),
    },
    {
      key: 'person-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: '立里可',
        alternateName: 'LiliCould',
        url: 'https://lilicould.cn',
        sameAs: ['https://github.com/LiliCould'],
        jobTitle: '全栈开发工程师',
      }),
    },
  ],
})

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
