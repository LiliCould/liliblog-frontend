import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getChatMessages } from '@/api/public'
import { getToken, getUserInfo } from '@/utils/storage'
import type { ApiResponse } from '@/types/api.d'
import type { LoginVO } from '@/types/auth.d'

interface Message {
  id?: number
  senderId?: number
  senderUsername?: string
  senderName?: string
  senderAvatar?: string
  content: string
  type: string
  fileType?: string
  parentId?: number
  ipAddress?: string
  createTime?: string
  parentContent?: string
  parentSenderName?: string
}

// 缓存键名
const CACHE_KEY = 'chat_messages_cache'
const LAST_READ_ID_KEY = 'chat_last_read_id'

// 从缓存读取消息
function loadMessagesFromCache(): Message[] {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      return JSON.parse(cached)
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

// 获取最后阅读的消息 ID
function getLastReadId(): number {
  const id = localStorage.getItem(LAST_READ_ID_KEY)
  return id ? parseInt(id) : 0
}

// 保存最后阅读的消息 ID
function saveLastReadId(id: number) {
  localStorage.setItem(LAST_READ_ID_KEY, id.toString())
}

interface SendMessage {
  content: string
  type: string
  fileType?: string
  parentId: number
  parentContent?: string
  parentSenderName?: string
}

export const useChatStore = defineStore('chat', () => {
  const ws = ref<WebSocket | null>(null)
  const messages = ref<Message[]>([])
  const onlineUsers = ref<any[]>([])
  const isConnected = ref(false)
  const unreadCount = ref(0)
  const lastReadId = ref(getLastReadId())
  const reconnectTimeout = ref<number | null>(null)
  const isConnecting = ref(false)
  const isInitialized = ref(false)
  const isChatRoomActive = ref(false)

  // 音频提示音对象（延迟加载）
  let dingAudio: HTMLAudioElement | null = null

  // 心跳相关
  let heartbeatTimer: number | null = null
  let missedHeartbeats = 0
  const HEARTBEAT_INTERVAL = 30000 // 30秒发送一次心跳
  const MAX_MISSED_HEARTBEATS = 3 // 最大丢失心跳次数

  // 获取音频对象
  const getDingAudio = () => {
    if (!dingAudio) {
      // 优先尝试绝对路径，其次尝试 Vite 提供的相对路径
      const audioUrl = new URL('/ding.wav', window.location.origin).href
      dingAudio = new Audio(audioUrl)
      
      // 添加详细状态监听，排查 NotSupportedError
      dingAudio.addEventListener('error', () => {
        const error = dingAudio?.error
        console.error('音频文件加载失败:', {
          url: audioUrl,
          code: error?.code, // 1: MEDIA_ERR_ABORTED, 2: MEDIA_ERR_NETWORK, 3: MEDIA_ERR_DECODE, 4: MEDIA_ERR_SRC_NOT_SUPPORTED
          message: error?.message,
          networkState: dingAudio?.networkState, // 3 代表网络错误/404
          readyState: dingAudio?.readyState
        })
      })
      
      // 预加载
      dingAudio.load()
    }
    return dingAudio
  }

  // 播放备用提示音（当 ding.wav 加载失败时）
  const playFallbackBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // A5 note
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)

      oscillator.start(audioCtx.currentTime)
      oscillator.stop(audioCtx.currentTime + 0.5)
      console.log('播放备用合成音成功')
    } catch (e) {
      console.warn('播放备用合成音失败:', e)
    }
  }

  // 播放提示音
  const playDing = () => {
    const audio = getDingAudio()
    
    // 如果音频文件确定不可用（网络状态为3且未就绪），直接尝试备用音
    if (audio.networkState === 3 || (audio.error && audio.error.code === 4)) {
      console.warn('音频文件不可用，尝试播放备用音')
      playFallbackBeep()
      return
    }

    audio.pause()
    audio.currentTime = 0
    audio.play().catch(e => {
      console.warn('音频播放被阻止或失败（可能是浏览器限制，需要用户点击页面）：', e)
      // 如果不是因为权限问题（NotAllowedError），尝试播放备用音
      if (e.name !== 'NotAllowedError') {
        playFallbackBeep()
      }
    })
  }

  // 尝试在用户首次交互时解锁音频（解决浏览器自动播放限制）
  const unlockAudio = () => {
    const audio = getDingAudio()
    // 先尝试解锁文件音频
    audio.play().then(() => {
      audio.pause()
      audio.currentTime = 0
      removeUnlockListeners()
      console.log('音频文件解锁成功')
    }).catch(e => {
      // 如果文件加载失败，尝试通过播放一个合成音来解锁音频上下文
      console.warn('文件音频解锁失败，尝试解锁 Web Audio 上下文:', e)
      playFallbackBeep()
      removeUnlockListeners()
    })
  }

  const removeUnlockListeners = () => {
    window.removeEventListener('click', unlockAudio)
    window.removeEventListener('touchstart', unlockAudio)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('click', unlockAudio)
    window.addEventListener('touchstart', unlockAudio)
  }

  // 计算未读消息数
  const calculateUnreadCount = () => {
    if (isChatRoomActive.value) {
      unreadCount.value = 0
      return
    }
    
    const count = messages.value.filter(msg => 
      msg.id && typeof msg.id === 'number' && msg.id > lastReadId.value && msg.type !== 'SYSTEM'
    ).length
    unreadCount.value = count
  }

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

    // 加载缓存消息
    const cachedMessages = loadMessagesFromCache()
    if (cachedMessages.length > 0) {
      messages.value = cachedMessages
      calculateUnreadCount()
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
          
          // 处理 ONLINE_LIST 类型的消息
          if (message.type === 'ONLINE_LIST') {
            try {
              const onlineUsersData = JSON.parse(message.content)
              onlineUsers.value = onlineUsersData
            } catch (parseError) {
              console.error('Failed to parse online users data:', parseError)
            }
            return
          }
          
          // 播放提示音（非自己发送的消息且非系统消息）
          const currentUser = getUserInfo<LoginVO>()
          if (message.type !== 'SYSTEM' && currentUser && message.senderUsername !== currentUser.username) {
            playDing()
          }

          // 查找并替换临时消息
          const tempMessageIndex = messages.value.findIndex(msg => {
            return typeof msg.id === 'number' && msg.id > 1000000000000 && 
                   msg.senderUsername === message.senderUsername &&
                   msg.content === message.content
          })
          
          if (tempMessageIndex !== -1) {
            messages.value[tempMessageIndex] = message
          } else {
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
          }

          // 只有在聊天室界面时才缓存内容和更新阅读状态
          if (isChatRoomActive.value) {
            saveMessagesToCache(messages.value)
            if (message.id && typeof message.id === 'number') {
              lastReadId.value = Math.max(lastReadId.value, message.id)
              saveLastReadId(lastReadId.value)
            }
          }
          
          calculateUnreadCount()
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.value.onclose = () => {
        console.log('WebSocket disconnected')
        isConnected.value = false
        isConnecting.value = false
        stopHeartbeat()
        
        // 自动重连机制，防止后台断连
        scheduleReconnect()
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        isConnected.value = false
        isConnecting.value = false
        scheduleReconnect()
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      isConnected.value = false
      isConnecting.value = false
      scheduleReconnect()
    }
  }

  function scheduleReconnect() {
    if (reconnectTimeout.value) {
      clearTimeout(reconnectTimeout.value)
    }

    reconnectTimeout.value = window.setTimeout(() => {
      console.log('Attempting to reconnect...')
      connectWebSocket()
    }, 5000)
  }

  async function loadInitialMessages() {
    try {
      const response = await getChatMessages()
      const apiResponse = response as unknown as ApiResponse<any[]>
      const messageData = apiResponse.data || []
      
      const newMessages = Array.isArray(messageData) ? messageData.sort((a: Message, b: Message) => {
        const timeA = new Date(a.createTime || '').getTime()
        const timeB = new Date(b.createTime || '').getTime()
        return timeA - timeB
      }) : []
      
      const messageMap = new Map<number, Message>()
      newMessages.forEach(msg => {
        if (msg.id) messageMap.set(msg.id, msg)
      })
      
      const cachedMessages = loadMessagesFromCache()
      cachedMessages.forEach(msg => {
        if (msg.id && !messageMap.has(msg.id)) {
          messageMap.set(msg.id, msg)
        }
      })
      
      const mergedMessages = Array.from(messageMap.values()).sort((a: Message, b: Message) => {
        const timeA = new Date(a.createTime || '').getTime()
        const timeB = new Date(b.createTime || '').getTime()
        return timeA - timeB
      })
      
      messages.value = mergedMessages
      
      // 只有在聊天室界面时才保存缓存
      if (isChatRoomActive.value) {
        saveMessagesToCache(mergedMessages)
        const maxId = mergedMessages.reduce((max, msg) => 
          (msg.id && typeof msg.id === 'number') ? Math.max(max, msg.id) : max, 0
        )
        if (maxId > lastReadId.value) {
          lastReadId.value = maxId
          saveLastReadId(lastReadId.value)
        }
      }

      calculateUnreadCount()
    } catch (error) {
      console.error('Failed to load initial messages:', error)
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

  function addMessage(message: Message) {
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

    if (isChatRoomActive.value) {
      saveMessagesToCache(messages.value)
      if (message.id && typeof message.id === 'number') {
        lastReadId.value = Math.max(lastReadId.value, message.id)
        saveLastReadId(lastReadId.value)
      }
    }
    calculateUnreadCount()
  }

  // 设置聊天室激活状态
  function setChatRoomActive(active: boolean) {
    isChatRoomActive.value = active
    if (active) {
      // 进入聊天室，清除未读并更新最后阅读 ID
      const maxId = messages.value.reduce((max, msg) => 
        (msg.id && typeof msg.id === 'number') ? Math.max(max, msg.id) : max, 0
      )
      if (maxId > lastReadId.value) {
        lastReadId.value = maxId
        saveLastReadId(lastReadId.value)
      }
      unreadCount.value = 0
      // 进入聊天室时保存当前消息到缓存
      saveMessagesToCache(messages.value)
    }
  }

  function updateReadPosition() {
    if (messages.value.length > 0) {
      const maxId = messages.value.reduce((max, msg) => 
        (msg.id && typeof msg.id === 'number') ? Math.max(max, msg.id) : max, 0
      )
      if (maxId > lastReadId.value) {
        lastReadId.value = maxId
        saveLastReadId(lastReadId.value)
        unreadCount.value = 0
      }
    }
  }

  async function getUnreadCount() {
    calculateUnreadCount()
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
    // 只有在非重连状态下才彻底关闭
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
    onlineUsers,
    isConnected,
    isConnecting,
    unreadCount,
    lastReadId,
    isChatRoomActive,
    initialize,
    sendMessage,
    addMessage,
    setChatRoomActive,
    updateReadPosition,
    getUnreadCount,
    closeConnection
  }
})
