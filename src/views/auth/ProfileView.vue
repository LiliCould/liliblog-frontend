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
            <el-upload
              :auto-upload="true"
              :show-file-list="false"
              :http-request="handleAvatarUpload"
              accept="image/*"
              class="avatar-upload"
            >
              <el-button size="small" type="primary" circle>
                <el-icon><Camera /></el-icon>
              </el-button>
            </el-upload>
          </div>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">用户名</span>
              <span class="info-value">{{ profile.username }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">昵称</span>
              <div class="nickname-edit">
                <el-input
                  v-if="editingNickname"
                  v-model="editNickname"
                  placeholder="请输入昵称"
                  size="small"
                  @keyup.enter="handleSaveNickname"
                  @blur="handleSaveNickname"
                  ref="nicknameInputRef"
                />
                <span v-else class="info-value" @click="startEditNickname">{{ profile.nickname }}</span>
                <el-button
                  v-if="!editingNickname"
                  size="small"
                  type="primary"
                  @click="startEditNickname"
                >
                  编辑
                </el-button>
              </div>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'
import type { FormInstance, FormItemRule, UploadRequestOptions } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { UserVO } from '@/types/auth.d'
import { formatDateTime } from '@/utils/format'
import { passwordRules } from '@/utils/validate'
import { uploadFile } from '@/api/file'
import { updateUserInfo } from '@/api/auth'
import type { ApiResponse } from '@/types/api.d'

const router = useRouter()
const userStore = useUserStore()
const profile = ref<UserVO | null>(null)
const passwordFormRef = ref<FormInstance>()
const nicknameInputRef = ref<InstanceType<typeof import('element-plus')['ElInput']>>()
const changingPassword = ref(false)
const updatingProfile = ref(false)
const editingNickname = ref(false)
const editNickname = ref('')

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

async function handleAvatarUpload(options: UploadRequestOptions) {
  try {
    const res = await uploadFile(options.file as File, 'avatar') as unknown as ApiResponse<string>
    const avatarUrl = res.message?.trim() || res.data
    if (avatarUrl) {
      // 更新本地用户信息
      if (profile.value) {
        profile.value.avatar = avatarUrl
      }
      // 同时更新 store 中的用户信息
      userStore.updateAvatar(avatarUrl)
      
      // 调用后端更新接口
      await updateUserInfo({
        avatar: avatarUrl
      })
      
      ElMessage.success({ message: '头像上传成功', duration: 1500 })
    }
  } catch {
    ElMessage.error({ message: '头像上传失败', duration: 1500 })
  }
}

function startEditNickname() {
  if (profile.value) {
    editNickname.value = profile.value.nickname
    editingNickname.value = true
    nextTick(() => {
      nicknameInputRef.value?.focus()
    })
  }
}

async function handleSaveNickname() {
  if (!editNickname.value.trim()) {
    ElMessage.error({ message: '昵称不能为空', duration: 1500 })
    return
  }
  
  if (editNickname.value.length < 2 || editNickname.value.length > 20) {
    ElMessage.error({ message: '昵称长度在 2-20 个字符之间', duration: 1500 })
    return
  }
  
  updatingProfile.value = true
  try {
    await updateUserInfo({
      nickname: editNickname.value
    })
    
    // 更新本地缓存
    userStore.updateNickname(editNickname.value)
    
    // 重新获取用户信息
    const data = await userStore.fetchProfile()
    if (data) {
      profile.value = data
    }
    
    editingNickname.value = false
    ElMessage.success({ message: '昵称更新成功', duration: 1500 })
  } catch {
    ElMessage.error({ message: '昵称更新失败', duration: 1500 })
  } finally {
    updatingProfile.value = false
  }
}

async function handleChangePassword() {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate()

  changingPassword.value = true
  try {
    await userStore.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
    ElMessage.success({ message: '密码修改成功，请重新登录', duration: 1500 })
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
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 28px;
  margin-bottom: 20px;
  transition: all var(--transition-base);
}

.profile-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--neon-glow-sm);
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
  align-items: center;
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
  flex: 1;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.info-value:hover {
  color: var(--color-primary);
}

.nickname-edit {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nickname-edit .el-input {
  flex: 1;
  max-width: 200px;
}

.loading-wrapper {
  padding: 20px 0;
}

.info-avatar {
  flex-shrink: 0;
  position: relative;
}

.info-avatar :deep(.el-avatar) {
  box-shadow: 0 0 0 3px var(--color-primary), var(--neon-glow-sm);
}

.avatar-upload {
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(25%, 25%);
}

.avatar-upload .el-button {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), var(--neon-glow-sm);
}

@media (max-width: 640px) {
  .user-info {
    flex-direction: column;
    align-items: center;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    width: 100%;
  }
  
  .nickname-edit {
    width: 100%;
  }
  
  .nickname-edit .el-input {
    max-width: none;
  }
}
</style>
