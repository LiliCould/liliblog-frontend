import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * 路由配置
 * 定义所有页面路由及权限控制
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/user/me',
      name: 'MyHome',
      component: () => import('@/views/UserHomeView.vue'),
      meta: { layout: 'main', requiresAuth: true },
    },
    {
      path: '/user/:id',
      name: 'UserHome',
      component: () => import('@/views/UserHomeView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/article/:id',
      name: 'ArticleDetail',
      component: () => import('@/views/ArticleDetailView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/category/:slug',
      name: 'Category',
      component: () => import('@/views/CategoryView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/tag/:slug',
      name: 'Tag',
      component: () => import('@/views/TagView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AboutView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { layout: 'none' },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { layout: 'none', requiresAdmin: true },
    },
    {
      path: '/write',
      name: 'Write',
      component: () => import('@/views/WriteView.vue'),
      meta: { layout: 'none', requiresAdmin: true },
    },
    {
      path: '/write/:id',
      name: 'EditArticle',
      component: () => import('@/views/WriteView.vue'),
      meta: { layout: 'none', requiresAdmin: true },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { layout: 'main', requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/admin/DashboardView.vue'),
      meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/articles',
      name: 'AdminArticles',
      component: () => import('@/views/admin/ArticleManage.vue'),
      meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/categories',
      name: 'AdminCategories',
      component: () => import('@/views/admin/CategoryManage.vue'),
      meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/tags',
      name: 'AdminTags',
      component: () => import('@/views/admin/TagManage.vue'),
      meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/comments',
      name: 'AdminComments',
      component: () => import('@/views/admin/CommentManage.vue'),
      meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true },
    },
  ],
})

/**
 * 路由守卫
 * 处理登录权限和管理员权限控制
 */
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 需要登录但未登录
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next('/login')
  }

  // 需要管理员权限但非管理员
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/')
  }

  next()
})

export default router
