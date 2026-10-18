import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, CreateUserDto, UpdateUserDto } from './user';
import { ServiceProvider } from '@/shared/api';
import type { UserService } from '@/entities/user';

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([]);
    const total = ref(0);

    const localUpdated = ref<Record<number, User>>({});
    const localAdded = ref<User[]>([]);
    const localDeleted = ref<Set<number>>(new Set());

    const service = () => ServiceProvider.get<UserService>('users');

    const fetchUsers = async (params: { limit?: number; skip?: number; q?: string }) => {
        const response = await service().getAll(params);
        let fetchedItems = response.items
            .filter((u: User) => !localDeleted.value.has(u.id))
            .map((u: User) => localUpdated.value[u.id] || u);

        if ((!params.skip || params.skip === 0) && !params.q) {
            fetchedItems = [...localAdded.value, ...fetchedItems];
        }
        users.value = fetchedItems;
        total.value = response.total;
    };

    const getUserById = async (id: number) => {
        if (localUpdated.value[id]) return localUpdated.value[id];
        return await service().getById(id);
    };

    const addUser = async (userData: CreateUserDto) => {
        const newUser = await service().create(userData);
        localAdded.value.unshift(newUser);
    };

    const updateUser = async (id: number, userData: UpdateUserDto) => {
        const updatedUser = await service().update(id, userData);
        const currentUser = localUpdated.value[id] || users.value.find((u: User) => u.id === id);
        localUpdated.value[id] = { ...currentUser, ...updatedUser } as User;
    };

    const deleteUser = async (id: number) => {
        await service().delete(id);
        localDeleted.value.add(id);
    };

    return {
        users, total, fetchUsers, getUserById,
        addUser, updateUser, deleteUser
    };
});