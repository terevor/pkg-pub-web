import { httpClient } from '@/plugins/axios'

const API = {
    category: '/api/pkg/list',
    categoryTree: '/api/pkg/list/all'
}

export const fetchCategoryList = data =>
    httpClient({
        url: API.category,
        params: data
    })

export const fetchCategoryTree = () =>
    httpClient({
        url: API.categoryTree
    })
