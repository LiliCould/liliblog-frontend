<template>
  <NuxtLoadingIndicator color="var(--color-primary)" :height="3" />
  <NuxtRouteAnnouncer />

  <ClientOnly>
    <ParticleField v-if="showGlobalParticles" variant="global" interactive />
  </ClientOnly>

  <NuxtLayout>
    <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
  </NuxtLayout>

  <ClientOnly>
    <AuthModal />
    <UploadProgressOverlay />
    <Toaster
      position="top-center"
      :duration="2200"
      :close-button="false"
      :rich-colors="true"
      class="liliblog-toaster"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const route = useRoute()
const { initTheme, currentTheme } = useTheme()
const { initCodeTheme, syncCodeThemeWithUi } = useCodeTheme()

const showGlobalParticles = computed(() => {
  const hiddenPrefixes = ['/admin', '/write', '/profile', '/user/me']
  return !hiddenPrefixes.some(prefix =>
    route.path === prefix || route.path.startsWith(`${prefix}/`),
  )
})
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

  if (import.meta.dev) {
    const params = new URLSearchParams(window.location.search)
    const authMode = params.get('auth')
    if (authMode === 'login' || authMode === 'register') {
      useAuthModal().open(authMode)
    }
    if (params.get('toast') === '1') {
      const toast = useToast()
      setTimeout(() => toast.error('测试错误提示：登录失败，请重试'), 600)
    }
  }

  window.addEventListener('liliblog:auth-expired', handleAuthExpired)

  if (userStore.isLoggedIn) {
    startAutoCheck()
    checkAndRefresh()
  }
})

watch(currentTheme, () => {
  if (import.meta.client) syncCodeThemeWithUi()
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
