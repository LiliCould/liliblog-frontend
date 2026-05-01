<template>
  <div class="about-page page-container">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">✦</span>
        关于我
      </h1>
      <p class="page-subtitle">热爱技术，追求卓越</p>
    </div>

    <div class="about-content">
      <!-- 个人信息卡片 -->
      <section class="profile-card">
        <div class="profile-visual">
          <div class="avatar-wrapper">
            <img src="/xiaodingdang.png" alt="立里可" class="profile-avatar" />
            <div class="avatar-ring"></div>
          </div>
          <div class="status-indicator online"></div>
        </div>

        <div class="profile-details">
          <h2 class="profile-name">立里可</h2>
          <p class="profile-title">意向：<span class="highlight">Java 后端开发工程师</span></p>

          <div class="contact-grid">
            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <div class="contact-content">
                <span class="contact-label">年龄</span>
                <span class="contact-value">{{ ageCalculator() }}岁</span>
              </div>
            </div>

            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                </path>
              </svg>
              <div class="contact-content">
                <span class="contact-label">电话</span>
                <span class="contact-value">155-7033-1235</span>
              </div>
            </div>

            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div class="contact-content">
                <span class="contact-label">位置</span>
                <span class="contact-value">江西某处</span>
              </div>
            </div>

            <div class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <div class="contact-content">
                <span class="contact-label">邮箱</span>
                <a href="mailto:lilicould@qq.com" class="contact-value link">lilicould@qq.com</a>
              </div>
            </div>

            <div class="contact-item full-width">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.795 24 17.301 24 12 24 5.373 18.627 0 12 0z" />
              </svg>
              <div class="contact-content">
                <span class="contact-label">GitHub</span>
                <a href="https://github.com/lilicould" target="_blank" rel="noopener" class="contact-value link">
                  github.com/lilicould
                  <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section class="content-section education-section">
        <div class="section-header">
          <div class="section-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h3 class="section-title">教育背景</h3>
        </div>

        <div class="education-card">
          <div class="edu-header">
            <div class="edu-time-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>2023.09 — 至今</span>
            </div>
            <h4 class="edu-school">江西某本科院校</h4>
          </div>

          <div class="edu-tags">
            <span class="tag tag-primary">软件工程</span>
            <span class="tag tag-secondary">本科</span>
          </div>

          <p class="edu-courses">
            数据结构、算法设计与分析、计算机网络、操作系统、数据库系统原理、面向对象程序设计（Java）、Java Web、框架技术、软件工程
          </p>
        </div>
      </section>

      <!-- 专业技能 -->
      <section class="content-section skills-section">
        <div class="section-header">
          <div class="section-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <h3 class="section-title">专业技能</h3>
        </div>

        <div class="skills-grid">
          <div class="skill-card">
            <div class="skill-icon">☕</div>
            <h4 class="skill-name">Java 基础</h4>
            <p class="skill-desc">扎实，熟悉集合/多线程，具备 OOM 排查思路及 Arthas 诊断能力。</p>
          </div>

          <div class="skill-card">
            <div class="skill-icon">🗄️</div>
            <h4 class="skill-name">数据库</h4>
            <p class="skill-desc">MySQL 索引优化与事务机制；Redis 缓存策略，能解决击穿/穿透/雪崩问题。</p>
          </div>

          <div class="skill-card">
            <div class="skill-icon">⚙️</div>
            <h4 class="skill-name">框架</h4>
            <p class="skill-desc">Spring Boot、Spring Security、MyBatis-Plus，了解 SpringCloudAlibaba 微服务组件。</p>
          </div>

          <div class="skill-card">
            <div class="skill-icon">🛠️</div>
            <h4 class="skill-name">工程化</h4>
            <p class="skill-desc">Maven、Git、Docker、Linux 基础运维。</p>
          </div>

          <div class="skill-card">
            <div class="skill-icon">🌐</div>
            <h4 class="skill-name">网络与安全</h4>
            <p class="skill-desc">熟悉 HTTP/HTTPS、TCP/IP、了解 XSS、SQL 注入等 Web 安全防护技术。</p>
          </div>

          <div class="skill-card">
            <div class="skill-icon">🎨</div>
            <h4 class="skill-name">前端技能</h4>
            <p class="skill-desc">熟悉 Vue 3 + Element Plus 组件化开发，能独立完成前后端联调。</p>
          </div>
        </div>
      </section>

      <!-- 项目经历 -->
      <section class="content-section projects-section">
        <div class="section-header">
          <div class="section-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 class="section-title">项目经历</h3>
        </div>

        <div class="projects-list">
          <article class="project-card">
            <div class="project-header">
              <h4 class="project-name">Fast-Yunke 快速开发脚手架</h4>
            </div>

            <div class="tech-stack">
              <strong>技术栈：</strong>
              <span>Java 21、Spring Boot 3.5.12、Spring Security、Spring Cache、MyBatis-Plus、MySQL
                8、Redis、Druid、java-jwt、PageHelper、EasyExcel、Lombok</span>
            </div>

            <p class="project-description">
              企业级后台快速开发脚手架，基于 Spring Boot 3 构建，集成权限认证、缓存、分页、Excel 导出、数据库连接池等企业级功能，可直接用于快速搭建后台管理系统。
            </p>

            <div class="project-highlights">
              <h5>项目亮点</h5>
              <ul>
                <li><strong>鉴权体系：</strong>解决分布式 Session 共享痛点，基于 JWT + Security 实现无状态认证及 Token 自动续期。</li>
                <li><strong>权限模型：</strong>基于 RBAC 设计用户-角色-菜单三级权限，通过自定义注解实现细粒度接口授权。</li>
                <li><strong>性能优化：</strong>利用 Redis 互斥锁防止热点数据缓存击穿；封装 EasyExcel 分批读写解决百万级导出 OOM 风险。</li>
                <li><strong>监控排查：</strong>集成 Druid 监控，解决开发阶段 SQL 慢查询及连接泄露排查盲区。</li>
              </ul>
            </div>
          </article>

          <article class="project-card featured">
            <div class="project-badge">当前项目</div>
            <div class="project-header">
              <h4 class="project-name">个人博客项目（LiliBlog）</h4>
              <a href="https://lilicould.cn" target="_blank" rel="noopener" class="project-link">
                lilicould.cn
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>

            <div class="tech-stack">
              <strong>技术栈：</strong>
              <span>Java 21、Spring Boot 4.0.1、Spring Web、Spring AOP、MyBatis、MySQL 8、Redis、JWT、WebSocket、Lombok</span>
            </div>

            <p class="project-description">
              独立开发并部署上线的个人博客系统，实现文章管理、评论、实时消息、邮件通知等完整功能。
            </p>

            <div class="project-highlights">
              <h5>项目亮点</h5>
              <ul>
                <li><strong>实时通信：</strong>引入 WebSocket 解决消息触达延迟问题，针对 Nginx 代理环境实现连接重连心跳机制。</li>
                <li><strong>链路诊断：</strong>基于 AOP 自定义注解记录方法耗时与入参，快速定位接口性能瓶颈。</li>
                <li><strong>缓存提速：</strong>采用 Redis 旁路缓存，将热点文章接口响应时间从 200ms 压缩至 15ms。</li>
                <li><strong>项目部署：</strong>完成 Linux 服务器部署与线上稳定运行。</li>
              </ul>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const ageCalculator = () => {
  const birthDate = new Date('2004-11-01')
  const currentDate = new Date()
  const age = currentDate.getFullYear() - birthDate.getFullYear()
  return age
}
</script>

