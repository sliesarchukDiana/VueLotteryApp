import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { ServiceProvider } from '@/shared/api';
import type { AuthService } from '../api/auth.service';

export const useSessionStore = defineStore('session', () => {
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const user = ref<any>(null);

    const isAuthenticated = computed(() => !!accessToken.value);

    const setSession = (access: string, refresh: string) => {
        accessToken.value = access;
        refreshToken.value = refresh;
    };

    const clearSession = () => {
        accessToken.value = null;
        refreshToken.value = null;
        user.value = null;
    };

    const login = async (credentials: Record<string, string>) => {
        const data = await (ServiceProvider.get<AuthService>('auth')).login(credentials);
        setSession(data.accessToken, data.refreshToken);
        user.value = data;
    };

    const logout = () => {
        clearSession();
    };

    const fetchUser = async () => {
        if (!accessToken.value) return;
        try {
            user.value = await (ServiceProvider.get<AuthService>('auth')).getMe();
        } catch (error) {
            clearSession();
        }
    };

    return {
        accessToken, refreshToken, user, isAuthenticated,
        login, logout, setSession, clearSession, fetchUser
    };
}, { persist: true });