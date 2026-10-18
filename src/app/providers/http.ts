import { http } from '@/shared/api/http-client';
import { useAuthStore } from '@/entities/session';
import { ServiceProvider } from '@/shared/api/service-provider';

export function setupHttpInterceptors() {
    http.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const authStore = useAuthStore();

                try {
                    if (!authStore.refreshToken) throw new Error('No refresh token');

                    const authService = ServiceProvider.get<any>('auth');
                    const data = await authService.refresh(authStore.refreshToken);

                    authStore.setTokens(data.accessToken, data.refreshToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                    return http(originalRequest);
                } catch (refreshError) {
                    authStore.logout();
                    window.location.href = '/#/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
}