// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import * as filters from '@/filters'
import components from '@/components'

import '@/assets/styles/index.scss'

Vue.config.productionTip = false

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

Object.keys(components).forEach((key) => { // 注册公共组件，组件名首字母大写后以v开头，使用时<v-xxx></v-xxx>
    const name = key.replace(/(\w)/, (v) => v.toUpperCase())
    Vue.component(`v${name}`, components[key])
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store: store,
    template: '<App/>',
    components: { App }
})
