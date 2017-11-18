import Vue from 'vue'
import Vuex from 'vuex'
import env from './modules/env'
import layout from './modules/layout'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        env,
        layout,
        user
    }
})
