import { httpClient } from '@/plugins/axios'

const API = {
    project: '/api/project',
    version: '/api/version',
    mod: '/api/mod'
}

export const fetchProjectList = data =>
    httpClient({
        url: API.project,
        params: data
    })

export const fetchVersionList = data =>
    httpClient({
        url: API.version,
        params: data
    })

export const fetchModList = data =>
    httpClient({
        url: API.mod,
        params: data
    })

export const saveProject = data =>
    httpClient({
        method: 'post',
        url: API.project,
        data
    })

export const saveVersion = data =>
    httpClient({
        method: 'post',
        url: API.version,
        data
    })

export const saveMod = data =>
    httpClient({
        method: 'post',
        url: API.mod,
        data
    })
