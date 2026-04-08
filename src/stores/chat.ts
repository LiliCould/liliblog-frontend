import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getChatMessages } from '@/api/public'
import { getToken } from '@/utils/storage'
import type { ApiResponse } from '@/types/api.d'

interface Message {
  id?: number
  senderId?: number
  senderUsername?: string
  senderName?: string
  senderAvatar?: string
  content: string
  type: string
  parentId?: number
  ipAddress?: string
  createTime?: string
  parentContent?: string
  parentSenderName?: string
}

// 缓存键名
const CACHE_KEY = 'chat_messages_cache'

// 从缓存读取消息
function loadMessagesFromCache(): Message[] {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    console.log('Cache raw data:', cached)
    if (cached) {
      const parsed = JSON.parse(cached)
      console.log('Cache parsed data length:', parsed.length)
      return parsed
    } else {
      console.log('Cache is empty')
    }
  } catch (error) {
    console.error('Failed to load messages from cache:', error)
  }
  return []
}

// 保存消息到缓存
function saveMessagesToCache(messages: Message[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(messages))
  } catch (error) {
    console.error('Failed to save messages to cache:', error)
  }
}

interface SendMessage {
  content: string
  type: string
  parentId: number
  parentContent?: string
  parentSenderName?: string
}

export const useChatStore = defineStore('chat', () => {
  const ws = ref<WebSocket | null>(null)
  const messages = ref<Message[]>([])
  const isConnected = ref(false)
  const unreadCount = ref(0)
  const reconnectTimeout = ref<number | null>(null)
  const isConnecting = ref(false)
  const isInitialized = ref(false)

  // 心跳相关
  let heartbeatTimer: number | null = null
  let missedHeartbeats = 0
  const HEARTBEAT_INTERVAL = 30000 // 30秒发送一次心跳
  const MAX_MISSED_HEARTBEATS = 3 // 最大丢失心跳次数

  // 根据环境变量生成 WebSocket 地址
  const getWsUrl = (): string => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    if (apiBaseUrl) {
      // 将 http:// 或 https:// 替换为 ws:// 或 wss://
      return apiBaseUrl.replace(/^http/, 'ws') + '/ws/chat'
    }
    // 开发环境默认地址
    return 'ws://localhost:8080/ws/chat'
  }
  const wsUrl = ref(getWsUrl())

  const chatMessages = computed(() => {
    return messages.value.filter(msg => msg.type !== 'SYSTEM')
  })

  async function initialize() {
    if (isInitialized.value) {
      return
    }

    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      isInitialized.value = true
      return
    }

    connectWebSocket()
    await loadInitialMessages()
    isInitialized.value = true
  }

  function connectWebSocket() {
    if (isConnecting.value || (ws.value && ws.value.readyState === WebSocket.OPEN)) {
      return
    }

    const token = getToken()
    if (!token) {
      console.log('No token found, cannot connect to WebSocket')
      isConnected.value = false
      return
    }

    try {
      isConnecting.value = true
      const url = `${wsUrl.value}?token=${token}`
      ws.value = new WebSocket(url)

      ws.value.onopen = () => {
        console.log('WebSocket connected')
        isConnected.value = true
        isConnecting.value = false
        if (reconnectTimeout.value) {
          clearTimeout(reconnectTimeout.value)
          reconnectTimeout.value = null
        }
        // 连接成功后启动心跳
        startHeartbeat()
      }

      ws.value.onmessage = (event) => {
        // 处理心跳响应
        if (event.data === 'PONG') {
          missedHeartbeats = 0
          return
        }

        try {
          const message = JSON.parse(event.data) as Message
          // 确保消息按时间顺序添加
          const insertIndex = messages.value.findIndex(msg => {
            const msgTime = new Date(msg.createTime || '').getTime()
            const newMsgTime = new Date(message.createTime || '').getTime()
            return newMsgTime < msgTime
          })

          if (insertIndex === -1) {
            messages.value.push(message)
          } else {
            messages.value.splice(insertIndex, 0, message)
          }
          // 更新缓存
          saveMessagesToCache(messages.value)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.value.onclose = () => {
        console.log('WebSocket disconnected')
        isConnected.value = false
        isConnecting.value = false
        // 断开连接时停止心跳
        stopHeartbeat()
        // 不再自动重连，只有用户点击聊天室进入时才连接
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        isConnected.value = false
        isConnecting.value = false
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      isConnected.value = false
      isConnecting.value = false
    }
  }

  // 不再使用自动重连功能
  // function scheduleReconnect() {
  //   if (reconnectTimeout.value) {
  //     clearTimeout(reconnectTimeout.value)
  //   }
  // 
  //   reconnectTimeout.value = window.setTimeout(() => {
  //     console.log('Attempting to reconnect...')
  //     connectWebSocket()
  //   }, 3000)
  // }

  async function loadInitialMessages() {
    console.log('=== loadInitialMessages start ===')
    try {
      // 先从缓存加载消息作为临时显示
      const cachedMessages = loadMessagesFromCache()
      console.log('Cached messages length:', cachedMessages.length)
      console.log('Cached messages IDs:', cachedMessages.map(m => m.id).filter(id => id))
      
      // 从服务器获取最新消息（不需要传参数，接口会返回七天内的所有消息）
      console.log('Fetching messages from server...')
      const response = await getChatMessages()
      console.log('Server response:', response)
      
      // 注意：由于响应拦截器的处理，response 实际上是 ApiResponse<any[]> 对象
      const apiResponse = response as unknown as ApiResponse<any[]>
      const messageData = apiResponse.data || []
      console.log('Server data length:', messageData.length)
      console.log('Server data IDs:', messageData.map((m: Message) => m.id))
      
      // 按时间正序排序消息（接口返回的是逆序，需要转换为正序）
      const newMessages = Array.isArray(messageData) ? messageData.sort((a: Message, b: Message) => {
        const timeA = new Date(a.createTime || '').getTime()
        const timeB = new Date(b.createTime || '').getTime()
        return timeA - timeB
      }) : []
      
      console.log('Server messages after sort:', newMessages.length, 'items')
      console.log('Server messages after sort IDs:', newMessages.map((m: Message) => m.id))
      
      // 合并服务器数据和缓存数据，确保获取到所有消息
      // 使用 Map 来去重，以消息 ID 为 key
      const messageMap = new Map<number, Message>()
      
      // 先添加服务器返回的消息
      newMessages.forEach(msg => {
        if (msg.id) {
          messageMap.set(msg.id, msg)
        }
      })
      
      // 再添加缓存中的消息（如果服务器没有的话）
      cachedMessages.forEach(msg => {
        if (msg.id && !messageMap.has(msg.id)) {
          messageMap.set(msg.id, msg)
        }
      })
      
      // 转换为数组并按时间排序
      const mergedMessages = Array.from(messageMap.values()).sort((a: Message, b: Message) => {
        const timeA = new Date(a.createTime || '').getTime()
        const timeB = new Date(b.createTime || '').getTime()
        return timeA - timeB
      })
      
      console.log('Merged messages:', mergedMessages.length, 'items')
      console.log('Merged messages IDs:', mergedMessages.map(m => m.id))
      
      // 使用合并后的数据
      messages.value = mergedMessages
      console.log('After setting merged messages, messages.length:', messages.value.length)
      console.log('After setting merged messages, messages IDs:', messages.value.map(m => m.id).filter(id => id))
      
      // 更新缓存
      saveMessagesToCache(mergedMessages)
      
      console.log('Final messages.length:', messages.value.length)
      console.log('Final messages IDs:', messages.value.map(m => m.id).filter(id => id))
    } catch (error) {
      console.error('Failed to load initial messages:', error)
      // 如果从服务器加载失败，使用缓存的消息
      const cachedMessages = loadMessagesFromCache()
      if (cachedMessages.length > 0) {
        console.log('Using cached messages after server error:', cachedMessages.length, 'items')
        console.log('Cached messages IDs:', cachedMessages.map(m => m.id).filter(id => id))
        messages.value = cachedMessages
      } else {
        console.log('No cached messages, setting empty array')
        messages.value = []
      }
    } finally {
      console.log('=== loadInitialMessages end ===')
    }
  }

  function sendMessage(message: SendMessage) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected')
      return
    }

    try {
      ws.value.send(JSON.stringify(message))
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  async function updateReadPosition() {
    // 接口不可用，暂时空实现
    console.log('Update read position not available')
  }

  async function getUnreadCount() {
    // 接口不可用，暂时空实现
    console.log('Get unread count not available')
  }

  // 心跳相关函数
  function startHeartbeat() {
    stopHeartbeat()
    missedHeartbeats = 0
    heartbeatTimer = window.setInterval(() => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        try {
          ws.value.send('PING')
          missedHeartbeats++
          console.log('Heartbeat sent, missed count:', missedHeartbeats)

          // 如果连续丢失多次心跳，认为连接已断开
          if (missedHeartbeats >= MAX_MISSED_HEARTBEATS) {
            console.warn('Connection lost due to heartbeat timeout')
            stopHeartbeat()
            isConnected.value = false
            ws.value.close()
          }
        } catch (error) {
          console.error('Failed to send heartbeat:', error)
        }
      }
    }, HEARTBEAT_INTERVAL)
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
    missedHeartbeats = 0
  }

  function closeConnection() {
    // 停止心跳
    stopHeartbeat()

    if (ws.value) {
      ws.value.close()
      ws.value = null
    }

    if (reconnectTimeout.value) {
      clearTimeout(reconnectTimeout.value)
      reconnectTimeout.value = null
    }

    isConnected.value = false
    isConnecting.value = false
    isInitialized.value = false
  }

  return {
    messages,
    chatMessages,
    isConnected,
    unreadCount,
    initialize,
    sendMessage,
    updateReadPosition,
    getUnreadCount,
    closeConnection
  }
})
