import { httpClient } from '@/plugins/axios'

const API = {
    project: '/project',
    version: '/version',
    mod: '/mod'
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

export const updateVersion = data =>
    httpClient({
        method: 'put',
        url: API.version,
        data
    })

export const saveMod = data =>
    httpClient({
        method: 'post',
        url: API.mod,
        data
    })

export const updateMod = data =>
    httpClient({
        method: 'put',
        url: API.mod,
        data
    })

export const deleteMod = id =>
    httpClient({
        method: 'delete',
        url: `${API.mod}/${id}`
    })
