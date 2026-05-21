<template>
  <footer class="mt-auto bg-t-bg relative border-t border-t-border">
    <div
      class="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-t-primary to-transparent opacity-60">
    </div>

    <div class="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10 pt-12 pb-6">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 pb-8 border-b border-t-border relative">
        <div class="sm:col-span-2 lg:col-span-1 max-w-xs">
          <div class="flex items-center gap-2.5 mb-3">
            <Star class="w-6 h-6 text-t-primary [filter:drop-shadow(0_0_4px_rgba(var(--color-primary-rgb),0.4))]" />
            <span
              class="text-[22px] font-bold bg-gradient-to-br from-t-primary to-t-secondary bg-clip-text [-webkit-text-fill-color:transparent]">LiliBlog</span>
          </div>
          <p class="text-sm text-t-body leading-relaxed">记录生活，分享技术，探索无限可能</p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-t-title uppercase tracking-wider mb-3">快速链接</h4>
          <nav class="flex flex-col gap-2">
            <router-link to="/"
              class="text-sm text-t-body no-underline w-fit relative transition-colors duration-200 hover:text-t-primary [text-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.3)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gradient-to-r after:from-t-primary after:to-t-secondary after:transition-[width] after:duration-300 hover:after:w-full">首页</router-link>
            <router-link to="/about"
              class="text-sm text-t-body no-underline w-fit relative transition-colors duration-200 hover:text-t-primary [text-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.3)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gradient-to-r after:from-t-primary after:to-t-secondary after:transition-[width] after:duration-300 hover:after:w-full">关于</router-link>
          </nav>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-t-title uppercase tracking-wider mb-3">联系方式</h4>
          <div class="flex flex-col gap-2">
            <a href="mailto:lilicould@qq.com"
              class="flex items-center gap-2.5 text-sm text-t-body no-underline py-1 transition-colors duration-200 hover:text-t-primary group">
              <Mail
                class="w-4 h-4 text-t-primary opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 [filter:drop-shadow(0_0_4px_rgba(var(--color-primary-rgb),0.5))]" />
              <span>lilicould@qq.com</span>
            </a>
            <a href="https://github.com/lilicould" target="_blank" rel="noopener"
              class="flex items-center gap-2.5 text-sm text-t-body no-underline py-1 transition-colors duration-200 hover:text-t-primary group">
              <Github
                class="w-4 h-4 text-t-primary opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 [filter:drop-shadow(0_0_4px_rgba(var(--color-primary-rgb),0.5))]" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-t-title uppercase tracking-wider mb-3">友情链接</h4>
          <nav class="flex flex-col gap-2">
            <a href="https://traums.cn/login" target="_blank" rel="noopener"
              class="text-sm text-t-body no-underline w-fit relative transition-colors duration-200 hover:text-t-primary [text-shadow:0_0_8px_rgba(var(--color-primary-rgb),0.3)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gradient-to-r after:from-t-primary after:to-t-secondary after:transition-[width] after:duration-300 hover:after:w-full">TraumSpace</a>
          </nav>
        </div>
      </div>

      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-2 text-xs text-t-body-secondary">
          <span>© 2025-{{ currentYear }} LiliCould.</span>
          <span class="opacity-50">·</span>
          <span>All rights reserved.</span>
        </div>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener"
          class="text-xs text-t-body-secondary no-underline px-2 py-1 rounded-sm transition-colors duration-200 hover:text-t-primary hover:bg-[rgba(var(--color-primary-rgb),0.08)]">
          赣ICP备2025078204号-1
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star, Mail, Github } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())
</script>
