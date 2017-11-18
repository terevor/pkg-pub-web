export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const SWITCH_THEME = 'SWITCH_THEME'
export const INIT_SIDEBAR_MENUS = 'INIT_SIDEBAR_MENUS'
export const UPDATE_OPENED_MENUS = 'UPDATE_OPENED_MENUS'
export const UPDATE_TAGS = 'UPDATE_TAGS'
export const REMOVE_TAGS = 'REMOVE_TAGS'
export const CLEAR_TAGS = 'CLEAR_TAGS'
export const INIT_BREADCRUMB = 'INIT_BREADCRUMB'
export const RESET_LAYOUT = 'RESET_LAYOUT'

const key = {}
const sk = ['toggle', 'theme', 'menus', 'opened', 'breadcrumbs', 'tags']
sk.forEach(k => {
    key[k] = `${process.env.SYSTEM_NAME}-${k}`
})

export default {
    state: {
        sidebar: {
            toggle: !!+localStorage.getItem(key.toggle), // 侧边栏收起或展开
            menuTheme: localStorage.getItem(key.theme) || 'light', // 主题 dark or light
            menus: JSON.parse(localStorage.getItem(key.menus)) || [],
            opened: JSON.parse(sessionStorage.getItem(key.opened)) || []
        },
        breadcrumbs: JSON.parse(sessionStorage.getItem(key.breadcrumbs)) || [],
        tags: JSON.parse(sessionStorage.getItem(key.tags)) || []
    },
    mutations: {
        [TOGGLE_SIDEBAR](state) {
            state.sidebar.toggle = !state.sidebar.toggle
            localStorage.setItem(key.toggle, state.sidebar.toggle ? 1 : 0)
        },
        [SWITCH_THEME](state) {
            state.sidebar.menuTheme = state.sidebar.menuTheme === 'light' ? 'dark' : 'light'
            localStorage.setItem(key.toggle, state.sidebar.menuTheme)
        },
        [INIT_SIDEBAR_MENUS](state, list) {
            state.sidebar.menus = list
            localStorage.setItem(key.menus, JSON.stringify(list))
        },
        [UPDATE_OPENED_MENUS](state, name) {
            state.sidebar.opened = [...state.sidebar.opened, name]
            sessionStorage.setItem(
                key.opened,
                JSON.stringify(state.sidebar.opened)
            )
        },
        [UPDATE_TAGS](state, tag) {
            const index = state.tags.findIndex(t => {
                return tag.name === t.name
            })
            if (index > -1) {
                state.tags.splice(index, 1, tag)
            } else {
                state.tags.push(tag)
            }
            sessionStorage.setItem(key.tags, JSON.stringify(state.tags))
        },
        [REMOVE_TAGS](state, tagName) {
            const index = state.tags.findIndex(t => {
                return t.name === tagName
            })
            if (index > -1) {
                state.tags.splice(index, 1)
            }
            sessionStorage.setItem(key.tags, JSON.stringify(state.tags))
        },
        [CLEAR_TAGS](state, exclude) {
            if (exclude && exclude !== 'home') {
                const tagExclude = state.tags.find(t => {
                    return t.name === exclude
                })
                state.tags.splice(1, state.tags.length - 1, tagExclude)
            } else {
                state.tags.splice(1, state.tags.length - 1)
            }
            sessionStorage.setItem(key.tags, JSON.stringify(state.tags))
        },
        [INIT_BREADCRUMB](state, list) {
            state.breadcrumbs = list
            sessionStorage.setItem(key.breadcrumbs, JSON.stringify(list))
        },
        [RESET_LAYOUT](state) {
            localStorage.removeItem(key.menus)
            sessionStorage.clear()
            state.sidebar.menus = []
            state.sidebar.opened = []
            state.breadcrumbs = []
            state.tags = []
        }
    },
    actions: {
        [TOGGLE_SIDEBAR]({ commit }) {
            commit(TOGGLE_SIDEBAR)
        },
        [SWITCH_THEME]({ commit }) {
            commit(SWITCH_THEME)
        },
        [INIT_SIDEBAR_MENUS]({ commit }, list) {
            commit(INIT_SIDEBAR_MENUS, list)
        },
        [UPDATE_OPENED_MENUS]({ commit }, name) {
            commit(UPDATE_OPENED_MENUS, name)
        },
        [UPDATE_TAGS]({ commit }, tag) {
            commit(UPDATE_TAGS, tag)
        },
        [REMOVE_TAGS]({ commit }, tagName) {
            commit(REMOVE_TAGS, tagName)
        },
        [CLEAR_TAGS]({ commit }, exclude) {
            commit(CLEAR_TAGS, exclude)
        },
        [INIT_BREADCRUMB]({ commit }, list) {
            commit(INIT_BREADCRUMB, list)
        },
        [RESET_LAYOUT]({ commit }) {
            commit(RESET_LAYOUT)
        }
    }
}
