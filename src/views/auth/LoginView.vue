<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none" style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,240,255,0.015) 2px,rgba(0,240,255,0.015) 4px)"></div>
    <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(rgba(0,240,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.03) 1px,transparent 1px);background-size:40px 40px"></div>

    <div class="w-full max-w-md relative z-10 rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-8 shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
      <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00f0ff] via-[#ff2d78] to-[#a3e635] rounded-t-xl shadow-[0_0_8px_rgba(0,240,255,0.3)]"></div>

      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-[#00f0ff] mb-1 tracking-wider" style="text-shadow:0 0 12px rgba(0,240,255,0.4)">LiliBlog</h1>
        <p class="text-sm text-[#6b7280]">欢迎回来</p>
      </div>

      <div class="flex mb-6 rounded-lg overflow-hidden border border-[rgba(0,240,255,0.15)]">
        <button
          class="flex-1 py-2.5 text-sm font-semibold transition-all duration-300"
          :class="activeTab === 'password'
            ? 'bg-[rgba(0,240,255,0.12)] text-[#00f0ff] border-b-2 border-[#00f0ff]'
            : 'text-[#6b7280] hover:text-[#e0e0e8]'"
          @click="activeTab = 'password'"
        >密码登录</button>
        <button
          class="flex-1 py-2.5 text-sm font-semibold transition-all duration-300"
          :class="activeTab === 'email'
            ? 'bg-[rgba(0,240,255,0.12)] text-[#00f0ff] border-b-2 border-[#00f0ff]'
            : 'text-[#6b7280] hover:text-[#e0e0e8]'"
          @click="activeTab = 'email'"
        >邮箱登录</button>
      </div>

      <form v-if="activeTab === 'password'" class="flex flex-col gap-4" @submit.prevent="handlePasswordLogin">
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            v-model="pwdForm.username"
            type="text"
            placeholder="用户名"
            class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
          />
        </div>
        <div class="relative">
          <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            v-model="pwdForm.password"
            type="password"
            placeholder="密码"
            class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full h-11 rounded-lg bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] font-semibold text-sm transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <form v-else class="flex flex-col gap-4" @submit.prevent="handleEmailLogin">
        <div class="relative">
          <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            v-model="emailForm.email"
            type="email"
            placeholder="邮箱"
            class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
          />
        </div>
        <div class="relative flex gap-2">
          <div class="relative flex-1">
            <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              v-model="emailForm.captcha"
              type="text"
              placeholder="验证码"
              class="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)]"
            />
          </div>
          <button
            type="button"
            :disabled="countdown > 0 || captchaLoading"
            class="shrink-0 h-11 px-4 rounded-lg bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.2)] text-[#00f0ff] text-sm font-medium transition-all duration-300 hover:bg-[rgba(0,240,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleSendCaptcha(emailForm.email)"
          >
            {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
          </button>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full h-11 rounded-lg bg-[rgba(0,240,255,0.12)] border border-[#00f0ff] text-[#00f0ff] font-semibold text-sm transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="text-center mt-6 text-sm text-[#6b7280]">
        还没有账号？
        <router-link to="/register" class="text-[#00f0ff] font-medium hover:underline" style="text-shadow:0 0 6px rgba(0,240,255,0.3)">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock, Mail, KeyRound } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { getCaptcha } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const activeTab = ref<'password' | 'email'>('password')
const loading = ref(false)
const captchaLoading = ref(false)
const countdown = ref(0)
let countdownTimer: number | null = null

const pwdForm = reactive({ username: '', password: '' })
const emailForm = reactive({ email: '', captcha: '' })

function startCountdown() {
  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(countdownTimer!)
  }, 1000)
}

async function handleSendCaptcha(email: string) {
  if (!email.trim()) return
  captchaLoading.value = true
  try {
    await getCaptcha(email)
    startCountdown()
  } catch {
    // handled by interceptor
  } finally {
    captchaLoading.value = false
  }
}

async function handlePasswordLogin() {
  if (!pwdForm.username.trim() || !pwdForm.password.trim()) return
  loading.value = true
  try {
    await userStore.loginByPassword({ username: pwdForm.username, password: pwdForm.password })
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

async function handleEmailLogin() {
  if (!emailForm.email.trim() || !emailForm.captcha.trim()) return
  loading.value = true
  try {
    await userStore.loginByMail({ email: emailForm.email, captcha: emailForm.captcha })
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
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