<style scoped>
.about-page {
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-3xl);
}

.page-header {
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-border);
  position: relative;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-title);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--spacing-xs);
}

.title-icon {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  animation: sparkle 3s ease-in-out infinite;
}

@keyframes sparkle {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.15);
  }
}

.page-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-muted);
  margin-left: calc(var(--font-size-xl) + 12px);
  font-style: italic;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Profile Card */
.profile-card {
  background: var(--color-card);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  padding: var(--spacing-2xl);
  display: flex;
  gap: var(--spacing-2xl);
  align-items: center;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(196, 93, 53, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.profile-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.profile-visual {
  position: relative;
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
  width: 160px;
  height: 160px;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: transform var(--transition-slow);
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  z-index: 1;
  animation: rotate-ring 8s linear infinite;
}

@keyframes rotate-ring {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.profile-card:hover .profile-avatar {
  transform: scale(1.05);
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
  z-index: 3;
}

.status-indicator.online {
  background: #52C41A;
  animation: pulse-online 2s ease-in-out infinite;
}

@keyframes pulse-online {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4);
  }

  50% {
    box-shadow: 0 0 0 8px rgba(82, 196, 26, 0);
  }
}

.profile-details {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-title);
  margin: 0 0 var(--spacing-xs) 0;
  letter-spacing: 1px;
}

.profile-title {
  font-size: var(--font-size-md);
  color: var(--color-body-light);
  margin: 0 0 var(--spacing-lg) 0;
}

