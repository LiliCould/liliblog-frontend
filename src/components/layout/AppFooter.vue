<template>
  <footer class="app-footer">
    <div class="footer-inner page-container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="brand-logo">
            <span class="logo-icon">✦</span>
            <span class="logo-text">LiliBlog</span>
          </div>
          <p class="brand-desc">记录生活，分享技术，探索无限可能</p>
        </div>

        <div class="footer-links-section">
          <h4 class="footer-heading">快速链接</h4>
          <nav class="footer-nav">
            <router-link to="/" class="footer-link">首页</router-link>
            <router-link to="/about" class="footer-link">关于</router-link>
            <router-link to="/chat" class="footer-link">聊天室</router-link>
          </nav>
        </div>

        <div class="footer-contact-section">
          <h4 class="footer-heading">联系方式</h4>
          <div class="contact-info">
            <a href="mailto:lilicould@qq.com" class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>lilicould@qq.com</span>
            </a>
            <a href="https://github.com/lilicould" target="_blank" rel="noopener" class="contact-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.795 24 17.301 24 12 24 5.373 18.627 0 12 0z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          <span>© {{ currentYear }} LiliCould.</span>
          <span class="separator">·</span>
          <span>All rights reserved.</span>
        </div>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" class="icp-link">
          赣ICP备2025078204号-1
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
}

.footer-inner {
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-lg);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.footer-brand {
  max-width: 320px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--spacing-md);
}

.brand-logo .logo-icon {
  font-size: 24px;
  color: var(--color-primary);
}

.brand-logo .logo-text {
  font-size: 22px;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-display);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-desc {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.footer-heading {
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-title);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-md);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-link {
  font-size: var(--font-size-sm);
  color: var(--color-body-light);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
  display: inline-block;
  width: fit-content;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width var(--transition-base);
}

.footer-link:hover {
  color: var(--color-primary);
}

.footer-link:hover::after {
  width: 100%;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-sm);
  color: var(--color-body-light);
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: 4px 0;
}

.contact-item svg {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
  opacity: 0.7;
  transition: all var(--transition-fast);
}

.contact-item:hover {
  color: var(--color-primary);
}

.contact-item:hover svg {
  opacity: 1;
  transform: translateX(2px);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.copyright {
  font-size: var(--font-size-xs);
  color: var(--color-muted-light);
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  opacity: 0.5;
}

.icp-link {
  font-size: var(--font-size-xs);
  color: var(--color-muted-light);
  text-decoration: none;
  transition: color var(--transition-fast);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.icp-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
  }

  .footer-brand {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .footer-inner {
    padding: var(--spacing-xl) var(--spacing-md) var(--spacing-md);
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .footer-brand {
    text-align: center;
  }

  .brand-logo {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .copyright {
    justify-content: center;
  }
}
</style>
