<template>
  <div class="about-page">
    <!-- 个人信息区域 -->
    <div class="profile-section">
      <div class="profile-avatar">
        <img src="/xiaodingdang.png" alt="立里可" />
      </div>
      <div class="profile-info">
        <h1 class="profile-name">立里可</h1>
        <p class="profile-title">意向：<span>Java 后端开发工程师</span></p>
        <div class="contact-list">
          <div class="contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <!-- 年龄使用动态计算 -->
            <span>{{ ageCalculator() }}岁</span>
          </div>
          <div class="contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
              </path>
            </svg>
            <span>155-7033-1235</span>
          </div>
          <div class="contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>江西某处</span>
          </div>
          <div class="contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>lilicould@qq.com</span>
          </div>
          <!-- github地址 -->
          <div class="contact-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.795 24 17.301 24 12 24 5.373 18.627 0 12 0z" />
            </svg>
            <span>
              <a href="https://github.com/lilicould" target="_blank"
                style="text-decoration: none;">https://github.com/lilicould
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <section class="card-section">
      <div class="section-header">
        <div class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
        <h2>教育背景</h2>
      </div>
      <div class="education-card">
        <div class="edu-main">
          <span class="edu-time">2023.09 — 至今</span>
          <h3 class="edu-school">江西某本科院校</h3>
        </div>
        <div class="edu-meta">
          <span class="tag">软件工程</span>
          <span class="tag">本科</span>
        </div>
        <p class="course-text">
          数据结构、算法设计与分析、计算机网络、操作系统、数据库系统原理、面向对象程序设计（Java）、Java Web、框架技术、软件工程
        </p>
      </div>
    </section>

    <!-- 专业技能 -->
    <section class="card-section">
      <div class="section-header">
        <div class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <h2>专业技能</h2>
      </div>
      <div class="skills-grid">
        <div class="skill-block">
          <h4>Java 基础</h4>
          <p>扎实，熟悉集合/多线程，具备 OOM 排查思路及 Arthas 诊断能力。</p>
        </div>
        <div class="skill-block">
          <h4>数据库</h4>
          <p>MySQL 索引优化与事务机制；Redis 缓存策略，能解决击穿/穿透/雪崩问题。</p>
        </div>
        <div class="skill-block">
          <h4>框架</h4>
          <p>Spring Boot、Spring Security、MyBatis-Plus，了解 SpringCloudAlibaba 微服务组件。</p>
        </div>
        <div class="skill-block">
          <h4>工程化</h4>
          <p>Maven、Git、Docker、Linux 基础运维。</p>
        </div>
        <div class="skill-block">
          <h4>网络与安全</h4>
          <p>熟悉 HTTP/HTTPS、TCP/IP、了解 XSS、SQL 注入等 Web 安全防护技术。</p>
        </div>
        <div class="skill-block">
          <h4>前端技能</h4>
          <p>熟悉 Vue 3 + Element Plus 组件化开发，能独立完成前后端联调。</p>
        </div>
      </div>
    </section>

    <!-- 项目经历 -->
    <section class="card-section">
      <div class="section-header">
        <div class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h2>项目经历</h2>
      </div>

      <div class="project-card">
        <div class="project-head">
          <h3>Fast-Yunke 快速开发脚手架</h3>
        </div>
        <div class="tech-row">
          <strong>技术栈：</strong>
          <span>Java 21、Spring Boot 3.5.12、Spring Security、Spring Cache、MyBatis-Plus、MySQL
            8、Redis、Druid、java-jwt、PageHelper、EasyExcel、Lombok</span>
        </div>
        <p class="project-desc">企业级后台快速开发脚手架，基于 Spring Boot 3 构建，集成权限认证、缓存、分页、Excel 导出、数据库连接池等企业级功能，可直接用于快速搭建后台管理系统。</p>
        <div class="highlights-box">
          <h4>项目亮点</h4>
          <ul>
            <li><strong>鉴权体系：</strong>解决分布式 Session 共享痛点，基于 JWT + Security 实现无状态认证及 Token 自动续期。</li>
            <li><strong>权限模型：</strong>基于 RBAC 设计用户-角色-菜单三级权限，通过自定义注解实现细粒度接口授权。</li>
            <li><strong>性能优化：</strong>利用 Redis 互斥锁防止热点数据缓存击穿；封装 EasyExcel 分批读写解决百万级导出 OOM 风险。</li>
            <li><strong>监控排查：</strong>集成 Druid 监控，解决开发阶段 SQL 慢查询及连接泄露排查盲区。</li>
          </ul>
        </div>
      </div>

      <div class="project-card">
        <div class="project-head">
          <h3>个人博客项目（LiliBlog）</h3>
          <a href="https://lilicould.cn" target="_blank" class="link-btn">
            https://lilicould.cn
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
        <div class="tech-row">
          <strong>技术栈：</strong>
          <span>Java 21、Spring Boot 4.0.1、Spring Web、Spring AOP、MyBatis、MySQL 8、Redis、JWT、WebSocket、Lombok</span>
        </div>
        <p class="project-desc">独立开发并部署上线的个人博客系统，实现文章管理、评论、实时消息、邮件通知等完整功能。</p>
        <div class="highlights-box">
          <h4>项目亮点</h4>
          <ul>
            <li><strong>实时通信：</strong>引入 WebSocket 解决消息触达延迟问题，针对 Nginx 代理环境实现连接重连心跳机制。</li>
            <li><strong>链路诊断：</strong>基于 AOP 自定义注解记录方法耗时与入参，快速定位接口性能瓶颈。</li>
            <li><strong>缓存提速：</strong>采用 Redis 旁路缓存，将热点文章接口响应时间从 200ms 压缩至 15ms。</li>
            <li><strong>项目部署：</strong>完成 Linux 服务器部署与线上稳定运行。</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">

