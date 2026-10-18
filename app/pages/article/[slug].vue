<template>
  <ArticleDetailView v-if="article" :article="article" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleDetail } from '~/types'
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, truncateText } from '~/utils/seo'

const route = useRoute()
const api = useApi()

const slug = computed(() => decodeURIComponent(String(route.params.slug || '')))

const { data: article } = await useAsyncData(
  () => `article:slug:${slug.value}`,
  () => api.get<ArticleDetail>(`/api/article/slug/${encodeURIComponent(slug.value)}`).catch(() => null),
  {
    watch: [slug],
    default: () => null,
  },
)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '文章不存在',
    fatal: true,
  })
}

useSeoMeta({
  title: () => article.value ? `${article.value.title} | ${SITE_NAME}` : `文章不存在 | ${SITE_NAME}`,
  description: () => article.value
    ? (article.value.summary || truncateText(article.value.contentHtml))
    : '',
  ogTitle: () => article.value?.title || '文章不存在',
  ogDescription: () => article.value?.summary || '',
  ogType: 'article',
  ogImage: () => article.value?.coverImage ? absoluteUrl(article.value.coverImage) : DEFAULT_OG_IMAGE,
  ogImageAlt: () => article.value?.title || '立里博客 LiliBlog',
  twitterImage: () => article.value?.coverImage ? absoluteUrl(article.value.coverImage) : DEFAULT_OG_IMAGE,
  articlePublishedTime: () => article.value?.createTime,
  articleModifiedTime: () => article.value?.updateTime,
  twitterCard: 'summary_large_image',
})

useHead(() => {
  const current = article.value
  if (!current) return {}

  return {
    link: [
      {
        rel: 'canonical',
        href: absoluteUrl(`/article/${encodeURIComponent(current.slug)}`),
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: current.title,
          description: current.summary || truncateText(current.contentHtml),
          image: current.coverImage ? absoluteUrl(current.coverImage) : undefined,
          datePublished: current.createTime,
          dateModified: current.updateTime || current.createTime,
          author: current.creator
            ? {
                '@type': 'Person',
                name: current.creator.nickname,
                url: absoluteUrl(`/user/${current.creator.id}`),
              }
            : undefined,
          publisher: {
            '@type': 'Organization',
            name: '立里博客',
            url: absoluteUrl('/'),
          },
          mainEntityOfPage: absoluteUrl(`/article/${encodeURIComponent(current.slug)}`),
        }),
      },
    ],
  }
})
</script>
