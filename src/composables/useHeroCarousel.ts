import { ref, onMounted, onUnmounted } from 'vue'
import anime from 'animejs'

export function useHeroCarousel(images: string[], interval = 6000) {
  const currentIndex = ref(0)
  const isPaused = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null
  let resumeTimer: ReturnType<typeof setTimeout> | null = null

  function switchImage(nextIndex: number) {
    const currentEl = document.querySelector(`.hero-image-${currentIndex.value}`)
    const nextEl = document.querySelector(`.hero-image-${nextIndex}`)

    if (!currentEl || !nextEl) return

    anime({
      targets: currentEl,
      opacity: 0,
      duration: 1200,
      easing: 'easeOutQuad'
    })

    anime({
      targets: nextEl,
      opacity: [0, 1],
      scale: [1.05, 1],
      duration: 1200,
      easing: 'easeInOutQuad'
    })

    currentIndex.value = nextIndex
  }

  function next() {
    const nextIndex = (currentIndex.value + 1) % images.length
    switchImage(nextIndex)
  }

  function prev() {
    const prevIndex = (currentIndex.value - 1 + images.length) % images.length
    switchImage(prevIndex)
  }

  function goTo(index: number) {
    if (index === currentIndex.value) return
    switchImage(index)
    resetTimer()
  }

  function start() {
    timer = setInterval(() => {
      if (!isPaused.value) next()
    }, interval)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    if (resumeTimer) {
      clearTimeout(resumeTimer)
      resumeTimer = null
    }
  }

  function pause() {
    isPaused.value = true
  }

  function resume() {
    if (resumeTimer) clearTimeout(resumeTimer)
    resumeTimer = setTimeout(() => {
      isPaused.value = false
    }, 3000)
  }

  function resetTimer() {
    stop()
    start()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      next()
      resetTimer()
    } else if (e.key === 'ArrowLeft') {
      prev()
      resetTimer()
    }
  }

  onMounted(() => {
    start()
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    stop()
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    currentIndex,
    isPaused,
    next,
    prev,
    goTo,
    pause,
    resume,
    resetTimer
  }
}