// 计算年龄
const ageCalculator = () => {
  const birthDate = new Date('2004-11-01')
  const currentDate = new Date()
  const age = currentDate.getFullYear() - birthDate.getFullYear()
  return age
}
</script>

<style scoped>
.about-page {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: calc(var(--header-height) + 40px) 20px 60px;
}

/* 个人信息 - 扁平化卡片 */
.profile-section {
  background: var(--color-card);
  backdrop-filter: var(--blur-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 40px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 36px;
  box-shadow: var(--shadow-card);
}

.profile-avatar {
  flex-shrink: 0;
}

.profile-avatar img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-primary-light);
  transition: transform 0.25s ease;
}

.profile-avatar:hover img {
  transform: scale(1.05);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-title);
  margin: 0 0 8px 0;
  letter-spacing: 2px;
}

.profile-title {
  font-size: var(--font-size-md);
  color: var(--color-body);
  margin: 0 0 24px 0;
}

.profile-title span {
  color: var(--color-primary);
  font-weight: 600;
}

.contact-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-base);
  color: var(--color-body);
}

.contact-item svg {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* 卡片通用 */
.card-section {
  background: var(--color-card);
  backdrop-filter: var(--blur-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 32px;
  margin-bottom: 28px;
  box-shadow: var(--shadow-card);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card-section:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--color-primary-light);
}

.section-icon {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-icon svg {
  width: 22px;
  height: 22px;
  color: white;
}

.section-header h2 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-title);
  margin: 0;
}

/* 教育背景 - 紧凑卡片 */
.education-card {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  border-left: 3px solid var(--color-primary);
}

.edu-main {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.edu-time {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
}

.edu-school {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-title);
  margin: 0;
}

.edu-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.course-text {
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--color-body);
  margin: 0;
}

/* 技能网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.skill-block {
  padding: 20px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
  transition: all 0.25s ease;
}

.skill-block:hover {
  background: var(--color-primary-light);
  transform: translateX(4px);
}

.skill-block h4 {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--color-title);
  margin: 0 0 8px 0;
}

.skill-block p {
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--color-body);
  margin: 0;
}

/* 项目卡片 */
.project-card {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border);
  transition: all 0.25s ease;
}

.project-card:last-child {
  margin-bottom: 0;
}

.project-card:hover {
  background: white;
  border-color: var(--color-primary-light-2);
  box-shadow: var(--shadow-md);
}

.project-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 10px;
}

.project-head h3 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-title);
  margin: 0;
}

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  text-decoration: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all 0.25s ease;
}

.link-btn svg {
  width: 14px;
  height: 14px;
}

.link-btn:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.tech-row {
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--color-body);
  margin-bottom: 14px;
}

.tech-row strong {
  color: var(--color-title);
  font-weight: 600;
  margin-right: 4px;
}

.project-desc {
  font-size: var(--font-size-base);
  line-height: 1.7;
  color: var(--color-body);
  margin: 0 0 18px 0;
  padding-left: 14px;
  border-left: 3px solid var(--color-border);
}

.highlights-box h4 {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--color-title);
  margin: 0 0 12px 0;
  position: relative;
  padding-left: 12px;
}

.highlights-box h4::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 2px;
}

.highlights-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlights-box li {
  display: flex;
  gap: 10px;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--color-body);
  position: relative;
  padding-left: 16px;
}

.highlights-box li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
}

.highlights-box strong {
  color: var(--color-title);
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .about-page {
    padding: calc(var(--header-height) + 24px) 16px 48px;
  }

  .profile-section {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
    gap: 28px;
  }

  .profile-avatar img {
    width: 120px;
    height: 120px;
  }

  .profile-name {
    font-size: 24px;
    letter-spacing: 4px;
  }

  .contact-list {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .card-section {
    padding: 24px 20px;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .project-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .about-page {
    padding: calc(var(--header-height) + 20px) 12px 40px;
  }

  .profile-section {
    padding: 24px 20px;
  }

  .profile-name {
    font-size: 22px;
  }

  .card-section {
    padding: 20px 16px;
    border-radius: var(--radius-md);
  }

  .section-header h2 {
    font-size: var(--font-size-lg);
  }

  .project-card {
    padding: 20px 16px;
  }

  .skills-grid {
    gap: 12px;
  }

  .skill-block {
    padding: 16px;
  }
}
</style>
