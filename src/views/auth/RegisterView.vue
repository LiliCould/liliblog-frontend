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
            @keyup.enter="handleRegister"
          />
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Message, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormItemRule } from 'element-plus'
import { register } from '@/api/auth'
import { usernameRules, passwordRules, emailRules, nicknameRules } from '@/utils/validate'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  nickname: '',
  password: '',
  confirmPassword: '',
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

const rules = {
  username: usernameRules,
  email: emailRules,
  nickname: nicknameRules,
  password: passwordRules,
  confirmPassword: confirmPasswordRules,
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
    })
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  box-shadow: var(--shadow-lg);
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
}
</style>
