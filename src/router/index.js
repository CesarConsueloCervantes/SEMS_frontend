import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import Error404 from '@/views/errors/Error404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta:{
        guest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta:{
        guest: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: Error404,
    },
  ],
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated)
        return next('/login')

    if (to.meta.guest && authStore.isAuthenticated)
        return next('/dashboard')

    next()
})

export default router