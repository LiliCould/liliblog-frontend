<template>
  <div class="empty-state">
    <div class="empty-visual">
      <span class="empty-icon">{{ icon }}</span>
      <div class="empty-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>

    <h3 class="empty-title">{{ text }}</h3>
    <p class="empty-description">这里还没有内容哦~</p>

    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text?: string
  icon?: string
}>(), {
  text: '暂无数据',
  icon: '📭',
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl) var(--spacing-xl);
  text-align: center;
}

.empty-visual {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.empty-icon {
  font-size: 64px;
  display: block;
  animation: float 3s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.empty-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: pulse-circle 4s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  background: var(--color-primary);
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.circle-2 {
  width: 60px;
  height: 60px;
  background: var(--color-accent);
  top: 30px;
  right: 10px;
  animation-delay: 1s;
}

.circle-3 {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  bottom: 10px;
  left: 40px;
  animation-delay: 2s;
}

@keyframes pulse-circle {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.08;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.12;
  }
}

.empty-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-title);
  margin: 0 0 var(--spacing-xs) 0;
}

.empty-description {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  margin: 0;
  max-width: 280px;
}
</style>