.highlight {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--color-bg-warm);
  transition: all var(--transition-fast);
}

.contact-item.full-width {
  grid-column: 1 / -1;
}

.contact-item svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-item:hover {
  background: var(--color-primary-light);
  transform: translateX(4px);
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-label {
  font-size: 10px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: var(--font-weight-medium);
}

.contact-value {
  font-size: var(--font-size-sm);
  color: var(--color-body);
  font-weight: var(--font-weight-medium);
}

.contact-value.link {
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all var(--transition-fast);
}

.contact-value.link:hover {
  color: var(--color-primary-hover);
}

.external-icon {
  width: 12px;
  height: 12px;
}

/* Content Sections */
.content-section {
  background: var(--color-card);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  padding: var(--spacing-2xl);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.content-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  opacity: 0;
  transition: opacity var(--transition-base);
}

.content-section:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.content-section:hover::before {
  opacity: 1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.section-icon-wrapper {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(196, 93, 53, 0.25);
}

.section-icon-wrapper svg {
  width: 22px;
  height: 22px;
  color: white;
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-title);
  margin: 0;
}

/* Education */
.education-card {
  background: var(--color-bg-warm);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border-left: 4px solid var(--color-primary);
}

.edu-header {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.edu-time-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary-light-2));
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
}

.edu-time-badge svg {
  width: 14px;
  height: 14px;
}

.edu-school {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-title);
  margin: 0;
}

.edu-tags {
  display: flex;
  gap: 8px;
  margin-bottom: var(--spacing-md);
}

.tag {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.tag-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
}

.tag-secondary {
  background: var(--color-bg-warm);
  color: var(--color-body);
  border: 1px solid var(--color-border);
}

.edu-courses {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-body-light);
  margin: 0;
}

/* Skills */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.skill-card {
  background: var(--color-bg-warm);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid transparent;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 0;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  transition: height var(--transition-base);
  border-radius: var(--radius-full);
}

.skill-card:hover {
  background: white;
  border-color: var(--color-border);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.skill-card:hover::before {
  height: 100%;
}

.skill-icon {
  font-size: 28px;
  margin-bottom: var(--spacing-sm);
}

.skill-name {
  font-family: var(--font-body);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-title);
  margin: 0 0 var(--spacing-sm) 0;
}

.skill-desc {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-body-light);
  margin: 0;
}

/* Projects */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.project-card {
  background: var(--color-bg-warm);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid transparent;
  transition: all var(--transition-base);
  position: relative;
}

.project-card.featured {
  border-color: var(--color-primary-light-2);
  background: linear-gradient(135deg, rgba(196, 93, 53, 0.02), transparent);
}

.project-badge {
  position: absolute;
  top: -1px;
  right: var(--spacing-xl);
  padding: 4px 14px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.project-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.project-name {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-title);
  margin: 0;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  text-decoration: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-fast);
}

.project-link svg {
  width: 12px;
  height: 12px;
}

.project-link:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 93, 53, 0.3);
}

.tech-stack {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-body-light);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-sm);
}

.tech-stack strong {
  color: var(--color-title);
  font-weight: var(--font-weight-semibold);
  margin-right: 4px;
}

.project-description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-body);
  margin: 0 0 var(--spacing-lg) 0;
  padding-left: var(--spacing-md);
  border-left: 3px solid var(--color-border);
}

.project-highlights h5 {
  font-family: var(--font-body);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-title);
  margin: 0 0 var(--spacing-md) 0;
  position: relative;
  padding-left: 14px;
}

.project-highlights h5::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  border-radius: 2px;
}

.project-highlights ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.project-highlights li {
  display: flex;
  gap: 12px;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-body-light);
  position: relative;
  padding-left: 20px;
}

.project-highlights li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}

.project-highlights strong {
  color: var(--color-title);
  font-weight: var(--font-weight-semibold);
}

/* Responsive */
@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
    padding: var(--spacing-xl);
  }

  .avatar-wrapper {
    width: 140px;
    height: 140px;
  }

  .profile-name {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 768px) {
  .about-page {
    padding-top: var(--spacing-lg);
    padding-bottom: var(--spacing-2xl);
  }

  .page-title {
    font-size: var(--font-size-xl);
  }

  .page-subtitle {
    margin-left: 0;
    display: block;
    margin-top: var(--spacing-xs);
  }

  .content-section {
    padding: var(--spacing-lg);
  }

  .edu-header {
    flex-direction: column;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-badge {
    position: static;
    display: inline-block;
    margin-bottom: var(--spacing-sm);
    border-radius: var(--radius-full);
  }
}
</style>
