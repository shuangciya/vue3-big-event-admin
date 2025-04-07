import { createRouter, createWebHistory } from 'vue-router'

// 在Vue3 CompositionAPI中
// 1.获取路由对象 router UseRouter()
// const router = useRoute()
// 2.获取路由参数 route useRoute
// const route = useRoute()
// 导入 import { useRouter,useRoute } from 'vue-router
// import.meta.env.BASE_URL 是vite中的环境变量 就是 vite.config.js中的base 配置项路径前缀  省略
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 懒加载（异步加载），用到时才加载
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect:'/article/manage',
      children:[
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
           component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/user/profile',
           component: () => import('@/views/user/UserProfile.vue')
        }
      ]
    }
  ],
})

export default router
