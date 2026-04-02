<template>
  <div class="profile-page page-container">
    <div class="profile-content">
      <div class="profile-card">
        <h2 class="section-title">个人信息</h2>
        <div v-if="profile" class="user-info">
          <div class="info-avatar">
            <el-avatar :size="80" :src="profile.avatar || undefined">
              {{ profile.nickname?.charAt(0) || 'U' }}
            </el-avatar>
          </div>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">用户名</span>
              <span class="info-value">{{ profile.username }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">昵称</span>
              <span class="info-value">{{ profile.nickname }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱</span>
              <span class="info-value">{{ profile.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">上次登录</span>
              <span class="info-value">{{ formatDateTime(profile.lastLoginTime) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">注册时间</span>
              <span class="info-value">{{ formatDateTime(profile.createTime) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="loading-wrapper">
          <el-skeleton :rows="4" animated />
        </div>
      </div>

      <div class="profile-card">
        <h2 class="section-title">修改密码</h2>
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordFormRules"
          label-width="80px"
          style="max-width: 400px;"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              show-password
              placeholder="请输入旧密码"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              show-password
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入新密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="changingPassword" @click="handleChangePassword">
              修改密码
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormItemRule } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { UserVO } from '@/types/auth.d'
import { formatDateTime } from '@/utils/format'
import { passwordRules } from '@/utils/validate'

const router = useRouter()
const userStore = useUserStore()
const profile = ref<UserVO | null>(null)
const passwordFormRef = ref<FormInstance>()
const changingPassword = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const confirmPasswordRules: FormItemRule[] = [
  { required: true, message: '请再次输入新密码', trigger: 'blur' },
  {
    validator: (_rule, value, callback) => {
      if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  },
]

const passwordFormRules = {
  oldPassword: passwordRules,
  newPassword: passwordRules,
  confirmPassword: confirmPasswordRules,
}

onMounted(async () => {
  try {
    const data = await userStore.fetchProfile()
    if (data) {
      profile.value = data
    }
  } catch {
    // handled by interceptor
  }
})

async function handleChangePassword() {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate()

  changingPassword.value = true
  try {
    await userStore.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
    ElMessage.success('密码修改成功，请重新登录')
    userStore.logout()
    router.push('/login')
  } catch {
    // handled by interceptor
  } finally {
    changingPassword.value = false
  }
}
</script>

<style scoped>
.profile-page {
  padding-top: 24px;
  padding-bottom: 40px;
}

.profile-content {
  max-width: 700px;
  margin: 0 auto;
}

.profile-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 28px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-title);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.user-info {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.info-list {
  flex: 1;
}

.info-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  width: 80px;
  font-size: 13px;
  color: var(--color-muted);
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: var(--color-title);
}

.loading-wrapper {
  padding: 20px 0;
}

@media (max-width: 640px) {
  .user-info {
    flex-direction: column;
    align-items: center;
  }
}
</style>
