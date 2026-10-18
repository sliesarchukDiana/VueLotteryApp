import { UsersLayout } from '@/pages/users';
import {createRouter, createWebHashHistory} from 'vue-router'
import { useAuthStore } from '@/entities/session'
import DefaultLayout from '@/app/layouts/DefaultLayout.vue'
import AuthLayout from '@/app/layouts/AuthLayout.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/home/ui/HomeView.vue'),
            meta: { layout: DefaultLayout, title: 'Головна' }
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/pages/about/ui/AboutView.vue'),
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
                    component: () => import('@/pages/users/ui/UsersView.vue'),
                    meta: { title: 'Користувачі' }
                },
                {
                    path: 'new',
                    name: 'user-create',
                    component: () => import('@/pages/user-edit/ui/UserEditView.vue'),
                    meta: { title: 'Створення користувача' }
                },
                {
                    path: ':id',
                    name: 'user-details',
                    component: () => import('@/pages/user-details/ui/UserDetailsView.vue'),
                    props: true,
                    meta: { title: 'Деталі користувача' }
                },
                {
                    path: ':id/edit',
                    name: 'user-edit',
                    component: () => import('@/pages/user-edit/ui/UserEditView.vue'),
                    props: true,
                    meta: { title: 'Редагування користувача' }
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/login/ui/LoginView.vue'),
            meta: { layout: AuthLayout, title: 'Авторизація' }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/pages/not-found/ui/NotFoundView.vue'),
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