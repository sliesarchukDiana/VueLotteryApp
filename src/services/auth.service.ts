import { http } from '@/api/http-client';

export class AuthService {
    async login(credentials: Record<string, string>) {
        const { data } = await http.post('/auth/login', credentials);
        return data;
    }

    async refresh(refreshToken: string) {
        const { data } = await http.post('/auth/refresh', { refreshToken, expiresInMins: 30 });
        return data;
    }

    async getMe() {
        const { data } = await http.get('/auth/me');
        return data;
    }
}