<script setup lang="ts">
/**
 * 关于页面
 * 展示博客介绍、技术栈、联系方式等信息
 */
</script>

<template>
  <div class="space-y-8">
    <!-- 标题 -->
    <div class="border-b-2 border-black pb-4 dark:border-[var(--neutral-800)]">
      <h1 class="text-3xl font-black tracking-tight">
        关于 LiliBlog
      </h1>
    </div>

    <!-- 博客介绍 -->
    <section>
      <h2 class="text-xl font-bold">博客介绍</h2>
      <p class="mt-3 leading-relaxed text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
        LiliBlog 是一个基于 Vue 3 + Vite 构建的个人博客系统，采用 Neo-Brutalism（新粗野主义）设计风格。
        博客致力于分享技术文章、生活随笔和学习心得，打造一个纯粹的内容创作与阅读空间。
      </p>
    </section>

    <!-- 技术栈 -->
    <section>
      <h2 class="text-xl font-bold">技术栈</h2>
      <div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
        <div
          v-for="tech in [
            { name: 'Vue 3', desc: '前端框架' },
            { name: 'Vite', desc: '构建工具' },
            { name: 'TypeScript', desc: '类型系统' },
            { name: 'Tailwind CSS', desc: 'CSS 框架' },
            { name: 'Pinia', desc: '状态管理' },
            { name: 'Vue Router', desc: '路由管理' },
          ]"
          :key="tech.name"
          class="border-2 border-black p-3 dark:border-[var(--neutral-800)]"
        >
          <div class="font-bold">{{ tech.name }}</div>
          <div class="mt-1 font-mono text-xs text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
            {{ tech.desc }}
          </div>
        </div>
      </div>
    </section>

    <!-- 联系方式 -->
    <section>
      <h2 class="text-xl font-bold">联系方式</h2>
      <div class="mt-3 space-y-2 font-mono text-sm">
        <p>
          <span class="font-bold">邮箱：</span>
          <a href="mailto:example@qq.com">example@qq.com</a>
        </p>
        <p>
          <span class="font-bold">GitHub：</span>
          <a href="https://github.com" target="_blank" rel="noopener">github.com</a>
        </p>
        <p>
          <span class="font-bold">Gitee：</span>
          <a href="https://gitee.com" target="_blank" rel="noopener">gitee.com</a>
        </p>
      </div>
    </section>
  </div>
</template>
