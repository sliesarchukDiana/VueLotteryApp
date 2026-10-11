import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
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
            name: 'users',
            component: () => import('@/views/UsersView.vue'),
            meta: { layout: DefaultLayout, requiresAuth: true, title: 'Користувачі' }
        },
        {
            path: '/users/:id',
            name: 'user-details',
            component: () => import('@/views/UserDetailsView.vue'),
            props: true,
            meta: { layout: DefaultLayout, requiresAuth: true, title: 'Деталі користувача' }
        },
        {
            path: '/users/:id/edit',
            name: 'user-edit',
            component: () => import('@/views/UserEditView.vue'),
            props: true,
            meta: { layout: DefaultLayout, requiresAuth: true, title: 'Редагування користувача' }
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