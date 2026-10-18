import { useSessionStore } from '@/entities/session';
import { http, ServiceProvider } from '@/shared/api';

export function setupHttpInterceptors() {
    http.interceptors.request.use((config) => {
        const sessionStore = useSessionStore();
        if (sessionStore.accessToken) {
            config.headers.Authorization = `Bearer ${sessionStore.accessToken}`;
        }
        return config;
    });

    http.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const sessionStore = useSessionStore();
                try {
                    if (!sessionStore.refreshToken) throw new Error('No refresh token');
                    const authService = ServiceProvider.get<any>('auth');
                    const data = await authService.refresh(sessionStore.refreshToken);
                    sessionStore.setSession(data.accessToken, data.refreshToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return http(originalRequest);
                } catch (refreshError) {
                    sessionStore.logout();
                    window.location.href = '/#/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
}