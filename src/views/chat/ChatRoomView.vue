<template>
  <div class="chat-room-view">
    <AppHeader />
    <div class="chat-room-container">
      <div class="chat-room-header">
        <h1 class="chat-room-title">立里聊天室</h1>
        <div class="status-bar">
          <div class="online-count-mobile" @click="showOnlineMembers = !showOnlineMembers">
            <el-icon><UserFilled /></el-icon>
            <span class="count-value">{{ chatStore.onlineUsers.length }}</span>
          </div>
          <span class="status-text">
            <el-icon :class="{ 'connected': chatStore.isConnected }" class="status-icon">
              <Connection v-if="chatStore.isConnected" />
              <CircleClose v-else />
            </el-icon>
            {{ chatStore.isConnected ? '已连接' : '连接中...' }}
          </span>
        </div>
      </div>

      <div class="chat-room-content">
        <!-- PC 侧边栏：在线人数和在线用户 -->
        <div class="chat-sidebar pc-only">
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <el-icon><UserFilled /></el-icon>
              在线用户
            </h3>
            <div class="online-count">
              <span class="count-label">在线人数：</span>
              <span class="count-value">{{ chatStore.onlineUsers.length }}</span>
            </div>
            <div class="user-list">
              <div v-for="user in chatStore.onlineUsers" :key="user.id" class="user-item">
                <el-avatar :size="32" :src="user.avatar || 'https://lilicould.cn/xiaodingdang.png'">
                  {{ user.nickname?.charAt(0) || 'U' }}
                </el-avatar>
                <span class="user-name">{{ user.nickname }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动端侧边抽屉 -->
        <el-drawer
          v-model="showOnlineMembers"
          title="在线用户"
          direction="rtl"
          size="280px"
          custom-class="mobile-online-drawer"
        >
          <div class="online-count">
            <span class="count-label">在线人数：</span>
            <span class="count-value">{{ chatStore.onlineUsers.length }}</span>
          </div>
          <div class="user-list">
            <div v-for="user in chatStore.onlineUsers" :key="user.id" class="user-item">
              <el-avatar :size="32" :src="user.avatar || 'https://lilicould.cn/xiaodingdang.png'">
                {{ user.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="user-name">{{ user.nickname }}</span>
            </div>
          </div>
        </el-drawer>

        <!-- 消息区域 -->
        <div class="chat-main">
          <div class="messages-container" ref="messagesContainer">
            <div v-for="message in chatStore.messages" :key="message.id || message.content" class="message-item" :class="{
              'system-message': message.type === 'SYSTEM',
              'own-message': message.senderUsername === userStore.username
            }" @contextmenu.prevent="startReply(message)" @touchstart="touchStart($event, message)"
              @touchend="touchEnd">
              <div v-if="message.type !== 'SYSTEM'" class="message-avatar">
                <el-avatar :size="36" :src="message.senderAvatar || 'https://lilicould.cn/xiaodingdang.png'">
                  {{ message.senderName?.charAt(0) || 'U' }}
                </el-avatar>
              </div>

              <div v-if="message.type === 'SYSTEM'" class="system-content">
                {{ message.content }}
              </div>
              <div v-else class="message-body">
                <div class="message-info">
                  <span class="sender-name">{{ message.senderName }}</span>
                  <span class="message-time">{{ formatMessageTime(message.createTime) }}</span>
                </div>
                
                <div class="message-content-wrapper">
                  <div v-if="(message.parentId ?? 0) > 0" class="message-quote">
                    <span class="quote-name">{{ message.parentSenderName || '用户' }}</span>
                    <div class="quote-content">
                      <template v-if="getUrlType(message.parentContent) === 'IMAGE'">
                        <el-image 
                          :src="message.parentContent" 
                          :preview-src-list="message.parentContent ? [message.parentContent] : []"
                          preview-teleported
                          fit="cover"
                          class="quote-thumb"
                        />
                      </template>
                      <template v-else-if="getUrlType(message.parentContent) === 'VIDEO'">
                        <div class="quote-file-mini" @click="previewFile(message.parentContent)">
                          <el-icon><VideoCamera /></el-icon>
                          <span>视频消息</span>
                        </div>
                      </template>
                      <template v-else-if="getUrlType(message.parentContent) === 'AUDIO'">
                        <div class="quote-file-mini" @click="previewFile(message.parentContent)">
                          <el-icon><Microphone /></el-icon>
                          <span>音频消息</span>
                        </div>
                      </template>
                      <template v-else-if="getUrlType(message.parentContent) === 'FILE'">
                        <div class="quote-file-mini" @click="previewFile(message.parentContent)">
                          <el-icon><Document /></el-icon>
                          <span>{{ getFileName(message.parentContent) }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <span>{{ message.parentContent || '引用内容被删除或尚未加载' }}</span>
                      </template>
                    </div>
                  </div>
                  
                  <!-- 文字消息 -->
                  <div v-if="getDisplayType(message) === 'TEXT'" class="message-content text-bubble">
                    {{ message.content }}
                  </div>
                  
                  <!-- 图片消息 -->
                  <div v-else-if="getDisplayType(message) === 'IMAGE'" class="message-content image-content">
                    <el-image 
                      :src="message.content" 
                      :preview-src-list="[message.content]"
                      preview-teleported
                      fit="cover"
                      class="chat-image"
                    />
                  </div>
                  
                  <!-- 视频消息 -->
                  <div v-else-if="getDisplayType(message) === 'VIDEO'" class="message-content video-content">
                    <video :src="message.content" controls class="chat-video"></video>
                  </div>
                  
                  <!-- 音频消息 -->
                  <div v-else-if="getDisplayType(message) === 'AUDIO'" class="message-content audio-content">
                    <audio :src="message.content" controls class="chat-audio"></audio>
                  </div>
                  
                  <!-- 文件消息 (QQ风格卡片) -->
                  <div v-else class="message-content file-card">
                    <div class="file-info">
                      <div class="file-icon-wrapper">
                        <el-icon :size="32" color="#409EFE"><Document /></el-icon>
                      </div>
                      <div class="file-details">
                        <div class="file-name-text">{{ getFileName(message.content) }}</div>
                        <div class="file-type-text">{{ getFileType(message.content) }}</div>
                      </div>
                    </div>
                    <div class="file-actions">
                      <el-button type="primary" link @click="previewFile(message.content)">预览</el-button>
                      <el-divider direction="vertical" />
                      <a :href="message.content" :download="getFileName(message.content)" class="download-btn">
                        <el-icon :size="16"><Download /></el-icon>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 回到底部按钮 -->
          <el-button v-if="showScrollToBottomButton" type="primary" circle class="scroll-to-bottom-button"
            @click="scrollToBottom" :title="'回到底部'">
            ↓
          </el-button>

          <!-- 输入区域 -->
          <div class="input-area" :class="{ 'replying': isReplying }">
            <!-- 回复状态 -->
            <div v-if="isReplying && replyToMessage" class="reply-status">
              <div class="reply-header">
                <span class="reply-label">回复：</span>
                <span class="reply-name">{{ replyToMessage.senderName }}</span>
                <el-button type="text" size="small" @click="cancelReply" class="cancel-reply">
                  ×
                </el-button>
              </div>
              <div class="reply-content">{{ replyToMessage.content.length > 50 ? replyToMessage.content.substring(0, 50)
                + '...' : replyToMessage.content }}</div>
            </div>

            <!-- 选中文件展示 -->
            <div v-if="selectedFile" class="selected-file-info">
              <div class="file-item">
                <el-icon><Document /></el-icon>
                <span class="file-name">{{ selectedFile.name }}</span>
                <el-button type="text" @click="cancelFileSelection" class="cancel-file">
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </div>

            <el-input 
              v-model="inputMessage" 
              type="textarea" 
              :autosize="{ minRows: 3, maxRows: 8 }"
              :placeholder="inputPlaceholder" 
              @keyup.enter.exact.prevent="sendMessage"
              @paste="handlePaste"
              :disabled="!chatStore.isConnected || isUploading || !!selectedFile" 
              class="message-input"
              resize="none"
              :class="{ 'has-content': inputMessage.trim() || selectedFile, 'replying': isReplying, 'disconnected': !chatStore.isConnected }"
            />
            
            <div class="input-actions-row">
              <!-- 工具栏 -->
              <div class="input-toolbar">
                <div class="tool-left">
                  <el-popover placement="top-start" :width="280" trigger="click" popper-class="emoji-popover">
                    <template #reference>
                      <el-button type="text" class="tool-btn"><el-icon><ChatDotRound /></el-icon></el-button>
                    </template>
                    <div class="emoji-picker">
                      <span v-for="emoji in emojiList" :key="emoji" class="emoji-item" @click="addEmoji(emoji)">
                        {{ emoji }}
                      </span>
                    </div>
                  </el-popover>
                  
                  <el-button type="text" class="tool-btn" @click="triggerFileInput('IMAGE')"><el-icon><Picture /></el-icon></el-button>
                  <el-button type="text" class="tool-btn" @click="triggerFileInput('VIDEO')"><el-icon><VideoCamera /></el-icon></el-button>
                  <el-button type="text" class="tool-btn" @click="triggerFileInput('AUDIO')"><el-icon><Microphone /></el-icon></el-button>
                  <el-button type="text" class="tool-btn" @click="triggerFileInput('FILE')"><el-icon><Folder /></el-icon></el-button>
                  
                  <input 
                    ref="fileInputRef" 
                    type="file" 
                    :accept="fileAccept"
                    style="display: none" 
                    @change="handleFileSelect"
                  />
                </div>
              </div>

              <div class="input-footer">
                <el-button 
                  type="primary" 
                  @click="sendMessage"
                  :disabled="!chatStore.isConnected || (!inputMessage.trim() && !selectedFile) || isUploading" 
                  class="send-button"
                  :loading="isUploading"
                  :class="{ 'can-send': chatStore.isConnected && (inputMessage.trim() || selectedFile) }"
                >
                  {{ isUploading ? '上传中...' : '发送' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MobileNav />

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewDialogVisible" title="文件预览" width="85%" class="preview-dialog" destroy-on-close>
      <div class="preview-container">
        <VueOfficeDocx v-if="previewType === 'DOCX'" :src="previewUrl" />
        <VueOfficeExcel v-if="previewType === 'XLSX'" :src="previewUrl" />
        <VueOfficePdf v-if="previewType === 'PDF'" :src="previewUrl" />
        <VueOfficePptx v-if="previewType === 'PPTX'" :src="previewUrl" />
        <MdPreview v-if="previewType === 'MD'" :modelValue="markdownContent" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Picture, VideoCamera, Microphone, Document, Download, Close, Folder, UserFilled, Connection, ChatDotRound, CircleClose } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { formatMessageTime } from '@/utils/format'
import { uploadFile } from '@/api/file'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import { ElMessage } from 'element-plus'

// vue-office components
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePdf from '@vue-office/pdf'
import VueOfficePptx from '@vue-office/pptx'
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'

// Markdown preview
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const messagesContainer = ref<HTMLElement>()
const inputMessage = ref('')

// 回复相关状态
const isReplying = ref(false)
const replyToMessage = ref<any>(null)
let touchTimer: number | null = null

// 滚动相关状态
const showScrollToBottomButton = ref(false)

// 在线成员窗口控制
const showOnlineMembers = ref(false)

const userStore = useUserStore()
const chatStore = useChatStore()

// 文件上传相关
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFileType = ref<'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE'>('IMAGE')
const isUploading = ref(false)
const selectedFile = ref<File | null>(null)

const fileAccept = computed(() => {
  switch (selectedFileType.value) {
    case 'IMAGE': return 'image/*'
    case 'VIDEO': return 'video/*'
    case 'AUDIO': return 'audio/*'
    default: return '*'
  }
})

function getDisplayType(message: any): string {
  if (message.type === 'SYSTEM') return 'SYSTEM'
  if (message.type === 'TEXT') return 'TEXT'
  
  // 综合考虑 message.type 和 后缀名
  const url = message.content
  return getUrlType(url) || message.type || 'FILE'
}

function getUrlType(url?: string): string {
  if (!url) return ''
  
  // 只有以 http 或 https 开头的才认为是 URL 并尝试解析类型
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return ''
  }

  const extension = url.split('.').pop()?.toLowerCase() || ''
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'IMAGE'
  if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) return 'VIDEO'
  if (['mp3', 'wav', 'flac'].includes(extension)) return 'AUDIO'
  if (['pdf', 'docx', 'xlsx', 'pptx', 'md'].includes(extension)) return 'FILE'
  
  return 'FILE'
}

// 预览相关
const previewDialogVisible = ref(false)
const previewUrl = ref('')
const previewType = ref('')
const markdownContent = ref('')

// 表情列表
const emojiList = ['😊', '😂', '🤣', '😍', '😒', '😘', '😁', '😉', '🙌', '👍', '🌹', '🎉', '🔥', '✨', '🎈', '🎁', '🎂', '🌈', '🍦', '🍓', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵']

// 输入框提示词计算
const inputPlaceholder = computed(() => {
  if (!userStore.isLoggedIn) {
    return '登录后才可加入聊天室'
  }

  if (!chatStore.isConnected) {
    if (isReplying.value) {
      return `回复 ${replyToMessage.value?.senderName}...`
    }
    if (inputMessage.value.trim()) {
      return '输入消息...'
    }
    return '已断开连接，请尝试刷新处理'
  }

  if (selectedFile.value) {
    return '已选中文件，点击发送上传'
  }

  if (isReplying.value) {
    return `回复 ${replyToMessage.value?.senderName}...`
  }
  return '输入消息...'
})

function touchStart(_event: TouchEvent, message: any) {
  // 移除 preventDefault，否则会阻止移动端滚动
  touchTimer = window.setTimeout(() => {
    startReply(message)
  }, 500) as unknown as number
}

function touchEnd(_event: TouchEvent) {
  // 移除 preventDefault，确保点击和滚动正常
  if (touchTimer) {
    clearTimeout(touchTimer)
    touchTimer = null
  }
}

function startReply(message: any) {
  isReplying.value = true
  replyToMessage.value = message
  // 聚焦到输入框
  nextTick(() => {
    const textareaElement = document.querySelector('.message-input textarea') as HTMLTextAreaElement
    if (textareaElement) {
      textareaElement.focus()
    }
  })
}

function cancelReply() {
  isReplying.value = false
  replyToMessage.value = null
  inputMessage.value = ''
}

// 文件处理方法
function triggerFileInput(type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE') {
  if (!chatStore.isConnected) return
  selectedFileType.value = type
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const file = files[0]
  selectedFile.value = file
  inputMessage.value = '' // 选中文件后清空文字
  target.value = ''
}

function handlePaste(event: ClipboardEvent) {
  if (!chatStore.isConnected || isUploading.value || !!selectedFile.value) return

  const items = event.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile()
      if (file) {
        selectedFile.value = file
        selectedFileType.value = 'IMAGE'
        inputMessage.value = '' // 选中图片后清空文字
        ElMessage.success('已从剪切板获取图片')
        event.preventDefault() // 阻止默认的文字粘贴行为
        break
      }
    }
  }
}

function cancelFileSelection() {
  selectedFile.value = null
}

function getFileType(url?: string): string {
  if (!url) return 'FILE'
  const extension = url.split('.').pop()?.toLowerCase() || ''
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'IMAGE'
  if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) return 'VIDEO'
  if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) return 'AUDIO'
  
  // 对于不可直接预览的文件，也返回大写的后缀名作为类型显示
  return extension.toUpperCase() || 'FILE'
}

