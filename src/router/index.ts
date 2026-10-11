import UsersLayout from '@/views/UsersLayout.vue';
import {createRouter, createWebHashHistory} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            meta: { layout: DefaultLayout, title: 'Головна' }
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/AboutView.vue'),
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
                    component: () => import('@/views/UsersView.vue'),
                    meta: { title: 'Користувачі' }
                },
                {
                    path: 'new',
                    name: 'user-create',
                    component: () => import('@/views/UserEditView.vue'),
                    meta: { title: 'Створення користувача' }
                },
                {
                    path: ':id',
                    name: 'user-details',
                    component: () => import('@/views/UserDetailsView.vue'),
                    props: true,
                    meta: { title: 'Деталі користувача' }
                },
                {
                    path: ':id/edit',
                    name: 'user-edit',
                    component: () => import('@/views/UserEditView.vue'),
                    props: true,
                    meta: { title: 'Редагування користувача' }
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: { layout: AuthLayout, title: 'Авторизація' }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
            meta: { layout: DefaultLayout, title: 'Сторінка не знайдена' }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
    } else if (to.name === 'login' && auth.isAuthenticated) {
        next({ name: 'users' })
    } else {
        next()
    }
})

router.afterEach((to) => {
    document.title = (to.meta.title as string) || 'Vue Lottery App'
})

export default router