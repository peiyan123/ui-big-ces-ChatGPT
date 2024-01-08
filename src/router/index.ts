import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'
import Home from '@/view/home.vue'
const routes: Array<RouteRecordRaw> = [

	{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component:() => import('@/view/login.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component:() => import('@/view/bigScreencomponents/components/chatPage.vue')
  },
]

const router = createRouter({
	history: createWebHashHistory(),
  routes
})

export default router