function getFileName(url?: string): string {
  if (!url) return '未知文件'
  return url.split('/').pop() || '未知文件'
}

function addEmoji(emoji: string) {
  if (selectedFile.value) {
    ElMessage.warning('选中文件后不可发送文字消息')
    return
  }
  inputMessage.value += emoji
}

async function previewFile(url?: string) {
  if (!url) return
  const type = getFileType(url)
  if (['PDF', 'DOCX', 'XLSX', 'PPTX'].includes(type)) {
    previewUrl.value = url
    previewType.value = type
    previewDialogVisible.value = true
  } else if (type === 'MD') {
    try {
      const response = await fetch(url)
      markdownContent.value = await response.text()
      previewType.value = 'MD'
      previewDialogVisible.value = true
    } catch (error) {
      console.error('Failed to fetch markdown content:', error)
      ElMessage.error('获取 Markdown 内容失败')
    }
  } else if (type === 'IMAGE' || type === 'VIDEO' || type === 'AUDIO') {
    window.open(url, '_blank')
  } else {
    window.open(url, '_blank')
  }
}

async function sendMessage() {
  if (!chatStore.isConnected) return

  const commonData: any = {
    parentId: isReplying.value && replyToMessage.value ? replyToMessage.value.id : 0
  }

  // 添加引用信息，确保前端能够显示引用内容
  if (isReplying.value && replyToMessage.value) {
    commonData.parentContent = replyToMessage.value.content
    commonData.parentSenderName = replyToMessage.value.senderName
  }

  if (selectedFile.value) {
    isUploading.value = true
    try {
      const response = await uploadFile(selectedFile.value, 'chat')
      const apiResponse = response as any
      if (apiResponse.code === 200) {
        const fileUrl = apiResponse.message
        const messageData: any = {
          ...commonData,
          content: fileUrl,
          type: selectedFileType.value
        }
        
        chatStore.sendMessage(messageData)
        selectedFile.value = null
        isReplying.value = false
        replyToMessage.value = null
      }
    } catch (error) {
      console.error('File upload failed:', error)
      ElMessage.error('文件上传失败')
    } finally {
      isUploading.value = false
    }
  } else {
    const content = inputMessage.value.trim()
    if (!content) return

    const messageData: any = {
      ...commonData,
      content,
      type: 'TEXT'
    }

    chatStore.sendMessage(messageData)
    inputMessage.value = ''
    isReplying.value = false
    replyToMessage.value = null
  }
  
  scrollToBottom()
}

