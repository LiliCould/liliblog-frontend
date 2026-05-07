<template>
  <div class="file-preview-page">
    <div class="preview-header">
      <h2 class="preview-title">{{ fileName }}</h2>
      <div class="preview-actions">
        <a :href="fileUrl" download class="download-link">📥 下载文件</a>
        <button @click="closeWindow" class="close-btn">✕ 关闭</button>
      </div>
    </div>

    <div class="preview-content">
      <!-- PDF预览 -->
      <vue-office-pdf v-if="fileType === 'pdf'" :src="fileUrl" style="height: 100%; width: 100%" @rendered="onRendered"
        @error="onError" />

      <!-- Word文档预览 -->
      <vue-office-docx v-else-if="fileType === 'word' || fileType === 'docx'" :src="fileUrl"
        style="height: 100%; width: 100%" @rendered="onRendered" @error="onError" />

      <!-- Excel预览 -->
      <vue-office-excel v-else-if="fileType === 'excel' || fileType === 'xlsx'" :src="fileUrl"
        style="height: 100%; width: 100%" @rendered="onRendered" @error="onError" />

      <!-- PPT预览 -->
      <vue-office-pptx v-else-if="fileType === 'ppt' || fileType === 'pptx'" :src="fileUrl"
        style="height: 100%; width: 100%" @rendered="onRendered" @error="onError" />

      <!-- 其他文件 - 直接显示或提示 -->
      <div v-else class="unsupported-preview">
        <div class="unsupported-icon">📄</div>
        <p>该文件类型暂不支持在线预览</p>
        <a :href="fileUrl" download class="download-btn-large">下载文件查看</a>
      </div>
    </div>

    <!-- 加载中遮罩 -->
    <div v-if="loading && fileUrl" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>文档加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMsg && !loading" class="error-overlay">
      <div class="error-icon">⚠️</div>
      <p>{{ errorMsg }}</p>
      <a :href="fileUrl" download class="download-btn-large">下载文件查看</a>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const VueOfficePdf = defineAsyncComponent(() => import('@vue-office/pdf'))
const VueOfficeDocx = defineAsyncComponent(() => import('@vue-office/docx'))
const VueOfficeExcel = defineAsyncComponent(() => import('@vue-office/excel'))
const VueOfficePptx = defineAsyncComponent(() => import('@vue-office/pptx'))

export default {
  components: {
    VueOfficeDocx,
    VueOfficeExcel,
    VueOfficePdf,
    VueOfficePptx
  },
  data() {
    return {
      fileUrl: '',
      fileType: '',
      fileName: '文件预览',
      loading: true,
      errorMsg: ''
    }
  },
  setup() {
    const route = useRoute()
    return { route }
  },
  mounted() {
    this.fileUrl = this.route.query.url || ''
    this.fileType = this.route.query.type || ''
    this.fileName = this.route.query.name || '文件预览'

    document.title = `预览 - ${this.fileName}`

    console.log('文件预览参数:', {
      url: this.fileUrl,
      type: this.fileType,
      name: this.fileName
    })

    if (!this.fileUrl) {
      this.loading = false
      this.errorMsg = '未提供文件地址'
    }
  },
  methods: {
    onRendered() {
      this.loading = false
      console.log('文档渲染完成')
    },
    onError(error) {
      this.loading = false
      this.errorMsg = '文档加载失败，请尝试下载后查看'
      console.error('文档加载失败:', error)
    },
    closeWindow() {
      window.close()
    }
  }
}
</script>

<style scoped>
.file-preview-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--color-card-solid);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.preview-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-title);
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.download-link {
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-tertiary));
  color: var(--color-bg);
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: var(--neon-glow-sm);
}

.download-link:hover {
  transform: translateY(-1px);
  box-shadow: var(--neon-glow-md);
}

.close-btn {
  padding: 8px 16px;
  background: var(--color-bg-warm);
  color: var(--color-body);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-accent);
  color: var(--color-bg);
  border-color: var(--color-accent);
  box-shadow: var(--neon-glow-pink-sm);
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: var(--color-bg-warm);
}

.unsupported-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: var(--color-muted);
}

.unsupported-icon {
  font-size: 80px;
  opacity: 0.3;
}

.unsupported-preview p {
  font-size: 16px;
  margin: 0;
}

.download-btn-large {
  padding: 12px 28px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-tertiary));
  color: var(--color-bg);
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: var(--neon-glow-sm);
}

.download-btn-large:hover {
  transform: translateY(-2px);
  box-shadow: var(--neon-glow-md);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 15, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: var(--neon-glow-sm);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  color: var(--color-body);
}

.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 15, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 1000;
}

.error-overlay p {
  color: var(--color-body);
}

.error-icon {
  font-size: 60px;
}
</style>
