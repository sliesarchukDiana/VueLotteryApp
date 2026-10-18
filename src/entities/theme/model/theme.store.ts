import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(false);

    const toggleTheme = () => {
        isDark.value = !isDark.value;
    };

    watch(isDark, (newValue) => {
        if (newValue) {
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
        }
    }, { immediate: true });

    return { isDark, toggleTheme };
}, { persist: true });