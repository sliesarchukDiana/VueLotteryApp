import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import { ServiceProvider } from '@/shared/api';

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
    const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));
    const user = ref<any>(null);

    const isAuthenticated = computed(() => !!accessToken.value);

    const setTokens = (access: string, refresh: string) => {
        accessToken.value = access;
        refreshToken.value = refresh;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    };

    const clearAuth = () => {
        accessToken.value = null;
        refreshToken.value = null;
        user.value = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const login = async (credentials: Record<string, string>) => {
        const data = await (ServiceProvider.get<any>('auth')).login(credentials);
        setTokens(data.accessToken, data.refreshToken);
        user.value = data;
    };

    const logout = () => {
        clearAuth();
    };

    const fetchUser = async () => {
        if (!accessToken.value) return;
        try {
            user.value = await (ServiceProvider.get<any>('auth')).getMe();
        } catch (error) {
            clearAuth();
        }
    };

    return {
        accessToken, refreshToken, user, isAuthenticated,
        login, logout, setTokens, clearAuth, fetchUser
    };
});