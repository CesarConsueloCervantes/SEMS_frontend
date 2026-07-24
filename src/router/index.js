import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router

//// ejemplo de la configuracion
// import { createRouter, createWebHistory } from 'vue-router'

// import LoginView from '@/views/auth/LoginView.vue'
// import RegisterView from '@/views/auth/RegisterView.vue'
// import DashboardView from '@/views/dashboard/DashboardView.vue'

// const router = createRouter({

//     history: createWebHistory(import.meta.env.BASE_URL),

//     routes: [

//         {

//             path: '/',

//             redirect: '/dashboard'

//         },

//         {

//             path: '/login',

//             name: 'login',

//             component: LoginView

//         },

//         {

//             path: '/register',

//             name: 'register',

//             component: RegisterView

//         },

//         {

//             path: '/dashboard',

//             name: 'dashboard',

//             component: DashboardView,

//             meta: {

//                 requiresAuth: true

//             }

//         }

//     ]

// })

// export default router