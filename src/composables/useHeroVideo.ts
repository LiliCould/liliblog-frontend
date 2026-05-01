import { ref, onMounted, onUnmounted } from 'vue'

export interface VideoConfig {
  src: string
  poster?: string
  muted?: boolean
  loop?: boolean
  autoplay?: boolean
  playsInline?: boolean
}

export function useHeroVideo(config: VideoConfig) {
  const videoRef = ref<HTMLVideoElement | null>(null)
  const isPlaying = ref(false)
  const isLoaded = ref(false)
  const hasError = ref(false)

  const defaultConfig = {
    muted: true,
    loop: true,
    autoplay: true,
    playsInline: true,
    ...config
  }

  async function play() {
    if (!videoRef.value) return

    try {
      await videoRef.value.play()
      isPlaying.value = true
    } catch (error) {
      console.warn('Video playback failed:', error)
      hasError.value = false
      isPlaying.value = false
    }
  }

  function pause() {
    if (!videoRef.value) return

    videoRef.value.pause()
    isPlaying.value = false
  }

  function handleLoadedData() {
    isLoaded.value = true
    if (defaultConfig.autoplay) {
      play()
    }
  }

  function handlePlay() {
    isPlaying.value = true
  }

  function handlePause() {
    isPlaying.value = false
  }

  function handleError() {
    hasError.value = true
    console.error('Video loading error')
  }

  onMounted(() => {
    const video = document.querySelector('.hero-video') as HTMLVideoElement
    if (video) {
      videoRef.value = video
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('error', handleError)

      if (defaultConfig.autoplay && defaultConfig.muted) {
        play().catch(() => {})
      }
    }
  })

  onUnmounted(() => {
    if (videoRef.value) {
      videoRef.value.removeEventListener('loadeddata', handleLoadedData)
      videoRef.value.removeEventListener('play', handlePlay)
      videoRef.value.removeEventListener('pause', handlePause)
      videoRef.value.removeEventListener('error', handleError)
      pause()
    }
  })

  return {
    videoRef,
    isPlaying,
    isLoaded,
    hasError,
    config: defaultConfig,
    play,
    pause
  }
}
