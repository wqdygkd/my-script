import Vue from 'vue'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
    showSpinner: false
})

import Router from 'vue-router'
Vue.use(Router)

const routers = [
    {
        path: '/',
        component: () => import('@/views/index'),
    },
]
const route = new Router({
    routes: routers
})

route.beforeEach((to, from, next) => {
    // start progress bar
    NProgress.start()
    next()
})

route.afterEach(() => {
    NProgress.done()
})

export default route
