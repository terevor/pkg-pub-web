import { httpClient } from '@/plugins/axios'

const API = {
    category: '/api/list'
}

export const fetchCategoryList = data =>
    httpClient({
        url: API.category,
        params: data
    })
