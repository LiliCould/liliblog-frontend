<template>
  <div class="min-h-screen flex items-center justify-center bg-t-bg p-4 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none"
      style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,240,255,0.015) 2px,rgba(0,240,255,0.015) 4px)">
    </div>
    <div class="absolute inset-0 pointer-events-none"
      style="background:linear-gradient(rgba(0,240,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.03) 1px,transparent 1px);background-size:40px 40px">
    </div>

    <div
      class="w-full max-w-md relative z-10 rounded-xl bg-t-surface border border-t-border p-8 shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
      <div
        class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00f0ff] via-[#ff2d78] to-[#a3e635] rounded-t-xl shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]">
      </div>

      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-t-primary mb-1 tracking-wider"
          style="text-shadow:0 0 12px rgba(0,240,255,0.4)">LiliBlog</h1>
        <p class="text-sm text-t-muted">创建你的账号</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
          <input v-model="form.username" type="text" placeholder="用户名"
            class="w-full h-11 pl-10 pr-4 rounded-lg bg-t-bg border border-t-border text-t-body text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]" />
        </div>

        <div class="relative">
          <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
          <input v-model="form.email" type="email" placeholder="邮箱"
            class="w-full h-11 pl-10 pr-4 rounded-lg bg-t-bg border border-t-border text-t-body text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]" />
        </div>

        <div class="relative flex gap-2">
          <div class="relative flex-1">
            <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input v-model="form.code" type="text" placeholder="验证码"
              class="w-full h-11 pl-10 pr-4 rounded-lg bg-t-bg border border-t-border text-t-body text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]" />
          </div>
          <button type="button" :disabled="countdown > 0 || captchaLoading"
            class="shrink-0 h-11 px-4 rounded-lg bg-[rgba(var(--color-primary-rgb),0.08)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-primary text-sm font-medium transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleSendCaptcha">
            {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
          </button>
        </div>

        <div class="relative">
          <PenLine class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
          <input v-model="form.nickname" type="text" placeholder="昵称"
            class="w-full h-11 pl-10 pr-4 rounded-lg bg-t-bg border border-t-border text-t-body text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]" />
        </div>

        <div class="relative">
          <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
          <input v-model="form.password" type="password" placeholder="密码"
            class="w-full h-11 pl-10 pr-4 rounded-lg bg-t-bg border border-t-border text-t-body text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]" />
        </div>

        <div class="relative">
          <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
          <input v-model="form.confirmPassword" type="password" placeholder="确认密码"
            class="w-full h-11 pl-10 pr-4 rounded-lg bg-t-bg border border-t-border text-t-body text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]" />
        </div>

        <button type="submit" :disabled="loading"
          class="w-full h-11 rounded-lg bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary font-semibold text-sm transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="text-center mt-6 text-sm text-t-muted">
        已有账号？
        <router-link to="/login" class="text-t-primary font-medium hover:underline"
          style="text-shadow:0 0 6px rgba(0,240,255,0.3)">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Mail, KeyRound, PenLine, Lock } from 'lucide-vue-next'
import { register, getCaptcha } from '@/api/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const loading = ref(false)
const captchaLoading = ref(false)
const countdown = ref(0)
let countdownTimer: number | null = null
const toast = useToast()

const form = reactive({
  username: '',
  email: '',
  code: '',
  nickname: '',
  password: '',
  confirmPassword: '',
})

function startCountdown() {
  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(countdownTimer!)
  }, 1000)
}

async function handleSendCaptcha() {
  if (!form.email.trim()) return
  captchaLoading.value = true
  try {
    await getCaptcha(form.email)
    startCountdown()
  } catch {
    // handled by interceptor
  } finally {
    captchaLoading.value = false
  }
}

async function handleRegister() {
  if (!form.username.trim() || !form.email.trim() || !form.code.trim() || !form.nickname.trim() || !form.password.trim()) return
  if (form.password !== form.confirmPassword) return
  loading.value = true
  try {
    await register({
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      nickname: form.nickname,
    })
    toast.success('注册成功，请登录')
    router.push('/login')
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>
