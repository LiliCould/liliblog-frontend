<template>
  <el-dialog
    v-model="visible"
    title="聊天室"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="chat-room">
      <div class="status-bar">
        <span class="status-text">
          <span class="status-dot" :class="{ 'connected': chatStore.isConnected }">
            {{ chatStore.isConnected ? '●' : '○' }}
          </span>
          {{ chatStore.isConnected ? '已连接' : '连接中...' }}
        </span>
      </div>

      <div 
        class="messages-container" 
        ref="messagesContainer"
        @scroll="handleScroll"
      >
        <div 
          v-for="message in chatStore.messages" 
          :key="message.id || message.content"
          class="message-item"
          :class="{
            'system-message': message.type === 'SYSTEM',
            'own-message': message.senderUsername === userStore.username
          }"
        >
          <template v-if="message.type === 'SYSTEM'">
            <div class="system-content">{{ message.content }}</div>
          </template>
          <template v-else>
            <el-avatar 
              class="message-avatar" 
              :size="32" 
              :src="message.senderAvatar || 'https://lilicould.cn/xiaodingdang.png'"
            >
              {{ message.senderName?.charAt(0) || 'U' }}
            </el-avatar>
            <div class="message-content-wrapper">
              <div class="message-header">
                <span class="sender-name">{{ message.senderName }}</span>
                <span class="message-time">{{ formatMessageTime(message.createTime) }}</span>
              </div>
              <div class="message-content">
                <template v-if="message.type === 'TEXT'">
                  {{ message.content }}
                </template>
                <template v-else-if="message.type === 'FILE'">
                  <div class="file-message" :class="getFileTypeClass(message.fileType || 'other')">
                    <div class="file-icon" v-if="!isPreviewable(message.fileType || 'other')">
                      <i :class="getFileIconClass(message.fileType || 'other')"></i>
                    </div>
                    <template v-else-if="message.fileType === 'image'">
                      <img 
                        :src="message.content" 
                        class="preview-image" 
                        @click="previewFile(message.content, message.fileType || 'other')"
                      />
                    </template>
                    <template v-else-if="message.fileType === 'video'">
                      <video 
                        :src="message.content" 
                        class="preview-video" 
                        controls 
                        @click="previewFile(message.content, message.fileType || 'other')"
                      />
                    </template>
                    <template v-else-if="message.fileType === 'audio'">
                      <audio 
                        :src="message.content" 
                        class="preview-audio" 
                        controls
                      />
                    </template>
                    <template v-else-if="message.fileType === 'pdf'">
                      <a 
                        :href="message.content" 
                        target="_blank" 
                        class="file-link"
                      >
                        <i class="el-icon-document"></i>
                        <span>{{ getFileName(message.content) }}</span>
                      </a>
                    </template>
                    <template v-else-if="message.fileType === 'markdown'">
                      <a 
                        :href="message.content" 
                        target="_blank" 
                        class="file-link"
                      >
                        <i class="el-icon-document"></i>
                        <span>{{ getFileName(message.content) }}</span>
                      </a>
                    </template>
                    <a 
                      :href="message.content" 
                      download 
                      class="download-link"
                    >
                      <i class="el-icon-download"></i>
                    </a>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="input-area">
        <div class="input-tools">
          <el-button 
            link 
            @click="triggerFileInput"
            :disabled="!chatStore.isConnected"
          >
            <i class="el-icon-upload"></i>
          </el-button>
          <input 
            ref="fileInput" 
            type="file" 
            multiple 
            style="display: none" 
            @change="handleFileSelect"
          />
        </div>
        <el-input
          v-model="inputMessage"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
          :disabled="!chatStore.isConnected"
        >
          <template #append>
            <el-button 
              type="primary" 
              @click="sendMessage"
              :disabled="!chatStore.isConnected || (!inputMessage.trim() && !uploadingFiles.length)"
            >
              发送
            </el-button>
          </template>
        </el-input>
        <div class="uploading-files" v-if="uploadingFiles.length > 0">
          <div 
            v-for="(file, index) in uploadingFiles" 
            :key="index"
            class="uploading-file-item"
          >
            <span class="file-name">{{ file.name }}</span>
            <el-progress 
              :percentage="file.progress" 
              :stroke-width="6" 
              :show-text="false"
            />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { formatMessageTime } from '@/utils/format'
import { uploadFile } from '@/api/file'

const visible = ref(false)
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const uploadingFiles = ref<Array<{ name: string; progress: number }>>([])

const userStore = useUserStore()
const chatStore = useChatStore()

function openChat() {
  visible.value = true
  chatStore.initialize()
  chatStore.updateReadPosition()
}

function closeChat() {
  visible.value = false
  chatStore.closeConnection()
}

