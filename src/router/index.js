import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Main from '@/views/Main'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)
Vue.use(Router)

const _import = require(`./_import_${process.env.NODE_ENV}`).default

export const routes = [
    {
        path: '/login',
        name: 'login',
        component: _import('Login'),
        meta: {
            title: 'Login - 登录',
            auth: false
        }
    },
    {
        path: '/404',
        name: 'error_404',
        component: _import('common/404'),
        meta: {
            title: '404 - 页面不存在',
            auth: false
        }
    },
    {
        path: '/401',
        name: 'error_401',
        component: _import('common/401'),
        meta: {
            title: '401 - 权限不足',
            auth: false
        }
    },
    {
        path: '/500',
        name: 'error_500',
        component: _import('common/500'),
        meta: {
            title: '500 - 服务端错误',
            auth: false
        }
    },
    {
        path: '/',
        name: 'main',
        component: Main,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '首页',
                    level: 0
                },
                component: _import('Home')
            },
            // {
            //     path: 'profile',
            //     name: 'profile',
            //     meta: {
            //         title: '个人中心'
            //     },
            //     component: _import('profile/Profile')
            // }
            {
                path: 'category',
                name: 'category',
                meta: {
                    title: '版本目录',
                    icon: 'network'
                },
                component: _import('category/Category')
            },
            {
                path: 'user',
                name: 'settings_user',
                meta: {
                    title: '用户',
                    icon: 'person',
                    level: 2,
                    parent: '系统配置'
                },
                component: _import('settings/User')
            },
            {
                path: 'group',
                name: 'settings_group',
                meta: {
                    title: '项目组',
                    icon: 'gear-a',
                    level: 2,
                    parent: '系统配置'
                },
                component: _import('settings/Group')
            }
        ]
    },
    {
        path: '*',
        redirect: '/404'
    }
]

const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({
        y: 0
    }),
    routes: routes
})

const canAccess = (permission) => {
    if (permission === '') return true
    const menus = store.state.layout.sidebar.menus
    return menus.some(n => {
        if (n.code === permission) return true
        if (n.children) {
            return n.children.some(m => {
                return m.code === permission
            })
        }
        return false
    })
}

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const {
        auth = true, permission = ''
    } = to.meta
    if (auth) {
        if (store.state.user.account === undefined) {
            iView.LoadingBar.finish()
            return next({
                name: 'login',
                query: {
                    from: to.fullPath
                }
            })
        } else if (!canAccess(permission)) {
            iView.LoadingBar.finish()
            return next({
                name: 'error_401'
            })
        }
    }
    window.document.title = to.meta.title || process.env.SYSTEM_NAME
    to.meta.from = from.fullPath
    next()
})

router.afterEach(() => {
    iView.LoadingBar.finish()
})

export default router
