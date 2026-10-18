import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/style.scss'
import App from './App.vue'
import router from './providers/router'
import { registerServices } from './providers/services'
import { setupHttpInterceptors } from './providers/http'
import { setupUI } from './providers/ui'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

registerServices()
const app = createApp(App)

setupUI(app)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
setupHttpInterceptors()
app.use(router)
app.mount('#app')
