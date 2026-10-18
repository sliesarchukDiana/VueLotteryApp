import { http } from '@/shared/api';
import type { User, CreateUserDto, UpdateUserDto } from '@/entities/user/model/user';
import type { Readable, Creatable, Editable, Deletable } from '@/shared/api';

export class UserService implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable<User> {

    async getAll(params: { limit?: number; skip?: number; q?: string } = { limit: 10, skip: 0 }) {
        const endpoint = params.q ? '/users/search' : '/users';
        const { data } = await http.get(endpoint, { params });
        return { items: data.users as User[], total: data.total as number };
    }

    async getById(id: number): Promise<User> {
        const { data } = await http.get(`/users/${id}`);
        return data;
    }

    async create(userData: CreateUserDto): Promise<User> {
        const { data } = await http.post('/users/add', userData);
        return data;
    }

    async update(id: number, userData: UpdateUserDto): Promise<User> {
        const { data } = await http.put(`/users/${id}`, userData);
        return data;
    }

    async delete(id: number): Promise<void> {
        await http.delete(`/users/${id}`);
    }
}