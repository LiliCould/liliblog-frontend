import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'
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

const CACHE_KEY = 'chat_messages_cache'
const LAST_READ_ID_KEY = 'chat_last_read_id'

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

function saveMessagesToCache(messages: Message[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(messages))
  } catch (error) {
    console.error('Failed to save messages to cache:', error)
  }
}

function getLastReadId(): number {
  const id = localStorage.getItem(LAST_READ_ID_KEY)
  return id ? parseInt(id) : 0
}

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

  let dingAudio: HTMLAudioElement | null = null

  let heartbeatTimer: number | null = null
  let missedHeartbeats = 0
  const HEARTBEAT_INTERVAL = 30000
  const MAX_MISSED_HEARTBEATS = 3

  const getDingAudio = () => {
    if (!dingAudio) {
      const audioUrl = new URL('/ding.wav', window.location.origin).href
      dingAudio = new Audio(audioUrl)

      dingAudio.addEventListener('error', () => {
        const error = dingAudio?.error
        console.error('音频文件加载失败:', {
          url: audioUrl,
          code: error?.code,
          message: error?.message,
          networkState: dingAudio?.networkState,
          readyState: dingAudio?.readyState
        })
      })

      dingAudio.load()
    }
    return dingAudio
  }

  const playFallbackBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime)
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

  const playDing = () => {
    const audio = getDingAudio()

    if (audio.networkState === 3 || (audio.error && audio.error.code === 4)) {
      console.warn('音频文件不可用，尝试播放备用音')
      playFallbackBeep()
      return
    }

    audio.pause()
    audio.currentTime = 0
    audio.play().catch(e => {
      console.warn('音频播放被阻止或失败（可能是浏览器限制，需要用户点击页面）：', e)
      if (e.name !== 'NotAllowedError') {
        playFallbackBeep()
      }
    })
  }

  const unlockAudio = () => {
    const audio = getDingAudio()
    audio.play().then(() => {
      audio.pause()
      audio.currentTime = 0
      removeUnlockListeners()
      console.log('音频文件解锁成功')
    }).catch(e => {
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

  const calculateUnreadCount = () => {
    if (isChatRoomActive.value) {
      unreadCount.value = 0
      return
    }

    const rawMessages = toRaw(messages.value)
    const currentLastReadId = lastReadId.value
    let count = 0
    for (let i = 0; i < rawMessages.length; i++) {
      const msg = toRaw(rawMessages[i])
      if (msg.id && typeof msg.id === 'number' && msg.id > currentLastReadId && msg.type !== 'SYSTEM') {
        count++
      }
    }
    unreadCount.value = count
  }

  const getWsUrl = (): string => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    if (apiBaseUrl) {
      return apiBaseUrl.replace(/^http/, 'ws') + '/ws/chat'
    }
    return 'ws://localhost:8080/ws/chat'
  }
  const wsUrl = ref(getWsUrl())

  async function initialize() {
    if (isInitialized.value) {
      return
    }

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
        startHeartbeat()
      }

      ws.value.onmessage = (event) => {
        if (event.data === 'PONG') {
          missedHeartbeats = 0
          return
        }

        try {
          const message = JSON.parse(event.data) as Message

          if (message.type === 'ONLINE_LIST') {
            try {
              const onlineUsersData = JSON.parse(message.content)
              onlineUsers.value = onlineUsersData
            } catch (parseError) {
              console.error('Failed to parse online users data:', parseError)
            }
            return
          }

          const currentUser = getUserInfo<LoginVO>()
          if (message.type !== 'SYSTEM' && currentUser && message.senderUsername !== currentUser.username) {
            playDing()
          }

          const rawArr = toRaw(messages.value)
          const tempMessageIndex = rawArr.findIndex(msg => {
            const rawMsg = toRaw(msg)
            return typeof rawMsg.id === 'number' && rawMsg.id > 1000000000000 &&
                   rawMsg.senderUsername === message.senderUsername &&
                   rawMsg.content === message.content
          })

          if (tempMessageIndex !== -1) {
            messages.value[tempMessageIndex] = message
          } else {
            const insertIndex = rawArr.findIndex(msg => {
              const rawMsg = toRaw(msg)
              const msgTime = new Date(rawMsg.createTime || '').getTime()
              const newMsgTime = new Date(message.createTime || '').getTime()
              return newMsgTime < msgTime
            })

            if (insertIndex === -1) {
              messages.value.push(message)
            } else {
              messages.value.splice(insertIndex, 0, message)
            }
          }

          if (isChatRoomActive.value) {
            saveMessagesToCache(toRaw(messages.value))
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
    const rawArr = toRaw(messages.value)
    const insertIndex = rawArr.findIndex(msg => {
      const rawMsg = toRaw(msg)
      const msgTime = new Date(rawMsg.createTime || '').getTime()
      const newMsgTime = new Date(message.createTime || '').getTime()
      return newMsgTime < msgTime
    })

    if (insertIndex === -1) {
      messages.value.push(message)
    } else {
      messages.value.splice(insertIndex, 0, message)
    }

    if (isChatRoomActive.value) {
      saveMessagesToCache(toRaw(messages.value))
      if (message.id && typeof message.id === 'number') {
        lastReadId.value = Math.max(lastReadId.value, message.id)
        saveLastReadId(lastReadId.value)
      }
    }
    calculateUnreadCount()
  }

  function setChatRoomActive(active: boolean) {
    isChatRoomActive.value = active
    if (active) {
      const rawArr = toRaw(messages.value)
      const maxId = rawArr.reduce((max, msg) => {
        const rawMsg = toRaw(msg)
        return (rawMsg.id && typeof rawMsg.id === 'number') ? Math.max(max, rawMsg.id) : max
      }, 0)
      if (maxId > lastReadId.value) {
        lastReadId.value = maxId
        saveLastReadId(lastReadId.value)
      }
      unreadCount.value = 0
      saveMessagesToCache(toRaw(messages.value))
    }
  }

  function updateReadPosition() {
    const rawArr = toRaw(messages.value)
    if (rawArr.length > 0) {
      const maxId = rawArr.reduce((max, msg) => {
        const rawMsg = toRaw(msg)
        return (rawMsg.id && typeof rawMsg.id === 'number') ? Math.max(max, rawMsg.id) : max
      }, 0)
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
