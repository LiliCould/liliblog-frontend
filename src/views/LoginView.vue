<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { isValidEmail, isValidCode } from '@/utils/validate'

/**
 * 登录页面
 * 支持用户名密码登录和邮箱验证码登录
 */
const router = useRouter()
const authStore = useAuthStore()

// 登录方式切换：pwd-密码登录，email-邮箱登录
const loginType = ref<'pwd' | 'email'>('pwd')

// 表单数据
const form = ref({
  username: '',
  password: '',
  email: '',
  code: '',
})

const loading = ref(false)
const errorMsg = ref('')

/**
 * 处理登录
 */
const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true

  try {
    let success = false

    if (loginType.value === 'pwd') {
      // 用户名密码登录
      if (!form.value.username || !form.value.password) {
        errorMsg.value = '请输入用户名和密码'
        return
      }
      success = await authStore.login({
        username: form.value.username,
        password: form.value.password,
      })
    } else {
      // 邮箱验证码登录
      if (!isValidEmail(form.value.email)) {
        errorMsg.value = '请输入有效的邮箱地址'
        return
      }
      if (!isValidCode(form.value.code)) {
        errorMsg.value = '请输入6位数字验证码'
        return
      }
      success = await authStore.loginEmail({
        email: form.value.email,
        code: form.value.code,
      })
    }

    if (success) {
      router.push('/')
    } else {
      errorMsg.value = '登录失败，请检查账号信息'
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { msg?: string } } }
    errorMsg.value = err.response?.data?.msg || '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-[var(--neutral-50)] px-4 dark:bg-[var(--background)]"
  >
    <div
      class="w-full max-w-md border-2 border-black bg-white p-8 dark:border-[var(--neutral-800)] dark:bg-[var(--surface)]"
    >
      <!-- 标题 -->
      <h1 class="text-2xl font-black tracking-tight">
        登录
      </h1>
      <p class="mt-1 font-mono text-sm text-[var(--neutral-800)] dark:text-[var(--text-secondary)]">
        欢迎回到 LiliBlog
      </p>

      <!-- 登录方式切换 -->
      <div class="mt-6 flex border-2 border-black dark:border-[var(--neutral-800)]">
        <button
          class="flex-1 py-2 text-sm font-bold"
          :class="{
            'bg-[var(--accent-toxic)] text-black': loginType === 'pwd',
          }"
          @click="loginType = 'pwd'"
        >
          密码登录
        </button>
        <button
          class="flex-1 py-2 text-sm font-bold"
          :class="{
            'bg-[var(--accent-toxic)] text-black': loginType === 'email',
          }"
          @click="loginType = 'email'"
        >
          邮箱登录
        </button>
      </div>

      <!-- 表单 -->
      <form
        class="mt-6 space-y-4"
        @submit.prevent="handleLogin"
      >
        <!-- 用户名密码登录 -->
        <template v-if="loginType === 'pwd'">
          <div>
            <label class="mb-1 block text-sm font-bold">用户名</label>
            <input
              v-model="form.username"
              type="text"
              class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-bold">密码</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
              placeholder="请输入密码"
            />
          </div>
        </template>

        <!-- 邮箱验证码登录 -->
        <template v-else>
          <div>
            <label class="mb-1 block text-sm font-bold">邮箱</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
              placeholder="请输入邮箱"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-bold">验证码</label>
            <div class="flex gap-2">
              <input
                v-model="form.code"
                type="text"
                maxlength="6"
                class="w-full border-2 border-black bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-toxic)] dark:border-[var(--neutral-800)]"
                placeholder="请输入6位验证码"
              />
            </div>
          </div>
        </template>

        <!-- 错误提示 -->
        <p
          v-if="errorMsg"
          class="text-sm font-bold"
          :style="{ color: 'var(--accent-magenta)' }"
        >
          {{ errorMsg }}
        </p>

        <!-- 登录按钮 -->
        <button
          type="submit"
          class="w-full border-2 border-black py-2 text-sm font-bold transition-none hover:bg-[var(--accent-toxic)] hover:text-black dark:border-white"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 返回首页 -->
      <div class="mt-4 text-center">
        <router-link
          to="/"
          class="text-xs font-mono"
        >
          [返回首页]
        </router-link>
      </div>
    </div>
  </div>
</template>
