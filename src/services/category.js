import { httpClient } from '@/plugins/axios'

const API = {
    category: '/pkg/list',
    categoryTree: '/pkg/list/all'
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
