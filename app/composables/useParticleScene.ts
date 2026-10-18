import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export interface ParticleSceneOptions {
  variant?: 'global' | 'hero'
  count?: number
  interactive?: boolean
  paused?: () => boolean
}

interface Node2D {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  colorIndex: number
}

const TAU = Math.PI * 2
const MAX_DPR = 2

/**
 * 全站连线网格背景。
 * 视觉参数参考 particles.js 的 line_linked / repulse 模式，并按本站四套主题重写。
 */
export function useParticleScene(
  canvasRef: Ref<HTMLCanvasElement | null>,
  hostRef: Ref<HTMLElement | null>,
  options: ParticleSceneOptions = {},
) {
  const variant = options.variant ?? 'global'
  const interactive = options.interactive === true

  let ctx: CanvasRenderingContext2D | null = null
  let host: HTMLElement | null = null
  let width = 1
  let height = 1
  let dpr = 1
  let reduced = false
  let documentVisible = true
  let baseOpacity = 0.4
  let lineColor = '#0284c7'
  let nodeColors: string[] = []
  let glowSprites: HTMLCanvasElement[] = []
  let nodes: Node2D[] = []
  let raf = 0
  let lastTime = 0

  let pointerX = 0
  let pointerY = 0
  let hasPointer = false

  let resizeTimer: ReturnType<typeof setTimeout> | null = null
  let resizeObserver: ResizeObserver | null = null
  let themeObserver: MutationObserver | null = null

  function isMobile(): boolean {
    return window.matchMedia('(max-width: 767px)').matches
  }

  function canInteract(): boolean {
    return interactive
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !reduced
  }

  function nodeCount(): number {
    if (options.count && options.count > 0) return options.count
    return isMobile() ? 48 : 90
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
    return 0.4
  }

  function makeGlowSprite(color: string): HTMLCanvasElement {
    const sprite = document.createElement('canvas')
    const size = 32
    sprite.width = size
    sprite.height = size

    const spriteCtx = sprite.getContext('2d')
    if (!spriteCtx) return sprite

    const gradient = spriteCtx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.35, color)
    gradient.addColorStop(1, 'transparent')

    spriteCtx.fillStyle = gradient
    spriteCtx.beginPath()
    spriteCtx.arc(size / 2, size / 2, size / 2, 0, TAU)
    spriteCtx.fill()
    return sprite
  }

  function buildTheme(): void {
    baseOpacity = readOpacity()
    nodeColors = readColors()
    lineColor = nodeColors[0]
    glowSprites = nodeColors.map(makeGlowSprite)
  }

  function createNodes(): void {
    nodes = Array.from({ length: nodeCount() }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
      radius: 1.2 + Math.random() * 1.6,
      colorIndex: index % 3,
    }))
  }

  function drawGlow(x: number, y: number, radius: number, colorIndex: number, alpha: number): void {
    const sprite = glowSprites[colorIndex]
    if (!ctx || !sprite) return
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
    ctx.drawImage(sprite, x - radius * 2, y - radius * 2, radius * 4, radius * 4)
  }

  function drawNode(x: number, y: number, radius: number, colorIndex: number, alpha: number): void {
    if (!ctx || alpha <= 0.01) return

    drawGlow(x, y, radius * 1.7, colorIndex, alpha * 0.4)

    ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
    ctx.fillStyle = nodeColors[colorIndex] || lineColor
    ctx.beginPath()
    ctx.arc(x, y, Math.max(0.8, radius), 0, TAU)
    ctx.fill()
  }

  function draw(time: number): void {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)

    const linkDistance = Math.max(100, Math.min(170, Math.max(width, height) * 0.11))
    const linkDistanceSq = linkDistance * linkDistance
    const cursorRadius = Math.max(120, Math.min(220, Math.min(width, height) * 0.24))
    const cursorRadiusSq = cursorRadius * cursorRadius
    const mouseActive = canInteract() && hasPointer

    ctx.lineWidth = 0.8
    ctx.strokeStyle = lineColor

    // 节点之间的连线
    for (let i = 0; i < nodes.length; i++) {
      const first = nodes[i]
      for (let j = i + 1; j < nodes.length; j++) {
        const second = nodes[j]
        const dx = first.x - second.x
        const dy = first.y - second.y
        const distanceSq = dx * dx + dy * dy
        if (distanceSq > linkDistanceSq) continue

        const strength = 1 - Math.sqrt(distanceSq) / linkDistance
        ctx.globalAlpha = baseOpacity * strength * 0.9
        ctx.beginPath()
        ctx.moveTo(first.x, first.y)
        ctx.lineTo(second.x, second.y)
        ctx.stroke()
      }
    }

    // 鼠标与附近节点的连线
    if (mouseActive) {
      for (const node of nodes) {
        const dx = node.x - pointerX
        const dy = node.y - pointerY
        const distanceSq = dx * dx + dy * dy
        if (distanceSq > cursorRadiusSq) continue

        const strength = 1 - Math.sqrt(distanceSq) / cursorRadius
        ctx.globalAlpha = baseOpacity * strength * 0.8
        ctx.beginPath()
        ctx.moveTo(pointerX, pointerY)
        ctx.lineTo(node.x, node.y)
        ctx.stroke()
      }

      drawGlow(pointerX, pointerY, 9, 0, baseOpacity * 0.85)
      ctx.globalAlpha = Math.min(0.9, baseOpacity * 1.4)
      ctx.fillStyle = lineColor
      ctx.beginPath()
      ctx.arc(pointerX, pointerY, 2.4, 0, TAU)
      ctx.fill()
    }

    // 节点
    for (const node of nodes) {
      const pulse = 0.9 + Math.sin(time * 0.6 + node.x * 0.01) * 0.1
      drawNode(node.x, node.y, node.radius * pulse, node.colorIndex, Math.min(0.9, baseOpacity * 1.3))
    }

    ctx.globalAlpha = 1
  }

  function update(dt: number): void {
    const mouseRadius = Math.max(100, Math.min(180, Math.min(width, height) * 0.18))
    const mouseActive = canInteract() && hasPointer

    for (const node of nodes) {
      node.x += node.vx * dt
      node.y += node.vy * dt

      if (node.x < -20) node.x = width + 20
      else if (node.x > width + 20) node.x = -20
      if (node.y < -20) node.y = height + 20
      else if (node.y > height + 20) node.y = -20

      if (!mouseActive) continue

      const dx = node.x - pointerX
      const dy = node.y - pointerY
      const distance = Math.hypot(dx, dy)
      if (distance > mouseRadius || distance < 0.001) continue

      // 鼠标排斥，类似 particles.js 的 repulse，但力度更克制
      const force = (1 - distance / mouseRadius) * 60 * dt
      node.x += (dx / distance) * force
      node.y += (dy / distance) * force
    }
  }

  function frame(now: number): void {
    if (!documentVisible || options.paused?.()) {
      raf = 0
      return
    }

    const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000))
    lastTime = now
    update(dt)
    draw(now / 1000)
    raf = requestAnimationFrame(frame)
  }

  function stop(): void {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function start(): void {
    if (reduced || raf || !documentVisible || options.paused?.()) return
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

    draw(performance.now() / 1000)
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
    buildTheme()
    draw(performance.now() / 1000)
  }

  onMounted(() => {
    if (!import.meta.client) return
    host = hostRef.value
    if (!host || !canvasRef.value) return

    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    documentVisible = !document.hidden

    buildTheme()
    resize()
    createNodes()
    draw(performance.now() / 1000)

    themeObserver = new MutationObserver(handleThemeChange)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    if (reduced) return

    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(host)

    document.addEventListener('visibilitychange', handleVisibilityChange)

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
    themeObserver?.disconnect()

    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerleave', handlePointerLeave)
  })
}
