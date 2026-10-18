import {createRouter, createWebHashHistory} from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { UsersLayout } from '@/pages/users'
import DefaultLayout from '@/app/layouts/DefaultLayout.vue'
import AuthLayout from '@/app/layouts/AuthLayout.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/home').then(m => m.HomeView),
            meta: { layout: DefaultLayout, title: 'Головна' }
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/pages/about').then(m => m.AboutView),
            meta: { layout: DefaultLayout, title: 'Про автора' }
        },
        {
            path: '/users',
            component: UsersLayout,
            meta: { layout: DefaultLayout, requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'users',
                    component: () => import('@/pages/users').then(m => m.UsersView),
                    meta: { title: 'Користувачі' }
                },
                {
                    path: 'new',
                    name: 'user-create',
                    component: () => import('@/pages/user-edit').then(m => m.UserEditView),
                    meta: { title: 'Створення користувача' }
                },
                {
                    path: ':id',
                    name: 'user-details',
                    component: () => import('@/pages/user-details').then(m => m.UserDetailsView),
                    props: true,
                    meta: { title: 'Профіль користувача' }
                },
                {
                    path: ':id/edit',
                    name: 'user-edit',
                    component: () => import('@/pages/user-edit').then(m => m.UserEditView),
                    props: true,
                    meta: { title: 'Редагування користувача' }
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/login').then(m => m.LoginView),
            meta: { layout: AuthLayout, title: 'Вхід' }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/pages/not-found').then(m => m.NotFoundView),
            meta: { layout: DefaultLayout, title: 'Сторінку не знайдено' }
        }
    ]
})

router.beforeEach((to, _from, next) => {
    const session = useSessionStore()
    if (to.meta.requiresAuth && !session.isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
    } else if (to.name === 'login' && session.isAuthenticated) {
        next({ name: 'users' })
    } else {
        next()
    }
})

router.afterEach((to) => {
    document.title = (to.meta.title as string) || 'Vue Lottery App'
})

export default router