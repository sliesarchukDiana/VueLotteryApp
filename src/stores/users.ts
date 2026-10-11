import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user';
import { ServiceProvider } from '@/services/service-provider';

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([]);
    const total = ref(0);

    const localUpdated = ref<Record<number, User>>({});
    const localAdded = ref<User[]>([]);
    const localDeleted = ref<Set<number>>(new Set());

    const fetchUsers = async (params: { limit?: number; skip?: number; q?: string }) => {
        const response = await ServiceProvider.users.getAll(params);

        let fetchedItems = response.items
            .filter(u => !localDeleted.value.has(u.id))
            .map(u => localUpdated.value[u.id] || u);

        if ((!params.skip || params.skip === 0) && !params.q) {
            fetchedItems = [...localAdded.value, ...fetchedItems];
        }

        users.value = fetchedItems;
        total.value = response.total;
    };

    const getUserById = async (id: number) => {
        if (localUpdated.value[id]) {
            return localUpdated.value[id];
        }
        return await ServiceProvider.users.getById(id);
    };

    const addUser = async (userData: CreateUserDto) => {
        const newUser = await ServiceProvider.users.create(userData);
        localAdded.value.unshift(newUser);
    };

    const updateUser = async (id: number, userData: UpdateUserDto) => {
        const updatedUser = await ServiceProvider.users.update(id, userData);

        const currentUser = localUpdated.value[id] || users.value.find(u => u.id === id);

        localUpdated.value[id] = { ...currentUser, ...updatedUser } as User;
    };

    const deleteUser = async (id: number) => {
        await ServiceProvider.users.delete(id);
        localDeleted.value.add(id);
    };

    return {
        users, total, fetchUsers, getUserById,
        addUser, updateUser, deleteUser
    };
});