// 处理滚动事件
function handleScroll() {
  const container = messagesContainer.value
  if (!container) return

  // 检测是否需要显示回到底部按钮
  const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
  showScrollToBottomButton.value = !isNearBottom
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    const container = messagesContainer.value
    if (container) {
      container.scrollTop = container.scrollHeight
      showScrollToBottomButton.value = false
    }
  })
}

// 处理消息的引用信息
function processMessageReferences(messages: any[]) {
  // 创建消息ID到消息对象的映射
  const messageMap = new Map()
  messages.forEach(msg => {
    if (msg.id) {
      messageMap.set(msg.id, msg)
    }
  })

  // 为每条有parentId的消息添加引用信息
  messages.forEach(msg => {
    if (msg.parentId > 0 && !msg.parentContent) {
      const parentMsg = messageMap.get(msg.parentId)
      if (parentMsg) {
        msg.parentContent = parentMsg.content
        msg.parentSenderName = parentMsg.senderName
      }
    }
  })
}

// 监听消息变化，处理引用信息
watch(() => chatStore.messages, (newMessages) => {
  if (newMessages && newMessages.length > 0) {
    processMessageReferences(newMessages)
  }
}, { deep: true })

// 监听新消息，自动滚动到底部
watch(() => chatStore.messages.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    scrollToBottom()
  }
})

