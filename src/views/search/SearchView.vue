<template>
    <AppLayout :show-hero="false">
        <div class="max-w-[900px] mx-auto">
            <div class="mb-6">
                <h1 class="text-xl font-bold text-t-title mb-2">
                    搜索结果
                </h1>
                <p v-if="keyword" class="text-sm text-t-muted">
                    关键词：<span class="text-t-primary font-medium">"{{ keyword }}"</span>
                    <span v-if="total > 0" class="ml-2">共 {{ total }} 篇文章</span>
                </p>
            </div>

            <div v-if="loading" class="flex flex-col gap-4">
                <div v-for="i in 3" :key="i" class="h-28 rounded-xl bg-t-surface animate-pulse"></div>
            </div>

            <div v-else-if="articles.length > 0" class="flex flex-col gap-6">
                <ArticleCard v-for="article in articles" :key="article.id" :article="article" />

                <Pagination v-if="total > 0" :current="current" :total="total" :page-size="pageSize"
                    @update:current="onPageChange" @update:page-size="onPageSizeChange" />
            </div>

            <div v-else-if="keyword && !loading" class="text-center py-16">
                <Search class="w-16 h-16 text-t-muted mx-auto mb-4 opacity-30" />
                <p class="text-t-muted text-lg mb-2">未找到相关文章</p>
                <p class="text-t-muted text-sm">试试其他关键词吧</p>
            </div>

            <div v-else-if="!keyword" class="text-center py-16">
                <Search class="w-16 h-16 text-t-muted mx-auto mb-4 opacity-30" />
                <p class="text-t-muted text-lg mb-2">输入关键词开始搜索</p>
                <p class="text-t-muted text-sm max-md:hidden">在顶部搜索框输入关键词后按回车</p>
                <div class="md:hidden mt-4 max-w-sm mx-auto flex gap-2 px-4">
                    <input v-model="keyword" type="text" placeholder="搜索文章..."
                        class="flex-1 h-10 px-4 rounded-lg bg-[rgba(var(--color-surface-rgb),0.6)] border border-[rgba(var(--color-primary-rgb),0.12)] text-t-body placeholder-[#6b7280] text-sm outline-none focus:border-[rgba(var(--color-primary-rgb),0.4)]"
                        @keyup.enter="doSearch(1)" />
                    <button
                        class="h-10 px-4 rounded-lg text-sm font-medium text-white bg-t-primary transition-all duration-200 hover:-translate-y-px cursor-pointer"
                        @click="doSearch(1)">
                        搜索
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { searchArticles } from '@/api/article'
import AppLayout from '@/components/layout/AppLayout.vue'
import ArticleCard from '@/components/common/ArticleCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import type { Article } from '@/types/article'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'

const route = useRoute()

const keyword = ref('')
const articles = ref<Article[]>([])
const loading = ref(false)
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)

async function doSearch(page = 1) {
    if (!keyword.value.trim()) {
        articles.value = []
        total.value = 0
        return
    }

    loading.value = true
    try {
        const res = await searchArticles({
            keyword: keyword.value.trim(),
            current: page,
            size: pageSize.value,
        }) as unknown as ApiResponse<PageResult<Article>>
        articles.value = res.data?.records || []
        total.value = res.data?.total || 0
        current.value = res.data?.current || page
    } catch {
        articles.value = []
        total.value = 0
    } finally {
        loading.value = false
    }
}

function onPageChange(page: number) {
    doSearch(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onPageSizeChange(size: number) {
    pageSize.value = size
    current.value = 1
    doSearch(1)
}

function syncFromRoute() {
    const q = route.query.q as string
    if (q && q !== keyword.value) {
        keyword.value = q
        current.value = 1
        doSearch(1)
    }
}

watch(() => route.query.q, () => {
    syncFromRoute()
})

onMounted(() => {
    syncFromRoute()
})
</script>
