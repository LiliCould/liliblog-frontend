import { onBeforeUnmount, onMounted, type Ref } from 'vue'

interface CardTiltOptions {
  max?: number
}

/**
 * 给卡片封面加轻微 3D 倾斜。
 * 仅在精细指针 + 非 reduced-motion 环境启用，触屏和低性能设备不做额外计算。
 */
export function useCardTilt(
  host: Ref<HTMLElement | null>,
  target: Ref<HTMLElement | null> = host,
  options: CardTiltOptions = {},
) {
  const max = options.max ?? 3
  let frame = 0

  function enabled(): boolean {
    if (!import.meta.client) return false
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function reset(): void {
    const element = target.value
    if (!element) return
    element.style.setProperty('--tilt-x', '0deg')
    element.style.setProperty('--tilt-y', '0deg')
  }

  function handleMove(event: PointerEvent): void {
    const element = target.value
    if (!element) return

    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      const rotateX = (0.5 - y) * max * 2
      const rotateY = (x - 0.5) * max * 2
      element.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`)
      element.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`)
    })
  }

  onMounted(() => {
    const element = host.value
    if (!element || !target.value) return
    if (!enabled()) return
    element.addEventListener('pointermove', handleMove, { passive: true })
    element.addEventListener('pointerleave', reset, { passive: true })
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    const element = host.value
    if (!element) return
    element.removeEventListener('pointermove', handleMove)
    element.removeEventListener('pointerleave', reset)
  })

  return { reset }
}