// 初始化聊天房间
onMounted(async () => {
  // 禁用浏览器自动恢复滚动位置，防止 F5 刷新后跳到顶部
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }

  // 等待初始化完全完成（包括缓存加载 + 服务器请求）
  await chatStore.initialize()
  chatStore.updateReadPosition()



  // 处理引用信息并滚动到底部（确保在初始化完成后执行）
  nextTick(() => {
    if (chatStore.messages && chatStore.messages.length > 0) {
      processMessageReferences(chatStore.messages)
    }
    scrollToBottom()
  })

  // 添加滚动事件监听器
  const container = messagesContainer.value
  if (container) {
    container.addEventListener('scroll', handleScroll)
  }
})

// 清理滚动事件监听器
onUnmounted(() => {
  chatStore.closeConnection()
  const container = messagesContainer.value
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style>
/* 全局样式，用于处理 Teleport 后的弹出框 */
.emoji-popover {
  padding: 0 !important;
  border-radius: 12px !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-lg) !important;
}

.preview-dialog {
  max-width: 1200px;
}

@media (max-width: 768px) {
  .preview-dialog {
    width: 95% !important;
    margin-top: 5vh !important;
  }
}

.preview-container {
  min-height: 400px;
  max-height: 75vh;
  overflow: auto; /* 允许横向滚动如果内容太宽 */
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
}

.preview-container > * {
  min-width: 100%;
  flex: 1;
}

.emoji-picker {
  display: grid;
  grid-template-columns: repeat(6, 40px);
  justify-content: center;
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px 12px 12px;
  box-sizing: border-box;
}

.emoji-picker::-webkit-scrollbar {
  width: 4px;
}

.emoji-picker::-webkit-scrollbar-track {
  background: transparent;
}

.emoji-picker::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.emoji-item {
  font-size: 22px;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
  height: 40px;
  width: 40px;
  border-radius: 8px;
  transition: all 0.2s;
  user-select: none;
}

.emoji-item:hover {
  background: var(--color-primary-light);
  transform: scale(1.1);
}
</style>

<style scoped>
.chat-room-view {
  min-height: 100vh;
  height: 100vh;
  background: #fafafa;
  font-family: var(--font-family);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-room-container {
  flex: 1;
  padding: 12px;
  padding-top: calc(24px + var(--header-height)); /* 增加间距以防重叠 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .chat-room-container {
    padding: 8px;
    padding-top: calc(40px + var(--header-height)); /* 移动端增加更多间距 */
  }
  
  .chat-room-header {
    padding: 10px 16px;
    margin-bottom: 8px;
  }
}

.chat-room-header {
  margin-bottom: 12px;
  padding: 14px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--color-border);
  position: relative;
  z-index: 10;
}

