import { httpClient } from '@/plugins/axios'

const API = {
    login: '/api/auth/login',
    register: '/api/auth/register',
    user: '/api/user/search'
}

export const submitLogin = data =>
    httpClient({
        url: API.login,
        method: 'post',
        data
    })

export const submitRegister = data =>
    httpClient({
        url: API.register,
        method: 'post',
        data
    })

export const fetchUserList = data =>
    httpClient({
        url: API.user,
        params: data
    })
