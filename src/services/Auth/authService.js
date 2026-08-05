import api from '@/config/axios'

/**
 * Sends user credentials to the login endpoint to authenticate and retrieve an access token.
 */
export async function login(credentials) {

    const { data } = await api.post(
        '/login',
        credentials
    )
    
    return data
}

/**
 * Sends registration data to create a new user profile and receive a session token.
 */
export async function register(userData) {

    const { data } = await api.post(
        '/register',
        userData
    )
    
    return data
}

/**
 * Requests the revocation of the active user session token on the server side.
 */
export async function logout() {

    const { data } = await api.post(
        '/logout'
    )
    
    return data
}