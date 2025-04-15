import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/stores";
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

// 登录访问拦截 => 默认是直接放行的
//根据返回值决定，是放行还是拦截
// 返回值：
// 1.undefined/true 直接放行
// 2.false    拦回from的地址页面
// 3.具体路径 或 路径对象 拦截到对应的地址
//   '/login'   {name:'login'}
router.beforeEach((to) => {
  // 如果没有token 且访问的是非登录页 拦截到登录页，其他正常放行
  const userStore = useUserStore()
  if(!userStore.token && to.path !== '/login') return '/login'
  //  to.name !== 'Login'   return { name: 'Login' }
})
export default router
