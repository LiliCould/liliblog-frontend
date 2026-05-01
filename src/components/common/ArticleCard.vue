<template>
  <article class="article-card clickable" @click="goDetail" ref="cardRef">
    <div class="card-inner">
      <div class="card-content">
        <div class="card-badges">
          <span v-if="article.isTop" class="badge badge-top">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            </svg>
            置顶
          </span>
          <span v-if="article.isRecommend" class="badge badge-recommend">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            推荐
          </span>
        </div>

        <h2 class="card-title">{{ article.title }}</h2>

        <p v-if="article.summary" class="card-summary">{{ article.summary }}</p>

        <div class="card-meta">
          <div class="meta-item author-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>{{ article.authorNickname }}</span>
          </div>

          <div v-if="article.categoryName" class="meta-item category-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{{ article.categoryName }}</span>
          </div>

          <div class="meta-item time-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <time :datetime="article.publishTime || article.createTime">{{ formatRelativeTime(article.publishTime ||
              article.createTime) }}</time>
          </div>

          <div class="meta-item views-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>{{ formatNumber(article.viewCount) }}</span>
          </div>
        </div>

        <div v-if="displayTags.length > 0" class="card-tags">
          <TagBadge v-for="tag in displayTags" :key="tag.id" :tag="tag" />
          <span v-if="hiddenTagsCount > 0" class="more-tags-badge">+{{ hiddenTagsCount }}</span>
        </div>
      </div>

      <div v-if="article.coverImage" class="card-cover">
        <div class="cover-wrapper">
          <img :src="article.coverImage" :alt="article.title" loading="lazy" />
          <div class="cover-overlay"></div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { default as anime } from 'animejs'
import type { Article } from '@/types/article.d'
import { formatRelativeTime, formatNumber } from '@/utils/format'
import TagBadge from './TagBadge.vue'

const props = defineProps<{
  article: Article
}>()

const router = useRouter()
const cardRef = ref<HTMLElement | null>(null)
const MAX_TAGS = 10

const displayTags = computed(() => {
  if (!props.article.tags) return []
  return props.article.tags.slice(0, MAX_TAGS)
})

const hiddenTagsCount = computed(() => {
  if (!props.article.tags) return 0
  return Math.max(0, props.article.tags.length - MAX_TAGS)
})

function goDetail() {
  if (props.article.slug) {
    router.push(`/article/s/${props.article.slug}`)
  } else {
    router.push(`/article/${props.article.id}`)
  }
}

onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target === cardRef.value) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [40, 0],
          scale: [0.95, 1],
          duration: 1000,
          easing: 'easeOutElastic(1, .8)'
        })

        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  if (cardRef.value) {
    observer.observe(cardRef.value)
  }
})
</script>

<style scoped>
.article-card {
  position: relative;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  overflow: hidden;
  opacity: 0;
}

.article-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(196, 93, 53, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1;
  border-radius: 16px;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary);
}

.article-card:hover::before {
  opacity: 1;
}

.card-inner {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  position: relative;
  z-index: 2;
}

.card-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.card-badges {
  display: flex;
  gap: 8px;
  margin-bottom: var(--spacing-sm);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.badge svg {
  width: 12px;
  height: 12px;
}

.badge-top {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary-light-2));
  color: var(--color-primary);
}

.badge-recommend {
  background: linear-gradient(135deg, #FEF7ED, #FDECD0);
  color: var(--color-accent);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-title);
  line-height: var(--line-height-snug);
  margin-bottom: var(--spacing-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover .card-title {
  color: var(--color-primary);
}

.card-summary {
  font-size: var(--font-size-sm);
  color: var(--color-body-light);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: var(--color-muted);
  transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.meta-item svg {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.article-card:hover .meta-item {
  color: var(--color-body-light);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.more-tags-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 26px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-muted);
  background: var(--color-bg-warm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.more-tags-badge:hover {
  color: var(--color-primary);
  border-color: var(--color-border-hover);
  background: var(--color-primary-light);
}

.card-cover {
  flex-shrink: 0;
  width: 200px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
}

.cover-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(196, 93, 53, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover .cover-wrapper img {
  transform: scale(1.05);
}

.article-card:hover .cover-overlay {
  opacity: 1;
}

@media (max-width: 768px) {
  .card-inner {
    flex-direction: column-reverse;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
  }

  .card-cover {
    width: 100%;
    height: 180px;
  }

  .card-meta {
    gap: var(--spacing-sm);
  }

  .meta-item {
    font-size: 10px;
  }
}
</style>
