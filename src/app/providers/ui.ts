import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import type { App } from 'vue';

export function setupUI(app: App) {
    app.use(PrimeVue);
    app.use(ToastService);
}