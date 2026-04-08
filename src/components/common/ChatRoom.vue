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
        <div v-if="chatStore.isLoading" class="loading-message">
          <el-icon class="loading-icon"><Loading /></el-icon>
          加载历史消息...
        </div>

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
              <div class="message-content">{{ message.content }}</div>
            </div>
          </template>
        </div>

        <div v-if="!chatStore.hasMore && chatStore.messages.length > 0" class="no-more-message">
          没有更多消息了
        </div>
      </div>

      <div class="input-area">
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
              :disabled="!chatStore.isConnected || !inputMessage.trim()"
            >
              发送
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { formatMessageTime } from '@/utils/format'

const visible = ref(false)
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()

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
  if (!content || !chatStore.isConnected) return

  chatStore.sendMessage({
    content,
    type: 'TEXT',
    parentId: 0
  })

  inputMessage.value = ''
  scrollToBottom()
}

function handleScroll() {
  const container = messagesContainer.value
  if (!container) return

  if (container.scrollTop === 0 && chatStore.hasMore && !chatStore.isLoading) {
    chatStore.loadMoreMessages()
  }
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
</style>