import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export interface ParticleSceneOptions {
  variant?: 'global' | 'hero'
  count?: number
  interactive?: boolean
  paused?: () => boolean
}

interface Particle {
  x: number
  y: number
  z: number
  ox: number
  oy: number
  oz: number
  vx: number
  vy: number
  size: number
  colorIndex: number
  orientation: number
  seed: number
}

const WORLD_RADIUS = 16
const CAMERA_DISTANCE = 50
const MAGNET_RADIUS = 10
const MAX_DPR = 2

export function useParticleScene(
  canvasRef: Ref<HTMLCanvasElement | null>,
  hostRef: Ref<HTMLElement | null>,
  options: ParticleSceneOptions = {},
) {
  const variant = options.variant ?? 'global'
  const interactive = options.interactive === true

  let ctx: CanvasRenderingContext2D | null = null
  let host: HTMLElement | null = null
  let particles: Particle[] = []
  let sprites: HTMLCanvasElement[][] = []
  let width = 1
  let height = 1
  let dpr = 1
  let worldScale = 1
  let worldHalfWidth = WORLD_RADIUS
  let worldHalfHeight = WORLD_RADIUS
  let baseOpacity = variant === 'hero' ? 0.55 : 0.3
  let raf = 0
  let lastTime = 0
  let reduced = false
  let inView = true
  let documentVisible = true
  let hasPointer = false
  let pointerX = 0
  let pointerY = 0
  let resizeTimer: ReturnType<typeof setTimeout> | null = null

  let resizeObserver: ResizeObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let themeObserver: MutationObserver | null = null

  function isMobile(): boolean {
    return window.matchMedia('(max-width: 767px)').matches
  }

  function canInteract(): boolean {
    return interactive
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !reduced
  }

  function particleCount(): number {
    if (options.count && options.count > 0) return options.count
    if (variant === 'hero') return isMobile() ? 60 : 130
    return isMobile() ? 30 : 60
  }

  function readColors(): string[] {
    const style = getComputedStyle(document.documentElement)
    const primary = style.getPropertyValue('--color-primary').trim() || '#0284c7'
    const secondary = style.getPropertyValue('--color-secondary').trim() || '#e11d48'
    const title = style.getPropertyValue('--color-title').trim() || '#0f172a'
    const fallbacks = [primary, secondary, title]

    return [1, 2, 3].map((index, i) =>
      style.getPropertyValue(`--particle-color-${index}`).trim() || fallbacks[i],
    )
  }

  function readOpacity(): number {
    const style = getComputedStyle(document.documentElement)
    const raw = style
      .getPropertyValue(variant === 'hero' ? '--particle-opacity-hero' : '--particle-opacity')
      .trim()
    const value = Number(raw)
    if (Number.isFinite(value)) return value
    return variant === 'hero' ? 0.55 : 0.3
  }

  function makeSprite(color: string, angle: number): HTMLCanvasElement {
    const sprite = document.createElement('canvas')
    const size = 16
    const scale = 2
    sprite.width = size * scale
    sprite.height = size * scale

    const spriteCtx = sprite.getContext('2d')
    if (!spriteCtx) return sprite

    spriteCtx.scale(scale, scale)
    spriteCtx.translate(size / 2, size / 2)
    spriteCtx.rotate(angle)
    spriteCtx.strokeStyle = color
    spriteCtx.lineWidth = 4
    spriteCtx.lineCap = 'round'
    spriteCtx.beginPath()
    spriteCtx.moveTo(0, -5)
    spriteCtx.lineTo(0, 5)
    spriteCtx.stroke()
    return sprite
  }

  function buildSprites(): void {
    baseOpacity = readOpacity()
    const angles = [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4]
    sprites = readColors().map(color => angles.map(angle => makeSprite(color, angle)))
  }

  function createParticles(): void {
    particles = Array.from({ length: particleCount() }, (_, index) => {
      const x = (Math.random() - 0.5) * worldHalfWidth * 2
      const y = (Math.random() - 0.5) * worldHalfHeight * 2
      const z = (Math.random() - 0.5) * 20
      return {
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 0.6 + Math.random() * 0.9,
        colorIndex: index % 3,
        orientation: Math.floor(Math.random() * 4),
        seed: Math.random() * Math.PI * 2,
      }
    })
  }

  function draw(): void {
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    const centerX = width / 2
    const centerY = height / 2
    const baseSize = variant === 'hero' ? 10 : 7

    particles.sort((a, b) => b.z - a.z)

    for (const particle of particles) {
      const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE + particle.z)
      const screenX = centerX + particle.x * worldScale * perspective
      const screenY = centerY + particle.y * worldScale * perspective

      if (screenX < -24 || screenX > width + 24 || screenY < -24 || screenY > height + 24) {
        continue
      }

      const sprite = sprites[particle.colorIndex]?.[particle.orientation]
      if (!sprite) continue

      const size = baseSize * particle.size * (0.65 + perspective * 0.5)
      const alpha = baseOpacity * (0.35 + 0.65 * Math.min(1, perspective))

      ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
      ctx.drawImage(sprite, screenX - size / 2, screenY - size / 2, size, size)
    }

    ctx.globalAlpha = 1
  }

  function update(dt: number, now: number): void {
    const time = now / 1000
    const ease = Math.min(1, dt * 6)
    const pointerWorldX = (pointerX - width / 2) / worldScale
    const pointerWorldY = (pointerY - height / 2) / worldScale
    const magnetActive = canInteract() && hasPointer

    for (const particle of particles) {
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt

      if (particle.x > worldHalfWidth + 0.5) particle.x = -worldHalfWidth - 0.5
      else if (particle.x < -worldHalfWidth - 0.5) particle.x = worldHalfWidth + 0.5
      if (particle.y > worldHalfHeight + 0.5) particle.y = -worldHalfHeight - 0.5
      else if (particle.y < -worldHalfHeight - 0.5) particle.y = worldHalfHeight + 0.5

      let targetX = particle.x
      let targetY = particle.y
      let targetZ = particle.oz + Math.sin(time * 0.35 + particle.seed) * 0.6

      if (magnetActive) {
        const dx = particle.x - pointerWorldX
        const dy = particle.y - pointerWorldY
        const distance = Math.hypot(dx, dy)

        if (distance < MAGNET_RADIUS && distance > 0.0001) {
          const angle = Math.atan2(dy, dx)
          if (distance < MAGNET_RADIUS * 0.6) {
            const ringRadius = MAGNET_RADIUS + Math.sin(time * 0.4 + particle.seed) * 0.6
            targetX = pointerWorldX + Math.cos(angle) * ringRadius
            targetY = pointerWorldY + Math.sin(angle) * ringRadius
            targetZ = particle.oz + Math.sin(time * 3 + particle.seed) * 2
          } else {
            targetZ = particle.oz + Math.sin(time * 3 + particle.seed) * 2
          }
        }
      }

      particle.x += (targetX - particle.x) * ease * 0.35
      particle.y += (targetY - particle.y) * ease * 0.35
      particle.z += (targetZ - particle.z) * ease * 0.5
    }
  }

  function frame(now: number): void {
    if (!inView || !documentVisible || options.paused?.()) {
      raf = 0
      return
    }

    const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000))
    lastTime = now
    update(dt, now)
    draw()
    raf = requestAnimationFrame(frame)
  }

  function stop(): void {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function start(): void {
    if (reduced || raf || !inView || !documentVisible || options.paused?.()) return
    lastTime = performance.now()
    raf = requestAnimationFrame(frame)
  }

  function resize(): void {
    const canvas = canvasRef.value
    host = hostRef.value
    if (!canvas || !host) return

    const rect = host.getBoundingClientRect()
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    worldScale = Math.min(width, height) / (WORLD_RADIUS * 2)
    worldHalfWidth = Math.max(1, width / (2 * worldScale))
    worldHalfHeight = Math.max(1, height / (2 * worldScale))
    draw()
  }

  function handleResize(): void {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      resizeTimer = null
      resize()
    }, 150)
  }

  function handlePointerMove(event: PointerEvent): void {
    if (!host || !canInteract()) return
    const rect = host.getBoundingClientRect()
    pointerX = event.clientX - rect.left
    pointerY = event.clientY - rect.top
    hasPointer = true
  }

  function handlePointerLeave(): void {
    hasPointer = false
  }

  function handleVisibilityChange(): void {
    documentVisible = !document.hidden
    if (documentVisible) start()
    else stop()
  }

  function handleThemeChange(): void {
    buildSprites()
    draw()
  }

  onMounted(() => {
    if (!import.meta.client) return
    host = hostRef.value
    if (!host || !canvasRef.value) return

    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    documentVisible = !document.hidden

    buildSprites()
    resize()
    createParticles()
    draw()

    themeObserver = new MutationObserver(handleThemeChange)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    if (reduced) return

    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(host)

    document.addEventListener('visibilitychange', handleVisibilityChange)

    if (variant === 'hero') {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        inView = entry?.isIntersecting ?? true
        if (inView) start()
        else stop()
      })
      intersectionObserver.observe(host)
    }

    if (canInteract()) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    }

    start()
  })

  onBeforeUnmount(() => {
    stop()

    if (resizeTimer) {
      clearTimeout(resizeTimer)
      resizeTimer = null
    }
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    themeObserver?.disconnect()

    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerleave', handlePointerLeave)
  })
}