.chat-room-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-title);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-room-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 14px;
  background: var(--color-primary);
  border-radius: 2px;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.online-count-mobile {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 13px;
  cursor: pointer;
  border: 1px solid var(--color-primary-light-2);
}

.status-text {
  font-size: 13px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  font-size: 14px;
  color: var(--color-muted);
}

.status-icon.connected {
  color: #67C23A; /* 使用更柔和的成功绿色 */
}

.chat-room-content {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.chat-sidebar {
  width: 240px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 105, 180, 0.1);
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #ff69b4;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 105, 180, 0.2);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
}

.online-count {
  margin-bottom: 12px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.count-value {
  font-weight: 600;
  color: #ff69b4;
  background: rgba(255, 105, 180, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
  border: 1px solid rgba(255, 105, 180, 0.3);
}

.online-users {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.online-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 105, 180, 0.1);
}

.online-user:hover {
  background: rgba(255, 105, 180, 0.05);
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.1);
}

.user-avatar {
  transition: all 0.3s;
  border: 2px solid rgba(255, 105, 180, 0.2);
}

.online-user:hover .user-avatar {
  transform: scale(1.1) rotate(5deg);
  border-color: rgba(255, 105, 180, 0.5);
}

.user-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  flex: 1;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
}

.no-online-users {
  font-size: 13px;
  color: #999;
  text-align: center;
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px dashed rgba(255, 105, 180, 0.2);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 105, 180, 0.1);
  min-height: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
  background-color: rgba(255, 255, 255, 0.9);
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(255, 105, 180, 0.3);
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 105, 180, 0.5);
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  color: #666;
  font-size: 13px;
  gap: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.loading-icon {
  font-size: 14px;
  animation: spin 1s linear infinite;
  color: #ff69b4;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.message-item {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item.system-message {
  align-items: center;
  margin: 16px 0;
  justify-content: center;
}

