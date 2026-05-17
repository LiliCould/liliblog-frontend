<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import AppSidebar from './AppSidebar.vue'
import RightSidebar from './RightSidebar.vue'

/**
 * 主布局组件（三栏布局）
 * 左侧边栏 + 中间主内容区 + 右侧边栏
 * 响应式：md 以下隐藏右侧，sm 以下左侧变抽屉
 */
const route = useRoute()

// 判断是否需要显示 Hero 区域（仅首页）
const showHero = computed(() => route.path === '/')
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- 顶部导航栏 -->
    <AppHeader />

    <!-- Hero 区域（仅首页显示） -->
    <slot v-if="showHero" name="hero">
      <div
        class="relative flex h-64 items-center justify-center border-b-2 border-black bg-[var(--neutral-900)] dark:border-[var(--neutral-800)]"
      >
        <div class="text-center">
          <h1 class="text-4xl font-black tracking-tight text-[var(--accent-toxic)] md:text-5xl">
            LiliCould's Blog
          </h1>
          <p class="mt-2 font-mono text-sm text-[var(--text-secondary)]">
            &lt;技术与生活的分享空间_/&gt;
          </p>
        </div>
      </div>
    </slot>

    <!-- 主内容区 -->
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
      <div class="flex gap-6">
        <!-- 左侧边栏 -->
        <div class="hidden w-60 shrink-0 lg:block xl:w-72">
          <div class="sticky top-20">
            <AppSidebar />
          </div>
        </div>

        <!-- 中间主内容区 -->
        <div class="min-w-0 flex-1">
          <slot />
        </div>

        <!-- 右侧边栏 -->
        <div class="hidden w-60 shrink-0 md:block xl:w-72">
          <div class="sticky top-20">
            <RightSidebar />
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>
