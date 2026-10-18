<template>
  <div>
    <div class="text-center mb-5">
      <img :src="logoSvg" alt="LiliBlog" class="h-9 w-auto mx-auto mb-2" />
      <p class="text-sm text-t-muted">{{ currentView === 'login' ? '欢迎回来' : '创建你的账号' }}</p>
    </div>

    <AppTabs
      v-if="currentView === 'login'"
      v-model="loginMethodTab"
      :tabs="loginTabOptions"
    />

    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <div v-if="currentView === 'login' && loginMethod === 'password'" key="login-pwd" class="px-6 py-5">
        <form class="flex flex-col gap-3" @submit.prevent="handlePasswordLogin">
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input
              v-model="pwdForm.username"
              type="text"
              autocomplete="username"
              placeholder="用户名"
              class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary"
            />
          </div>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input
              v-model="pwdForm.password"
              type="password"
              autocomplete="current-password"
              placeholder="密码"
              class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-9 bg-t-primary-fill text-t-on-primary font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>

      <div v-else-if="currentView === 'login' && loginMethod === 'email'" key="login-email" class="px-6 py-5">
        <form class="flex flex-col gap-3" @submit.prevent="handleEmailLogin">
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input
              v-model="emailForm.email"
              type="email"
              autocomplete="email"
              placeholder="邮箱"
              class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary"
            />
          </div>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
              <input
                v-model="emailForm.code"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="验证码"
                class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary"
              />
            </div>
            <button
              type="button"
              :disabled="countdown > 0 || captchaLoading"
              class="shrink-0 h-9 px-3 bg-[rgba(var(--color-primary-rgb),0.08)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-primary text-xs font-medium transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.15)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              @click="handleSendCaptcha(emailForm.email)"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-9 bg-t-primary-fill text-t-on-primary font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>

      <div v-else-if="currentView === 'register' && allowRegister" key="register-form" class="px-6 py-5">
        <form class="flex flex-col gap-3" @submit.prevent="handleRegister">
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input v-model="registerForm.username" type="text" autocomplete="username" placeholder="用户名" class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
          </div>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input v-model="registerForm.email" type="email" autocomplete="email" placeholder="邮箱" class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
          </div>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
              <input v-model="registerForm.code" type="text" inputmode="numeric" placeholder="验证码" class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
            </div>
            <button type="button" :disabled="countdown > 0 || captchaLoading" class="shrink-0 h-9 px-3 bg-[rgba(var(--color-primary-rgb),0.08)] border border-[rgba(var(--color-primary-rgb),0.2)] text-t-primary text-xs font-medium transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.15)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" @click="handleSendCaptcha(registerForm.email)">
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
          <div class="relative">
            <PenLine class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input v-model="registerForm.nickname" type="text" placeholder="昵称" class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
          </div>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input v-model="registerForm.password" type="password" autocomplete="new-password" placeholder="密码" class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
          </div>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input v-model="registerForm.confirmPassword" type="password" autocomplete="new-password" placeholder="确认密码" class="w-full h-9 pl-9 pr-3 bg-t-bg border border-t-border text-t-body text-sm placeholder:text-t-muted outline-none transition-colors duration-200 focus:border-t-primary" />
          </div>
          <button type="submit" :disabled="loading" class="w-full h-9 bg-t-primary-fill text-t-on-primary font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
      </div>

      <div v-else key="register-closed" class="px-6 py-5">
        <div class="flex flex-col items-center text-center py-4">
          <div class="w-14 h-14 rounded-full bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center mb-4">
            <Lock class="w-7 h-7 text-t-primary" />
          </div>
          <h3 class="text-base font-semibold text-t-title mb-2">暂时关闭注册</h3>
          <p class="text-sm text-t-muted leading-relaxed mb-4">
            目前暂不开放新用户注册，<br />如需账号请联系管理员。
          </p>
          <div class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(var(--color-primary-rgb),0.06)] border border-[rgba(var(--color-primary-rgb),0.15)] cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.12)]" @click="copyEmail">
            <Mail class="w-4 h-4 text-t-primary" />
            <span class="text-sm text-t-primary font-medium">lilicould@qq.com</span>
            <Copy class="w-3.5 h-3.5 text-t-muted" />
          </div>
          <button type="button" class="w-full h-9 mt-6 bg-t-primary-fill text-t-on-primary font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer" @click="switchView('login')">
            返回登录
          </button>
        </div>
      </div>
    </Transition>

    <div class="px-6 pb-5 pt-2 text-center text-sm text-t-muted">
      <template v-if="currentView === 'login'">
        还没有账号？
        <NuxtLink v-if="!embedded" to="/register" class="text-t-primary font-medium hover:underline">立即注册</NuxtLink>
        <button v-else type="button" class="text-t-primary font-medium hover:underline cursor-pointer bg-transparent border-none p-0" @click="switchView('register')">
          立即注册
        </button>
      </template>
      <template v-else>
        已有账号？
        <button type="button" class="text-t-primary font-medium hover:underline cursor-pointer bg-transparent border-none p-0" @click="switchView('login')">
          立即登录
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Copy, KeyRound, Lock, Mail, PenLine, User } from 'lucide-vue-next'
import { getCaptcha, register } from '~/api/auth'
import logoSvg from '~/assets/logo.svg'