.system-content {
  background: rgba(0, 0, 0, 0.05);
  color: #999;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  text-align: center;
}

.message-item.own-message {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  border-radius: 8px;
  overflow: hidden;
}

.message-body {
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 100px);
}

.message-item.own-message .message-body {
  align-items: flex-end;
}

.message-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--color-muted);
}

.message-item.own-message .message-info {
  flex-direction: row-reverse;
}

.sender-name {
  font-weight: 500;
  color: #666;
}

.message-time {
  font-size: 11px;
  opacity: 0.8;
}

.message-content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.message-item.own-message .message-content-wrapper {
  align-items: flex-end;
}

.text-bubble {
  background: white;
  padding: 10px 14px;
  border-radius: 4px 16px 16px 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
  word-break: break-word;
  white-space: pre-wrap;
  display: inline-block; /* 修复短消息撑满一行的问题 */
  width: fit-content;
}

.message-item.own-message .text-bubble {
  background: var(--color-primary-light);
  border-color: var(--color-primary-light-2);
  border-radius: 16px 4px 16px 16px;
  color: var(--color-primary);
  text-align: left;
}

/* 媒体内容样式 */
.image-content, .video-content, .audio-content {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.chat-image {
  max-width: 100%;
  max-height: 300px;
  display: block;
  cursor: zoom-in;
}

.chat-video {
  max-width: 100%;
  max-height: 300px;
  display: block;
}

.chat-audio {
  max-width: 100%;
}

/* 文件卡片 微信风格优化 */
.file-card {
  width: 280px;
  max-width: 100%;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-sm);
}

