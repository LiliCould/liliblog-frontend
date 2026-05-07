<template>
  <div class="register-page">
    <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">LiliBlog</h1>
        <p class="register-subtitle">创建你的账号</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱"
            :prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item prop="nickname">
          <el-input
            v-model="form.nickname"
            placeholder="昵称"
            :prefix-icon="UserFilled"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="captcha">
          <el-input
            v-model="form.captcha"
            placeholder="验证码"
            :prefix-icon="Postcard"
            @keyup.enter="handleRegister"
          >
            <template #append>
              <el-button
                :loading="captchaLoading"
                :disabled="countdown > 0"
                @click="handleGetCaptcha"
              >
                {{ countdown > 0 ? `${countdown}s后重新获取` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="register-btn"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Message, UserFilled, Postcard } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormItemRule } from 'element-plus'
import { register, getCaptcha } from '@/api/auth'
import { usernameRules, passwordRules, emailRules, nicknameRules } from '@/utils/validate'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const captchaLoading = ref(false)
const countdown = ref(0)
let countdownTimer: number | null = null

const form = reactive({
  username: '',
  email: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  captcha: '',
})

const confirmPasswordRules: FormItemRule[] = [
  { required: true, message: '请再次输入密码', trigger: 'blur' },
  {
    validator: (_rule, value, callback) => {
      if (value !== form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  },
]

const captchaRules: FormItemRule[] = [
  { required: true, message: '请输入验证码', trigger: 'blur' },
]

const rules = {
  username: usernameRules,
  email: emailRules,
  nickname: nicknameRules,
  password: passwordRules,
  confirmPassword: confirmPasswordRules,
  captcha: captchaRules,
}

function startCountdown() {
  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownTimer!)
    }
  }, 1000)
}

async function handleGetCaptcha() {
  if (!form.email) {
    ElMessage.error({ message: '请输入邮箱', duration: 1500 })
    return
  }
  
  captchaLoading.value = true
  try {
    await getCaptcha(form.email)
    ElMessage.success({ message: '验证码已发送到您的邮箱', duration: 1500 })
    startCountdown()
  } catch {
    // error handled by interceptor
  } finally {
    captchaLoading.value = false
  }
}

async function handleRegister() {
  if (!formRef.value) return
  await formRef.value.validate()

  loading.value = true
  try {
    await register({
      username: form.username,
      email: form.email,
      password: form.password,
      nickname: form.nickname,
      captcha: form.captcha,
    })
    ElMessage.success({ message: '注册成功，请登录', duration: 1500 })
    router.push('/login')
  } catch {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.register-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 240, 255, 0.015) 2px,
      rgba(0, 240, 255, 0.015) 4px
    );
  pointer-events: none;
}

.register-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-card);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  box-shadow: var(--shadow-lg), var(--neon-glow-sm);
  border: 1px solid var(--color-border);
  position: relative;
  z-index: 1;
}

.register-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-tertiary));
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: var(--neon-glow-sm);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
  letter-spacing: 2px;
}

.register-subtitle {
  font-size: 14px;
  color: var(--color-muted);
}

.register-btn {
  width: 100%;
  border-radius: var(--radius-md);
  font-size: 15px;
  height: 44px;
  box-shadow: var(--neon-glow-sm);
  letter-spacing: 1px;
}

.register-btn:hover {
  box-shadow: var(--neon-glow-md);
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: var(--color-muted);
}

.register-footer a {
  color: var(--color-primary);
  font-weight: 500;
  margin-left: 4px;
  transition: all var(--transition-fast);
}

.register-footer a:hover {
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}
</style>
