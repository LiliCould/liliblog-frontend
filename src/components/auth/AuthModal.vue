<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.stop></div>
      <div class="relative w-full max-w-[380px] bg-t-surface border border-t-border shadow-lg overflow-hidden">
        <button
          class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-t-muted hover:text-t-body hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all cursor-pointer z-10"
          @click="close">
          <X class="w-4 h-4" />
        </button>

        <div class="px-6 pt-7 pb-0 rounded-t">
          <div class="text-center mb-5">
            <img src="@/assets/logo.svg" alt="LiliBlog" class="h-9 w-auto mx-auto mb-2" />
            <p class="text-sm text-t-muted">{{ currentView === 'login' ? '欢迎回来' : '创建你的账号' }}</p>
          </div>

          <div v-if="currentView === 'login'" class="flex border-b border-t-border">
            <button v-for="tab in loginTabs" :key="tab.key" type="button"
              class="flex-1 py-2 text-sm font-medium transition-all duration-200 cursor-pointer" :class="loginMethod === tab.key
                ? 'text-t-primary border-b-2 border-t-primary'
                : 'text-t-muted hover:text-t-body border-b-2 border-transparent'" @click="loginMethod = tab.key">
              {{ tab.label }}
            </button>
          </div>
        </div>

        <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0"
          enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in"
          leave-from-class="opacity-100" leave-to-class="opacity-0" mode="out-in">
          <div v-if="currentView === 'login' && loginMethod === 'password'" key="login-pwd" class="px-6 py-5">
            <form class="flex flex-col gap-3" @submit.prevent="handlePasswordLogin">
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                <input v-model="pwdForm.username" type="text" placeholder="用户名"
                  class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
              </div>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                <input v-model="pwdForm.password" type="password" placeholder="密码"
                  class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
              </div>
              <button type="submit" :disabled="loading"
                class="w-full h-9 bg-t-primary text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {{ loading ? '登录中...' : '登录' }}
              </button>
            </form>
          </div>

          <div v-else-if="currentView === 'login' && loginMethod === 'email'" key="login-email" class="px-6 py-5">
            <form class="flex flex-col gap-3" @submit.prevent="handleEmailLogin">
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                <input v-model="emailForm.email" type="email" placeholder="邮箱"
                  class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
              </div>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                  <input v-model="emailForm.code" type="text" placeholder="验证码"
                    class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
                </div>
                <button type="button" :disabled="countdown > 0 || captchaLoading"
                  class="shrink-0 h-9 px-3 bg-[rgba(var(--color-primary-rgb),0.08)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-primary text-xs font-medium transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.15)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  @click="handleSendCaptcha(emailForm.email)">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </button>
              </div>
              <button type="submit" :disabled="loading"
                class="w-full h-9 bg-t-primary text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {{ loading ? '登录中...' : '登录' }}
              </button>
            </form>
          </div>

          <div v-else-if="currentView === 'register'" key="register" class="px-6 py-5">
            <form class="flex flex-col gap-2.5" @submit.prevent="handleRegister">
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                <input v-model="regForm.username" type="text" placeholder="用户名"
                  class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
              </div>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                <input v-model="regForm.email" type="email" placeholder="邮箱"
                  class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
              </div>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                  <input v-model="regForm.code" type="text" placeholder="验证码"
                    class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
                </div>
                <button type="button" :disabled="countdown > 0 || captchaLoading"
                  class="shrink-0 h-9 px-3 bg-[rgba(var(--color-primary-rgb),0.08)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-primary text-xs font-medium transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.15)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  @click="handleSendCaptcha(regForm.email)">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </button>
              </div>
              <div class="relative">
                <PenLine class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                <input v-model="regForm.nickname" type="text" placeholder="昵称"
                  class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
              </div>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                <input v-model="regForm.password" type="password" placeholder="密码"
                  class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
              </div>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
                <input v-model="regForm.confirmPassword" type="password" placeholder="确认密码"
                  class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
              </div>
              <button type="submit" :disabled="loading"
                class="w-full h-9 bg-t-primary text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {{ loading ? '注册中...' : '注册' }}
              </button>
            </form>
          </div>
        </Transition>

        <div class="px-6 pb-5 pt-2 text-center text-sm text-t-muted">
          <template v-if="currentView === 'login'">
            还没有账号？
            <button type="button"
              class="text-t-primary font-medium hover:underline cursor-pointer bg-transparent border-none p-0"
              @click="switchView('register')">立即注册</button>
          </template>
          <template v-else>
            已有账号？
            <button type="button"
              class="text-t-primary font-medium hover:underline cursor-pointer bg-transparent border-none p-0"
              @click="switchView('login')">立即登录</button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, watch } from 'vue'
import { X, User, Lock, Mail, KeyRound, PenLine } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { register, getCaptcha } from '@/api/auth'
import { useToast } from '@/composables/useToast'
import { useAuthModal } from '@/composables/useAuthModal'

const { visible, initialView, close } = useAuthModal()
const userStore = useUserStore()
const toast = useToast()

const currentView = ref<'login' | 'register'>('login')
const loginMethod = ref<'password' | 'email'>('password')
const loading = ref(false)
const captchaLoading = ref(false)
const countdown = ref(0)
let countdownTimer: number | null = null

const loginTabs = [
  { key: 'password' as const, label: '密码登录' },
  { key: 'email' as const, label: '邮箱登录' },
]

const pwdForm = reactive({ username: '', password: '' })
const emailForm = reactive({ email: '', code: '' })
const regForm = reactive({
  username: '',
  email: '',
  code: '',
  nickname: '',
  password: '',
  confirmPassword: '',
})

watch(initialView, (val) => {
  currentView.value = val
  loginMethod.value = 'password'
}, { immediate: true })

function switchView(view: 'login' | 'register') {
  currentView.value = view
  if (view === 'login') loginMethod.value = 'password'
}

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
  } catch { } finally {
    captchaLoading.value = false
  }
}

async function handlePasswordLogin() {
  if (!pwdForm.username.trim() || !pwdForm.password.trim()) return
  loading.value = true
  try {
    await userStore.loginByPassword({ username: pwdForm.username, password: pwdForm.password, loginType: 'pwd' })
    toast.success('登录成功')
    close()
  } catch { } finally {
    loading.value = false
  }
}

async function handleEmailLogin() {
  if (!emailForm.email.trim() || !emailForm.code.trim()) return
  loading.value = true
  try {
    await userStore.loginByMail({ email: emailForm.email, code: emailForm.code, loginType: 'email' })
    toast.success('登录成功')
    close()
  } catch { } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (!regForm.username.trim() || !regForm.email.trim() || !regForm.code.trim() || !regForm.nickname.trim() || !regForm.password.trim()) return
  if (regForm.password !== regForm.confirmPassword) return
  loading.value = true
  try {
    await register({
      username: regForm.username,
      email: regForm.email,
      password: regForm.password,
      confirmPassword: regForm.confirmPassword,
      nickname: regForm.nickname,
    })
    toast.success('注册成功，请登录')
    switchView('login')
  } catch { } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>