const props = withDefaults(defineProps<{
  initialView?: 'login' | 'register'
  allowRegister?: boolean
  embedded?: boolean
}>(), {
  initialView: 'login',
  allowRegister: false,
  embedded: false,
})

const emit = defineEmits<{
  success: []
}>()

const userStore = useUserStore()
const toast = useToast()

const currentView = ref<'login' | 'register'>(props.initialView)
const loginMethod = ref<'password' | 'email'>('password')
const loading = ref(false)
const captchaLoading = ref(false)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const loginTabs = [
  { key: 'password' as const, label: '密码登录' },
  { key: 'email' as const, label: '邮箱登录' },
]

const loginTabOptions = computed(() =>
  loginTabs.map(tab => ({ label: tab.label, value: tab.key })),
)

const loginMethodTab = computed({
  get: () => loginMethod.value,
  set: (value: string) => {
    if (value === 'password' || value === 'email') {
      loginMethod.value = value
    }
  },
})

const pwdForm = reactive({ username: '', password: '' })
const emailForm = reactive({ email: '', code: '' })
const registerForm = reactive({
  username: '',
  email: '',
  code: '',
  nickname: '',
  password: '',
  confirmPassword: '',
})

watch(() => props.initialView, (value) => {
  currentView.value = value
  loginMethod.value = 'password'
})

function switchView(view: 'login' | 'register'): void {
  currentView.value = view
  if (view === 'login') loginMethod.value = 'password'
}

function startCountdown(): void {
  countdown.value = 60
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

async function handleSendCaptcha(email: string): Promise<void> {
  if (!email.trim()) return
  captchaLoading.value = true
  try {
    await getCaptcha(email)
    startCountdown()
    toast.success('验证码已发送')
  } catch {
    // 错误提示由 axios 拦截器统一处理
  } finally {
    captchaLoading.value = false
  }
}

async function handlePasswordLogin(): Promise<void> {
  if (!pwdForm.username.trim() || !pwdForm.password.trim()) return
  loading.value = true
  try {
    await userStore.loginByPassword({ username: pwdForm.username, password: pwdForm.password, loginType: 'pwd' })
    toast.success('登录成功')
    emit('success')
  } catch {
    // 错误提示由 axios 拦截器统一处理
  } finally {
    loading.value = false
  }
}

async function handleEmailLogin(): Promise<void> {
  if (!emailForm.email.trim() || !emailForm.code.trim()) return
  loading.value = true
  try {
    await userStore.loginByMail({ email: emailForm.email, code: emailForm.code, loginType: 'email' })
    toast.success('登录成功')
    emit('success')
  } catch {
    // 错误提示由 axios 拦截器统一处理
  } finally {
    loading.value = false
  }
}

async function handleRegister(): Promise<void> {
  if (!registerForm.username.trim() || !registerForm.email.trim() || !registerForm.code.trim() || !registerForm.nickname.trim() || !registerForm.password.trim()) {
    toast.warning('请填写完整的注册信息')
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    toast.warning('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      nickname: registerForm.nickname,
    })
    toast.success('注册成功，请登录')
    switchView('login')
  } catch {
    // 错误提示由 axios 拦截器统一处理
  } finally {
    loading.value = false
  }
}

async function copyEmail(): Promise<void> {
  try {
    await navigator.clipboard.writeText('lilicould@qq.com')
    toast.success('邮箱已复制')
  } catch {
    toast.info('lilicould@qq.com')
  }
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>
