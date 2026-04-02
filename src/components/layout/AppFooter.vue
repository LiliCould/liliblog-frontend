<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <p class="copyright">&copy; 2025-2026 LiliCould. All rights reserved.</p>
      <p class="footer-links">
        <span>Powered by LiliCould</span>
      </p>
      <p class="icp">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">赣ICP备2025078204号-1</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.footer-inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  text-align: center;
}

.copyright {
  font-size: 13px;
  color: var(--color-muted);
  margin-bottom: 4px;
}

.footer-links {
  font-size: 12px;
  color: var(--color-muted);
}

.icp {
  font-size: 12px;
  color: var(--color-muted);
  margin-top: 4px;
}

.icp a {
  color: var(--color-muted);
  text-decoration: none;
}

.icp a:hover {
  color: var(--color-primary);
}
</style>
