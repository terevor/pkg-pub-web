import Vue from 'vue'

export const INIT_ENV = 'INIT_ENV'
export const CLEAR_ENV = 'CLEAR_ENV'

export default {
    state: window.__GLOBAL_CONF || {},
    mutations: {
        [INIT_ENV](state, env) {
            Object.assign(state, env)
        },
        [CLEAR_ENV](state) {
            Object.keys(state).forEach(k => Vue.delete(state, k))
        }
    },
    actions: {
        [INIT_ENV]({ commit }, env) {
            commit(INIT_ENV, env)
        },
        [CLEAR_ENV]({ commit }) {
            commit(CLEAR_ENV)
        }
    }
}