.message-item.own-message .file-card {
  border-color: var(--color-primary-light-2);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon-wrapper {
  width: 48px;
  height: 48px;
  background: var(--color-primary-light);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

.file-details {
  flex: 1;
  overflow: hidden;
}

.file-name-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-title);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-type-text {
  font-size: 12px;
  color: var(--color-muted);
  margin-top: 2px;
}

.file-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
  padding-top: 8px;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
}

.download-btn:hover {
  background: var(--color-primary);
  color: white;
}

/* 引用效果 */
.message-quote {
  margin-bottom: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.03);
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-item.own-message .message-quote {
  border-left: none;
  border-right: 3px solid var(--color-primary);
  align-items: flex-end;
}

.quote-name {
  font-weight: 600;
  color: var(--color-primary);
}

.quote-content {
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-item.own-message .quote-content {
  flex-direction: row-reverse;
}

.quote-thumb {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  cursor: zoom-in;
  border: 1px solid var(--color-border);
}

.quote-file-mini {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--color-border);
  transition: all 0.2s;
  font-size: 11px;
}

.quote-file-mini:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 响应式设计补全 */
@media (max-width: 768px) {
  .pc-only {
    display: none !important;
  }

  .chat-sidebar {
    display: none;
  }

  .mobile-online-drawer .user-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
  }

  .mobile-online-drawer .user-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mobile-online-drawer .user-name {
    font-size: 14px;
    color: var(--color-text);
  }

  .chat-main {
    border-radius: 0;
    box-shadow: none;
    border: none;
  }

  .messages-container {
    padding: 12px;
    -webkit-overflow-scrolling: touch; /* 优化 iOS 滚动 */
    overflow-y: auto;
    height: 100%;
  }

  .message-body {
    max-width: calc(100% - 60px);
  }

  .file-card {
    width: 100%;
  }

  .text-bubble {
    font-size: 15px; /* 移动端文字稍大 */
    padding: 8px 12px;
  }
}

/* 回复菜单 */
.reply-menu {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 4px;
  min-width: 80px;
}

/* 回复状态 */
.reply-status {
  padding: 10px 12px;
  background: rgba(255, 105, 180, 0.1);
  border-radius: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  border: 1px solid rgba(255, 105, 180, 0.2);
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.reply-label {
  color: #666;
}

.reply-name {
  font-weight: 600;
  color: #ff69b4;
  flex: 1;
}

.reply-content {
  color: #666;
  line-height: 1.4;
  word-break: break-word;
  padding-left: 20px;
  border-left: 2px solid rgba(255, 105, 180, 0.3);
  margin-top: 4px;
}

.cancel-reply {
  color: #999;
  padding: 0;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
}

.cancel-reply:hover {
  color: #ff69b4;
}

.input-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-top: 1px solid rgba(255, 105, 180, 0.2);
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
  color: #ff69b4;
  font-weight: 500;
}