function sendMessage() {
  const content = inputMessage.value.trim()
  if (!content && uploadingFiles.value.length === 0) return
  if (!chatStore.isConnected) return

  if (content) {
    chatStore.sendMessage({
      content,
      type: 'TEXT',
      parentId: 0
    })
    inputMessage.value = ''
  }

  scrollToBottom()
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    uploadingFiles.value.push({ name: file.name, progress: 0 })
    
    try {
      const response = await uploadFile(file, 'chat')
      const apiResponse = response as any
      if (apiResponse.code === 200) {
        const fileUrl = apiResponse.message
        const fileType = getFileType(file.name)
        
        chatStore.sendMessage({
          content: fileUrl,
          type: 'FILE',
          fileType,
          parentId: 0
        })
      }
    } catch (error) {
      console.error('File upload failed:', error)
    } finally {
      const index = uploadingFiles.value.findIndex(item => item.name === file.name)
      if (index !== -1) {
        uploadingFiles.value.splice(index, 1)
      }
    }
  }

  target.value = ''
  scrollToBottom()
}

function getFileType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return 'image'
  } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension || '')) {
    return 'video'
  } else if (['mp3', 'wav', 'ogg', 'flac'].includes(extension || '')) {
    return 'audio'
  } else if (extension === 'pdf') {
    return 'pdf'
  } else if (['md', 'markdown'].includes(extension || '')) {
    return 'markdown'
  } else {
    return 'other'
  }
}

function isPreviewable(fileType: string): boolean {
  return ['image', 'video', 'audio', 'pdf', 'markdown'].includes(fileType)
}

function getFileTypeClass(fileType: string): string {
  return `file-type-${fileType}`
}

function getFileIconClass(fileType: string): string {
  switch (fileType) {
    case 'image':
      return 'el-icon-picture'
    case 'video':
      return 'el-icon-video-camera'
    case 'audio':
      return 'el-icon-microphone'
    case 'pdf':
      return 'el-icon-document'
    case 'markdown':
      return 'el-icon-document'
    default:
      return 'el-icon-document'
  }
}

function getFileName(url: string): string {
  return url.split('/').pop() || ''
}

function previewFile(url: string, fileType: string) {
  if (fileType === 'image' || fileType === 'video') {
    window.open(url, '_blank')
  } else if (fileType === 'pdf' || fileType === 'markdown') {
    window.open(url, '_blank')
  }
}

function handleScroll() {
  const container = messagesContainer.value
  if (!container) return

  // 移除对不存在的属性和方法的引用
}

function scrollToBottom() {
  nextTick(() => {
    const container = messagesContainer.value
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

watch(() => chatStore.messages, () => {
  scrollToBottom()
}, { deep: true })

watch(visible, (newVal) => {
  if (newVal) {
    scrollToBottom()
  }
})

// 只有在用户点击打开聊天室时才初始化

onUnmounted(() => {
  chatStore.closeConnection()
})

defineExpose({
  openChat,
  closeChat
})
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 500px;
  padding: 10px 0;
}

.status-bar {
  padding: 0 10px 10px;
  font-size: 12px;
  color: var(--color-muted);
}

.status-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  font-size: 8px;
  transition: all 0.3s;
}

.status-dot.connected {
  color: var(--color-success);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px;
  margin-bottom: 10px;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  color: var(--color-muted);
  font-size: 12px;
  gap: 6px;
}

.loading-icon {
  font-size: 14px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.message-item {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.message-item.system-message {
  align-items: center;
  margin: 10px 0;
}

.system-content {
  background: var(--color-bg);
  color: var(--color-muted);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
}

.message-item.own-message {
  align-items: flex-end;
}

.message-avatar {
  margin-right: 10px;
  flex-shrink: 0;
}

.message-item.own-message .message-avatar {
  margin-right: 0;
  margin-left: 10px;
  order: 2;
}

.message-content-wrapper {
  max-width: 70%;
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: 10px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-item.own-message .message-content-wrapper {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
}

.sender-name {
  font-weight: 500;
  color: var(--color-title);
}

.message-time {
  color: var(--color-muted);
  margin-left: 8px;
}

.message-content {
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
}

.no-more-message {
  text-align: center;
  padding: 10px 0;
  color: var(--color-muted);
  font-size: 12px;
}

.input-area {
  margin-top: 10px;
  padding: 0 10px;
}

.input-tools {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
}

.uploading-files {
  margin-top: 8px;
}

.uploading-file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--color-muted);
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.file-icon {
  font-size: 24px;
  color: var(--color-muted);
}

.preview-image {
  max-width: 200px;
  max-height: 150px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.2s;
}

.preview-image:hover {
  transform: scale(1.05);
}

.preview-video {
  max-width: 200px;
  max-height: 150px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.preview-audio {
  width: 100%;
  margin-top: 4px;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  text-decoration: none;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.file-link:hover {
  text-decoration: underline;
}

.download-link {
  color: var(--color-muted);
  font-size: 14px;
  margin-left: auto;
}

.download-link:hover {
  color: var(--color-primary);
}

.file-type-other {
  background: var(--color-bg);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-type-image, .file-type-video, .file-type-audio, .file-type-pdf, .file-type-markdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>