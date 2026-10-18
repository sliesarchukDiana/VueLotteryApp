import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { ServiceProvider } from '@/shared/api';

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const user = ref<any>(null);

    const isAuthenticated = computed(() => !!accessToken.value);

    const setTokens = (access: string, refresh: string) => {
        accessToken.value = access;
        refreshToken.value = refresh;
    };

    const clearAuth = () => {
        accessToken.value = null;
        refreshToken.value = null;
        user.value = null;
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
}, {
    persist: true
});