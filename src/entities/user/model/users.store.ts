import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, CreateUserDto, UpdateUserDto } from './user';
import { ServiceProvider } from '@/shared/api';
import type { UserService } from '../api/user.service';

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([]);
    const total = ref(0);
    const isLoading = ref(false);
    const error = ref<string>('');

    const localUpdated = ref<Record<number, User>>({});
    const localAdded = ref<User[]>([]);
    const localDeleted = ref<Set<number>>(new Set());

    const service = () => ServiceProvider.get<UserService>('users');

    const fetchUsers = async (params: { limit?: number; skip?: number; q?: string } = { limit: 10, skip: 0 }) => {
        isLoading.value = true;
        error.value = '';
        try {
            const response = await service().getAll(params);
            let fetchedItems = response.items
                .filter((u: User) => !localDeleted.value.has(u.id))
                .map((u: User) => localUpdated.value[u.id] || u);

            if ((!params.skip || params.skip === 0) && !params.q) {
                fetchedItems = [...localAdded.value, ...fetchedItems];
            }
            users.value = fetchedItems;
            total.value = response.total;
        } catch (e: any) {
            error.value = e.message || 'Помилка при завантаженні списку користувачів';
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    const getUserById = async (id: number) => {
        isLoading.value = true;
        error.value = '';
        try {
            if (localUpdated.value[id]) return localUpdated.value[id];
            return await service().getById(id);
        } catch (e: any) {
            error.value = e.message || 'Помилка при завантаженні користувача';
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    const addUser = async (userData: CreateUserDto) => {
        isLoading.value = true;
        error.value = '';
        try {
            const newUser = await service().create(userData);
            localAdded.value.unshift(newUser);
            return newUser;
        } catch (e: any) {
            error.value = e.message || 'Помилка при створенні користувача';
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    const updateUser = async (id: number, userData: UpdateUserDto) => {
        isLoading.value = true;
        error.value = '';
        try {
            const updatedUser = await service().update(id, userData);
            const currentUser = localUpdated.value[id] || users.value.find((u: User) => u.id === id);
            localUpdated.value[id] = { ...currentUser, ...updatedUser } as User;
            return updatedUser;
        } catch (e: any) {
            error.value = e.message || 'Помилка при оновленні користувача';
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteUser = async (id: number) => {
        isLoading.value = true;
        error.value = '';
        try {
            await service().delete(id);
            localDeleted.value.add(id);
        } catch (e: any) {
            error.value = e.message || 'Помилка при видаленні користувача';
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        users, total, isLoading, error,
        fetchUsers, getUserById,
        addUser, updateUser, deleteUser
    };
});