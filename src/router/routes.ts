import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: '首页' },
    },
    {
        path: '/article/:id(\\d+)',
        name: 'ArticleDetail',
        component: () => import('@/views/article/ArticleDetail.vue'),
        meta: { title: '文章详情' },
    },
    {
        path: '/article/s/:slug',
        name: 'ArticleBySlug',
        component: () => import('@/views/article/ArticleDetail.vue'),
        meta: { title: '文章详情' },
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/article/SearchResult.vue'),
        meta: { title: '搜索' },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { title: '登录', layout: 'blank' },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: { title: '注册', layout: 'blank' },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/auth/ProfileView.vue'),
        meta: { title: '个人信息', requiresAuth: true },
    },
    {
        path: '/manage/articles',
        name: 'MyArticles',
        component: () => import('@/views/manage/MyArticles.vue'),
        meta: { title: '我的文章', requiresAuth: true },
    },
    {
        path: '/manage/editor',
        name: 'ArticleCreate',
        component: () => import('@/views/manage/ArticleEditor.vue'),
        meta: { title: '写文章', requiresAuth: true },
    },
    {
        path: '/manage/editor/:id(\\d+)',
        name: 'ArticleEdit',
        component: () => import('@/views/manage/ArticleEditor.vue'),
        meta: { title: '编辑文章', requiresAuth: true },
    },

    {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/chat/ChatRoomView.vue'),
        meta: { title: '聊天室', layout: 'blank' },
    },
    {
        path: '/preview',
        name: 'FilePreview',
        component: () => import('@/views/preview/FilePreview.vue'),
        meta: { title: '文件预览', layout: 'blank' },
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/AboutView.vue'),
        meta: { title: '关于我' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: '页面不存在' },
    },
]

export default routes
