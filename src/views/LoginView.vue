<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogIn, Mail } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref<'password' | 'email'>('password')
const loading = ref(false)

const passwordForm = ref({
  username: '',
  password: '',
})

const emailForm = ref({
  email: '',
  code: '',
})

const handlePasswordLogin = async () => {
  if (!passwordForm.value.username || !passwordForm.value.password) return
  loading.value = true
  try {
    await authStore.login({
      username: passwordForm.value.username,
      password: passwordForm.value.password,
    })
    router.push('/')
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}

const handleEmailLogin = async () => {
  if (!emailForm.value.email || !emailForm.value.code) return
  loading.value = true
  try {
    await authStore.loginEmail({
      email: emailForm.value.email,
      code: emailForm.value.code,
    })
    router.push('/')
  } catch (error) {
    console.error('邮箱登录失败', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg-canvas px-4">
    <div class="w-full max-w-md bg-bg-surface rounded-2xl card-shadow p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-black text-text-title tracking-tight">立里博客</h1>
        <p class="text-sm text-text-meta mt-2">欢迎回来</p>
      </div>

      <!-- 登录方式切换 -->
      <div class="flex items-center gap-2 mb-6 p-1 bg-bg-canvas rounded-xl">
        <button
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-none',
            activeTab === 'password'
              ? 'bg-bg-surface text-text-title shadow-sm'
              : 'text-text-meta hover:text-text-body',
          ]"
          @click="activeTab = 'password'"
        >
          <LogIn class="w-4 h-4" />
          密码登录
        </button>
        <button
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-none',
            activeTab === 'email'
              ? 'bg-bg-surface text-text-title shadow-sm'
              : 'text-text-meta hover:text-text-body',
          ]"
          @click="activeTab = 'email'"
        >
          <Mail class="w-4 h-4" />
          邮箱登录
        </button>
      </div>

      <!-- 密码登录表单 -->
      <form v-if="activeTab === 'password'" class="space-y-4" @submit.prevent="handlePasswordLogin">
        <div>
          <label class="block text-sm font-medium text-text-title mb-1.5">用户名</label>
          <input
            v-model="passwordForm.username"
            type="text"
            class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            placeholder="请输入用户名"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-title mb-1.5">密码</label>
          <input
            v-model="passwordForm.password"
            type="password"
            class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            placeholder="请输入密码"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 邮箱登录表单 -->
      <form v-else class="space-y-4" @submit.prevent="handleEmailLogin">
        <div>
          <label class="block text-sm font-medium text-text-title mb-1.5">邮箱</label>
          <input
            v-model="emailForm.email"
            type="email"
            class="w-full px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
            placeholder="请输入邮箱"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-title mb-1.5">验证码</label>
          <div class="flex gap-2">
            <input
              v-model="emailForm.code"
              type="text"
              class="flex-1 px-4 py-2.5 bg-bg-canvas border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary"
              placeholder="请输入验证码"
            />
            <button
              type="button"
              class="px-4 py-2.5 border border-border rounded-xl text-sm text-text-body hover:bg-bg-canvas transition-none whitespace-nowrap"
            >
              获取验证码
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-none disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>
