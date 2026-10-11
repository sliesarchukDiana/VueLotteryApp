import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { ServiceProvider } from '@/services/service-provider';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const authStore = useAuthStore();

            try {
                if (!authStore.refreshToken) throw new Error('No refresh token');

                const data = await ServiceProvider.auth.refresh(authStore.refreshToken);
                authStore.setTokens(data.accessToken, data.refreshToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return http(originalRequest);
            } catch (refreshError) {
                authStore.logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);