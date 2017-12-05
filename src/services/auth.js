import { httpClient } from '@/plugins/axios'

const API = {
    login: '/auth/login',
    register: '/auth/register',
    user: '/user/search'
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
