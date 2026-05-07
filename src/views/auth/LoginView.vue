<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">LiliBlog</h1>
        <p class="login-subtitle">欢迎回来</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <span>还没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { usernameRules, passwordRules } from '@/utils/validate'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: usernameRules,
  password: passwordRules,
}

async function handleLogin() {
  if (!formRef.value) return
  await formRef.value.validate()

  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success({ message: '登录成功', duration: 1500 })
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-page::before {
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

.login-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.login-card {
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

.login-card::before {
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

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
  letter-spacing: 2px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--color-muted);
}

.login-btn {
  width: 100%;
  border-radius: var(--radius-md);
  font-size: 15px;
  height: 44px;
  box-shadow: var(--neon-glow-sm);
  letter-spacing: 1px;
}

.login-btn:hover {
  box-shadow: var(--neon-glow-md);
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: var(--color-muted);
}

.login-footer a {
  color: var(--color-primary);
  font-weight: 500;
  margin-left: 4px;
  transition: all var(--transition-fast);
}

.login-footer a:hover {
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}
</style>
