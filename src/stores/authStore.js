import { defineStore } from 'pinia'
import * as authService from '@/services/Auth/authService'

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null'),
    }),

    getters: {

        isAuthenticated: (state) => !!state.user,
    },

    actions: {

        async login(credentials) {

            const { user, access_token } = await authService.login(credentials)

            this.user = user
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('access_token', access_token)
        },

        async register(userData){
            
            const { user, access_token } = await authService.register(userData)

            this.user = user
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('access_token', access_token)
        },

        async logout() {

            try {
                await authService.logout()
            } finally {
                this.user = null
                localStorage.removeItem('user')
                localStorage.removeItem('access_token')
            }
        },
    }
})