.input-toggle:hover {
  background: rgba(255, 105, 180, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(255, 105, 180, 0.1);
}

.input-area {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background: white;
  transition: all 0.3s ease;
  position: relative;
}

/* 消息内容类型样式 */
.image-content {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
}

.chat-image {
  max-width: 240px;
  max-height: 240px;
  border-radius: 8px;
  cursor: zoom-in;
  display: block;
  border: 1px solid var(--color-border);
}

.chat-video {
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  display: block;
  border: 1px solid var(--color-border);
}

.chat-audio {
  max-width: 250px;
  height: 40px;
}

/* 文件卡片 QQ风格 */
.file-card {
  width: 280px;
  background: white !important;
  border-radius: 12px;
  border: 1px solid var(--color-border) !important;
  padding: 12px !important;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-sm);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon-wrapper {
  width: 44px;
  height: 44px;
  background: var(--color-primary-light);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.file-details {
  flex: 1;
  overflow: hidden;
}

.file-name-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-title);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-type-text {
  font-size: 12px;
  color: var(--color-muted);
  margin-top: 2px;
}

.file-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
  padding-top: 8px;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
}

.download-btn:hover {
  background: var(--color-primary);
  color: white;
}

/* 输入区域增强 */
.selected-file-info {
  margin-bottom: 12px;
  padding: 10px 14px;
  background: var(--color-primary-light);
  border-radius: 8px;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-primary-light-2);
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  color: var(--color-primary);
}

.file-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cancel-file {
  padding: 0;
  color: var(--color-primary);
  opacity: 0.7;
}

.cancel-file:hover {
  opacity: 1;
}

.input-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.tool-btn {
  font-size: 18px;
  color: var(--color-muted);
  padding: 6px;
  transition: all 0.2s;
  border-radius: 6px;
}

.tool-btn:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.emoji-btn {
  font-size: 18px;
  line-height: 1;
}

.input-footer {
  display: flex;
  justify-content: flex-end;
}

.message-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  background: #fafafa;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.2s;
}

.message-input :deep(.el-textarea__inner:focus) {
  border-color: var(--color-primary);
  background: white;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.send-button {
  border-radius: 24px;
  padding: 0 24px;
  height: 36px;
  font-weight: 500;
  border: none;
  background: #f0f0f0;
  color: #999;
  transition: all 0.3s;
}

.send-button.can-send {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.send-button.can-send:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .chat-sidebar {
    width: 200px;
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .chat-room-view {
    padding: 0;
  }

  .chat-room-container {
    padding: 10px;
  }

  .chat-room-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
    padding: 10px 12px;
  }

  .chat-room-title {
    font-size: 18px;
  }

  .chat-room-content {
    flex-direction: column;
    flex: 1;
    gap: 12px;
  }

  .chat-sidebar {
    display: none;
    position: fixed;
    top: calc(var(--header-height) + 20px);
    right: 20px;
    width: 200px;
    max-height: 300px;
    z-index: 1000;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    padding: 12px;
    overflow-y: auto;
  }

  .chat-sidebar.show-mobile {
    display: block;
  }

  .online-count-mobile {
    display: flex;
  }

  .chat-room-header {
    padding: 10px 12px;
  }

  .chat-room-title {
    font-size: 18px;
  }

  .sidebar-title {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .online-user {
    padding: 6px 8px;
  }

  .chat-main {
    flex: 1;
  }

  .messages-container {
    padding: 16px;
  }

  .message-item {
    margin-bottom: 12px;
    gap: 8px;
  }

  .message-avatar {
    size: 32px;
  }

  .message-content-wrapper {
    max-width: 75%;
    padding: 8px 12px;
  }

  .input-area {
    padding: 12px 16px;
  }

  .send-button {
    min-width: 70px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .chat-room-title {
    font-size: 16px;
  }

  .chat-sidebar {
    height: 120px;
  }

  .message-content-wrapper {
    max-width: 80%;
  }

  .messages-container {
    padding: 12px;
  }

  .scroll-to-bottom-button {
    bottom: 80px;
    right: 16px;
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
}

/* 回到底部按钮样式 */
.scroll-to-bottom-button {
  position: fixed;
  bottom: 220px;
  right: 32px;
  width: 44px;
  height: 44px;
  font-size: 16px;
  z-index: 100;
  background: white;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.scroll-to-bottom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  background: var(--color-primary-light);
}

.scroll-to-bottom-button:active {
  transform: translateY(0);
}
</style>